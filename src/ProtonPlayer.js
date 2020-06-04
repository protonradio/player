import Bowser from 'bowser';

import ProtonPlayerError from './ProtonPlayerError';
import noop from './utils/noop';
import { debug } from './utils/logger';
import Loader from './Loader';
import Clip from './Clip';
import _ from './init';

export default class ProtonPlayer {
  constructor({ silenceURL, volume = 1, onReady = noop, onError = noop }) {
    debug('ProtonPlayer#constructor');

    const browser = Bowser.getParser(window.navigator.userAgent);
    if (browser.getBrowser().name === 'Safari') {
      window.MediaSource = undefined;
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
      audioElement.autoplay = true;

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
      console.warn('Player not ready');
      return;
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

      clip.play();
    } catch (err) {
      this._onError(err);
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
      clip.setCurrentPosition(percent);
      return;
    }

    const audioMetadata = clip && clip.audioMetadata;

    this.dispose(url);
    this.play(
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
      console.error('Clip failed to load', err);
    });

    clip.on('playbackerror', (err) => {
      console.error('Something went wrong during playback', err);
    });

    this._clips[url] = clip;
    return clip;
  }

  _clearIntervals() {
    clearInterval(this._playbackPositionInterval);
  }
}
