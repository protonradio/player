import Loader from './Loader';
import EventEmitter from './EventEmitter';
import getContext from './getContext';
import warn from './utils/warn';
const CHUNK_SIZE = 64 * 1024;
const OVERLAP = 0.2;

export default class Clip extends EventEmitter {
  constructor({
    url,
    fileSize,
    initialPosition = 0,
    silenceChunks = [],
    loop = false,
    volume = 1,
    audioMetadata = {}
  }) {
    super();

    this._useMediaSource = typeof window.MediaSource !== 'undefined';
    if (this._useMediaSource) {
      this._audioElement = document.querySelector('audio');
    } else {
      this.context = getContext();
      this._gain = this.context.createGain();
      this._gain.connect(this.context.destination);
    }

    this.length = 0;
    this.loaded = false;
    this.canplaythrough = false;
    this.playing = false;
    this.ended = false;
    this._currentTime = 0;
    this.url = url;
    this.fileSize = fileSize;
    this.loop = loop;
    this.volume = volume;
    this._chunks = [];
    this._silenceChunks = silenceChunks;
    this._chunkIndex = 0;
    this._tickTimeout = null;
    this._mediaSourceTimeout = null;

    this._shouldStopBuffering = false;
    this._preBuffering = false;
    this._preBuffered = false;
    this._buffering = false;
    this._buffered = false;

    this._totalChunksCount = Math.ceil(fileSize / CHUNK_SIZE);
    this._initialChunk = this._getChunkIndexByPosition(initialPosition);
    this._initialByte = this._initialChunk * CHUNK_SIZE;
    this._seekedChunk = 0;

    if (initialPosition !== 0 && Object.keys(audioMetadata).length === 0) {
      this._preBuffering = true;
      const initialChunkLoader = new Loader(
        CHUNK_SIZE,
        this.url,
        CHUNK_SIZE, // load just 1 chunk
        []
      );
      initialChunkLoader.on('loaderror', err => {
        this._preBuffering = false;
        this._fire('loaderror', err);
      });
      initialChunkLoader.on('load', () => {
        this._preBuffering = false;
        this._initLoader(initialChunkLoader.audioMetadata);
      });
      initialChunkLoader.buffer(true);
    } else {
      this._initLoader(audioMetadata);
    }
  }

  _initLoader(audioMetadata) {
    this._loader = new Loader(
      CHUNK_SIZE,
      this.url,
      this.fileSize,
      this._chunks,
      audioMetadata
    );
    this._loader.on('canplaythrough', () => {
      if (this._buffering && !this._preBuffering) {
        this._preBuffered = true;
      }
      this._fire('canplaythrough');
    });
    this._loader.on('loadprogress', ({ buffered, total }) => {
      const bufferedWithOffset = buffered + this._initialByte;
      this._fire('loadprogress', {
        total,
        initialPosition: this._initialChunk / this._totalChunksCount,
        buffered: bufferedWithOffset,
        progress: bufferedWithOffset / total
      });
    });
    this._loader.on('playbackerror', error =>
      this._fire('playbackerror', error)
    );
    this._loader.on('loaderror', error => this._fire('loaderror', error));
    this._loader.on('load', () => this._fire('load'));
  }

  preBuffer(isRetrying = false) {
    if (isRetrying && this._shouldStopBuffering) {
      return Promise.reject(new Error('Clip was paused or disposed'));
    } else {
      this._shouldStopBuffering = false;
    }

    if (this._preBuffered || this._buffered) {
      return Promise.reject(new Error('Clip is already pre-buffered'));
    }

    if (this._preBuffering || this._buffering || !this._loader) {
      return new Promise((resolve, reject) => {
        setTimeout(
          () =>
            this.preBuffer(true)
              .then(resolve)
              .catch(reject),
          1
        );
      });
    }

    this._preBuffering = true;
    const bufferToCompletion = false;
    const preloadOnly = true;
    return this._loader
      .buffer(bufferToCompletion, preloadOnly, this._initialByte)
      .then(() => {
        this._preBuffering = false;
        this._preBuffered = true;
      })
      .catch(err => {
        this._preBuffering = false;
        this._preBuffered = false;
        throw err;
      });
  }

  buffer(bufferToCompletion = false, isRetrying = false) {
    if (isRetrying && this._shouldStopBuffering) {
      return Promise.reject(new Error('Clip was paused or disposed'));
    } else {
      this._shouldStopBuffering = false;
    }

    if (this._buffering || this._buffered) {
      return Promise.reject(new Error('Clip is already buffering or buffered'));
    }

    if (this._preBuffering || !this._loader) {
      return new Promise((resolve, reject) => {
        setTimeout(
          () =>
            this.buffer(bufferToCompletion, true)
              .then(resolve)
              .catch(reject),
          1
        );
      });
    }

    this._buffering = true;
    const preloadOnly = false;
    return this._loader
      .buffer(bufferToCompletion, preloadOnly, this._initialByte)
      .then(() => {
        this._buffering = false;
        this._buffered = true;
      })
      .catch(err => {
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
    this.pause();
    this._preBuffering = false;
    this._preBuffered = false;
    this._buffering = false;
    this._buffered = false;
    this.loaded = false;
    this.canplaythrough = false;
    this._currentTime = 0;
    this._chunks = [];
    this._fire('dispose');
  }

  play() {
    if (this.playing) {
      warn(
        `clip.play() was called on a clip that was already playing (${this.url})`
      );
      return;
    }

    this.buffer();

    if (this._useMediaSource) {
      this._mediaSource = new MediaSource();
      this._audioElement.src = URL.createObjectURL(this._mediaSource);
      const self = this;
      this._mediaSource.addEventListener('sourceopen', function() {
        self._sourceBuffer = this.addSourceBuffer('audio/mpeg');
        self._playUsingMediaSource();
      });
    } else {
      this._gain = this.context.createGain();
      this._gain.connect(this.context.destination);
      this.context.resume();
      this._playUsingAudioContext();
    }

    this.volume = this._volume;
    this.playing = true;
    this.ended = false;
  }

  pause() {
    this._shouldStopBuffering = true;

    if (this._useMediaSource) {
      clearTimeout(this._mediaSourceTimeout);
      this._audioElement.pause();
      this._audioElement.volume = 0;
    } else {
      clearTimeout(this._tickTimeout);
      this._gain.gain.value = 0;
      this._gain.disconnect(this.context.destination);
      this._gain = null;
      this._currentTime =
        this._startTime + (this.context.currentTime - this._contextTimeAtStart);
    }

    if (this._loader) {
      this._loader.cancel();
    }

    this._preBuffering = false;
    this._buffering = false;
    this.playing = false;

    this._fire('pause');
    return this;
  }

  setCurrentPosition(position = 0) {
    this.playing = false;

    if (this._useMediaSource) {
      clearTimeout(this._mediaSourceTimeout);
      this._audioElement.pause();
      this._audioElement.volume = 0;
    } else {
      clearTimeout(this._tickTimeout);
      this._gain.gain.value = 0;
      this._gain.disconnect(this.context.destination);
      this._gain = null;
      this._currentTime = 0;
    }

    const initialChunk = this._getChunkIndexByPosition(position);
    this._seekedChunk = initialChunk;
    this._chunkIndex = initialChunk - this._initialChunk;

    if (this._useMediaSource) {
      this._mediaSource = new MediaSource();
      this._audioElement.src = URL.createObjectURL(this._mediaSource);
      const self = this;
      this._mediaSource.addEventListener('sourceopen', function() {
        self._sourceBuffer = this.addSourceBuffer('audio/mpeg');
        self._playUsingMediaSource();
      });
    } else {
      this._gain = this.context.createGain();
      this._gain.connect(this.context.destination);
      this.context.resume();
      this._playUsingAudioContext();
    }

    this.volume = this._volume;
    this.playing = true;
    this.ended = false;
  }

  isPositionLoaded(position = 0) {
    const initialChunk = this._getChunkIndexByPosition(position);
    const wantedChunk = initialChunk - this._initialChunk;
    const chunk = this._chunks[wantedChunk] || {};
    return chunk.ready === true && Number.isNaN(chunk.duration) === false;
  }

  get currentTime() {
    if (!this.playing) {
      return this._currentTime;
    }

    const offset =
      (this._seekedChunk || this._initialChunk) *
      (this._loader ? this._loader.firstChunkDuration : 0);

    if (this._useMediaSource) {
      return this._audioElement.currentTime + offset;
    }

    return (
      offset +
      this._startTime +
      (this.context.currentTime - this._contextTimeAtStart)
    );
  }

  get duration() {
    if (!this._loader) return 0;
    return (this.fileSize / CHUNK_SIZE) * this._loader.firstChunkDuration;
  }

  get paused() {
    return !this.playing;
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

  _playUsingAudioContext() {
    let time = 0;
    this._startTime = this._currentTime;
    const timeOffset = this._currentTime - time;
    this._fire('play');
    let playing = true;

    const pauseListener = this.on('pause', () => {
      playing = false;
      if (previousSource) previousSource.stop();
      if (currentSource) currentSource.stop();
      pauseListener.cancel();
    });

    let _playingSilence =
      this._chunks.length === 0 ||
      this._chunks[0].ready !== true ||
      Number.isNaN(this._chunks[0].duration) === true;

    const _chunks = _playingSilence ? this._silenceChunks : this._chunks;
    if (!_playingSilence) {
      this._chunkIndex++;
    }

    let chunk = _chunks[0];
    let previousSource;
    let currentSource;
    chunk.createSource(
      timeOffset,
      source => {
        if (Number.isNaN(chunk.duration)) {
          this._fire(
            'playbackerror',
            'Error playing initial chunk because duration is NaN'
          );
          return;
        }

        currentSource = source;
        this._contextTimeAtStart = this.context.currentTime;
        let lastStart = this._contextTimeAtStart;
        let nextStart =
          this._contextTimeAtStart + (chunk.duration - timeOffset);

        const gain = this.context.createGain();
        gain.connect(this._gain);
        gain.gain.setValueAtTime(0, nextStart + OVERLAP);
        source.connect(gain);
        source.start(this.context.currentTime);

        const endGame = () => {
          if (this.context.currentTime >= nextStart) {
            this.pause();
            this._currentTime = 0;
            this.ended = true;
            this._fire('ended');
          } else {
            requestAnimationFrame(endGame);
          }
        };

        const advance = () => {
          if (!playing) return;

          _playingSilence =
            this._chunks.length === 0 ||
            this._chunkIndex >= this._chunks.length ||
            this._chunks[this._chunkIndex].ready !== true ||
            Number.isNaN(this._chunks[this._chunkIndex].duration) === true;

          const _chunks = _playingSilence ? this._silenceChunks : this._chunks;
          let i = _playingSilence ? 0 : this._chunkIndex++ % _chunks.length;

          if (this.loop || _playingSilence) i %= _chunks.length;

          chunk = _chunks[i];

          if (!_playingSilence && this._chunkIndex >= this._chunks.length) {
            chunk = null;
          }

          if (!chunk) {
            endGame();
            return;
          }

          if (!chunk.ready) {
            return;
          }

          chunk.createSource(
            0,
            source => {
              if (Number.isNaN(chunk.duration)) {
                this._fire(
                  'playbackerror',
                  'Error playing chunk because duration is NaN'
                );
                return;
              }

              if (_playingSilence) this._wasPlayingSilence = true;
              if (this._wasPlayingSilence && !_playingSilence) {
                this._wasPlayingSilence = false;
                this._contextTimeAtStart = this.context.currentTime;
                nextStart = this.context.currentTime;
              }

              previousSource = currentSource;
              currentSource = source;
              const gain = this.context.createGain();
              gain.connect(this._gain);
              gain.gain.setValueAtTime(0, nextStart);
              gain.gain.setValueAtTime(1, nextStart + OVERLAP);
              source.connect(gain);
              source.start(nextStart);
              lastStart = nextStart;
              nextStart += chunk.duration;
              gain.gain.setValueAtTime(0, nextStart + OVERLAP);
              tick();
            },
            error => {
              error.url = this.url;
              error.phonographCode = 'COULD_NOT_CREATE_SOURCE';
              this._fire('playbackerror', error);
            }
          );
        };

        const tick = () => {
          if (!this.playing) return;

          const shouldAdvance = _playingSilence
            ? this.context.currentTime > lastStart
            : this.context.currentTime > lastStart &&
              this._chunks[this._chunkIndex] &&
              this._chunks[this._chunkIndex].ready === true &&
              Number.isNaN(this._chunks[this._chunkIndex].duration) === false;

          if (shouldAdvance) {
            advance();
          } else {
            this._tickTimeout = setTimeout(tick, 500);
          }
        };

        const frame = () => {
          if (!playing) return;
          requestAnimationFrame(frame);
          this._fire('progress');
        };

        tick();
        frame();
      },
      error => {
        error.url = this.url;
        error.phonographCode = 'COULD_NOT_START_PLAYBACK';
        this._fire('playbackerror', error);
      }
    );
  }

  _playUsingMediaSource() {
    if (!this.playing) return;

    if (this._chunkIndex + this._initialChunk >= this._totalChunksCount) {
      this._mediaSource.endOfStream();
      return;
    }

    const shouldSkip =
      this._chunks.length === 0 ||
      this._chunkIndex >= this._chunks.length ||
      this._chunks[this._chunkIndex].ready !== true ||
      Number.isNaN(this._chunks[this._chunkIndex].duration) === true;

    if (!shouldSkip) {
      const chunk = this._chunks[this._chunkIndex];
      try {
        this._sourceBuffer.appendBuffer(chunk.raw);
        this._chunkIndex += 1;
      } catch (e) {
        // SourceBuffer might be full, remove segments that have already been played.
        if (!this._sourceBuffer.updating) {
          this._sourceBuffer.remove(0, this._audioElement.currentTime);
        }
      }
    }

    this._mediaSourceTimeout = setTimeout(
      this._playUsingMediaSource.bind(this),
      500
    );
  }

  _getChunkIndexByPosition(position = 0) {
    const initialChunk = Math.floor(this._totalChunksCount * position);
    return initialChunk >= this._totalChunksCount
      ? this._totalChunksCount - 1
      : initialChunk;
  }
}
