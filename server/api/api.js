const router = require('express').Router()

router.use('/users', require('./users/usersRoutes'))
router.use('/bestScores', require('./bestScores/bestScoresRoutes'))

module.exports = router
