/* eslint no-console: 0 */
global.SHOUT = function SHOUT (...args) {
  console.log('*********************')
  console.log.apply(null, args)
  console.log('*********************')
}

module.exports = {

  logging: true,
  seed: true,

  db: {
    url: process.env.DB_URL || 'mongodb://localhost/memory-n-back_test',
  },
}
