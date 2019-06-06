import _noop from "lodash.noop";
import { Loader, Clip } from "./index";

export default class ProtonPlayer {
  constructor(onReady, onError) {
    this._onReady = onReady || _noop;
    this._onError = onError || _noop;
    this._ready = false;
    this._silenceChunks = [];
    this._clips = {};

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

  play(url, fileSize) {
    if (!this._ready) {
      console.warn("player not ready");
      return;
    }

    this.pauseAll();

    return this._getClip(url, fileSize).play();
  }

  pauseAll() {
    Object.keys(this._clips).forEach(k => {
      this._clips[k].pause();
    });
  }

  disposeAll() {
    Object.keys(this._clips).forEach(k => {
      this._clips[k].dispose();
      delete this._clips[k];
    });
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
}
