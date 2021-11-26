import { debug } from './utils/logger';
import suppressAbortError from './utils/suppressAbortError';

export default class MediaSourceEngine {
  constructor({ audioElement }) {
    this.audioElement = audioElement;
    this.source = new MediaSource();
    this.sourceBuffer = null;
    this.sourceTimeout = null;
  }

  play(clip) {
    debug('MediaSourceEngine.play');
    this.source = new MediaSource();

    const self = this;
    this.source.addEventListener('sourceopen', function () {
      self.sourceBuffer = this.addSourceBuffer('audio/mpeg');
      self._play(clip);
    });

    this.audioElement.src = URL.createObjectURL(this.source);

    return this.audioElement.play().catch(suppressAbortError);
  }

  _play(clip) {
    if (clip._state.playback.isStopped()) return;

    if (clip._clipState.chunksBufferingFinished) {
      debug('MediaSourceEngine endOfStream()');
      this.source.endOfStream();
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
        this.sourceBuffer.appendBuffer(chunk.raw);
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
          this.sourceBuffer.remove(0, clip._audioElement.currentTime);
        } catch (e) {
          debug('Exception when running SourceBuffer#remove', e);
        }
      }
    }

    const timeout = isChunkReady ? Math.min(500, chunk.duration * 1000) : 100;
    this.sourceTimeout = setTimeout(() => this._play(clip), timeout);
  }

  resume() {
    debug('MediaSourceEngine.resume');
    return this.audioElement.play().catch(suppressAbortError);
  }

  stop() {
    debug('MediaSourceEngine.stop');
    clearTimeout(this.sourceTimeout);
    this.pause();
  }

  pause() {
    debug('MediaSourceEngine.pause');
    this.audioElement.pause();
    this.audioElement.volume = 0;
  }

  setVolume(volume) {
    debug('MediaSourceEngine.setVolume');
    this.audioElement.volume = volume;
  }
}
