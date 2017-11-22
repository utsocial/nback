const mongoose = require('mongoose')
require('mongoose-type-email')
const bcrypt = require('bcryptjs')
const uniqueValidator = require('mongoose-unique-validator')

const Schema = mongoose.Schema
const UsersSchema = getSchema()

UsersSchema.pre('save', preSave)
UsersSchema.plugin(uniqueValidator, { message: 'User with that email already exists' })

module.exports = mongoose.model('users', UsersSchema)

function getSchema () {
  return new Schema({

    name: {
      type: String,
      required: true,
      min: 2,
    },

    email: {
      type: mongoose.SchemaTypes.Email,
      unique: true,
      required: true,
    },

    password: {
      type: String,
      select: false,
    },

    losingMoves: {
      type: {},
      required: true,
      default: {},
    },

    fbUserId: String,
    fbPictureUrl: String,

    createdAt: {
      type: Date,
      default: Date.now,
      required: true,
    },

  }, { minimize: false })
}

function preSave (next) {
  bcrypt.hash(this.password, 10, (err, hash) => {
    if (err) {
      next(err)
      return
    }
    this.password = hash
    next()
  })
}
