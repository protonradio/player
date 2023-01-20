import Bowser from 'bowser';

import ProtonPlayerError from './ProtonPlayerError';
import { debug } from './utils/logger';
import getContext from './getContext';
import noop from './utils/noop';
import initializeiOSAudioEngine from './utils/initializeiOSAudioEngine';
import Player from './Player';
import Cursor from './Cursor';

initializeiOSAudioEngine();

export default class ProtonPlayer {
  constructor({
    onReady = noop,
    onError = noop,
    onPlaybackProgress = noop,
    onPlaybackEnded = noop,
    onTrackChanged = noop,
    volume = 1,
  }) {
    debug('ProtonPlayer#constructor');

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

    this.player = new Player({
      onPlaybackEnded,
      onPlaybackProgress,
      onTrackChanged,
      onNextTrack: () => this._moveToNextTrack(),
      onReady,
      onError,
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
    return this.player.playTrack(track);
  }

  play(playlist, index = 0) {
    debug('ProtonPlayer#play');

    if (!Array.isArray(playlist)) {
      playlist = [playlist];
    }

    this.playlist = new Cursor(playlist, index);

    const [nextTrack] = this.playlist.forward();
    this.player.playNext(nextTrack);

    return this.player.playTrack(this.playlist.current());
  }

  pause() {
    debug('ProtonPlayer#pause');

    this.player.pause();
  }

  resume() {
    debug('ProtonPlayer#resume');

    this.player.resume();
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

  reset() {
    debug('ProtonPlayer#reset');

    this.playlist = new Cursor([]);
    this.player.disposeAll();
  }
}
