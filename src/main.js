import { Clip } from "./index";

export default class ProtonPlayer {
  constructor() {
    this.ready = false;
    const url = "http://local.protonradio.com:3003/noise";
    // const url =
    //   "http://local.protonradio.com:3003/stream?fn=834792_Drumcode_Live_%282018-09-02%29_Part_1_-_ANNA.mp3&md5=wmfuZF7DT540xl4ag%2BHo9g%3D%3D&player_id=1559662467703&token=eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjozMDMyMjIsInBocGJiX3VzZXIiOnsidXNlcl9hY3RpdmUiOnRydWUsInVzZXJuYW1lIjoiY2hhcmxlc25hdmkiLCJhdXRoZW50aWNhdGlvbl90b2tlbiI6IkJ6WWZpUU53SzdVY0g5TDNGaHBFIiwicHJvdG9uX3N1YnNjcmliZSI6dHJ1ZX0sInVzZXIiOnsiaWQiOjI4NjY4LCJhY2Nlc3NsZXZlbCI6M30sImV4cCI6MTU1OTc0ODgzNywiaWF0IjoxNTU5NjYyNDM3fQ.O0PxjDssN5EXYJsLXqyXvvpwKsMVhkMk83USqOOebAU";

    this.clip = new Clip({ url, fileSize: 65535 });

    this.clip.on("loaderror", err => {
      console.error("Clip failed to load", err);
    });

    this.clip.on("playbackerror", err => {
      console.error("Something went wrong during playback", err);
    });

    this.clip.buffer().then(() => {
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
    // this.clip.dispose();
    // this.clip = new Clip({ url });
    this.clip.play(url);
  }

  dispose() {
    this.clip.dispose();
  }
}
