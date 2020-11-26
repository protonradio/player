import EventEmitter from './EventEmitter';

const CHUNK_SIZE = 64 * 1024;

export default class ClipState extends EventEmitter {
  constructor(fileSize) {
    super();
    this._fileSize = fileSize;
    this._totalChunksCount = Math.ceil(fileSize / CHUNK_SIZE);
    this._chunks = [];
    this._chunkIndex = 0;
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

  set chunkIndex(index) {
    const diff = Math.abs(index - this._chunkIndex);
    this._chunkIndex = index;
    if (diff > 1) {
      this._fire('chunkIndexChanged', this._chunkIndex);
    }
  }

  reset() {
    this._chunks = [];
  }

  isChunkReady(wantedChunk) {
    const chunk = this._chunks[wantedChunk] || {};
    return chunk.ready === true && Number.isNaN(chunk.duration) === false;
  }
}
