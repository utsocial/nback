const bcrypt = require('bcryptjs')
const CustomError = require('custom-error-generator')
const axios = require('axios')
const config = require('../../config')
const service = require('./usersService')
const Users = require('./usersModel')
const BestScores = require('../bestScores/bestScoresModel')

module.exports = { get, getOne, login, fbAuth, post, put }

function get (req, res, next) {
  Users.find()
    .then(users => res.json(users))
    .catch(next)
}

function getOne (req, res, next) {
  let user
  const { id } = req.params
  Users.findById(id)
    .then(_user => {
      if (!_user) {
        throw Error('user doesn\'t exist')
      }
      return _user
    })
    .then(prepareUser)
    .then(_user => {
      user = _user
      return BestScores.find({ userId: user._id })
    })
    .then(bestScores => {
      user.bestScores = attachBestScores(bestScores)
      res.json(user)
    })
    .catch(next)
}

function login (req, res, next) {
  let user
  const { email, password } = req.body
  Users.findOne({ email }).select('+password')
    .then(_user => validateUserCredentials(_user, password))
    .then(prepareUser)
    .then(_user => {
      user = _user
      return BestScores.find({ userId: user._id })
    })
    .then(bestScores => {
      user.bestScores = attachBestScores(bestScores)
      res.json(user)
    })
    .catch(next)
}

function post (req, res, next) {
  const newUser = req.body
  Users.create(newUser)
    .then(prepareUser)
    .then(user => res.status(201).json(user))
    .catch(err => {
      if (err.errors && err.errors.email && err.errors.email.message) {
        throw new CustomError('custom error', {
          code: 400,
        })('User with that email already exists')
      }
    })
    .catch(next)
}

function put (req, res, next) {
  Users.update({ _id: req.params.id }, { $set: req.body })
    .then(DBres => res.json(DBres))
    .catch(next)
}

function fbAuth (req, res, next) {
  let user
  const { email, name, userID, fbPictureUrl, accessToken: fbClientAccessToken, isMobile } = req.query
  const update = {
    name,
    fbUserId: userID,
    email,
    fbPictureUrl,
  }
  // Find or create user
  const options = { upsert: true, new: true, setDefaultsOnInsert: true }
  Users.findOneAndUpdate({ email }, update, options)
  .then(prepareUser)
  .then(_user => {
    user = _user
    return BestScores.find({ userId: user._id })
  })
  .then(bestScores => {
    user.bestScores = attachBestScores(bestScores)
    res.json(user)
  })
  .catch(next)
  // client get the user object response
  // exchange client token for long term server token behind the scenes
  // and save it on user collection
  .then(() => {
    return isMobile ? fbClientAccessToken : axios.get(`https://graph.facebook.com/oauth/access_token?client_id=${config.fbId}&client_secret=${config.fbSecret}&grant_type=fb_exchange_token&fb_exchange_token=${fbClientAccessToken}`)
  })
  .then(fbRes => {
    const fbServerAccessToken = isMobile ? fbRes : fbRes.data.split('=')[1]
    return Users.findOneAndUpdate({ _id: user._id }, { $set: { fbAccessToken: fbServerAccessToken } })
  })
  .catch(next)
}

function validateUserCredentials (user, password) {
  if (!user || !bcrypt.compareSync(password, user.password)) {
    throw new CustomError('custom error', {
      code: 400,
    })('user with that email does not exist or password is incorrect')
  }
  return user
}

function prepareUser (user) {
  user = user.toObject()
  delete user.password
  user.token = service.signToken(user._id)
  return user
}

function attachBestScores (bestScores) {
  return bestScores.reduce((res, bs) => {
    res[bs.mode] = bs.score
    return res
  }, {})
}
