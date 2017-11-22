/* eslint no-console: off */
global.IS_LOGGING = process.env.IS_WEB ? __DEV__ : global.__DEV__

export default {
  log: (...args) => global.IS_LOGGING ? console.log(...args) : null,
  info: (...args) => global.IS_LOGGING ? console.info(...args) : null,
  warn: (...args) => global.IS_LOGGING ? console.warn(...args) : null,
  error: (...args) => global.IS_LOGGING ? console.error(...args) : null,
}
