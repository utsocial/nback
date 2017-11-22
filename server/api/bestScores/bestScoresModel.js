const mongoose = require('mongoose')

const Schema = mongoose.Schema
const BestScoresSchema = getSchema()

module.exports = mongoose.model('bestScores', BestScoresSchema)

function getSchema () {
  return new Schema({

    userId: {
      type: Schema.Types.ObjectId,
      ref: 'users',
      required: true,
    },

    score: {
      type: Number,
      min: 0,
      required: true,
    },

    mode: {
      type: String,
      min: 2,
      required: true,
    },

  })
}
