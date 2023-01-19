import Bowser from 'bowser';

import ProtonPlayerError from './ProtonPlayerError';
import { debug, warn, error } from './utils/logger';
import getContext from './getContext';
import noop from './utils/noop';
import initializeiOSAudioEngine from './utils/initializeiOSAudioEngine';
import Player from './Player';
import Source from './Source';

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

    this.player = new Player({
      onPlaybackEnded,
      onPlaybackProgress,
      onNextTrack: (currentTrack, nextTrack) => {
        this._syncToPlayerState();
        onTrackChanged(currentTrack, nextTrack);
      },
      onReady,
      onError,
      volume,
      osName: this.osName,
      browserName: this.browserName,
    });

    // A queue of tracks scheduled to be played in the future.
    this.source = new Source([]);
  }

  _syncToPlayerState() {
    const [_, nextSource] = this.source.forward();
    this.source = nextSource;

    const [nextTrack] = this.source.forward();
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

  play(source, index = 0) {
    debug('ProtonPlayer#play');

    // Just attempt to resume playback if no arguments are provided.
    if (source == null) {
      return this.player.resume();
    }

    if (!Array.isArray(source)) {
      source = [source];
    }

    this.source = new Source(source, index);

    const [nextTrack] = this.source.forward();
    this.player.playNext(nextTrack);

    return this.player.playTrack(this.source.current());
  }

  skip() {
    debug('ProtonPlayer#skip');

    this.player.skip();
  }

  back() {
    debug('ProtonPlayer#back');

    const currentTrack = this.source.current();
    const [previousTrack, source] = this.source.back();

    this.source = source;
    this.player.playTrack(previousTrack);
    this.player.playNext(currentTrack);
    this.player.onNextTrack(currentTrack, previousTrack);
  }

  currentTrack() {
    debug('ProtonPlayer#currentTrack');

    return this.source.current();
  }

  previousTracks() {
    debug('ProtonPlayer#previousTracks');

    return this.source.head();
  }

  nextTracks() {
    debug('ProtonPlayer#nextTracks');

    return this.source.tail();
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

    this.source = new Source([]);
    this.player.disposeAll();
  }
}
