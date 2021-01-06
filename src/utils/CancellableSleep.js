import noop from './noop';

export const SLEEP_CANCELLED = 'SLEEP_CANCELLED';

export default class CancellableSleep {
  constructor(timeout) {
    this._timeout = timeout;
    this._sleepOnCancel = noop;
  }

  wait() {
    return new Promise((resolve, reject) => {
      if (this._timeout <= 0) {
        resolve();
        return;
      }
      const sleepTimeout = setTimeout(resolve, this._timeout);
      this._sleepOnCancel = () => {
        reject(SLEEP_CANCELLED);
        clearTimeout(sleepTimeout);
      };
    });
  }

  cancel() {
    this._sleepOnCancel();
  }
}
