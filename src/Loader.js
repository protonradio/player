import Chunk from './Chunk';
import EventEmitter from './EventEmitter';
import Fetcher, { PRELOAD_BATCH_SIZE } from './Fetcher';
import { slice } from './utils/buffer';
import { debug } from './utils/logger';
import parseMetadata from './utils/parseMetadata';
import getContext from './getContext';

export default class Loader extends EventEmitter {
  constructor(chunkSize, url, fileSize, chunks, clipState, audioMetadata = {}) {
    super();
    this._chunkSize = chunkSize;
    this._chunks = chunks;
    this._clipState = clipState;
    this._referenceHeader = audioMetadata.referenceHeader;
    this.metadata = audioMetadata.metadata;
    this._fetcher = new Fetcher(chunkSize, url, fileSize, clipState);
    this._loadStarted = false;
    this._canPlayThrough = false;
    this.context = getContext();
    this.buffered = 0;
    this._chunksDuration = 0;
    this._chunksCount = 0;

    this._clipState.on('chunkIndexChanged', (newIndex) => {
      this._initialChunk = newIndex;
      // this._canPlayThrough = this._clipState.isChunkReady(newIndex); // TODO: do this or always set it to false?
      this._canPlayThrough = false;
    });
  }

  get audioMetadata() {
    return {
      referenceHeader: this._referenceHeader,
      metadata: this.metadata,
    };
  }

  get averageChunkDuration() {
    return this._chunksCount > 0 ? this._chunksDuration / this._chunksCount : 0;
  }

  cancel() {
    this._fetcher.cancel();
    this._loadStarted = false;
  }

  buffer(bufferToCompletion = false, preloadOnly = false, initialChunk = 0) {
    if (!this._loadStarted) {
      this._loadStarted = !preloadOnly;
      this._initialChunk = initialChunk;
      this._canPlayThrough = false;

      const checkCanplaythrough = () => {
        if (this._canPlayThrough || !this.length) return;
        let loadedChunksCount = 0;
        const preloadBatchSize = Math.min(
          PRELOAD_BATCH_SIZE,
          this._clipState.totalChunksCount - this._initialChunk
        );
        debug(`checkCanplaythrough:
        - PRELOAD_BATCH_SIZE: ${PRELOAD_BATCH_SIZE}
        - this._clipState.totalChunksCount: ${this._clipState.totalChunksCount}
        - this._initialChunk: ${this._initialChunk}
        - this._clipState.totalChunksCount - this._initialChunk: ${
          this._clipState.totalChunksCount - this._initialChunk
        }
        - preloadBatchSize: ${preloadBatchSize}
        `);
        for (let i = this._initialChunk; i < this._clipState.totalChunksCount; i++) {
          const chunk = this._chunks[i];
          if (!chunk || !chunk.duration) break;
          if (++loadedChunksCount >= preloadBatchSize) {
            this._canPlayThrough = true;
            this._fire('canPlayThrough');
            debug('Can play through 1');
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
              // TODO: do the following checks based on arguments to the library?
              if (
                this.metadata.sampleRate === 44100 &&
                this.metadata.channelMode === 'stereo'
              )
                break;
            }
          }
        }
      };

      const createChunk = (uint8Array, index) => {
        calculateMetadata(uint8Array);
        return new Promise((resolve, reject) => {
          const chunk = new Chunk({
            index,
            clip: {
              context: this.context,
              metadata: this.metadata,
              _referenceHeader: this._referenceHeader,
            },
            raw: slice(uint8Array, 0, uint8Array.length),
            callback: (err) => {
              if (err) {
                return reject(err);
              }
              resolve(chunk);
            },
          });
        });
      };

      this._fetcher.load({
        preloadOnly,
        initialChunk,
        createChunk,
        onProgress: (chunkLength, total) => {
          this.buffered += chunkLength;
          this.length = total;
          this._fire('loadprogress', { buffered: this.buffered, total });
        },
        onData: (chunk) => {
          debug(`onData -> chunk.index: ${chunk.index} -> chunk.next: ${!!chunk.next}`);
          const lastChunk = this._chunks[chunk.index - 1];
          if (lastChunk) lastChunk.attach(chunk);
          // const nextChunk = this._chunks[chunk.index + 1];
          // if (nextChunk) chunk.attach(nextChunk);
          this._chunks[chunk.index] = chunk;
          if (!this._canPlayThrough) {
            checkCanplaythrough();
          }
          if (chunk.raw.length === this._chunkSize + 1 && chunk.duration > 0) {
            this._chunksDuration += chunk.duration;
            this._chunksCount += 1;
          }
        },
        onLoad: (lastChunk) => {
          if (lastChunk) {
            lastChunk.attach(null);
          }
          const firstChunk = this._chunks[this._initialChunk];
          if (firstChunk) {
            firstChunk.onready(() => {
              if (!this._canPlayThrough) {
                this._canPlayThrough = true;
                this._fire('canPlayThrough');
                debug('Can play through 2');
              }
              this.loaded = true;
              this._fire('load');
            });
          }
        },
        onError: (error = {}) => {
          error.url = this.url;
          error.phonographCode = 'COULD_NOT_LOAD';
          this._fire('loaderror', error);
          this._loadStarted = false;
        },
      });
    }
    return new Promise((resolve, reject) => {
      const ready = preloadOnly ? this._canPlayThrough : this.loaded;
      if (ready) {
        resolve();
      } else {
        this.once(preloadOnly ? 'canPlayThrough' : 'load', resolve);
        this.once('loaderror', reject);
      }
    });
  }
}
