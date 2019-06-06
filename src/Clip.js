import Fetcher from "./Fetcher";
import Loader from "./Loader";
import EventEmitter from "./EventEmitter";
import Clone from "./Clone";
import getContext from "./getContext";
import warn from "./utils/warn";
const CHUNK_SIZE = 64 * 1024;
const OVERLAP = 0.2;

export default class Clip extends EventEmitter {
  constructor({ url, fileSize, silenceChunks = [], loop = false, volume = 1 }) {
    super();
    this.callbacks = {};
    this.context = getContext();
    this.buffered = 0;
    this.length = 0;
    this.loaded = false;
    this.canplaythrough = false;
    this.playing = false;
    this.ended = false;
    this._currentTime = 0;
    this.url = url;
    this.loop = loop;
    this.loader = new Fetcher(CHUNK_SIZE, url, fileSize);
    this._volume = volume;
    this._gain = this.context.createGain();
    this._gain.gain.value = this._volume;
    this._gain.connect(this.context.destination);
    this._chunks = [];
    this._silenceChunks = silenceChunks;
  }

  buffer(bufferToCompletion = false) {
    const buffer = new Loader(CHUNK_SIZE, this._chunks, this.loader);
    buffer.on("canplaythrough", () => this._fire("canplaythrough"));
    buffer.on("loadprogress", data => this._fire("loadprogress", data));
    buffer.on("loaderror", error => this._fire("loaderror", error));
    buffer.on("load", () => this._fire("load"));
    return buffer.buffer(bufferToCompletion);
  }

  clone() {
    return new Clone(this);
  }

  connect(destination, output, input) {
    if (!this._connected) {
      this._gain.disconnect();
      this._connected = true;
    }
    this._gain.connect(destination, output, input);
    return this;
  }

  disconnect(destination, output, input) {
    this._gain.disconnect(destination, output, input);
  }

  dispose() {
    if (this.playing) this.pause();
    this.loader.cancel();
    this._currentTime = 0;
    this.loaded = false;
    this.canplaythrough = false;
    this._chunks = [];
    this._fire("dispose");
  }

  play() {
    const promise = new Promise((fulfil, reject) => {
      this.once("ended", fulfil);
      this.once("loaderror", reject);
      this.once("playbackerror", reject);
      this.once("dispose", () => {
        if (this.ended) return;
        fulfil();
      });
    });

    // if (this.playing) {
    //   warn(
    //     `clip.play() was called on a clip that was already playing (${
    //       this.url
    //     })`
    //   );
    // } else if (!this.canplaythrough) {
    //   warn(
    //     `clip.play() was called before clip.canplaythrough === true (${
    //       this.url
    //     })`
    //   );
    //   this.buffer().then(() => this._play());
    // } else {
    //   this._play();
    // }

    if (this.playing) {
      warn(
        `clip.play() was called on a clip that was already playing (${
          this.url
        })`
      );
      return promise;
    }

    this.context.resume();
    this._play();

    this.playing = true;
    this.ended = false;

    return promise;
  }

  pause() {
    if (!this.playing) {
      warn(
        `clip.pause() was called on a clip that was already paused (${
          this.url
        })`
      );
      return this;
    }
    this.playing = false;
    this._currentTime =
      this._startTime + (this.context.currentTime - this._contextTimeAtStart);
    this._fire("pause");
    return this;
  }

  get currentTime() {
    if (this.playing) {
      return (
        this._startTime + (this.context.currentTime - this._contextTimeAtStart)
      );
    } else {
      return this._currentTime;
    }
  }

  set currentTime(currentTime) {
    if (this.playing) {
      this.pause();
      this._currentTime = currentTime;
      this.play();
    } else {
      this._currentTime = currentTime;
    }
  }

  get duration() {
    let total = 0;
    for (let chunk of this._chunks) {
      if (!chunk.duration) return null;
      total += chunk.duration;
    }
    return total;
  }

  get paused() {
    return !this.playing;
  }

  get volume() {
    return this._volume;
  }

  set volume(volume) {
    this._gain.gain.value = this._volume = volume;
  }

  _play() {
    let chunkIndex = 0;
    let silenceChunkIndex = 0;
    let time = 0;
    // for (chunkIndex = 0; chunkIndex < this._chunks.length; chunkIndex += 1) {
    //   const chunk = this._chunks[chunkIndex];
    //   if (!chunk.duration) {
    //     warn(`attempted to play content that has not yet buffered ${this.url}`);
    //     setTimeout(() => {
    //       this._play();
    //     }, 100);
    //     return;
    //   }
    //   const chunkEnd = time + chunk.duration;
    //   if (chunkEnd > this._currentTime) break;
    //   time = chunkEnd;
    // }
    this._startTime = this._currentTime;
    const timeOffset = this._currentTime - time;
    this._fire("play");
    let playing = true;
    const pauseListener = this.on("pause", () => {
      playing = false;
      if (previousSource) previousSource.stop();
      if (currentSource) currentSource.stop();
      pauseListener.cancel();
    });
    const _playingSilence =
      this._chunks.length === 0 || this._chunks[0].ready !== true;
    const _chunks = _playingSilence ? this._silenceChunks : this._chunks;
    const i = _playingSilence
      ? silenceChunkIndex++ % _chunks.length
      : chunkIndex++ % _chunks.length;
    let chunk = _chunks[i];
    let previousSource;
    let currentSource;
    chunk.createSource(
      timeOffset,
      source => {
        currentSource = source;
        this._contextTimeAtStart = this.context.currentTime;
        let lastStart = this._contextTimeAtStart;
        let nextStart =
          this._contextTimeAtStart + (chunk.duration - timeOffset);
        const gain = this.context.createGain();
        gain.connect(this._gain);
        gain.gain.setValueAtTime(0, nextStart + OVERLAP);
        source.connect(gain);
        source.start(this.context.currentTime);
        const endGame = () => {
          if (this.context.currentTime >= nextStart) {
            this.pause()._currentTime = 0;
            this.ended = true;
            this._fire("ended");
          } else {
            requestAnimationFrame(endGame);
          }
        };
        const advance = () => {
          if (!playing) return;
          const _playingSilence =
            this._chunks.length === 0 || this._chunks[0].ready !== true;
          const _chunks = _playingSilence ? this._silenceChunks : this._chunks;
          let i = _playingSilence
            ? silenceChunkIndex++ % _chunks.length
            : chunkIndex++ % _chunks.length;
          if (this.loop || _playingSilence) i %= _chunks.length;
          chunk = _chunks[i];
          if (chunk) {
            chunk.createSource(
              0,
              source => {
                previousSource = currentSource;
                currentSource = source;
                const gain = this.context.createGain();
                gain.connect(this._gain);
                gain.gain.setValueAtTime(0, nextStart);
                gain.gain.setValueAtTime(1, nextStart + OVERLAP);
                source.connect(gain);
                source.start(nextStart);
                lastStart = nextStart;
                nextStart += chunk.duration;
                gain.gain.setValueAtTime(0, nextStart + OVERLAP);
                tick();
              },
              error => {
                error.url = this.url;
                error.phonographCode = "COULD_NOT_CREATE_SOURCE";
                this._fire("playbackerror", error);
              }
            );
          } else {
            endGame();
          }
        };
        const tick = () => {
          if (this.context.currentTime > lastStart) {
            advance();
          } else {
            setTimeout(tick, 500);
          }
        };
        const frame = () => {
          if (!playing) return;
          requestAnimationFrame(frame);
          this._fire("progress");
        };
        tick();
        frame();
      },
      error => {
        error.url = this.url;
        error.phonographCode = "COULD_NOT_START_PLAYBACK";
        this._fire("playbackerror", error);
      }
    );
  }
}
