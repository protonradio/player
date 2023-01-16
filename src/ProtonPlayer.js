import Bowser from 'bowser';

import ProtonPlayerError from './ProtonPlayerError';
import { debug, warn, error } from './utils/logger';
import getContext from './getContext';
import noop from './utils/noop';
import initializeiOSAudioEngine from './utils/initializeiOSAudioEngine';
import Player from './Player';
import TrackSource from './TrackSource';

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
    this.source = new TrackSource([]);
  }

  _syncToPlayerState() {
    const [_, nextSource] = this.source.nextTrack();
    this.source = nextSource;

    const [nextTrack] = this.source.nextTrack();
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

  setPlaybackPosition(percent, newLastAllowedPosition = null) {
    debug('ProtonPlayer#setPlaybackPosition');

    this.player.setPlaybackPosition(percent, newLastAllowedPosition);
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

    this.source = new TrackSource(source, index);

    const [nextTrack] = this.source.nextTrack();
    this.player.playNext(nextTrack);

    return this.player.playTrack(this.source.currentTrack());
  }

  skip() {
    debug('ProtonPlayer#skip');

    this.player.skip();
  }

  reset() {
    debug('ProtonPlayer#reset');

    this.source = new TrackSource([]);
    this.player.dispose();
  }

  setVolume(volume) {
    debug('ProtonPlayer#setVolume');

    this.player.setVolume(volume);
  }
}
