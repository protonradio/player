import { debug, warn } from './utils/logger';

const OVERLAP = 0.2;

const play = (clip) => {
  debug('AudioContext.play');
  clip._playbackProgress = 0;
  clip._scheduledEndTime = null;

  if (!clip._state.playback.isPaused()) {
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

  clip._createSourceFromChunk(chunk, timeOffset, (err, source) => {
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
      const gain = clip.context.createGain();
      gain.connect(clip._gain);

      clip._contextTimeAtStart = clip.context.currentTime;
      nextStart = clip._contextTimeAtStart + (chunk.duration - timeOffset);
      if (!chunk.isSilence) {
        clip._scheduledEndTime = nextStart + OVERLAP;
      }

      gain.gain.setValueAtTime(0, nextStart + OVERLAP);
      source.connect(gain);
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

      clip._createSourceFromChunk(chunk, 0, (err, source) => {
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
          clip._contextTimeAtStart = clip.context.currentTime;
          nextStart = clip.context.currentTime;
        }

        previousSource = currentSource;
        currentSource = source;

        try {
          const gain = clip.context.createGain();
          gain.connect(clip._gain);
          gain.gain.setValueAtTime(0, nextStart);
          gain.gain.setValueAtTime(1, nextStart + OVERLAP);
          source.connect(gain);
          source.start(nextStart);
          nextStart += chunk.duration;
          if (!chunk.isSilence) {
            clip._scheduledEndTime = nextStart + OVERLAP;
          }
          gain.gain.setValueAtTime(0, nextStart + OVERLAP);
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
      if (!clip._state.playback.isPlaying() || clip._clipState.chunksBufferingFinished) {
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
      clip._tickTimeout = setTimeout(tick.bind(clip, Date.now(), timeout), timeout);
    };

    const frame = () => {
      if (!clip._state.playback.isPlaying()) return;
      requestAnimationFrame(frame);
      clip._fire('progress');
    };

    tick();
    frame();
  });
};

const stop = (clip) => {
  debug('AudioContext.stop');
  clip._bufferingOffset = clip._playbackProgress;
  clearTimeout(clip._tickTimeout);

  // TODO: Where does ._gain come from? Existence/no-exist seems to be a proxy
  // for whether or not the clip is currently playing.
  if (clip._gain) {
    clip._gain.gain.value = 0;
    clip._gain.disconnect(clip.context.destination);
    clip._gain = null;
  }
};

export default {
  play,
  stop,
};
