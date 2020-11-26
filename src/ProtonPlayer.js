import Bowser from 'bowser';

import ProtonPlayerError from './ProtonPlayerError';
import { debug, warn, error } from './utils/logger';
import noop from './utils/noop';
import getContext from './getContext';
import Loader from './Loader';
import Clip from './Clip';
import _ from './init';

export default class ProtonPlayer {
  constructor({ silenceURL, volume = 1, onReady = noop, onError = noop }) {
    debug('ProtonPlayer#constructor');

    const browser = Bowser.getParser(window.navigator.userAgent);
    this.browserName = browser.getBrowserName().toLowerCase();
    this.osName = browser.getOSName().toLowerCase();

    // Firefox is not supported because it cannot decode MP3 files.
    if (this.browserName === 'firefox') {
      throw new ProtonPlayerError(`${this.browserName} is not supported.`);
    }

    // Check if the AudioContext API can be instantiated.
    try {
      getContext();
    } catch (e) {
      throw new ProtonPlayerError(
        `${this.browserName} does not support the AudioContext API.`
      );
    }

    this._onReady = onReady;
    this._onError = onError;
    this._volume = volume;
    this._ready = false;
    this._silenceChunks = [];
    this._clips = {};
    this._currentlyPlaying = null;
    this._playbackPositionInterval = null;
    this._useMediaSource =
      typeof window.MediaSource !== 'undefined' &&
      typeof window.MediaSource.isTypeSupported === 'function' &&
      window.MediaSource.isTypeSupported('audio/mpeg');

    if (this._useMediaSource) {
      const audioElement = document.createElement('audio');
      audioElement.autoplay = false;

      document.body.appendChild(audioElement);

      audioElement.addEventListener('ended', () => {
        if (this._currentlyPlaying && this._currentlyPlaying.clip) {
          this._currentlyPlaying.clip.playbackEnded();
        }
      });

      audioElement.addEventListener('waiting', () => {
        if (this._currentlyPlaying) {
          this._currentlyPlaying.onBufferChange(true);
        }
      });

      ['canplay', 'canplaythrough', 'playing'].forEach((eventName) => {
        audioElement.addEventListener(eventName, () => {
          if (this._currentlyPlaying) {
            this._currentlyPlaying.onBufferChange(false);
          }
        });
      });
    }

    if (!silenceURL) {
      throw new Error(
        'The `silenceURL` argument is required for using the AudioContext API backend'
      );
    }
    const silenceChunkSize = 64 * 64;
    const silenceLoader = new Loader(
      silenceChunkSize,
      silenceURL,
      silenceChunkSize,
      this._silenceChunks
    );
    silenceLoader.on('loaderror', (err) => {
      this._ready = false;
      this._onError(err);
    });
    silenceLoader.on('load', () => {
      this._ready = true;
      this._onReady();
    });
    silenceLoader.buffer(true);
  }

  preLoad(url, fileSize, initialPosition = 0) {
    // TODO: allow preloading on iOS by making preloading more efficient (aka: load and process 1 chunk at a time when preloading)
    if (this.osName === 'ios') {
      return Promise.resolve();
    }

    debug('ProtonPlayer#preLoad', url);

    try {
      return this._getClip(url, fileSize, initialPosition).preBuffer();
    } catch (err) {
      this._onError(err);
      return Promise.reject(err);
    }
  }

  play({
    url,
    fileSize,
    onBufferChange = noop,
    onBufferProgress = noop,
    onPlaybackProgress = noop,
    onPlaybackEnded = noop,
    initialPosition = 0,
    audioMetadata = {},
    fromSetPlaybackPosition = false,
  }) {
    debug('ProtonPlayer#play', url);

    if (!this._ready) {
      const message = 'Player not ready';
      warn(message);
      return Promise.reject(message);
    }

    if (
      this._currentlyPlaying &&
      this._currentlyPlaying.clip &&
      this._currentlyPlaying.url === url &&
      fromSetPlaybackPosition === false
    ) {
      debug('ProtonPlayer#play -> resume');
      return this._currentlyPlaying.clip.resume() || Promise.resolve();
    }

    onBufferProgress(0, 0);
    onPlaybackProgress(initialPosition);

    this.stopAll();

    try {
      const clip = this._getClip(url, fileSize, initialPosition, audioMetadata);

      this._currentlyPlaying = {
        clip,
        url,
        fileSize,
        onBufferChange,
        onBufferProgress,
        onPlaybackProgress,
        onPlaybackEnded,
        lastReportedProgress: initialPosition,
      };

      clip.on('loadprogress', ({ initialPosition, progress }) =>
        onBufferProgress(initialPosition, progress)
      );

      clip.once('ended', () => {
        this.stopAll();
        onPlaybackProgress(1);
        onPlaybackEnded();
      });

      clip.on('bufferchange', (isBuffering) => onBufferChange(isBuffering));

      this._playbackPositionInterval = setInterval(() => {
        const { duration, currentTime } = clip;
        if (duration === 0 || duration < currentTime) return;
        let progress = currentTime / duration;

        if (progress < 0) {
          progress = 0;
        } else if (progress > 1) {
          progress = 1; // Prevent playback progress from exceeding 1 (100%)
        }

        if (
          !this._currentlyPlaying ||
          progress < this._currentlyPlaying.lastReportedProgress // Prevent playback progress from going backwards
        ) {
          return;
        }

        this._currentlyPlaying.lastReportedProgress = progress;
        onPlaybackProgress(progress);
      }, 250);

      return clip.play() || Promise.resolve();
    } catch (err) {
      this._onError(err);
      return Promise.reject(err.toString());
    }
  }

  pauseAll() {
    debug('ProtonPlayer#pauseAll');

    if (this._currentlyPlaying && this._currentlyPlaying.clip) {
      this._currentlyPlaying.clip.pause();
    }
  }

  stopAll() {
    debug('ProtonPlayer#stopAll');

    this._currentlyPlaying = null;
    this._clearIntervals();
    Object.keys(this._clips).forEach((k) => {
      this._clips[k].offAll('loadprogress');
      this._clips[k].stop();
    });
  }

  dispose(url) {
    debug('ProtonPlayer#dispose', url);

    if (this._currentlyPlaying && this._currentlyPlaying.url === url) {
      this._currentlyPlaying = null;
      this._clearIntervals();
    }

    if (!this._clips[url]) return;

    this._clips[url].offAll('loadprogress');
    this._clips[url].dispose();
    delete this._clips[url];
  }

  disposeAll() {
    debug('ProtonPlayer#disposeAll');

    this.disposeAllExcept();
  }

  disposeAllExcept(urls = []) {
    debug('ProtonPlayer#disposeAllExcept', urls);

    Object.keys(this._clips)
      .filter((k) => urls.indexOf(k) < 0)
      .forEach((k) => this.dispose(k));
  }

  setPlaybackPosition(percent) {
    debug('ProtonPlayer#setPlaybackPosition', percent);

    if (!this._currentlyPlaying || percent > 1) {
      return;
    }

    this._currentlyPlaying.lastReportedProgress = percent;

    const {
      url,
      fileSize,
      onBufferChange,
      onBufferProgress,
      onPlaybackProgress,
      onPlaybackEnded,
    } = this._currentlyPlaying;

    const clip = this._clips[url];

    // TODO: should be able to call `setCurrentPosition` even if the position is not loaded yet.
    if (clip) {
      // && clip.isPositionLoaded(percent)
      return clip.setCurrentPosition(percent) || Promise.resolve();
    }

    const audioMetadata = clip && clip.audioMetadata;

    this.dispose(url);

    return this.play({
      url,
      fileSize,
      onBufferChange,
      onBufferProgress,
      onPlaybackProgress,
      onPlaybackEnded,
      audioMetadata,
      initialPosition: percent,
      fromSetPlaybackPosition: true,
    });
  }

  setVolume(volume = 1) {
    debug('ProtonPlayer#setVolume', volume);

    this._volume = volume;
    Object.keys(this._clips).forEach((k) => {
      this._clips[k].volume = this._volume;
    });
  }

  _getClip(url, fileSize, initialPosition = 0, audioMetadata = {}) {
    if (typeof url !== 'string') {
      throw new ProtonPlayerError('Invalid URL');
    }

    if (typeof fileSize !== 'number') {
      throw new ProtonPlayerError('Invalid file size');
    }

    if (this._clips[url]) {
      return this._clips[url];
    }

    const clip = new Clip({
      url,
      fileSize,
      initialPosition,
      audioMetadata,
      silenceChunks: this._silenceChunks,
      volume: this._volume,
      osName: this.osName,
      browserName: this.browserName,
      useMediaSource: this._useMediaSource,
    });

    clip.on('loaderror', (err) => {
      error('Clip failed to load', err);
    });

    clip.on('playbackerror', (err) => {
      error('Something went wrong during playback', err);
    });

    this._clips[url] = clip;
    return clip;
  }

  _clearIntervals() {
    clearInterval(this._playbackPositionInterval);
  }
}
