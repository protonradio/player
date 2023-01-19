import Clip from './Clip';
import ClipState from './ClipState';
import ProtonPlayerError from './ProtonPlayerError';
import { debug, warn, error } from './utils/logger';
import { getSilenceURL } from './utils/silence';
import canUseMediaSource from './utils/canUseMediaSource';
import noop from './utils/noop';
import Loader from './Loader';

export default class Player {
  constructor({
    browserName,
    onError,
    onNextTrack,
    onPlaybackEnded,
    onPlaybackProgress,
    onReady,
    osName,
    volume,
  }) {
    this.browserName = browserName;
    this.osName = osName;
    this.volume = volume;
    this.onError = onError;
    this.onNextTrack = onNextTrack;
    this.onPlaybackEnded = onPlaybackEnded;
    this.onPlaybackProgress = onPlaybackProgress;
    this.onReady = onReady;

    this.ready = false;

    // Database of cached audio data and track metadata.
    this.clips = {};
    this.currentlyPlaying = null;
    this.nextTrack = null;

    const silenceChunkSize = 64 * 64;
    this.silenceClipState = new ClipState(silenceChunkSize);

    if (canUseMediaSource()) {
      const audioElement = document.createElement('audio');
      audioElement.autoplay = false;

      document.body.appendChild(audioElement);

      audioElement.addEventListener('ended', () => {
        if (this.currentlyPlaying && this.currentlyPlaying.clip) {
          this.currentlyPlaying.clip.playbackEnded();
        }
      });

      audioElement.addEventListener('waiting', () => {
        if (this.currentlyPlaying) {
          this.currentlyPlaying.onBufferChange(true);
        }
      });

      ['canplay', 'canplaythrough', 'playing'].forEach((eventName) => {
        audioElement.addEventListener(eventName, () => {
          if (this.currentlyPlaying) {
            this.currentlyPlaying.onBufferChange(false);
          }
        });
      });
    }

    const silenceLoader = new Loader(
      silenceChunkSize,
      getSilenceURL(),
      this.silenceClipState
    );
    silenceLoader.on('loaderror', (err) => {
      this.ready = false;
      this.onError(err);
    });
    silenceLoader.on('load', () => {
      this.ready = true;
      this.onReady();
    });
    silenceLoader.buffer();
  }

  reset() {
    this.currentlyPlaying = null;
    this.nextTrack = null;

    this.disposeAll();
  }

  playNext(track) {
    this._dispose(track.url);

    this.nextTrack = track;
    this.preLoad(
      track.url,
      track.fileSize,
      track.initialPosition,
      track.lastAllowedPosition
    );
  }

  preLoad(url, fileSize, initialPosition = 0, lastAllowedPosition = 1) {
    // TODO: allow preloading on iOS by making preloading more efficient (aka: load and process 1 chunk at a time when preloading)
    if (this.osName === 'ios') {
      return Promise.resolve();
    }

    try {
      return this._getClip(
        url,
        fileSize,
        initialPosition,
        lastAllowedPosition
      ).preBuffer();
    } catch (err) {
      this.onError(err);
      return Promise.reject(err);
    }
  }

  playTrack(track) {
    this.__DEPRECATED__playTrack(track, track);
  }

  __DEPRECATED__playTrack(
    {
      url,
      fileSize,
      onBufferChange = noop,
      onBufferProgress = noop,
      initialPosition = 0,
      lastAllowedPosition = 1,
      audioMetadata = {},
      fromSetPlaybackPosition = false,
    },
    track = null
  ) {
    if (!this.ready) {
      const message = 'Player not ready';
      warn(message);
      return Promise.reject(message);
    }

    if (
      this.currentlyPlaying &&
      this.currentlyPlaying.clip &&
      this.currentlyPlaying.url === url &&
      fromSetPlaybackPosition === false
    ) {
      debug('ProtonPlayer#play -> resume');
      return this.currentlyPlaying.clip.resume() || Promise.resolve();
    }

    onBufferProgress(0, 0);
    this.onPlaybackProgress(initialPosition);

    this.stopAll();

    try {
      const clip = this._getClip(
        url,
        fileSize,
        initialPosition,
        lastAllowedPosition,
        audioMetadata
      );

      this.currentlyPlaying = {
        track,
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
        if (this.nextTrack) {
          let nextTrack = this.nextTrack;
          let currentTrack = this.currentlyPlaying?.track;
          this.nextTrack = null;
          this.playTrack(nextTrack);
          this.onNextTrack(currentTrack, nextTrack);
        } else {
          this.stopAll();
          this.onPlaybackEnded();
        }
        this.onPlaybackProgress(1);
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
          !this.currentlyPlaying ||
          progress < this.currentlyPlaying.lastReportedProgress // Prevent playback progress from going backwards
        ) {
          return;
        }

        this.currentlyPlaying.lastReportedProgress = progress;
        this.onPlaybackProgress(progress);
      }, 250);

      return clip.play() || Promise.resolve();
    } catch (err) {
      this.onError(err);
      return Promise.reject(err.toString());
    }
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

    if (this.clips[url]) {
      return this.clips[url];
    }

    const clip = new Clip({
      url,
      fileSize,
      initialPosition,
      lastAllowedPosition,
      audioMetadata,
      silenceChunks: this.silenceClipState.chunks,
      volume: this.volume,
      osName: this.osName,
      browserName: this.browserName,
      useMediaSource: canUseMediaSource(),
    });

    clip.on('loaderror', (err) => {
      error('Clip failed to load', err);
    });

    clip.on('playbackerror', (err) => {
      error('Something went wrong during playback', err);
    });

    this.clips[url] = clip;
    return clip;
  }

  stopAll() {
    this.currentlyPlaying = null;
    this._clearIntervals();
    Object.keys(this.clips).forEach((k) => {
      this.clips[k].offAll('loadprogress');
      this.clips[k].stop();
    });
  }

  skip() {
    if (this.nextTrack) {
      const currentTrack = this.currentlyPlaying?.track;
      const track = this.nextTrack;
      this.nextTrack = null;

      this.playTrack(track);
      this.onNextTrack(currentTrack, track);

      if (currentTrack) {
        this._dispose(currentTrack.url);
      }
    } else {
      this.stopAll();
      this.onPlaybackEnded();
    }
  }

  resume() {
    if (this.currentlyPlaying && this.currentlyPlaying.clip) {
      this.currentlyPlaying.clip.resume();
    }
  }

  pause() {
    if (this.currentlyPlaying && this.currentlyPlaying.clip) {
      this.currentlyPlaying.clip.pause();
    }
  }

  setVolume(volume = 1) {
    this.volume = volume;
    Object.keys(this.clips).forEach((k) => {
      this.clips[k].volume = this.volume;
    });
  }

  setPlaybackPosition(percent, newLastAllowedPosition = null) {
    if (!this.currentlyPlaying || percent > 1) {
      return Promise.resolve();
    }

    this.currentlyPlaying.lastReportedProgress = percent;

    const {
      url,
      fileSize,
      onBufferChange,
      onBufferProgress,
      onPlaybackProgress,
      onPlaybackEnded,
      lastAllowedPosition,
    } = this.currentlyPlaying;

    newLastAllowedPosition = newLastAllowedPosition || lastAllowedPosition;

    const clip = this.clips[url];

    if (clip) {
      return (
        clip.setCurrentPosition(percent, newLastAllowedPosition) || Promise.resolve()
      );
    }

    const audioMetadata = clip && clip.audioMetadata;

    this.dispose(url);

    return this.playTrack({
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

  _dispose(url) {
    if (this.currentlyPlaying && this.currentlyPlaying.url === url) {
      this.currentlyPlaying = null;
      this._clearIntervals();
    }

    if (!this.clips[url]) return;

    this.clips[url].offAll('loadprogress');
    this.clips[url].dispose();
    delete this.clips[url];
  }

  disposeAll(urls = []) {
    Object.keys(this.clips).forEach((k) => this._dispose(k));
  }

  _clearIntervals() {
    clearInterval(this._playbackPositionInterval);
  }
}
