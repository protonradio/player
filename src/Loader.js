import Chunk from "./Chunk";
import EventEmitter from "./EventEmitter";
import Fetcher from "./Fetcher";
import { slice } from "./utils/buffer";
import parseMetadata from "./utils/parseMetadata";
import isFrameHeader from "./utils/isFrameHeader";
import getContext from "./getContext";

export default class Loader extends EventEmitter {
  constructor(chunkSize, url, fileSize, chunks) {
    super();
    this._chunkSize = chunkSize;
    this._chunks = chunks;
    this._fetcher = new Fetcher(chunkSize, url, fileSize);
    this._loadStarted = false;
    this._referenceHeader = {};
    this.context = getContext();
    this.metadata = null;
    this.buffered = 0;
    this.firstChunkDuration = 0;
  }

  cancel() {
    this._fetcher.cancel();
    this._loadStarted = false;
  }

  buffer(bufferToCompletion = false, preloadOnly = false, initialByte = 0) {
    if (!this._loadStarted) {
      this._loadStarted = !preloadOnly;

      let tempBuffer = new Uint8Array(this._chunkSize * 2);
      let p = 0;
      // let loadStartTime = Date.now();
      let totalLoadedBytes = 0;
      const checkCanplaythrough = () => {
        if (this.canplaythrough || !this.length) return;
        let duration = 0;
        let bytes = 0;
        for (let chunk of this._chunks) {
          // if (!chunk.duration) break;
          if (!chunk.duration) continue;
          duration += chunk.duration;
          bytes += chunk.raw.length;
        }
        if (!duration) return;
        const scale = this.length / bytes;
        const estimatedDuration = duration * scale;
        // const timeNow = Date.now();
        // const elapsed = timeNow - loadStartTime;
        // const bitrate = totalLoadedBytes / elapsed;
        // const estimatedTimeToDownload =
        //   (1.5 * (this.length - totalLoadedBytes)) / bitrate / 1e3;
        const estimatedTimeToDownload = 4; // TODO: ???
        // if we have enough audio that we can start playing now
        // and finish downloading before we run out, we've
        // reached canplaythrough
        const availableAudio = (bytes / this.length) * estimatedDuration;
        if (availableAudio > estimatedTimeToDownload) {
          this.canplaythrough = true;
          this._fire("canplaythrough");
        }
      };

      const drainBuffer = () => {
        const isFirstChunk = this._chunks.length === 0;
        const firstByte = isFirstChunk ? 32 : 0;
        const chunk = new Chunk({
          clip: {
            context: this.context,
            metadata: this.metadata,
            _referenceHeader: this._referenceHeader
          },
          raw: slice(tempBuffer, firstByte, p),
          onready: () => {
            if (!this.canplaythrough) {
              checkCanplaythrough();
            }
            if (!this.firstChunkDuration) {
              this.firstChunkDuration = chunk.duration;
            }
          },
          onerror: error => {
            error.url = this.url;
            error.phonographCode = "COULD_NOT_DECODE";
            this._fire("loaderror", error);
          }
        });
        const lastChunk = this._chunks[this._chunks.length - 1];
        if (lastChunk) lastChunk.attach(chunk);
        this._chunks.push(chunk);
        p = 0;
        return chunk;
      };
      this._fetcher.load({
        preloadOnly,
        initialByte,
        onProgress: (chunkLength, total) => {
          this.buffered += chunkLength;
          this.length = total;
          this._fire("loadprogress", { buffered: this.buffered, total });
        },
        onData: uint8Array => {
          if (!this.metadata) {
            for (let i = 0; i < uint8Array.length; i += 1) {
              // determine some facts about this mp3 file from the initial header
              if (
                uint8Array[i] === 0b11111111 &&
                (uint8Array[i + 1] & 0b11110000) === 0b11110000
              ) {
                // http://www.datavoyage.com/mpgscript/mpeghdr.htm
                this._referenceHeader = {
                  mpegVersion: uint8Array[i + 1] & 0b00001000,
                  mpegLayer: uint8Array[i + 1] & 0b00000110,
                  sampleRate: uint8Array[i + 2] & 0b00001100,
                  channelMode: uint8Array[i + 3] & 0b11000000
                };
                this.metadata = parseMetadata(this._referenceHeader);
                break;
              }
            }
          }
          for (let i = 0; i < uint8Array.length; i += 1) {
            // once the buffer is large enough, wait for
            // the next frame header then drain it
            if (p >= this._chunkSize) {
              drainBuffer();
            }
            // write new data to buffer
            tempBuffer[p++] = uint8Array[i];
          }
          totalLoadedBytes += uint8Array.length;
        },
        onLoad: () => {
          if (p) {
            const lastChunk = drainBuffer();
            lastChunk.attach(null);
            totalLoadedBytes += p;
          }
          const firstChunk = this._chunks[0];
          firstChunk.onready(() => {
            if (!this.canplaythrough) {
              this.canplaythrough = true;
              this._fire("canplaythrough");
            }
            this.loaded = true;
            this._fire("load");
          });
        },
        onError: error => {
          error.url = this.url;
          error.phonographCode = "COULD_NOT_LOAD";
          this._fire("loaderror", error);
          this._loadStarted = false;
        }
      });
    }
    return new Promise((fulfil, reject) => {
      const ready = preloadOnly ? this.canplaythrough : this.loaded;
      if (ready) {
        fulfil();
      } else {
        this.once(preloadOnly ? "canplaythrough" : "load", fulfil);
        this.once("loaderror", reject);
      }
    });
  }
}
