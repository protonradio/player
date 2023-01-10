import Bowser from 'bowser';

import ProtonPlayerError from './ProtonPlayerError';
import { debug, warn, error } from './utils/logger';
import getContext from './getContext';
import noop from './utils/noop';
import initializeiOSAudioEngine from './utils/initializeiOSAudioEngine';
import Queue from './Queue';
import Track from './Track';
import Player from './Player';

initializeiOSAudioEngine();

// Separate out the "player" side effects into something else.
// - Will need a "currentTrack" and "nextTrack", at least for gapless.
// - This class will then:
//   - manage the queue
//   - wire up callback comms
//   - deal with compatibility / os / browser shit
//   - expose the user API

export default class ProtonPlayer {
  constructor({
    onReady = noop,
    onError = noop,
    onPlaybackProgress = noop,
    onPlaybackEnded = noop,
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
      onPlaybackEnded: () => this._syncQueueToPlayer(),
      onPlaybackProgress,
      onReady,
      onError,
      volume,
      osName: this.osName,
      browserName: this.browserName,
    });

    // A queue of tracks scheduled to be played in the future.
    this._queue = new Queue();
  }

  _syncQueueToPlayer() {
    if (this._queue.peek()) {
      let [_, nextQueue] = this._queue.pop();
      this._queue = nextQueue;

      let followingTrack = this._queue.peek();
      if (followingTrack) {
        this.player.playNext(followingTrack);
      }
    }
  }

  playTrack(track) {
    debug('ProtonPlayer#playTrack');

    this.clearQueue();
    this.player.reset();
    return this.player.playTrack(track);
  }

  setPlaybackPosition(percent, newLastAllowedPosition = null) {
    debug('ProtonPlayer#setPlaybackPosition');

    this.player.setPlaybackPosition(percent, newLastAllowedPosition);
  }

  play() {
    debug('ProtonPlayer#play');

    if (!this.player.currentlyPlaying && this._queue.peek()) {
      let [nextTrack, nextQueue] = this._queue.pop();
      this._queue = nextQueue;

      return this.player.playTrack(nextTrack);
    } else if (this.player.currentlyPlaying) {
      return this.player.playTrack(this.player.currentlyPlaying);
    }
  }

  playNext(tracks) {
    debug('ProtonPlayer#playNext');

    if (!Array.isArray(tracks)) {
      tracks = [tracks];
    }

    this._queue = this._queue.prepend(tracks.map((t) => new Track(t)));
    this.player.playNext(tracks[0]);
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

      this.player.playTrack(nextTrack);
    } else {
      this.player.stopAll();
    }
  }

  clearQueue() {
    debug('ProtonPlayer#clearQueue');

    this._queue = this._queue.clear();
    this.player.dispose();
  }

  queue() {
    debug('ProtonPlayer#queue');

    return this._queue.unwrap();
  }
}
