import { debug } from '../utils/logger';
import suppressAbortError from '../utils/suppressAbortError';

// A reference to an HTML5 `<audio>` element. Currently this interface is a bit
// fragile and invasive -- it assumes a single `<audio>` element, stores a
// reference to it, and mutates it. If this element is managed by another
// system simultaneously you may get strange behavior.
//
// TODO: Should the library inject its own `<audio>` element?
let audioElement = null;

// A reference to an HTML5 `MediaSource` instance.
let source = null;

// A reference to the internal MPEG buffer for the `source`. Appending MPEG data
// to this buffer results in it being played.
let sourceBuffer = null;

// While playing, the system uses a recursive `setTimeout` loop to continuously
// append audio data to the `sourceBuffer`. This is a reference to that timeout
// and only exists while audio is being played.
let sourceTimeout = null;

function initialize({ volume = 1.0 }) {
  audioElement = document.querySelector('audio');
  source = new MediaSource();
  sourceBuffer = null;
  sourceTimeout = null;

  setVolume(volume);
}

function play(clip) {
  source = new MediaSource();
  source.addEventListener('sourceopen', function () {
    sourceBuffer = this.addSourceBuffer('audio/mpeg');
    _play(clip);
  });

  audioElement.src = URL.createObjectURL(source);

  return audioElement.play().catch(suppressAbortError);
}

function _play(clip) {
  if (clip._clipState.chunksBufferingFinished) {
    debug('MediaSourceEngine endOfStream()');
    source.endOfStream();
    return;
  }

  const isChunkReady = clip._clipState.isChunkReady(clip._clipState.chunkIndex);

  const useSilence =
    !isChunkReady &&
    clip._clipState.chunkIndex === clip._initialChunk &&
    !clip._wasPlayingSilence &&
    (clip.browserName === 'safari' || clip.osName === 'ios');

  const chunk = useSilence
    ? clip._silenceChunks[0]
    : isChunkReady && clip._clipState.chunks[clip._clipState.chunkIndex];

  if (chunk) {
    try {
      sourceBuffer.appendBuffer(chunk.raw);
      if (isChunkReady) {
        clip._clipState.chunkIndex += 1;
        clip._wasPlayingSilence = false;
      } else if (useSilence) {
        clip._wasPlayingSilence = true;
      }
    } catch (e) {
      // SourceBuffer might be full, remove segments that have already been played.
      debug('Exception when running SourceBuffer#appendBuffer', e);
      try {
        sourceBuffer.remove(0, audioElement.currentTime);
      } catch (e) {
        debug('Exception when running SourceBuffer#remove', e);
      }
    }
  }

  const timeout = isChunkReady ? Math.min(500, chunk.duration * 1000) : 100;
  sourceTimeout = setTimeout(() => _play(clip), timeout);
}

function resume() {
  return audioElement.play().catch(suppressAbortError);
}

function pause() {
  audioElement.pause();
}

function stop() {
  clearTimeout(sourceTimeout);
  pause();
}

function setVolume(volume) {
  audioElement.volume = volume;
}

function isPlaying() {
  return !audioElement.paused;
}

function __TEMP__currentTime(clip) {
  if (!clip._state.playback.isPlaying()) {
    return 0;
  }

  const averageChunkDuration = clip._loader ? clip._loader.averageChunkDuration : 0;
  const offset = averageChunkDuration * clip._initialChunk;

  return offset + audioElement.currentTime;
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
