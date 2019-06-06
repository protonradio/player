import _noop from "lodash.noop";
import { Loader, Clip } from "./index";

export default class ProtonPlayer {
  constructor(onReady) {
    this._onReady = onReady || _noop;
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
    silenceLoader.on("canplaythrough", () => console.log("canplaythrough"));
    silenceLoader.on("loadprogress", () => console.log("loadprogress"));
    silenceLoader.on("loaderror", () => console.log("loaderror"));
    silenceLoader.on("load", () => {
      console.log("load");
      this._ready = true;
      this._onReady();
    });
    silenceLoader.buffer(true);
  }

  preLoad(url, fileSize) {
    this._createClip(url, fileSize).preBuffer();
  }

  play(url, fileSize) {
    if (!this._ready) {
      console.log("cannot play yet");
      return;
    }

    this.pauseAll();
    this._createClip(url, fileSize).play();
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

  _createClip(url, fileSize) {
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
