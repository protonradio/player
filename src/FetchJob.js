import CancellableSleep, { SLEEP_CANCELLED } from './utils/CancellableSleep';
import axios, { Cancel, CancelToken } from 'axios';
import { debug, error } from './utils/logger';
import DecodingError from './DecodingError';
import seconds from './utils/seconds';

export default class FetchJob {
  constructor(url, createChunk, chunkIndex, start, end) {
    this._url = url;
    this._createChunk = createChunk;
    this._chunkIndex = chunkIndex;
    this._start = start;
    this._end = end;
    this._cancelled = false;
    this._cancelTokenSource = CancelToken.source();
  }

  cancel() {
    this._cancelled = true;
    this._cancelTokenSource.cancel();
    this._sleep && this._sleep.cancel();
  }

  fetch(retryCount = 0) {
    if (this._cancelled) return Promise.resolve(null);

    if (!Number.isInteger(this._start) || !Number.isInteger(this._end)) {
      const message = 'Range header is not valid';
      error(message, { start: this._start, end: this._end });
      return Promise.reject(new Error(message));
    }

    const options = {
      headers: {
        range: `${this._start}-${this._end}`,
      },
      timeout: seconds(5),
      responseType: 'arraybuffer',
      cancelToken: this._cancelTokenSource.token,
    };
    return axios
      .get(this._url, options)
      .then((response) => {
        if (this._cancelled) return null;
        if (!(response.data instanceof ArrayBuffer)) {
          throw new Error('Bad response body');
        }
        const uint8Array = new Uint8Array(response.data);
        return this._createChunk(uint8Array, this._chunkIndex);
      })
      .catch((error) => {
        if (error instanceof Cancel) return;

        const timedOut = error.code === 'ECONNABORTED';
        const networkError = error.message === 'Network Error';
        const decodingError = error instanceof DecodingError;
        const tooManyRequests = error.response && error.response.status === 429;
        if (timedOut || networkError || decodingError || tooManyRequests) {
          if (!networkError && retryCount >= 10) {
            throw new Error(`Chunk fetch/decode failed after ${retryCount} retries`);
          }
          const message = timedOut
            ? `Timed out fetching chunk`
            : decodingError
            ? `Decoding error when creating chunk`
            : `Too many requests when fetching chunk`;
          debug(`${message}. Retrying...`);
          const timeout = tooManyRequests ? seconds(10) : seconds(retryCount); // TODO: use `X-RateLimit-Reset` header if error was "tooManyRequests"
          this._sleep = new CancellableSleep(timeout);
          return this._sleep
            .wait()
            .then(() => this.fetch(retryCount + 1))
            .catch((err) => {
              if (err !== SLEEP_CANCELLED) throw err;
            });
        }

        debug(`Unexpected error when fetching chunk`);
        throw error;
      });
  }
}
