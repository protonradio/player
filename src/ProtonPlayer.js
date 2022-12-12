import Bowser from 'bowser';

import ProtonPlayerError from './ProtonPlayerError';
import { debug, warn, error } from './utils/logger';
import getContext from './getContext';
import ClipState from './ClipState';
import noop from './utils/noop';
import Loader from './Loader';
import Clip from './Clip';
import { getSilenceURL } from './utils/silence';
import initializeiOSAudioEngine from './utils/initializeiOSAudioEngine';
import Queue from './Queue';
import Track from './Track';

initializeiOSAudioEngine();

export default class ProtonPlayer {
  constructor({
    volume = 1,
    onReady = noop,
    onError = noop,
    onPlaybackProgress = noop,
    onPlaybackEnded = noop,
  }) {
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
    this._onPlaybackProgress = onPlaybackProgress;
    this._onPlaybackEnded = onPlaybackEnded;
    this._volume = volume;
    this._ready = false;
    const silenceChunkSize = 64 * 64;
    this._silenceChunksClipState = new ClipState(silenceChunkSize);
    this._clips = {};
    this._currentlyPlaying = null;
    this._playbackPositionInterval = null;
    this._useMediaSource =
      typeof window.MediaSource !== 'undefined' &&
      typeof window.MediaSource.isTypeSupported === 'function' &&
      window.MediaSource.isTypeSupported('audio/mpeg');
    this._queue = new Queue();

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

    const silenceLoader = new Loader(
      silenceChunkSize,
      getSilenceURL(),
      this._silenceChunksClipState
    );
    silenceLoader.on('loaderror', (err) => {
      this._ready = false;
      this._onError(err);
    });
    silenceLoader.on('load', () => {
      this._ready = true;
      this._onReady();
    });
    silenceLoader.buffer();
  }

  preLoad(url, fileSize, initialPosition = 0, lastAllowedPosition = 1) {
    // TODO: allow preloading on iOS by making preloading more efficient (aka: load and process 1 chunk at a time when preloading)
    if (this.osName === 'ios') {
      return Promise.resolve();
    }

    debug('ProtonPlayer#preLoad', url);

    try {
      return this._getClip(
        url,
        fileSize,
        initialPosition,
        lastAllowedPosition
      ).preBuffer();
    } catch (err) {
      this._onError(err);
      return Promise.reject(err);
    }
  }

  playTrack({
    url,
    fileSize,
    onBufferChange = noop,
    onBufferProgress = noop,
    initialPosition = 0,
    lastAllowedPosition = 1,
    audioMetadata = {},
    fromSetPlaybackPosition = false,
  }) {
    debug('ProtonPlayer#playTrack', url);

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
    this._onPlaybackProgress(initialPosition);

    this.stopAll();

    try {
      const clip = this._getClip(
        url,
        fileSize,
        initialPosition,
        lastAllowedPosition,
        audioMetadata
      );

      this._currentlyPlaying = {
        clip,
        url,
        fileSize,
        onBufferChange,
        onBufferProgress,
        lastAllowedPosition,
        lastReportedProgress: initialPosition,
      };

      clip.on('loadprogress', ({ initialPosition, progress }) =>
        onBufferProgress(initialPosition, progress)
      );

      clip.once('ended', () => {
        this.stopAll();
        this._onPlaybackProgress(1);
        this._onPlaybackEnded();

        if (this._queue.peek()) {
          let [nextTrack, nextQueue] = this._queue.pop();
          this._queue = nextQueue;

          this.play(nextTrack);

          let followingTrack = this._queue.peek();
          if (followingTrack) {
            this.preLoad(
              followingTrack.url,
              followingTrack.fileSize,
              followingTrack.initialPosition,
              followingTrack.lastAllowedPosition
            );
          }
        }
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
        this._onPlaybackProgress(progress);
      }, 250);

      return clip.play() || Promise.resolve();
    } catch (err) {
      this._onError(err);
      return Promise.reject(err.toString());
    }
  }

  play() {
    debug('ProtonPlayer#play');

    if (!this._currentlyPlaying && this._queue.peek()) {
      let [nextTrack, nextQueue] = this._queue.pop();
      this._queue = nextQueue;

      return this.playTrack(nextTrack);
    } else if (this._currentlyPlaying) {
      return this.playTrack(this._currentlyPlaying);
    }
  }

  playNext(track) {
    debug('ProtonPlayer#playNext');

    this._queue = this._queue.prepend(new Track(track));
    this.preLoad(
      track.url,
      track.fileSize,
      track.initialPosition,
      track.lastAllowedPosition
    );
  }

  playLater(tracks) {
    debug('ProtonPlayer#playLater');

    if (!Array.isArray(tracks)) {
      tracks = [tracks];
    }

    this._queue = this._queue.append(tracks.map((t) => new Track(t)));
  }

  skip() {
    debug('ProtonPlayer#skip');

    if (this._queue.peek()) {
      let [nextTrack, nextQueue] = this._queue.pop();
      this._queue = nextQueue;

      this.playTrack(nextTrack);
    } else {
      this.stopAll();
    }
  }

  clearQueue() {
    debug('ProtonPlayer#clearQueue');

    this._queue = this._queue.clear();
  }

  queue() {
    debug('ProtonPlayer#queue');

    return this._queue.unwrap();
  }

  pause() {
    debug('ProtonPlayer#pause');

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

  dispose(urls = []) {
    debug('ProtonPlayer#dispose', urls);

    Object.keys(this._clips)
      .filter((k) => urls.indexOf(k) < 0)
      .forEach((k) => this._dispose(k));
  }

  _dispose(url) {
    if (this._currentlyPlaying && this._currentlyPlaying.url === url) {
      this._currentlyPlaying = null;
      this._clearIntervals();
    }

    if (!this._clips[url]) return;

    this._clips[url].offAll('loadprogress');
    this._clips[url].dispose();
    delete this._clips[url];
  }

  setPlaybackPosition(percent, newLastAllowedPosition = null) {
    debug('ProtonPlayer#setPlaybackPosition', percent);

    if (!this._currentlyPlaying || percent > 1) {
      return Promise.resolve();
    }

    this._currentlyPlaying.lastReportedProgress = percent;

    const {
      url,
      fileSize,
      onBufferChange,
      onBufferProgress,
      onPlaybackProgress,
      onPlaybackEnded,
      lastAllowedPosition,
    } = this._currentlyPlaying;

    newLastAllowedPosition = newLastAllowedPosition || lastAllowedPosition;

    const clip = this._clips[url];

    if (clip) {
      return (
        clip.setCurrentPosition(percent, newLastAllowedPosition) || Promise.resolve()
      );
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
      lastAllowedPosition: newLastAllowedPosition,
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

  _getClip(
    url,
    fileSize,
    initialPosition = 0,
    lastAllowedPosition = 1,
    audioMetadata = {}
  ) {
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
      lastAllowedPosition,
      audioMetadata,
      silenceChunks: this._silenceChunksClipState.chunks,
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
