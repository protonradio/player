import EventEmitter from './EventEmitter';
import { debug } from './utils/logger';

export const CHUNK_SIZE = 64 * 1024;

export default class ClipState extends EventEmitter {
  constructor(fileSize, initialPosition = 0, lastAllowedPosition = 1) {
    super();
    this.reset();
    this._fileSize = fileSize;
    this._totalChunksCount = Math.ceil(fileSize / CHUNK_SIZE);
    this._chunkIndex = this.getChunkIndexByPosition(initialPosition);
    this._lastAllowedChunkIndex = this.getLastChunkIndexByPosition(lastAllowedPosition);
  }

  reset() {
    this._chunks = [];
    this._chunkIndex = 0;
    this._chunksBufferingFinished = false;
  }

  isChunkReady(wantedChunk) {
    const chunk = this._chunks[wantedChunk];
    return chunk && !Number.isNaN(chunk.duration);
  }

  getChunkIndexByPosition(position = 0) {
    const initialChunk = Math.floor(this._totalChunksCount * position);
    return initialChunk >= this._totalChunksCount
      ? this._totalChunksCount - 1
      : initialChunk;
  }

  getLastChunkIndexByPosition(position = 1) {
    return Math.max(
      Math.min(Math.ceil(this._totalChunksCount * position), this._totalChunksCount - 1),
      1
    );
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

  get lastAllowedChunkIndex() {
    return this._lastAllowedChunkIndex;
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
    this._chunksBufferingFinished =
      index >= this._totalChunksCount || index >= this._lastAllowedChunkIndex;
    if (this._chunksBufferingFinished) {
      return;
    }
    const diff = index - this._chunkIndex;
    this._chunkIndex = index;
    if (diff !== 1) {
      this._fire('chunkIndexManuallyChanged', this._chunkIndex);
    }
  }

  set lastAllowedChunkIndex(position) {
    const newLastAllowedChunkIndex = this.getLastChunkIndexByPosition(position);
    if (
      this._chunksBufferingFinished &&
      newLastAllowedChunkIndex > this._lastAllowedChunkIndex &&
      newLastAllowedChunkIndex < this._totalChunksCount
    ) {
      this._chunksBufferingFinished = false;
    }
    this._lastAllowedChunkIndex = newLastAllowedChunkIndex;
  }
}
