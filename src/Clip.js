import Loader from './Loader';
import EventEmitter from './EventEmitter';
import ProtonPlayerError from './ProtonPlayerError';
import getContext from './getContext';
import { debug, warn } from './utils/logger';
import suppressAbortError from './utils/suppressAbortError';
import noop from './utils/noop';
import ClipState, { CHUNK_SIZE } from './ClipState';

const OVERLAP = 0.2;
const TIMEOUT_SAFE_OFFSET = 50;

const PLAYBACK_STATE = {
  STOPPED: 'STOPPED',
  PLAYING: 'PLAYING',
  PAUSED: 'PAUSED',
};

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
    this._playbackState = PLAYBACK_STATE.STOPPED;
    this.ended = false;
    this.url = url;
    this.volume = volume;
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
    if (this._playbackState === PLAYBACK_STATE.PLAYING) {
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
        self._playUsingMediaSource();
      });
      this._audioElement.src = URL.createObjectURL(this._mediaSource);
      promise = this._audioElement.play().catch(suppressAbortError);
    } else {
      this._gain = this.context.createGain();
      this._gain.connect(this.context.destination);
      this.context.resume();
      this._playUsingAudioContext();
      promise = Promise.resolve();
    }

    this.volume = this._volume;
    this._playbackState = PLAYBACK_STATE.PLAYING;
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
      this._playUsingAudioContext();
      promise = Promise.resolve();
    }
    this._playbackState = PLAYBACK_STATE.PLAYING;
    return promise;
  }

  pause() {
    if (this._useMediaSource) {
      this._pauseUsingMediaSource();
    } else {
      this._stopUsingAudioContext();
    }
    this._playbackState = PLAYBACK_STATE.PAUSED;
  }

  stop() {
    this._shouldStopBuffering = true;

    if (this._useMediaSource) {
      this._stopUsingMediaSource();
    } else {
      this._stopUsingAudioContext();
    }

    if (this._loader) {
      this._loader.cancel();
    }

    this._preBuffering = false;
    this._buffering = false;
    this._playbackState = PLAYBACK_STATE.STOPPED;
    this._fire('stop');

    return this;
  }

  playbackEnded() {
    debug('Clip#playbackEnded');
    if (this._playbackState === PLAYBACK_STATE.PLAYING) {
      this._playbackState = PLAYBACK_STATE.STOPPED;
      this.ended = true;
      this._fire('ended');
    }
  }

  setCurrentPosition(position = 0, lastAllowedPosition = 1) {
    if (this._useMediaSource) {
      this._stopUsingMediaSource();
    } else {
      this._stopUsingAudioContext();
    }

    this._playbackState = PLAYBACK_STATE.STOPPED;
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
        self._playUsingMediaSource();
      });
    } else {
      this._gain = this.context.createGain();
      this._gain.connect(this.context.destination);
      this.context.resume();
      this._playUsingAudioContext();
      promise = Promise.resolve();
    }

    this.volume = this._volume;
    this._playbackState = PLAYBACK_STATE.PLAYING;
    this.ended = false;
    return promise;
  }

  get currentTime() {
    if (this._playbackState !== PLAYBACK_STATE.PLAYING) {
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
    return this._playbackState === PLAYBACK_STATE.PAUSED;
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
    this._playbackProgress = 0;
    this._scheduledEndTime = null;

    if (this._playbackState !== PLAYBACK_STATE.PAUSED) {
      this._bufferingOffset = 0;
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

    const stopListener = this.on('stop', () => {
      playing = false;
      stopSources();
      stopListener.cancel();
    });

    let _playingSilence = !this._clipState.isChunkReady(this._clipState.chunkIndex);
    let chunk = _playingSilence
      ? this._silenceChunks[0]
      : this._clipState.chunks[this._clipState.chunkIndex];
    chunk.isSilence = _playingSilence;

    let previousSource;
    let currentSource;

    chunk.createSource(timeOffset, (err, source) => {
      if (err) {
        err.url = this.url;
        err.customCode = 'COULD_NOT_START_PLAYBACK';
        this._fire('playbackerror', err);
        return;
      }

      if (Number.isNaN(chunk.duration)) {
        this._fire(
          'playbackerror',
          'Error playing initial chunk because duration is NaN'
        );
        return;
      }

      source.loop = chunk.isSilence;
      currentSource = source;

      let nextStart;

      try {
        const gain = this.context.createGain();
        gain.connect(this._gain);

        this._contextTimeAtStart = this.context.currentTime;
        nextStart = this._contextTimeAtStart + (chunk.duration - timeOffset);
        if (!chunk.isSilence) {
          this._scheduledEndTime = nextStart + OVERLAP;
        }

        gain.gain.setValueAtTime(0, nextStart + OVERLAP);
        source.connect(gain);
        source.start(this._contextTimeAtStart);
      } catch (e) {
        if (e.name === 'TypeError') {
          warn(`Ignored error: ${e.toString()}`);
        } else {
          throw e;
        }
      }

      this._lastPlayedChunk =
        _playingSilence && this._clipState.chunkIndex === this._initialChunk
          ? null
          : this._clipState.chunkIndex;

      const advance = () => {
        if (!playing) return;

        if (!_playingSilence && this._lastPlayedChunk === this._clipState.chunkIndex) {
          this._clipState.chunkIndex += 1;
        }

        if (this._clipState.chunksBufferingFinished) {
          this._scheduledEndTime = null;
          return;
        }

        chunk = _playingSilence
          ? this._silenceChunks[0]
          : this._clipState.chunks[this._clipState.chunkIndex];
        chunk.isSilence = _playingSilence;

        if (!chunk.ready) {
          return;
        }

        chunk.createSource(0, (err, source) => {
          if (err) {
            err.url = this.url;
            err.customCode = 'COULD_NOT_CREATE_SOURCE';
            this._fire('playbackerror', err);
            return;
          }

          if (Number.isNaN(chunk.duration)) {
            this._fire('playbackerror', 'Error playing chunk because duration is NaN');
            return;
          }

          source.loop = chunk.isSilence;

          if (this._wasPlayingSilence && !_playingSilence) {
            this._wasPlayingSilence = false;
            stopSources();
            this._contextTimeAtStart = this.context.currentTime;
            nextStart = this.context.currentTime;
          }

          previousSource = currentSource;
          currentSource = source;

          try {
            const gain = this.context.createGain();
            gain.connect(this._gain);
            gain.gain.setValueAtTime(0, nextStart);
            gain.gain.setValueAtTime(1, nextStart + OVERLAP);
            source.connect(gain);
            source.start(nextStart);
            nextStart += chunk.duration;
            if (!chunk.isSilence) {
              this._scheduledEndTime = nextStart + OVERLAP;
            }
            gain.gain.setValueAtTime(0, nextStart + OVERLAP);
          } catch (e) {
            if (e.name === 'TypeError') {
              warn(`Ignored error: ${e.toString()}`);
            } else {
              throw e;
            }
          }

          this._lastPlayedChunk =
            _playingSilence && this._clipState.chunkIndex === this._initialChunk
              ? null
              : this._clipState.chunkIndex;
        });
      };

      const tick = (scheduledAt = 0, scheduledTimeout = 0) => {
        if (
          this._playbackState !== PLAYBACK_STATE.PLAYING ||
          this._clipState.chunksBufferingFinished
        ) {
          return;
        }

        const i =
          this._lastPlayedChunk === this._clipState.chunkIndex
            ? this._clipState.chunkIndex + 1
            : this._clipState.chunkIndex;

        _playingSilence = !this._clipState.isChunkReady(i);

        if (_playingSilence) {
          this._wasPlayingSilence = true;
        } else {
          advance();
        }

        const timeout = this._calculateNextChunkTimeout(i, scheduledAt, scheduledTimeout);
        this._tickTimeout = setTimeout(tick.bind(this, Date.now(), timeout), timeout);
      };

      const frame = () => {
        if (this._playbackState !== PLAYBACK_STATE.PLAYING) return;
        requestAnimationFrame(frame);
        this._fire('progress');
      };

      tick();
      frame();
    });
  }

  _playUsingMediaSource() {
    if (this._playbackState === PLAYBACK_STATE.STOPPED) return;

    if (this._clipState.chunksBufferingFinished) {
      debug('this._mediaSource.endOfStream()');
      this._mediaSource.endOfStream();
      return;
    }

    const isChunkReady = this._clipState.isChunkReady(this._clipState.chunkIndex);

    const useSilence =
      !isChunkReady &&
      this._clipState.chunkIndex === this._initialChunk &&
      !this._wasPlayingSilence &&
      (this.browserName === 'safari' || this.osName === 'ios');

    const chunk = useSilence
      ? this._silenceChunks[0]
      : isChunkReady && this._clipState.chunks[this._clipState.chunkIndex];

    if (chunk) {
      try {
        this._sourceBuffer.appendBuffer(chunk.raw);
        if (isChunkReady) {
          this._clipState.chunkIndex += 1;
          this._wasPlayingSilence = false;
        } else if (useSilence) {
          this._wasPlayingSilence = true;
        }
      } catch (e) {
        // SourceBuffer might be full, remove segments that have already been played.
        debug('Exception when running SourceBuffer#appendBuffer', e);
        try {
          this._sourceBuffer.remove(0, this._audioElement.currentTime);
        } catch (e) {
          debug('Exception when running SourceBuffer#remove', e);
        }
      }
    }

    const timeout = isChunkReady ? Math.min(500, chunk.duration * 1000) : 100;
    this._mediaSourceTimeout = setTimeout(this._playUsingMediaSource.bind(this), timeout);
  }

  _pauseUsingMediaSource() {
    if (this._playbackState === PLAYBACK_STATE.PLAYING) {
      this._audioElement.pause();
      this._audioElement.volume = 0;
    }
  }

  _stopUsingMediaSource() {
    clearTimeout(this._mediaSourceTimeout);
    this._pauseUsingMediaSource();
  }

  _stopUsingAudioContext() {
    this._bufferingOffset = this._playbackProgress;
    clearTimeout(this._tickTimeout);
    if (this._playbackState === PLAYBACK_STATE.PLAYING) {
      this._gain.gain.value = 0;
      this._gain.disconnect(this.context.destination);
      this._gain = null;
    }
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
