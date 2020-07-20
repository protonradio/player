import axios, { CancelToken, Cancel } from 'axios';
import { debug } from './utils/logger';
import noop from './utils/noop';
import DecodingError from './DecodingError';

const SLEEP_CANCELLED = 'SLEEP_CANCELLED';
const LOAD_BATCH_SIZE = 2;
const PRELOAD_BATCH_SIZE = 4;

export default class Fetcher {
  constructor(chunkSize, url, fileSize) {
    this.chunkSize = chunkSize;
    this.url = url;
    this.fileSize = fileSize;
    this._totalLoaded = 0;
    this._nextChunkStart = 0;
    this._nextChunkEnd = 0;
    this._cancelled = false;
    this._preloaded = false;
    this._preloading = false;
  }

  cancel() {
    this._cancelled = true;
    this._cancelTokenSource && this._cancelTokenSource.cancel();
    this._sleepOnCancel && this._sleepOnCancel();
  }

  load({
    preloadOnly = false,
    initialByte = 0,
    onProgress,
    onData,
    onLoad,
    onError,
    createChunk,
  }) {
    this._totalLoaded = this._totalLoaded || initialByte;
    this._nextChunkStart = this._nextChunkStart || initialByte;
    this._onProgress = onProgress || noop;
    this._onData = onData || noop;
    this._onLoad = onLoad || noop;
    this._onError = onError || noop;
    this._createChunk = createChunk || noop;
    this._cancelled = false;
    this._preLoad()
      .then((chunks) => {
        chunks.forEach((chunk) => this._handleChunk(chunk));
        if (this._fullyLoaded || preloadOnly) return;
        this._load();
      })
      .catch(this._onError);
  }

  _handleChunk(chunk) {
    const uint8Array = chunk.raw;
    if (!uint8Array || uint8Array.length === 0) return;

    this._totalLoaded += uint8Array.length;
    this._onData(chunk);
    this._onProgress(uint8Array.length, this.fileSize);
    this._fullyLoaded = this._totalLoaded >= this.fileSize;
    if (this._fullyLoaded) {
      this._onLoad(chunk);
    }
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
    const promises = this._loadBatch(LOAD_BATCH_SIZE);
    if (promises.length === 0) {
      return Promise.resolve();
    }

    const startTime = Date.now();

    return Promise.all(promises)
      .then((chunks) => {
        if (this._cancelled) return;
        chunks.forEach((chunk) => this._handleChunk(chunk));
        if (!this._fullyLoaded) {
          this._advanceStart();
          const timeout =
            LOAD_BATCH_SIZE * (this._seconds(1) / 2) - (Date.now() - startTime);
          return this._sleep(timeout)
            .then(() => this._load())
            .catch((err) => {
              if (err !== SLEEP_CANCELLED) throw err;
            });
        }
      })
      .catch(this._onError);
  }

  _loadFragment(start, end, retryCount = 0) {
    debug(`Fetching chunk...`);
    const options = {
      headers: {
        range: `${start}-${end}`,
      },
      timeout: this._seconds(5),
      responseType: 'arraybuffer',
      cancelToken: this._cancelTokenSource.token,
    };
    return axios
      .get(this.url, options)
      .then((response) => {
        if (this._cancelled) return null;
        if (!(response.data instanceof ArrayBuffer)) {
          throw new Error('Bad response body');
        }
        const uint8Array = new Uint8Array(response.data);
        return this._createChunk(uint8Array);
      })
      .catch((error) => {
        if (error instanceof Cancel) return;

        const timedOut = error.code === 'ECONNABORTED';
        const decodingError = error instanceof DecodingError;
        const tooManyRequests = error.response && error.response.status === 429;
        if (timedOut || decodingError || tooManyRequests) {
          if (retryCount >= 10) {
            throw new Error(`Chunk fetch/decode failed after ${retryCount} retries`);
          }
          const message = timedOut
            ? `Timed out fetching chunk`
            : decodingError
            ? `Decoding error when creating chunk`
            : `Too many requests when fetching chunk`;
          debug(`${message}. Retrying...`);
          const timeout = tooManyRequests ? this._seconds(10) : this._seconds(retryCount); // TODO: use `X-RateLimit-Reset` header if error was "tooManyRequests"
          return this._sleep(timeout)
            .then(() => this._loadFragment(start, end, retryCount + 1))
            .catch((err) => {
              if (err !== SLEEP_CANCELLED) throw err;
            });
        }

        debug(`Unexpected error when fetching chunk`);
        throw error;
      });
  }

  _loadBatch(batchSize = 1) {
    this._cancelTokenSource = CancelToken.source();
    const promises = [];
    for (let i = 0; i < batchSize; i++) {
      if (this._nextChunkStart >= this.fileSize) {
        break;
      }
      this._advanceEnd();
      promises.push(this._loadFragment(this._nextChunkStart, this._nextChunkEnd));
      this._advanceStart();
    }
    return promises;
  }

  _advanceStart() {
    this._nextChunkStart = this._nextChunkEnd + 1;
  }

  _advanceEnd() {
    this._nextChunkEnd =
      this._nextChunkStart + Math.min(this._getRemaining(), this.chunkSize);
  }

  _getRemaining() {
    return this.fileSize - this._totalLoaded - 1;
  }

  _sleep(timeout) {
    return new Promise((resolve, reject) => {
      if (timeout <= 0) {
        resolve();
        return;
      }
      debug(`Sleeping for ${timeout}ms...`);
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
