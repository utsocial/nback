import axios from 'axios'
import _ from 'lodash'
import logger from '../utils/logger'
import utils from '../utils'
import { API_URL } from '../constants'
import { refreshUserSuccess, refreshUserError } from '../actions/user'

export default class UserMiddleware {

  toMiddleware () {
    return store => next => action => {
      if (!this.isUser(store)) {
        next(action)
        return
      }
      if (action.type === 'init app') {
        next(action)
        this.setAuthHeader(store)
        this.refreshUser(store)
        return
      }

      if (action.type.match(/facebook authSuccess|signup success|login success/)) {
        next(action) // let reducer update state first
        this.setAuthHeader(store)
        return
      }

      if (action.type.match(/guess wrong|miss aMatch/)) {
        const prevBestScores = store.getState().play.bestScores
        next(action) // let reducer update the state before saving state to DB
        const newBestScores = store.getState().play.bestScores
        this.storeLosingMovesInDB(store)
        if (_.isEqual(prevBestScores, newBestScores)) {
          return
        }
        this.storeBestScoresInDB(store)
        return
      }

      next(action)
    }
  }

  refreshUser (store) {
    const { _id } = store.getState().auth.user
    axios.get(`${API_URL}/users/${_id}`)
      .then(({ data: user }) => store.dispatch(refreshUserSuccess(user)))
      .catch(err => store.dispatch(refreshUserError(err)))
  }

  setAuthHeader (store) {
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + store.getState().auth.user.token
  }

  storeLosingMovesInDB (store) {
    const { _id } = store.getState().auth.user
    const { losingMoves } = store.getState().play
    axios.put(`${API_URL}/users/${_id}`, { losingMoves })
      .then(() => logger.log('store losing moves to DB:', losingMoves))
      .catch(err => logger.error('store losing moves to DB error:', err))
  }

  storeBestScoresInDB (store) {
    const { score, modes, nBack } = store.getState().play
    const mode = utils.getModeKey(modes, nBack)
    axios.put(`${API_URL}/bestScores/addOrUpdate`, { mode, score })
      .then(() => logger.log('store bestScore to DB: success', { mode, score }))
      .catch(err => logger.error('store bestScore to DB: error:', err))
  }

  isUser ({ getState }) {
    return getState().auth.user._id
  }
}
