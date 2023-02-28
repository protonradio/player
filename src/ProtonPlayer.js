import Bowser from 'bowser';

import ProtonPlayerError from './ProtonPlayerError';
import { debug } from './utils/logger';
import getContext from './getContext';
import initializeiOSAudioEngine from './utils/initializeiOSAudioEngine';
import Player from './Player';
import Cursor from './Cursor';
import EventEmitter from './EventEmitter';

initializeiOSAudioEngine();

const PlaybackState = {
  UNINITIALIZED: 'UNINITIALIZED',
  READY: 'READY',
  PLAYING: 'PLAYING',
  PAUSED: 'PAUSED',
};

export default class ProtonPlayer extends EventEmitter {
  static PlaybackState = PlaybackState;

  constructor({ volume = 1 }) {
    debug('ProtonPlayer#constructor');

    super();

    const browser = Bowser.getParser(window.navigator.userAgent);
    const browserName = browser.getBrowserName().toLowerCase();
    const osName = browser.getOSName().toLowerCase();

    // Firefox is not supported because it cannot decode MP3 files.
    if (browserName === 'firefox') {
      throw new ProtonPlayerError(`${browserName} is not supported.`);
    }

    // Check if the AudioContext API can be instantiated.
    try {
      getContext();
    } catch (e) {
      throw new ProtonPlayerError(
        `${browserName} does not support the AudioContext API.`
      );
    }

    this.state = PlaybackState.UNINITIALIZED;

    this.player = new Player({
      onPlaybackEnded: () => {
        this.state = PlaybackState.READY;
        this._fire('state_changed', PlaybackState.READY);
      },
      onPlaybackProgress: (progress) => this._fire('tick', progress),
      onTrackChanged: (track, nextTrack) =>
        this._fire('track_changed', { track, nextTrack }),
      onNextTrack: () => this._moveToNextTrack(),
      onReady: () => {
        this.state = PlaybackState.READY;
        this._fire('state_changed', PlaybackState.READY);
      },
      onVolumeChanged: (volume) => this._fire('volume_changed', volume),
      onError: (e) => this._fire('error', e),
      volume,
      osName,
      browserName,
    });

    this.playlist = new Cursor([]);
  }

  _moveToNextTrack() {
    const [_, playlist] = this.playlist.forward();
    this.playlist = playlist;

    const [nextTrack] = this.playlist.forward();
    if (nextTrack) {
      this.player.playNext(nextTrack);
    }
  }

  playTrack(track) {
    debug('ProtonPlayer#playTrack');

    this.reset();
    this.player.reset();
    return this.player.playTrack(track).then(() => {
      this.state = PlaybackState.PLAYING;
      this._fire('state_changed', this.state);
    });
  }

  play(playlist, index = 0) {
    debug('ProtonPlayer#play');

    if (!Array.isArray(playlist)) {
      playlist = [playlist];
    }

    this.playlist = new Cursor(playlist, index);

    const [nextTrack] = this.playlist.forward();
    this.player.playNext(nextTrack);

    return this.player.playTrack(this.playlist.current()).then(() => {
      this.state = PlaybackState.PLAYING;
      this._fire('state_changed', this.state);
    });
  }

  toggle() {
    debug('ProtonPlayer#toggle');

    if (this.state === PlaybackState.PLAYING) {
      return this.pause();
    } else if (this.state === PlaybackState.PAUSED) {
      return this.resume();
    } else {
      return Promise.reject();
    }
  }

  pause() {
    debug('ProtonPlayer#pause');

    return this.player.pause().then(() => {
      this.state = PlaybackState.PAUSED;
      this._fire('state_changed', this.state);
    });
  }

  resume() {
    debug('ProtonPlayer#resume');

    return this.player.resume().then(() => {
      this.state = PlaybackState.PLAYING;
      this._fire('state_changed', this.state);
    });
  }

  skip() {
    debug('ProtonPlayer#skip');

    const [nextTrack, playlist] = this.playlist.forward();
    this.playlist = playlist;

    if (nextTrack) {
      this.player.playTrack(nextTrack);

      const [followingTrack] = this.playlist.forward();
      if (followingTrack) {
        this.player.playNext(followingTrack);
      }
    } else {
      this.player.stopAll();
      this.player.onPlaybackEnded();
    }
  }

  jump(index) {
    debug('ProtonPlayer#jump');

    this.playlist = this.playlist.move(index);
    const currentTrack = this.playlist.current();

    if (currentTrack) {
      this.player.playTrack(currentTrack);

      const [followingTrack] = this.playlist.forward();
      if (followingTrack) {
        this.player.playNext(followingTrack);
      }
    } else {
      this.player.stopAll();
      this.player.onPlaybackEnded();
    }
  }

  back() {
    debug('ProtonPlayer#back');

    const currentTrack = this.playlist.current();
    const [previousTrack, playlist] = this.playlist.back();

    this.playlist = playlist;
    this.player.playTrack(previousTrack);
    this.player.playNext(currentTrack);
  }

  currentTrack() {
    debug('ProtonPlayer#currentTrack');

    return this.playlist.current();
  }

  previousTracks() {
    debug('ProtonPlayer#previousTracks');

    return this.playlist.head();
  }

  nextTracks() {
    debug('ProtonPlayer#nextTracks');

    return this.playlist.tail();
  }

  setPlaybackPosition(percent, newLastAllowedPosition = null) {
    debug('ProtonPlayer#setPlaybackPosition');

    this.player.setPlaybackPosition(percent, newLastAllowedPosition);
  }

  setVolume(volume) {
    debug('ProtonPlayer#setVolume');

    this.player.setVolume(volume);
  }

  currentVolume() {
    debug('ProtonPlayer#currentVolume');

    return this.player.volume;
  }

  toggleMute() {
    debug('ProtonPlayer#toggleMute');

    const isMuted = this.player.isMuted();
    if (isMuted) {
      this.player.unmute();
    } else {
      this.player.mute();
    }
    return !isMuted;
  }

  isMuted() {
    debug('ProtonPlayer#isMuted');

    return this.player.isMuted();
  }

  reset() {
    debug('ProtonPlayer#reset');

    this.playlist = new Cursor([]);
    this.player.disposeAll();
  }
}
