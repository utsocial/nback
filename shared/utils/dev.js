/* eslint no-console: 0 */
module.exports = store => {
  global.store = store
  global.SHOUT = SHOUT
}

function SHOUT (...args) {
  console.log('*********************')
  console.log.apply(null, args)
  console.log('*********************')
}
