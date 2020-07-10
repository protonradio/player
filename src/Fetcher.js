import axios, { CancelToken, Cancel } from 'axios';
import { debug } from './utils/logger';
import noop from './utils/noop';

export default class Fetcher {
  constructor(chunkSize, url, fileSize, loadBatchSize = 1) {
    // TODO: the following 2 properties should be static (need to configure translation to ES5 for UMD build)
    this.SLEEP_CANCELLED = 'SLEEP_CANCELLED';
    this.PRELOAD_BATCH_SIZE = 4;

    this.chunkSize = chunkSize;
    this.url = url;
    this.fileSize = fileSize;
    this.loadBatchSize = loadBatchSize;
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

  load({ preloadOnly = false, initialByte = 0, onProgress, onData, onLoad, onError }) {
    this._totalLoaded = this._totalLoaded || initialByte;
    this._nextChunkStart = this._nextChunkStart || initialByte;
    this._onProgress = onProgress || noop;
    this._onData = onData || noop;
    this._onLoad = onLoad || noop;
    this._onError = onError || noop;
    this._cancelled = false;
    this._preLoad()
      .then((values) => {
        values.forEach((uint8Array) => this._handleChunk(uint8Array));
        if (this._fullyLoaded || preloadOnly) return;
        this._load();
      })
      .catch(this._onError);
  }

  _handleChunk(uint8Array) {
    if (!uint8Array || uint8Array.length === 0) return;

    this._totalLoaded += uint8Array.length;
    this._onData(uint8Array);
    this._onProgress(uint8Array.length, this.fileSize);
    this._fullyLoaded = this._totalLoaded >= this.fileSize;
    if (this._fullyLoaded) {
      this._onLoad();
    }
  }

  _preLoad() {
    if (this._preloading || this._preloaded) return Promise.resolve(new Uint8Array([]));

    this._preloading = true;
    const promises = this._loadBatch(this.PRELOAD_BATCH_SIZE);

    return Promise.all(promises)
      .then((values) => {
        this._preloaded = true;
        this._preloading = false;
        return values;
      })
      .catch((err) => {
        this._preloaded = false;
        this._preloading = false;
        throw err;
      });
  }

  _load() {
    const startTime = Date.now();
    const promises = this._loadBatch(this.loadBatchSize);

    if (promises.length === 0) {
      return Promise.resolve();
    }

    return Promise.all(promises)
      .then((values) => {
        if (this._cancelled) return;
        values.forEach((uint8Array) => this._handleChunk(uint8Array));
        if (!this._fullyLoaded) {
          this._advanceStart();
          const timeout =
            this.loadBatchSize * (this._seconds(1) / 2) - (Date.now() - startTime);
          return this._sleep(timeout)
            .then(() => this._load())
            .catch((err) => {
              if (err !== this.SLEEP_CANCELLED) throw err;
            });
        }
      })
      .catch(this._onError);
  }

  _loadFragment(retryCount = 0) {
    const chunkNumber = Math.round(this._nextChunkEnd / this.chunkSize);
    debug(`Fetching chunk ${chunkNumber}...`);
    const options = {
      headers: {
        range: `${this._nextChunkStart}-${this._nextChunkEnd}`,
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
        return new Uint8Array(response.data);
      })
      .catch((error) => {
        if (error instanceof Cancel) return;

        const timedOut = error.code === 'ECONNABORTED';
        const tooManyRequests = error.response && error.response.status === 429;
        if (timedOut || tooManyRequests) {
          if (retryCount >= 10) {
            throw new Error(`Chunk fetch failed after ${retryCount} retries`);
          }
          const message = timedOut
            ? `Timed out fetching chunk ${chunkNumber}`
            : `Too many requests when fetching chunk ${chunkNumber}`;
          debug(`${message}. Retrying...`);
          const timeout = timedOut ? this._seconds(retryCount) : this._seconds(10); // TODO: use `X-RateLimit-Reset` header if error was "tooManyRequests"
          return this._sleep(timeout)
            .then(() => this._loadFragment(retryCount + 1))
            .catch((err) => {
              if (err !== this.SLEEP_CANCELLED) throw err;
            });
        }

        debug(`Unexpected error when fetching chunk ${chunkNumber}`);
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
      promises.push(this._loadFragment());
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
        reject(this.SLEEP_CANCELLED);
        clearTimeout(sleepTimeout);
      };
    });
  }

  _seconds(secs = 0) {
    return secs * 1000;
  }
}
