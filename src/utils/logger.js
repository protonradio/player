export function debug(...args) {
  if (__DEV__) {
    console.log(`%c[ProtonPlayer]`, 'color: #e26014; font-weight: bold;', ...args);
  }
}

export function warn(...args) {
  console.warn(`%c[ProtonPlayer]`, 'color: yellow; font-weight: bold;', ...args);
}

export function error(...args) {
  console.error(`%c[ProtonPlayer]`, 'color: red; font-weight: bold;', ...args);
}
