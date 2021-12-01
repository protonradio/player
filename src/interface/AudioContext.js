import getContext from '../getContext';
import PlaybackState from '../PlaybackState';

import { slice } from '../utils/buffer';
import { warn } from '../utils/logger';

const OVERLAP = 0.2;

// A reference to the current AudioContext.
let context = null;

// A reference to the GainNode which is wired up to globally control the gain
// of the resulting audio stream. This only exists when audio is actively being
// played.
let gain = null;

// The timeout ID for the internal audio playback loop.
let tickTimeout = null;

// A reference to the `Clip` that is currently loaded for playback. This only
// exists when the player is not stopped.
let currentClip = null;

function initialize({ volume = 1.0 }) {
  context = getContext();

  gain = context.createGain();
  gain.connect(context.destination);
  setVolume(volume);

  tickTimeout = null;
  currentClip = null;
}

function play(clip) {
  gain = context.createGain();
  gain.connect(context.destination);
  context.resume();

  setVolume(clip.volume);

  currentClip = clip;
  _play(clip);

  return Promise.resolve();
}

function stop() {
  currentClip = null;
  pause();
}

function pause() {
  if (gain) {
    gain.gain.value = 0;
    gain.disconnect(context.destination);
    gain = null;
  }

  clearTimeout(tickTimeout);
  tickTimeout = null;
}

function resume() {
  if (!currentClip) {
    warn('AudioContextEngine.resume', 'No clip currently loaded.');
  }
  play(currentClip);
}

// TODO: Error if no gain node.
function setVolume(volume) {
  gain.gain.value = volume;
}

function isPlaying() {
  return getPlaybackState() === PlaybackState.Playing;
}

function getPlaybackState() {
  if (currentClip === null) return PlaybackState.Stopped;
  if (gain === null) return PlaybackState.Paused;
  return PlaybackState.Playing;
}

function _play(clip) {
  clip._playbackProgress = 0;
  clip._scheduledEndTime = null;

  if (getPlaybackState() !== PlaybackState.Paused) {
    clip._bufferingOffset = 0;
  }

  const timeOffset = 0;
  let playing = true;

  const stopSources = () => {
    try {
      if (previousSource) previousSource.stop();
      if (currentSource) currentSource.stop();
    } catch (e) {
      if (e.name === 'InvalidStateError') {
        warn(`Ignored error: ${e.toString()}`);
      } else {
        throw e;
      }
    }
  };

  const stopListener = clip.on('stop', () => {
    playing = false;
    stopSources();
    stopListener.cancel();
  });

  let _playingSilence = !clip._clipState.isChunkReady(clip._clipState.chunkIndex);
  let chunk = _playingSilence
    ? clip._silenceChunks[0]
    : clip._clipState.chunks[clip._clipState.chunkIndex];
  chunk.isSilence = _playingSilence;

  let previousSource;
  let currentSource;

  _createSourceFromChunk(clip, chunk, timeOffset, (err, source) => {
    if (err) {
      err.url = clip.url;
      err.customCode = 'COULD_NOT_START_PLAYBACK';
      clip._fire('playbackerror', err);
      return;
    }

    if (Number.isNaN(chunk.duration)) {
      clip._fire('playbackerror', 'Error playing initial chunk because duration is NaN');
      return;
    }

    source.loop = chunk.isSilence;
    currentSource = source;

    let nextStart;

    try {
      const overlapGain = context.createGain();
      overlapGain.connect(gain);

      clip._contextTimeAtStart = context.currentTime;
      nextStart = clip._contextTimeAtStart + (chunk.duration - timeOffset);
      if (!chunk.isSilence) {
        clip._scheduledEndTime = nextStart + OVERLAP;
      }

      overlapGain.gain.setValueAtTime(0, nextStart + OVERLAP);
      source.connect(overlapGain);
      source.start(clip._contextTimeAtStart);
    } catch (e) {
      if (e.name === 'TypeError') {
        warn(`Ignored error: ${e.toString()}`);
      } else {
        throw e;
      }
    }

    clip._lastPlayedChunk =
      _playingSilence && clip._clipState.chunkIndex === clip._initialChunk
        ? null
        : clip._clipState.chunkIndex;

    const advance = () => {
      if (!playing) return;

      if (!_playingSilence && clip._lastPlayedChunk === clip._clipState.chunkIndex) {
        clip._clipState.chunkIndex += 1;
      }

      if (clip._clipState.chunksBufferingFinished) {
        clip._scheduledEndTime = null;
        return;
      }

      chunk = _playingSilence
        ? clip._silenceChunks[0]
        : clip._clipState.chunks[clip._clipState.chunkIndex];
      chunk.isSilence = _playingSilence;

      if (!chunk) {
        return;
      }

      _createSourceFromChunk(clip, chunk, 0, (err, source) => {
        if (err) {
          err.url = clip.url;
          err.customCode = 'COULD_NOT_CREATE_SOURCE';
          clip._fire('playbackerror', err);
          return;
        }

        if (Number.isNaN(chunk.duration)) {
          clip._fire('playbackerror', 'Error playing chunk because duration is NaN');
          return;
        }

        source.loop = chunk.isSilence;

        if (clip._wasPlayingSilence && !_playingSilence) {
          clip._wasPlayingSilence = false;
          stopSources();
          clip._contextTimeAtStart = context.currentTime;
          nextStart = context.currentTime;
        }

        previousSource = currentSource;
        currentSource = source;

        try {
          const overlapGain = context.createGain();
          overlapGain.connect(gain);
          overlapGain.gain.setValueAtTime(0, nextStart);
          overlapGain.gain.setValueAtTime(1, nextStart + OVERLAP);
          source.connect(overlapGain);
          source.start(nextStart);
          nextStart += chunk.duration;
          if (!chunk.isSilence) {
            clip._scheduledEndTime = nextStart + OVERLAP;
          }
          overlapGain.gain.setValueAtTime(0, nextStart + OVERLAP);
        } catch (e) {
          if (e.name === 'TypeError') {
            warn(`Ignored error: ${e.toString()}`);
          } else {
            throw e;
          }
        }

        clip._lastPlayedChunk =
          _playingSilence && clip._clipState.chunkIndex === clip._initialChunk
            ? null
            : clip._clipState.chunkIndex;
      });
    };

    const tick = (scheduledAt = 0, scheduledTimeout = 0) => {
      if (!isPlaying() || clip._clipState.chunksBufferingFinished) {
        return;
      }

      const i =
        clip._lastPlayedChunk === clip._clipState.chunkIndex
          ? clip._clipState.chunkIndex + 1
          : clip._clipState.chunkIndex;

      _playingSilence = !clip._clipState.isChunkReady(i);

      if (_playingSilence) {
        clip._wasPlayingSilence = true;
      } else {
        advance();
      }

      const timeout = clip._calculateNextChunkTimeout(i, scheduledAt, scheduledTimeout);
      tickTimeout = setTimeout(tick.bind(clip, Date.now(), timeout), timeout);
    };

    const frame = () => {
      if (!isPlaying()) return;
      requestAnimationFrame(frame);
      clip._fire('progress');
    };

    tick();
    frame();
  });
}

function _createSourceFromChunk(clip, chunk, timeOffset, callback) {
  if (!chunk) {
    const message = 'Something went wrong! Chunk was not ready in time for playback';
    error(message);
    callback(new Error(message));
    return;
  }

  const nextChunk = clip._clipState._chunks[chunk.index + 1];
  const extendedBuffer = chunk.concat(nextChunk);
  const { buffer } = slice(extendedBuffer, 0, extendedBuffer.length);

  context.decodeAudioData(
    buffer,
    (decoded) => {
      if (timeOffset) {
        const sampleOffset = ~~(timeOffset * decoded.sampleRate);
        const numChannels = decoded.numberOfChannels;
        const lengthWithOffset = decoded.length - sampleOffset;
        const length = lengthWithOffset >= 0 ? lengthWithOffset : decoded.length;
        const offset = context.createBuffer(numChannels, length, decoded.sampleRate);
        for (let chan = 0; chan < numChannels; chan += 1) {
          const sourceData = decoded.getChannelData(chan);
          const targetData = offset.getChannelData(chan);
          for (let i = 0; i < sourceData.length - sampleOffset; i += 1) {
            targetData[i] = sourceData[i + sampleOffset];
          }
        }
        decoded = offset;
      }
      const source = context.createBufferSource();
      source.buffer = decoded;
      callback(null, source);
    },
    (err) => {
      err = err || {}; // Safari might error out without an error object
      callback(err);
    }
  );
}

function __TEMP__currentTime(clip) {
  if (!isPlaying()) {
    return 0;
  }

  const averageChunkDuration = clip._loader ? clip._loader.averageChunkDuration : 0;
  const offset = averageChunkDuration * clip._initialChunk;

  const isPlayingSilence =
    clip._scheduledEndTime == null || context.currentTime > clip._scheduledEndTime;

  if (isPlayingSilence) {
    if (clip._clipState.chunksBufferingFinished) {
      // Playback has finished.
      clip.playbackEnded();
      return averageChunkDuration * clip._clipState.totalChunksCount;
    }

    // Player is buffering.
    clip._onBufferChange(true);

    if (clip._scheduledEndTime != null) {
      clip._bufferingOffset = clip._playbackProgress;
    }

    return offset + clip._playbackProgress;
  }

  // Player is playing back.
  clip._onBufferChange(false);

  if (clip._contextTimeAtStart === clip._lastContextTimeAtStart) {
    clip._playbackProgress +=
      context.currentTime -
      clip._contextTimeAtStart -
      clip._playbackProgress +
      clip._bufferingOffset;
  } else {
    clip._playbackProgress = clip._bufferingOffset;
  }

  clip._lastContextTimeAtStart = clip._contextTimeAtStart;

  return offset + clip._playbackProgress;
}

export default {
  initialize,
  play,
  pause,
  resume,
  stop,
  setVolume,
  isPlaying,
  __TEMP__currentTime,
};
