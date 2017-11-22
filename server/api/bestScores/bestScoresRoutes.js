const router = require('express').Router()
const controller = require('./bestScoresController')
const usersService = require('../users/usersService')

router.route('/addOrUpdate')
  .put(usersService.decodeToken, controller.addOrUpdate)

module.exports = router
