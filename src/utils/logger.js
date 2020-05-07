const DEBUG = false;

export function debug(...args) {
  if (DEBUG) {
    console.log(...args);
  }
}
