import Loader from './Loader';
import EventEmitter from './EventEmitter';
import ProtonPlayerError from './ProtonPlayerError';
import { debug, warn } from './utils/logger';
import noop from './utils/noop';
import ClipState, { CHUNK_SIZE } from './ClipState';

const TIMEOUT_SAFE_OFFSET = 50;

export default class Clip extends EventEmitter {
  constructor({
    url,
    fileSize,
    initialPosition = 0,
    lastAllowedPosition = 1,
    silenceChunks = [],
    volume = 1,
    audioMetadata = {},
    osName,
    browserName,
    playerState,
  }) {
    super();

    this.osName = osName;
    this.browserName = browserName;

    this.length = 0;
    this.loaded = false;
    this.ended = false;
    this.url = url;
    this.volume = volume;

    this._state = playerState;
    this._silenceChunks = silenceChunks;

    this._lastPlayedChunk = null;
    this._lastContextTimeAtStart = null;
    this._scheduledEndTime = null;
    this._playbackProgress = 0;
    this._bufferingOffset = 0;
    this._lastBufferChange = null;

    this._shouldStopBuffering = false;
    this._preBuffering = false;
    this._preBuffered = false;
    this._buffering = false;
    this._buffered = false;

    this._clipState = new ClipState(fileSize, initialPosition, lastAllowedPosition);
    this._initialChunk = this._clipState.chunkIndex;
    this._initialByte = this._initialChunk * CHUNK_SIZE;

    if (initialPosition !== 0 && Object.keys(audioMetadata).length === 0) {
      this._preBuffering = true;
      const initialChunkClipState = new ClipState(CHUNK_SIZE);
      const initialChunkLoader = new Loader(CHUNK_SIZE, this.url, initialChunkClipState);
      initialChunkLoader.on('loaderror', (err) => {
        this._preBuffering = false;
        this._fire('loaderror', err);
      });
      initialChunkLoader.on('load', () => {
        this._preBuffering = false;
        this._initLoader(initialChunkLoader.audioMetadata);
      });
      initialChunkLoader.buffer();
    } else {
      this._initLoader(audioMetadata);
    }
  }

  _initLoader(audioMetadata) {
    this._loader = new Loader(CHUNK_SIZE, this.url, this._clipState, audioMetadata);
    this._loader.on('canPlayThrough', () => {
      if (this._buffering && !this._preBuffering) {
        this._preBuffered = true;
      }
      this._fire('canPlayThrough');
    });
    this._loader.on('loadprogress', ({ buffered, total }) => {
      const bufferedWithOffset = buffered + this._initialByte;
      this._fire('loadprogress', {
        total,
        initialPosition: this._initialChunk / this._clipState.totalChunksCount,
        buffered: bufferedWithOffset,
        progress: bufferedWithOffset / total,
      });
    });
    this._loader.on('playbackerror', (error) => this._fire('playbackerror', error));
    this._loader.on('loaderror', (error) => this._fire('loaderror', error));
    this._loader.on('load', () => this._fire('load'));
  }

  preBuffer(isRetrying = false) {
    if (isRetrying && this._shouldStopBuffering) {
      return Promise.reject(new ProtonPlayerError('Clip was paused or disposed'));
    }

    if (this._preBuffered || this._buffered) {
      return Promise.resolve();
    }

    this._shouldStopBuffering = false;

    if (this._preBuffering || this._buffering || !this._loader) {
      return new Promise((resolve, reject) => {
        setTimeout(() => this.preBuffer(true).then(resolve).catch(reject), 1);
      });
    }

    this._preBuffering = true;
    const preloadOnly = true;
    return this._loader
      .buffer(preloadOnly, this._initialChunk)
      .then(() => {
        this._preBuffering = false;
        this._preBuffered = true;
      })
      .catch((err) => {
        this._preBuffering = false;
        this._preBuffered = false;
        throw err;
      });
  }

  buffer(isRetrying = false) {
    if (isRetrying && this._shouldStopBuffering) {
      return Promise.reject(new ProtonPlayerError('Clip was paused or disposed'));
    }

    if (this._buffered) {
      return Promise.resolve();
    }

    this._shouldStopBuffering = false;

    if (this._preBuffering || this._buffering || !this._loader) {
      return new Promise((resolve, reject) => {
        setTimeout(() => this.buffer(true).then(resolve).catch(reject), 1);
      });
    }

    this._onBufferChange(true);
    this._buffering = true;
    const preloadOnly = false;
    return this._loader
      .buffer(preloadOnly, this._initialChunk)
      .then(() => {
        this._buffering = false;
        this._buffered = true;
      })
      .catch((err) => {
        this._buffering = false;
        this._buffered = false;
        throw err;
      });
  }

  dispose() {
    this.stop();
    this._preBuffering = false;
    this._preBuffered = false;
    this._buffering = false;
    this._buffered = false;
    this.loaded = false;
    this._clipState.reset();
    this._fire('dispose');
  }

  play() {
    if (this._state.playback.isPlaying()) {
      const message = `clip.play() was called on a clip that was already playing (${this.url})`;
      warn(message);
      return Promise.reject(message);
    }

    return this.buffer()
      .then(() => {
        this._fire('playing');
        this.ended = false;
      })
      .catch(noop);
  }

  stop() {
    this._shouldStopBuffering = true;
    this._bufferingOffset = this._playbackProgress;

    if (this._loader) {
      this._loader.cancel();
    }

    this._preBuffering = false;
    this._buffering = false;
    this._fire('stop');

    return this;
  }

  playbackEnded() {
    debug('Clip#playbackEnded');
    if (this._state.playback.isPlaying()) {
      this.ended = true;
      this._fire('ended');
    }
  }

  setCurrentPosition(position = 0, lastAllowedPosition = 1) {
    this._fire('stop');

    this._initialChunk = this._clipState.getChunkIndexByPosition(position);
    this._clipState.lastAllowedChunkIndex = lastAllowedPosition;
    this._clipState.chunkIndex = this._initialChunk;

    this.ended = false;
  }

  get duration() {
    if (!this._loader) return 0;
    return (this._clipState.fileSize / CHUNK_SIZE) * this._loader.averageChunkDuration;
  }

  get paused() {
    return this._state.playback.isPaused();
  }

  get audioMetadata() {
    if (!this._loader) return {};
    return this._loader.audioMetadata;
  }

  _calculateNextChunkTimeout(chunkIndex = 0, scheduledAt = 0, scheduledTimeout = 0) {
    const playingSilence = !this._clipState.isChunkReady(chunkIndex);
    if (playingSilence) {
      return 100;
    }
    const timeoutDiff = this._calculateTimeoutDiff(scheduledAt, scheduledTimeout);
    const chunk = this._clipState.chunks[chunkIndex];
    return chunk && typeof chunk.duration === 'number' && chunk.duration > 0
      ? Math.max(chunk.duration * 1000 - TIMEOUT_SAFE_OFFSET - timeoutDiff, 0)
      : 500;
  }

  _calculateTimeoutDiff(scheduledAt = 0, scheduledTimeout = 0) {
    if (scheduledAt === 0 && scheduledTimeout === 0) {
      return TIMEOUT_SAFE_OFFSET;
    }
    return Math.max(
      Date.now() - Math.max(scheduledAt, 0) - Math.max(scheduledTimeout, 0),
      0
    );
  }

  _onBufferChange(isBuffering) {
    if (this._lastBufferChange === isBuffering) {
      return;
    }
    this._fire('bufferchange', isBuffering);
    this._lastBufferChange = isBuffering;
  }
}
