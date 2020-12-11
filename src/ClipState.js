import EventEmitter from './EventEmitter';
import { debug } from './utils/logger';

export const CHUNK_SIZE = 64 * 1024;

export default class ClipState extends EventEmitter {
  constructor(fileSize, initialPosition = 0) {
    super();
    this.reset();
    this._fileSize = fileSize;
    this._totalChunksCount = Math.ceil(fileSize / CHUNK_SIZE);
    this._chunkIndex = this.getChunkIndexByPosition(initialPosition);
  }

  reset() {
    this._chunks = [];
    this._chunkIndex = 0;
    this._chunksBufferingFinished = false;
  }

  isChunkReady(wantedChunk) {
    const chunk = this._chunks[wantedChunk] || {};
    return chunk.ready === true && Number.isNaN(chunk.duration) === false;
  }

  getChunkIndexByPosition(position = 0) {
    const initialChunk = Math.floor(this._totalChunksCount * position);
    return initialChunk >= this._totalChunksCount
      ? this._totalChunksCount - 1
      : initialChunk;
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
    const diff = index - this._chunkIndex;
    this._chunkIndex = index;
    if (diff !== 1) {
      this._fire('chunkIndexChanged', this._chunkIndex);
    }
  }
}
