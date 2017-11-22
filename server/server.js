const mongoose = require('mongoose')
const express = require('express')
const logger = require('./utils/logger')
const config = require('./config')
const api = require('./api')

mongoose.Promise = global.Promise
const app = express()

mongoose.connect(config.db.url)

// dev/tests
if (config.seed) {
  require('./utils/seed')
}

require('./middlewares/appMiddleware')(app)

app.use('/api', api)
app.use('/api', require('./middlewares/404Middleware'))
app.use(require('./middlewares/errorMiddleware'))

if (!module.parent) {
  app.listen(config.port)
}

logger.log('listening on port ' + config.port)
module.exports = app
