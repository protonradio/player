import { debug } from './logger';

// This is for the temporary suppression of errors caused by synchronously
// interacting with a `MediaSource` while it is asynchronously loading. Doing so
// does not cause any incorrect behavior in our case, so it is safe to just
// ignore for now.
export default function suppressAbortError (e) {
  if (e.name === 'AbortError') {
    debug('AbortError suppressed', e.message);
  } else {
    throw e;
  }
}
