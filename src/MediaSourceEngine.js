import { debug } from './utils/logger';

const play = (clip) => {
  debug('MediaSourceEngine.play');
  if (clip._state.playback.isStopped()) return;

  if (clip._clipState.chunksBufferingFinished) {
    debug('clip._mediaSource.endOfStream()');
    clip._mediaSource.endOfStream();
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
      clip._sourceBuffer.appendBuffer(chunk.raw);
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
        clip._sourceBuffer.remove(0, clip._audioElement.currentTime);
      } catch (e) {
        debug('Exception when running SourceBuffer#remove', e);
      }
    }
  }

  const timeout = isChunkReady ? Math.min(500, chunk.duration * 1000) : 100;
  clip._mediaSourceTimeout = setTimeout(() => play(clip), timeout);
};

const stop = (clip) => {
  debug('MediaSourceEngine.stop');
  clearTimeout(clip._mediaSourceTimeout);
  pause(clip);
};

const pause = (clip) => {
  debug('MediaSourceEngine.pause');
  if (clip._state.playback.isPlaying()) {
    clip._audioElement.pause();
    clip._audioElement.volume = 0;
  }
};

export default {
  play,
  stop,
  pause,
};
