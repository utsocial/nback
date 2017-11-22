import { AsyncStorage } from 'react-native'
import utils from '../utils'
import logger from '../utils/logger'
import { syncBestScores, syncGameConfig, syncLosingMoves } from '../actions/play'
import { syncUser } from '../actions/auth'
import * as lsUtils from '../utils/localStorage'

export default class StorageMiddleware {

  toMiddleware () {
    return store => next => action => {
      if (action.type === 'init app') {
        lsUtils.sync(store.dispatch, syncUser, 'user')
        lsUtils.sync(store.dispatch, syncBestScores, 'bestScores')
        lsUtils.sync(store.dispatch, syncLosingMoves, 'losingMoves')
        const { modes, nBack, speed } = store.getState().play
        lsUtils.sync(store.dispatch, syncGameConfig, 'gameConfig', { modes, nBack, speed })
        next(action)
        return
      }

      if (action.type.match(/crement n|rement speed|toggle mode/)) {
        next(action) // let reducer update the state before saving it to LS
        this.saveGameConf(store.getState().play)
        return
      }

      if (action.type.match(/guess wrong|miss aMatch/)) {
        this.saveBestScores(store.getState().play)
        next(action)
        AsyncStorage.setItem('losingMoves', JSON.stringify(store.getState().play.losingMoves))
        return
      }

      if (action.type.match(/facebook authSuccess|login success|signup success|refresh userSuccess/)) {
        AsyncStorage.setItem('user', JSON.stringify(action.payload))
        next(action)
        AsyncStorage.setItem('bestScores', JSON.stringify(store.getState().play.bestScores))
        AsyncStorage.setItem('losingMoves', JSON.stringify(store.getState().play.losingMoves))
        return
      }

      if (action.type === 'logout') {
        AsyncStorage.removeItem('user')
        next(action)
        return
      }

      if (action.type === 'refresh userError') {
        AsyncStorage.removeItem('user')
        next(action)
        return
      }

      next(action)
    }
  }

  async saveGameConf ({ modes, nBack, speed }) {
    try {
      await AsyncStorage.setItem('gameConfig', JSON.stringify({ modes, nBack, speed }))
    } catch (err) {
      logger.error('[StorageMiddleware] Error saving gameConf:', { modes, nBack, speed }, err)
    }
  }

  async saveBestScores ({ bestScores, modes, nBack, score }) {
    if (utils.getBestScore(modes, nBack, bestScores) >= score) {
      return
    }
    try {
      await AsyncStorage.mergeItem('bestScores', JSON.stringify({ [utils.getModeKey(modes, nBack)]: score }))
    } catch (err) {
      logger.error('[StorageMiddleware] Error saving bestScores:', err)
    }
  }

}
