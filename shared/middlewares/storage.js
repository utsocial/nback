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
        const { modes, nBack, speed } = store.getState().play
        localStorage.setItem('gameConfig', JSON.stringify({ modes, nBack, speed }))
        return
      }

      if (action.type.match(/guess wrong|miss aMatch/)) {
        next(action) // let reducer update the state before saving it to LS
        localStorage.setItem('bestScores', JSON.stringify(store.getState().play.bestScores))
        localStorage.setItem('losingMoves', JSON.stringify(store.getState().play.losingMoves))
        return
      }

      if (action.type.match(/facebook authSuccess|login success|signup success|refresh userSuccess/)) {
        localStorage.setItem('user', JSON.stringify(action.payload))
        next(action)
        localStorage.setItem('bestScores', JSON.stringify(store.getState().play.bestScores))
        localStorage.setItem('losingMoves', JSON.stringify(store.getState().play.losingMoves))
        return
      }

      if (action.type === 'logout') {
        localStorage.removeItem('user')
        next(action)
        return
      }

      if (action.type === 'refresh userError') {
        localStorage.removeItem('user')
        next(action)
        return
      }

      next(action)
    }
  }

}
