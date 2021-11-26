const PLAYBACK_STATE = {
  STOPPED: 'STOPPED',
  PLAYING: 'PLAYING',
  PAUSED: 'PAUSED',
};

export default class PlaybackState {
  constructor({ state = PLAYBACK_STATE.STOPPED } = {}) {
    this.state = state;
  }

  isPlaying() {
    return this.state === PLAYBACK_STATE.PLAYING;
  }

  isPaused() {
    return this.state === PLAYBACK_STATE.PAUSED;
  }

  isStopped() {
    return this.state === PLAYBACK_STATE.STOPPED;
  }

  play() {
    return new PlaybackState({ state: PLAYBACK_STATE.PLAYING });
  }

  pause() {
    return new PlaybackState({ state: PLAYBACK_STATE.PAUSED });
  }

  // TODO: `stopped` is a bit too much like paused, maybe change to `inactive`?
  stop() {
    return new PlaybackState({ state: PLAYBACK_STATE.STOPPED });
  }
}
