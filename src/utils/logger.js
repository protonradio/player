const DEBUG = false;

export function debug(...args) {
  if (DEBUG) {
    console.log('[ProtonPlayer]', ...args);
  }
}

export function warn(...args) {
  console.warn('[ProtonPlayer]', ...args);
}

export function error(...args) {
  console.error('[ProtonPlayer]', ...args);
}
