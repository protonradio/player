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
    const browserName = browser.getBrowserName();
    const osName = browser.getOSName(true);

    // Firefox is not supported because it cannot decode MP3 files.
    if (browserName === 'Firefox') {
      throw new ProtonPlayerError(`${browserName} is not supported.`);
    }

    // Safari detects some delay between the user click and the audio playback start with the MediaSource API.
    // That's why we force Safari to use the AudioContext API.
    if (browserName === 'Safari' || osName === 'ios') {
      window.MediaSource = undefined;
    }

    // Check if the MediaSource API supports decoding MP3s.
    if (window.MediaSource && !window.MediaSource.isTypeSupported('audio/mpeg')) {
      throw new ProtonPlayerError(
        `${browserName} does not have decoders for 'audio/mpeg'.`
      );
    }

    // Check if the AudioContext API can be instantiated.
    try {
      getContext();
    } catch (e) {
      throw new ProtonPlayerError(
        `${browserName} does not support the AudioContext API.`
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

    if (typeof window.MediaSource !== 'undefined') {
      const audioElement = document.createElement('audio');
      audioElement.autoplay = false;

      document.body.appendChild(audioElement);

      audioElement.addEventListener('ended', () => {
        Object.keys(this._clips).forEach((k) => {
          this._clips[k].playbackEnded();
        });
      });

      setTimeout(() => {
        this._ready = true;
        this._onReady();
      });
    } else {
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
  }

  preLoad(url, fileSize, initialPosition = 0) {
    debug('ProtonPlayer#preLoad');

    try {
      return this._getClip(url, fileSize, initialPosition).preBuffer();
    } catch (err) {
      this._onError(err);
      return Promise.reject(err);
    }
  }

  play(
    url,
    fileSize,
    onBufferProgress = noop,
    onPlaybackProgress = noop,
    initialPosition = 0,
    audioMetadata = {}
  ) {
    debug('ProtonPlayer#play');

    if (!this._ready) {
      const message = 'Player not ready';
      warn(message);
      return Promise.reject(message);
    }

    onBufferProgress(0, 0);
    onPlaybackProgress(initialPosition);

    this.pauseAll();

    try {
      const clip = this._getClip(url, fileSize, initialPosition, audioMetadata);

      this._currentlyPlaying = {
        clip,
        url,
        fileSize,
        onBufferProgress,
        onPlaybackProgress,
        lastReportedProgress: initialPosition,
      };

      clip.on('loadprogress', ({ initialPosition, progress }) =>
        onBufferProgress(initialPosition, progress)
      );

      clip.on('ended', () => {
        this.pauseAll();
        onPlaybackProgress(1);
      });

      this._playbackPositionInterval = setInterval(() => {
        if (clip.duration === 0) return;
        const progress = clip.currentTime / clip.duration;

        if (
          progress > 1 || // Prevent playback progress from exceeding 1 (100%)
          progress < this._currentlyPlaying.lastReportedProgress // Prevent playback progress from going backwards
        ) {
          return;
        }

        this._currentlyPlaying.lastReportedProgress = progress;
        onPlaybackProgress(progress);
      }, 500);

      return clip.play() || Promise.resolve();
    } catch (err) {
      this._onError(err);
      return Promise.reject(err.toString());
    }
  }

  pauseAll() {
    debug('ProtonPlayer#pauseAll');

    this._currentlyPlaying = null;
    this._clearIntervals();
    Object.keys(this._clips).forEach((k) => {
      this._clips[k].offAll('loadprogress');
      this._clips[k].pause();
    });
  }

  dispose(url) {
    debug('ProtonPlayer#dispose');

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
    debug('ProtonPlayer#disposeAllExcept');

    Object.keys(this._clips)
      .filter((k) => urls.indexOf(k) < 0)
      .forEach((k) => this.dispose(k));
  }

  setPlaybackPosition(percent) {
    debug('ProtonPlayer#setPlaybackPosition');

    if (!this._currentlyPlaying || percent > 1) {
      return;
    }

    this._currentlyPlaying.lastReportedProgress = percent;

    const {
      url,
      fileSize,
      onBufferProgress,
      onPlaybackProgress,
    } = this._currentlyPlaying;

    const clip = this._clips[url];

    if (clip && clip.isPositionLoaded(percent)) {
      return clip.setCurrentPosition(percent) || Promise.resolve();
    }

    const audioMetadata = clip && clip.audioMetadata;

    this.dispose(url);

    return this.play(
      url,
      fileSize,
      onBufferProgress,
      onPlaybackProgress,
      percent,
      audioMetadata
    );
  }

  setVolume(volume = 1) {
    debug('ProtonPlayer#setVolume');

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
      silenceChunks: this._silenceChunks,
      volume: this._volume,
      audioMetadata,
    });

    clip.on('loaderror', (err) => {
      error('Clip failed to load', err);
    });

    clip.on('playbackerror', (err) => {
      error('Something went wrong during playback: ' + err.toString());
    });

    this._clips[url] = clip;
    return clip;
  }

  _clearIntervals() {
    clearInterval(this._playbackPositionInterval);
  }
}
