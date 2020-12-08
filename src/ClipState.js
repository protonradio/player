import EventEmitter from './EventEmitter';
import { debug } from './utils/logger';

const CHUNK_SIZE = 64 * 1024;

export default class ClipState extends EventEmitter {
  constructor(fileSize) {
    super();
    this._fileSize = fileSize;
    this._totalChunksCount = Math.ceil(fileSize / CHUNK_SIZE);
    this.reset();
  }

  reset() {
    debug('ClipState#reset');
    this._chunks = [];
    this._chunkIndex = 0;
    this._chunksBufferingFinished = false;
  }

  isChunkReady(wantedChunk) {
    const chunk = this._chunks[wantedChunk] || {};
    return chunk.ready === true && Number.isNaN(chunk.duration) === false;
  }

  logChunks() {
    debug(
      '\n' +
        this._chunks
          .map((chunk, index) => `[${index}] = ` + chunk.toString())
          .filter((val) => !!val)
          .join('\n')
    );
  }

  get fileSize() {
    return this._fileSize;
  }

  get totalChunksCount() {
    return this._totalChunksCount;
  }

  get chunks() {
    return this._chunks;
  }

  get chunkIndex() {
    return this._chunkIndex;
  }

  get chunksBufferingFinished() {
    return this._chunksBufferingFinished;
  }

  set chunkIndex(index) {
    this._chunksBufferingFinished = index >= this._totalChunksCount;
    if (this._chunksBufferingFinished) {
      return;
    }
    const diff = Math.abs(index - this._chunkIndex);
    this._chunkIndex = index;
    if (diff > 1) {
      this._fire('chunkIndexChanged', this._chunkIndex);
    }
  }
}
