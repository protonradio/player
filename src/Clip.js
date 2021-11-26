import Loader from './Loader';
import EventEmitter from './EventEmitter';
import ProtonPlayerError from './ProtonPlayerError';
import getContext from './getContext';
import { debug, warn } from './utils/logger';
import suppressAbortError from './utils/suppressAbortError';
import noop from './utils/noop';
import ClipState, { CHUNK_SIZE } from './ClipState';
import AudioContextEngine from './AudioContextEngine';
import MediaSourceEngine from './MediaSourceEngine';
import { slice } from './utils/buffer';

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
    useMediaSource,
    playerState,
  }) {
    super();

    this.osName = osName;
    this.browserName = browserName;
    this._useMediaSource = useMediaSource;

    if (this._useMediaSource) {
      this._audioElement = document.querySelector('audio');
    } else {
      this.context = getContext();
      this._gain = this.context.createGain();
      this._gain.connect(this.context.destination);
    }

    this.length = 0;
    this.loaded = false;
    this.ended = false;
    this.url = url;
    this.volume = volume;

    this._state = playerState;
    this._silenceChunks = silenceChunks;
    this._lastPlayedChunk = null;
    this._tickTimeout = null;
    this._mediaSourceTimeout = null;

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

  connect(destination, output, input) {
    if (!this._connected) {
      this._gain.disconnect();
      this._connected = true;
    }
    this._gain.connect(destination, output, input);
    return this;
  }

  disconnect(destination, output, input) {
    this._gain.disconnect(destination, output, input);
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

    this.buffer().then(noop).catch(noop);

    let promise;

    if (this._useMediaSource) {
      const self = this;
      this._mediaSource = new MediaSource();
      this._mediaSource.addEventListener('sourceopen', function () {
        self._sourceBuffer = this.addSourceBuffer('audio/mpeg');
        MediaSourceEngine.play(self);
      });
      this._audioElement.src = URL.createObjectURL(this._mediaSource);
      promise = this._audioElement.play().catch(suppressAbortError);
    } else {
      this._gain = this.context.createGain();
      this._gain.connect(this.context.destination);
      this.context.resume();
      AudioContextEngine.play(this);
      promise = Promise.resolve();
    }

    this.volume = this._volume;
    this._fire('playing');
    this.ended = false;
    return promise;
  }

  resume() {
    let promise;
    if (this._useMediaSource) {
      this._audioElement.volume = this.volume;
      promise = this._audioElement.play().catch(suppressAbortError);
    } else {
      this._gain = this.context.createGain();
      this._gain.connect(this.context.destination);
      this.context.resume();
      AudioContextEngine.play(this);
      promise = Promise.resolve();
    }
    this._fire('playing');
    return promise;
  }

  pause() {
    if (this._useMediaSource) {
      MediaSourceEngine.pause(this);
    } else {
      AudioContextEngine.stop(this);
    }
    this._fire('paused');
  }

  stop() {
    this._shouldStopBuffering = true;

    if (this._useMediaSource) {
      MediaSourceEngine.stop(this);
    } else {
      AudioContextEngine.stop(this);
    }

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
    if (this._useMediaSource) {
      MediaSourceEngine.stop(this);
    } else {
      AudioContextEngine.stop(this);
    }

    this._fire('stop');

    this._initialChunk = this._clipState.getChunkIndexByPosition(position);
    this._clipState.lastAllowedChunkIndex = lastAllowedPosition;
    this._clipState.chunkIndex = this._initialChunk;

    let promise;

    if (this._useMediaSource) {
      this._mediaSource = new MediaSource();
      this._audioElement.src = URL.createObjectURL(this._mediaSource);
      promise = this._audioElement.play().catch(suppressAbortError);
      const self = this;
      this._mediaSource.addEventListener('sourceopen', function () {
        self._sourceBuffer = this.addSourceBuffer('audio/mpeg');
        MediaSourceEngine.play(self);
      });
    } else {
      this._gain = this.context.createGain();
      this._gain.connect(this.context.destination);
      this.context.resume();
      AudioContextEngine.play(this);
      promise = Promise.resolve();
    }

    this.volume = this._volume;
    this._fire('positionchange');
    this.ended = false;
    return promise;
  }

  get currentTime() {
    if (!this._state.playback.isPlaying()) {
      return 0;
    }

    const averageChunkDuration = this._loader ? this._loader.averageChunkDuration : 0;
    const offset = averageChunkDuration * this._initialChunk;

    if (this._useMediaSource) {
      return offset + this._audioElement.currentTime;
    }

    const isPlayingSilence =
      this._scheduledEndTime == null || this.context.currentTime > this._scheduledEndTime;

    if (isPlayingSilence) {
      if (this._clipState.chunksBufferingFinished) {
        // Playback has finished.
        this.playbackEnded();
        return averageChunkDuration * this._clipState.totalChunksCount;
      }

      // Player is buffering.
      this._onBufferChange(true);

      if (this._scheduledEndTime != null) {
        this._bufferingOffset = this._playbackProgress;
      }

      return offset + this._playbackProgress;
    }

    // Player is playing back.
    this._onBufferChange(false);

    if (this._contextTimeAtStart === this._lastContextTimeAtStart) {
      this._playbackProgress +=
        this.context.currentTime -
        this._contextTimeAtStart -
        this._playbackProgress +
        this._bufferingOffset;
    } else {
      this._playbackProgress = this._bufferingOffset;
    }

    this._lastContextTimeAtStart = this._contextTimeAtStart;

    return offset + this._playbackProgress;
  }

  get duration() {
    if (!this._loader) return 0;
    return (this._clipState.fileSize / CHUNK_SIZE) * this._loader.averageChunkDuration;
  }

  get paused() {
    return this._state.playback.isPaused();
  }

  get volume() {
    return this._volume;
  }

  set volume(volume) {
    this._volume = volume;

    if (this._useMediaSource && this._audioElement) {
      this._audioElement.volume = this._volume;
    } else if (this._gain && this._gain.gain) {
      this._gain.gain.value = this._volume;
    }
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

  _createSourceFromChunk(chunk, timeOffset, callback) {
    debug('_createSourceFromChunk');
    const context = getContext();

    if (!chunk) {
      const message = 'Something went wrong! Chunk was not ready in time for playback';
      error(message);
      callback(new Error(message));
      return;
    }

    const nextChunk = this._clipState._chunks[chunk.index + 1];
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
}
