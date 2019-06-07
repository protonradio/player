import _noop from "lodash.noop";
import { Loader, Clip } from "./index";

export default class ProtonPlayer {
  constructor(onReady = _noop, onError = _noop) {
    this._onReady = onReady;
    this._onError = onError;
    this._ready = false;
    this._silenceChunks = [];
    this._clips = {};
    this._playingURL = null;
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

  play(url, fileSize, onBufferProgress = _noop, onPlaybackProgress = _noop) {
    if (!this._ready) {
      console.warn("player not ready");
      return;
    }

    onBufferProgress(0);
    onPlaybackProgress(0);

    this.pauseAll();
    this._playingURL = url;
    const clip = this._getClip(url, fileSize);

    clip.on("loadprogress", ({ progress }) => onBufferProgress(progress));

    this._playbackPositionInterval = setInterval(() => {
      const progress = clip.currentTime / clip.duration;
      onPlaybackProgress(progress);
    }, 500);

    clip.play();
    return clip;
  }

  pauseAll() {
    this._playingURL = null;
    this._clearIntervals();
    Object.keys(this._clips).forEach(k => {
      this._clips[k].offAll("loadprogress");
      this._clips[k].pause();
    });
  }

  disposeAll() {
    this._playingURL = null;
    this._clearIntervals();
    Object.keys(this._clips).forEach(k => {
      this._clips[k].offAll("loadprogress");
      this._clips[k].dispose();
      delete this._clips[k];
    });
  }

  setPlaybackPosition(time) {
    const clip = this._clips[this._playingURL];
    if (!clip) {
      return;
    }
    clip.currentTime = time;
  }

  _getClip(url, fileSize) {
    if (this._clips[url]) {
      return this._clips[url];
    }

    const clip = new Clip({
      url,
      fileSize,
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
