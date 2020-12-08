import CancellableSleep, { SLEEP_CANCELLED } from './utils/CancellableSleep';
import axios, { Cancel, CancelToken } from 'axios';
import { debug, error } from './utils/logger';
import DecodingError from './DecodingError';
import seconds from './utils/seconds';

export default class FetchJob {
  constructor(url, start, end) {
    this._url = url;
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
    const start = this._start;
    const end = this._end;
    if (!Number.isInteger(start) || !Number.isInteger(end)) {
      const message = 'Range header is not valid';
      error(message, { start, end });
      return Promise.reject(new Error(message));
    }

    const options = {
      headers: {
        range: `${start}-${end}`,
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
        return new Uint8Array(response.data);
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
