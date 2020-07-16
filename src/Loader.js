import Chunk from './Chunk';
import EventEmitter from './EventEmitter';
import Fetcher from './Fetcher';
import { slice } from './utils/buffer';
import { debug } from './utils/logger';
import parseMetadata from './utils/parseMetadata';
import getContext from './getContext';

export default class Loader extends EventEmitter {
  constructor(chunkSize, url, fileSize, chunks, audioMetadata = {}, loadBatchSize = 1) {
    super();
    this._chunkSize = chunkSize;
    this._chunks = chunks;
    this._referenceHeader = audioMetadata.referenceHeader;
    this.metadata = audioMetadata.metadata;
    this._fetcher = new Fetcher(chunkSize, url, fileSize, loadBatchSize);
    this._loadStarted = false;
    this._canPlayThrough = false;
    this.context = getContext();
    this.buffered = 0;
    this.firstChunkDuration = 0;
  }

  get audioMetadata() {
    return {
      referenceHeader: this._referenceHeader,
      metadata: this.metadata,
    };
  }

  cancel() {
    this._fetcher.cancel();
    this._loadStarted = false;
  }

  buffer(bufferToCompletion = false, preloadOnly = false, initialByte = 0) {
    if (!this._loadStarted) {
      this._loadStarted = !preloadOnly;
      this._canPlayThrough = false;

      const checkCanplaythrough = () => {
        if (this._canPlayThrough || !this.length) return;
        let loadedChunksCount = 0;
        for (let chunk of this._chunks) {
          if (!chunk.duration) break;
          if (++loadedChunksCount >= this._fetcher.PRELOAD_BATCH_SIZE) {
            this._canPlayThrough = true;
            this._fire('canplaythrough');
            debug('Can play through');
            break;
          }
        }
      };

      const calculateMetadata = (uint8Array) => {
        if (
          !this.metadata ||
          !this._referenceHeader ||
          Object.keys(this.metadata).length === 0 ||
          Object.keys(this._referenceHeader).length === 0
        ) {
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
                channelMode: uint8Array[i + 3] & 0b11000000,
              };
              this.metadata = parseMetadata(this._referenceHeader);
              break;
            }
          }
        }
      };

      const createChunk = (uint8Array) => {
        calculateMetadata(uint8Array);
        return new Promise((resolve, reject) => {
          const chunk = new Chunk({
            clip: {
              context: this.context,
              metadata: this.metadata,
              _referenceHeader: this._referenceHeader,
            },
            raw: slice(uint8Array, 0, uint8Array.length),
            onready: () => resolve(chunk),
            onerror: (error) => reject(error),
          });
        });
      };

      this._fetcher.load({
        preloadOnly,
        initialByte,
        createChunk,
        onProgress: (chunkLength, total) => {
          this.buffered += chunkLength;
          this.length = total;
          this._fire('loadprogress', { buffered: this.buffered, total });
        },
        onData: (chunk) => {
          const lastChunk = this._chunks[this._chunks.length - 1];
          if (lastChunk) lastChunk.attach(chunk);
          this._chunks.push(chunk);
          if (!this._canPlayThrough) {
            checkCanplaythrough();
          }
          if (!this.firstChunkDuration) {
            this.firstChunkDuration = chunk.duration;
          }
        },
        onLoad: (chunk) => {
          if (chunk.raw.length > 0) {
            chunk.attach(null);
          }
          const firstChunk = this._chunks[0];
          firstChunk.onready(() => {
            if (!this._canPlayThrough) {
              this._canPlayThrough = true;
              this._fire('canplaythrough');
            }
            this.loaded = true;
            this._fire('load');
          });
        },
        onError: (error = {}) => {
          error.url = this.url;
          error.phonographCode = 'COULD_NOT_LOAD';
          this._fire('loaderror', error);
          this._loadStarted = false;
        },
      });
    }
    return new Promise((fulfil, reject) => {
      const ready = preloadOnly ? this._canPlayThrough : this.loaded;
      if (ready) {
        fulfil();
      } else {
        this.once(preloadOnly ? 'canplaythrough' : 'load', fulfil);
        this.once('loaderror', reject);
      }
    });
  }
}
