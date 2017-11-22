const _ = require('lodash')

const config = {
  dev: 'development',
  test: 'testing',
  prod: 'production',
  staging: 'staging',
  jwtSecret: process.env.JWT_SECRET || 'JWT_SECRET',
  fbSecret: process.env.FACEBOOK_SECRET || '702669633f14078d15180cea1246a76d',
  fbId: process.env.FACEBOOK_ID || '329879750722396',
  sysPassword: process.env.SYS_PASSWORD || 'sysPass',
  port: process.env.PORT || 3001,
}

process.env.NODE_ENV = process.env.NODE_ENV || config.dev

config.env = process.env.NODE_ENV
const envConfig = require(`./${config.env}`)

module.exports = _.merge(config, envConfig)
