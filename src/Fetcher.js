import axios, { CancelToken, Cancel } from 'axios';
import { debug, error } from './utils/logger';
import noop from './utils/noop';
import DecodingError from './DecodingError';
import FetchJob from './FetchJob';

const SLEEP_CANCELLED = 'SLEEP_CANCELLED';
const LOAD_BATCH_SIZE = 2;
export const PRELOAD_BATCH_SIZE = 4;

export default class Fetcher {
  constructor(chunkSize, url, fileSize, clipState) {
    this.chunkSize = chunkSize;
    this.url = url;
    this.fileSize = fileSize;
    this._clipState = clipState;
    // this._cancelled = false;
    this._preloaded = false;
    this._preloading = false;

    this._currentChunk = 0;
    this._doneFetchingChunks = false;

    this._jobs = {};

    this._clipState.on('chunkIndexChanged', (newIndex) => {
      this.cancel();
      this._currentChunk = newIndex;
      this._doneFetchingChunks = false;
      // this._cancelled = false;
      this._load();
    });
  }

  cancel() {
    // this._cancelled = true;
    debug(`Fetcher#cancel -> this._jobs: ${JSON.stringify(this._jobs, null, 2)}`);
    Object.keys(this._jobs).forEach((chunkIndex) => {
      this._jobs[chunkIndex].cancel();
      delete this._jobs[chunkIndex];
    });
    // this._cancelTokenSource && this._cancelTokenSource.cancel();
    this._sleepOnCancel && this._sleepOnCancel();
  }

  load({
    preloadOnly = false,
    initialChunk = 0,
    onProgress,
    onData,
    onLoad,
    onError,
    createChunk,
  }) {
    this._currentChunk = initialChunk;
    this._doneFetchingChunks = false;
    this._onProgress = onProgress || noop;
    this._onData = onData || noop;
    this._onLoad = onLoad || noop;
    this._onError = onError || noop;
    this._createChunk = createChunk || noop;
    // this._cancelled = false;
    this._preLoad()
      .then((chunks) => {
        // chunks.forEach((chunk) => this._handleChunk(chunk));
        if (preloadOnly || this._doneFetchingChunks) {
          return;
        }
        this._load();
      })
      .catch(this._onError);
  }

  _handleChunk(chunk) {
    return new Promise((resolve) => {
      if (chunk && this._jobs[chunk.index]) {
        delete this._jobs[chunk.index];
      }

      if (!chunk || !chunk.raw || chunk.raw.length === 0) {
        resolve();
        return;
      }

      this._onData(chunk);
      this._onProgress(chunk.raw.length, this.fileSize);

      const isLastChunk = chunk.index === this._clipState.totalChunksCount - 1;
      this._doneFetchingChunks = isLastChunk; // TODO: is this OK?
      if (isLastChunk) {
        this._onLoad(chunk);
      }

      resolve();
    });
  }

  _preLoad() {
    if (this._preloading || this._preloaded) return Promise.resolve([]);

    this._preloading = true;
    const promises = this._loadBatch(PRELOAD_BATCH_SIZE);

    return Promise.all(promises)
      .then((chunks) => {
        this._preloaded = true;
        this._preloading = false;
        return chunks;
      })
      .catch((err) => {
        this._preloaded = false;
        this._preloading = false;
        throw err;
      });
  }

  _load() {
    if (this._doneFetchingChunks) {
      return Promise.resolve();
    }

    const promises = this._loadBatch(LOAD_BATCH_SIZE);
    const startTime = Date.now();

    return Promise.all(promises)
      .then((chunks) => {
        // if (this._cancelled) return;
        // chunks.forEach((chunk) => this._handleChunk(chunk));
        if (this._doneFetchingChunks) {
          return Promise.resolve();
        }
        const timeout =
          chunks.length === 0
            ? 0
            : LOAD_BATCH_SIZE * (this._seconds(1) / 2) - (Date.now() - startTime);
        return this._sleep(timeout)
          .then(() => this._load())
          .catch((err) => {
            if (err !== SLEEP_CANCELLED) throw err;
          });
      })
      .catch(this._onError);
  }

  // _loadFragment(chunkIndex, retryCount = 0) {
  //   // if (this._clipState.isChunkReady(chunkIndex)) {
  //   if (this._clipState.chunks[chunkIndex]) {
  //     return Promise.resolve(this._clipState.chunks[chunkIndex]);
  //   }
  //
  //   const { start, end } = this._getRange(chunkIndex);
  //   if (!Number.isInteger(start) || !Number.isInteger(end)) {
  //     const message = 'Range header is not valid';
  //     error(message, { start, end });
  //     return Promise.reject(new Error(message));
  //   }
  //
  //   const options = {
  //     headers: {
  //       range: `${start}-${end}`,
  //     },
  //     timeout: this._seconds(5),
  //     responseType: 'arraybuffer',
  //     cancelToken: this._cancelTokenSource.token,
  //   };
  //   return axios
  //     .get(this.url, options)
  //     .then((response) => {
  //       // if (this._cancelled) return null;
  //       if (!(response.data instanceof ArrayBuffer)) {
  //         throw new Error('Bad response body');
  //       }
  //       const uint8Array = new Uint8Array(response.data);
  //       return this._createChunk(uint8Array, chunkIndex);
  //     })
  //     .catch((error) => {
  //       if (error instanceof Cancel) return;
  //
  //       const timedOut = error.code === 'ECONNABORTED';
  //       const decodingError = error instanceof DecodingError;
  //       const tooManyRequests = error.response && error.response.status === 429;
  //       if (timedOut || decodingError || tooManyRequests) {
  //         if (retryCount >= 10) {
  //           throw new Error(`Chunk fetch/decode failed after ${retryCount} retries`);
  //         }
  //         const message = timedOut
  //           ? `Timed out fetching chunk`
  //           : decodingError
  //           ? `Decoding error when creating chunk`
  //           : `Too many requests when fetching chunk`;
  //         debug(`${message}. Retrying...`);
  //         const timeout = tooManyRequests ? this._seconds(10) : this._seconds(retryCount); // TODO: use `X-RateLimit-Reset` header if error was "tooManyRequests"
  //         return this._sleep(timeout)
  //           .then(() => this._loadFragment(chunkIndex, retryCount + 1))
  //           .catch((err) => {
  //             if (err !== SLEEP_CANCELLED) throw err;
  //           });
  //       }
  //
  //       debug(`Unexpected error when fetching chunk`);
  //       throw error;
  //     });
  // }

  _loadBatch(batchSize = 1) {
    // this._cancelTokenSource = CancelToken.source();
    const promises = [];
    for (let i = 0; i < batchSize; i++) {
      const chunkIndex = this._currentChunk;
      const { start, end } = this._getRange(chunkIndex);
      if (start >= this.fileSize) {
        break;
      }

      if (this._clipState.chunks[chunkIndex]) {
        promises.push(Promise.resolve(this._clipState.chunks[chunkIndex]));
      } else {
        const job = new FetchJob(this.url, start, end);
        this._jobs[chunkIndex] = job;
        const promise = job
          .fetch()
          .then((uint8Array) => this._createChunk(uint8Array, chunkIndex))
          .then((chunk) => this._handleChunk(chunk));
        promises.push(promise);
      }

      if (this._currentChunk < this._clipState.totalChunksCount) {
        this._currentChunk += 1;
      }
    }
    return promises;
  }

  _getRange(chunkIndex) {
    const start = chunkIndex * this.chunkSize + chunkIndex;
    const end = Math.min(this.fileSize, start + this.chunkSize);
    return { start, end };
  }

  _sleep(timeout) {
    return new Promise((resolve, reject) => {
      if (timeout <= 0) {
        resolve();
        return;
      }
      const sleepTimeout = setTimeout(resolve, timeout);
      this._sleepOnCancel = () => {
        reject(SLEEP_CANCELLED);
        clearTimeout(sleepTimeout);
      };
    });
  }

  _seconds(secs = 0) {
    return secs * 1000;
  }
}
