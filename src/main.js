import _noop from "lodash.noop";
import { Loader, Clip } from "./index";

export default class ProtonPlayer {
  constructor(onReady = _noop, onError = _noop) {
    this._onReady = onReady;
    this._onError = onError;
    this._ready = false;
    this._silenceChunks = [];
    this._clips = {};
    this._currentlyPlaying = null;
    this._playbackPositionInterval = null;

    const silenceURL = "http://local.protonradio.com:3003/silence";
    const silenceChunkSize = 64 * 64;
    const silenceLoader = new Loader(
      silenceChunkSize,
      silenceURL,
      silenceChunkSize,
      this._silenceChunks
    );
    silenceLoader.on("loaderror", err => {
      this._ready = false;
      this._onError(err);
    });
    silenceLoader.on("load", () => {
      this._ready = true;
      this._onReady();
    });
    silenceLoader.buffer(true);
  }

  preLoad(url, fileSize) {
    return this._getClip(url, fileSize).preBuffer();
  }

  play(
    url,
    fileSize,
    onBufferProgress = _noop,
    onPlaybackProgress = _noop,
    initialByte = 0
  ) {
    if (!this._ready) {
      console.warn("Player not ready");
      return;
    }

    onBufferProgress(0);
    onPlaybackProgress(0);

    this.pauseAll();
    const clip = this._getClip(url, fileSize, initialByte);
    this._currentlyPlaying = {
      clip,
      url,
      fileSize,
      onBufferProgress,
      onPlaybackProgress
    };

    clip.on("loadprogress", ({ progress }) => onBufferProgress(progress));

    this._playbackPositionInterval = setInterval(() => {
      if (clip.duration === 0) return;
      const progress = clip.currentTime / clip.duration;
      onPlaybackProgress(progress);
    }, 500);

    clip.on("ended", () => this.pauseAll());

    clip.play();
    return clip;
  }

  pauseAll() {
    this._currentlyPlaying = null;
    this._clearIntervals();
    Object.keys(this._clips).forEach(k => {
      this._clips[k].offAll("loadprogress");
      this._clips[k].pause();
    });
  }

  dispose(url) {
    if (this._currentlyPlaying && this._currentlyPlaying.url === url) {
      this._currentlyPlaying = null;
      this._clearIntervals();
    }

    if (!this._clips[url]) return;
    this._clips[url].offAll("loadprogress");
    this._clips[url].dispose();
    delete this._clips[url];
  }

  disposeAll() {
    Object.keys(this._clips).forEach(k => {
      this.dispose(k);
    });
  }

  setPlaybackPosition(percent) {
    if (!this._currentlyPlaying) {
      return;
    }

    const {
      url,
      fileSize,
      onBufferProgress,
      onPlaybackProgress
    } = this._currentlyPlaying;

    const initialByte = Math.round(fileSize * percent);
    this.dispose(url);
    this.play(url, fileSize, onBufferProgress, onPlaybackProgress, initialByte);
  }

  _getClip(url, fileSize, initialByte = 0) {
    if (this._clips[url]) {
      return this._clips[url];
    }

    const clip = new Clip({
      url,
      fileSize,
      initialByte,
      silenceChunks: this._silenceChunks
    });

    clip.on("loaderror", err => {
      console.error("Clip failed to load", err);
    });

    clip.on("playbackerror", err => {
      console.error("Something went wrong during playback", err);
    });

    this._clips[url] = clip;
    return clip;
  }

  _clearIntervals() {
    clearInterval(this._playbackPositionInterval);
  }
}
