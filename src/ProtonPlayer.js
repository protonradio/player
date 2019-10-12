import Bowser from 'bowser';
import _noop from 'lodash.noop';
import { Loader, Clip } from './index';

export default class ProtonPlayer {
  constructor({ silenceURL, volume = 1, onReady = _noop, onError = _noop }) {
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
      let audioElement = document.createElement('audio');
      audioElement.autoplay = true;

      document.body.appendChild(audioElement);

      audioElement.addEventListener('ended', () => {
        Object.keys(this._clips).forEach(k => {
          this._clips[k].playing = false;
          this._clips[k].ended = true;
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
      silenceLoader.on('loaderror', err => {
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
    return this._getClip(url, fileSize, initialPosition).preBuffer();
  }

  play(
    url,
    fileSize,
    onBufferProgress = _noop,
    onPlaybackProgress = _noop,
    initialPosition = 0,
    audioMetadata = {}
  ) {
    if (!this._ready) {
      console.warn('Player not ready');
      return;
    }

    onBufferProgress(0, 0);
    onPlaybackProgress(0);

    this.pauseAll();
    const clip = this._getClip(url, fileSize, initialPosition, audioMetadata);
    this._currentlyPlaying = {
      clip,
      url,
      fileSize,
      onBufferProgress,
      onPlaybackProgress
    };

    clip.on('loadprogress', ({ initialPosition, progress }) =>
      onBufferProgress(initialPosition, progress)
    );

    this._playbackPositionInterval = setInterval(() => {
      if (clip.duration === 0) return;
      const progress = clip.currentTime / clip.duration;
      onPlaybackProgress(progress);
    }, 500);

    clip.on('ended', () => this.pauseAll());

    clip.play();
    return clip;
  }

  pauseAll() {
    this._currentlyPlaying = null;
    this._clearIntervals();
    Object.keys(this._clips).forEach(k => {
      this._clips[k].offAll('loadprogress');
      this._clips[k].pause();
    });
  }

  dispose(url) {
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
    this.disposeAllExcept();
  }

  disposeAllExcept(urls = []) {
    Object.keys(this._clips)
      .filter(k => urls.indexOf(k) < 0)
      .forEach(k => this.dispose(k));
  }

  setPlaybackPosition(percent) {
    if (!this._currentlyPlaying || percent > 1) {
      return;
    }

    const {
      url,
      fileSize,
      onBufferProgress,
      onPlaybackProgress
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
    this._volume = volume;
    Object.keys(this._clips).forEach(k => {
      this._clips[k].volume = this._volume;
    });
  }

  _getClip(url, fileSize, initialPosition = 0, audioMetadata = {}) {
    if (this._clips[url]) {
      return this._clips[url];
    }

    const clip = new Clip({
      url,
      fileSize,
      initialPosition,
      silenceChunks: this._silenceChunks,
      volume: this._volume,
      audioMetadata
    });

    clip.on('loaderror', err => {
      console.error('Clip failed to load', err);
    });

    clip.on('playbackerror', err => {
      console.error('Something went wrong during playback', err);
    });

    this._clips[url] = clip;
    return clip;
  }

  _clearIntervals() {
    clearInterval(this._playbackPositionInterval);
  }
}
