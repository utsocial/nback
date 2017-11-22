const deasync = require('deasync')
const logger = require('./logger')
const config = require('../config')

// models
const BestScores = require('../api/bestScores/bestScoresModel')
const Users = require('../api/users/usersModel')
const usersService = require('../api/users/usersService')

// data
const seedData = require('./seedData')

const { bestScores, users } = seedData
const Models = [BestScores, Users]

// init
logger.log(`Seeding ${config.env} DB ...`)

module.exports = run()

function run () {
  let ready // eslint-disable-line no-unmodified-loop-condition
  cleanDB()
    .then(seedUsers)
    .then(seedBestScores)
    .then(onSeedSuccess)
    .catch(onSeedError)
    .then(() => { ready = true })

  // make seed sync so test won't run before it is completed
  while (ready === undefined) { // eslint-disable-line no-unmodified-loop-condition
    deasync.sleep(100)
  }
}

function cleanDB () {
  logger.log('Cleaning the DB ...')
  const promises = Models.map(model => model.remove().exec())
  return Promise.all(promises)
}

function seedUsers () {
  logger.log('Seeding users ...')
  const promises = users.map(p => Users.create(p))
  return Promise.all(promises)
          .then(attachTokenToUsers)
}

function seedBestScores () {
  logger.log('Seeding bestScores ...')
  const promises = bestScores.map(p => BestScores.create(p))
  return Promise.all(promises)
}

function onSeedSuccess () {
  logger.log('Seeded DB!')
}

function onSeedError (err) {
  logger.error('error seeding DB:', err)
}

function attachTokenToUsers () {
  users.map(u => {
    u.token = usersService.signToken(u._id)
    return u
  })
}
