import CancellableSleep, { SLEEP_CANCELLED } from './utils/CancellableSleep';

export const LOAD_BATCH_SIZE = 2;
export const PRELOAD_BATCH_SIZE = 4;

export default class SequentialFetcher {
  constructor(clipState, chunkIndex, fetchChunk, preLoadOnly = false) {
    this._clipState = clipState;
    this._chunkIndex = chunkIndex;
    this._initialChunk = chunkIndex;
    this._fetchChunk = fetchChunk;
    this._preLoadOnly = preLoadOnly;
    this._cancelled = false;
  }

  cancel() {
    this._cancelled = true;
    this._sleep && this._sleep.cancel();
  }

  load() {
    if (this._cancelled || this._chunkIndex >= this._clipState.totalChunksCount) {
      return;
    }

    const startTime = Date.now();
    const promises = [];
    const firstLoad = this._chunkIndex === this._initialChunk;
    const batchSize = Math.min(
      this._preLoadOnly || firstLoad ? PRELOAD_BATCH_SIZE : LOAD_BATCH_SIZE,
      this._clipState.totalChunksCount
    );

    for (let i = 0; i < batchSize; i++) {
      if (this._chunkIndex >= this._clipState.totalChunksCount) {
        break;
      }

      const chunkExists = !!this._clipState.chunks[this._chunkIndex];
      if (!chunkExists) {
        promises.push(this._fetchChunk(this._chunkIndex));
      }

      this._chunkIndex += 1;
    }

    if (this._preLoadOnly) {
      return;
    }

    const timeout =
      promises.length === 0 ? 0 : LOAD_BATCH_SIZE * 500 - (Date.now() - startTime);
    this._sleep = new CancellableSleep(timeout);

    Promise.all(promises)
      .then(() => this._sleep.wait())
      .then(() => this.load())
      .catch((err) => {
        if (err !== SLEEP_CANCELLED) throw err;
      });
  }
}
