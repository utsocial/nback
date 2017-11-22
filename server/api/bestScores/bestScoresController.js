const BestScores = require('./bestScoresModel')

module.exports = { addOrUpdate }

function addOrUpdate (req, res, next) {
  const userId = req.user._id
  const { mode, score } = req.body
  const update = { score }
  const options = { upsert: true, new: true, setDefaultsOnInsert: true }
  BestScores.findOneAndUpdate({ userId, mode }, update, options)
    .then(bestScore => res.status(200).send('success adding bestScore'))
    .catch(next)
}
