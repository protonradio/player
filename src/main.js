import _noop from "lodash.noop";
import { Loader, Buffer, Clip } from "./index";

export default class ProtonPlayer {
  constructor(onReady) {
    this._onReady = onReady || _noop;
    this._ready = false;
    this._silenceChunks = [];

    const silenceURL = "http://local.protonradio.com:3003/silence";
    const silenceChunkSize = 64 * 64;
    const silenceFileSize = silenceChunkSize;
    const silencePreloadChunks = 1;
    const silenceLoader = new Loader(
      silenceChunkSize,
      silenceURL,
      silenceFileSize,
      silencePreloadChunks
    );
    const silenceBuffer = new Buffer(
      silenceChunkSize,
      this._silenceChunks,
      silenceLoader
    );
    silenceBuffer.on("canplaythrough", () => console.log("canplaythrough"));
    silenceBuffer.on("loadprogress", () => console.log("loadprogress"));
    silenceBuffer.on("loaderror", () => console.log("loaderror"));
    silenceBuffer.on("load", () => {
      console.log("load");
      this._ready = true;
      this._onReady();
    });
    silenceBuffer.buffer(true);
  }

  play(url, fileSize) {
    if (!this._ready) {
      console.log("cannot play yet");
      return;
    }

    if (this.clip) {
      this.clip.dispose();
    }

    this.clip = new Clip({
      url,
      fileSize,
      silenceChunks: this._silenceChunks
    });

    this.clip.on("loaderror", err => {
      console.error("Clip failed to load", err);
    });

    this.clip.on("playbackerror", err => {
      console.error("Something went wrong during playback", err);
    });

    this.clip.buffer().then(() => {
      console.log("buffer promise resolved");
    });

    this.clip.play();
  }

  dispose() {
    this.clip.dispose();
  }
}
