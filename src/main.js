import { Clip } from "./index";

export default class ProtonPlayer {
  constructor() {
    this.ready = false;

    const url = "http://local.protonradio.com:3003/noise";
    this.clip = new Clip({ url });

    this.clip.on("loaderror", err => {
      console.error("Clip failed to load", err);
    });

    this.clip.on("playbackerror", err => {
      console.error("Something went wrong during playback", err);
    });

    this.clip.buffer(true).then(() => {
      console.log("buffer promise resolved");
      this.ready = true;
      for (let $btn of $playBtns) {
        $btn.removeAttribute("disabled");
      }
    });
  }

  play(url) {
    if (!this.ready) {
      console.log("cannot play yet");
      return;
    }
    this.clip.play(url);
  }

  dispose() {
    this.clip.dispose();
  }
}
