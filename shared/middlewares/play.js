import { playInterval, missAMatch, resetBoard, guessCorrect, guessWrong, replayOver } from '../actions/play'
import utils from '../utils'

export default class PlayMiddleware {

  constructor ({ interval, resetBoardTimeout } = {}) {
    this.interval = interval
    this.resetBoardTimeout = resetBoardTimeout
  }

  toMiddleware () {
    return store => next => action => {
      if (action.type === 'start game') {
        this.onStartGame(store)
        next(action)
        return
      }

      if (action.type === 'replay') {
        this.onReplay(store)
        next(action)
        return
      }

      if (action.type === 'pause game') {
        this.onPauseGame()
        next(action)
        return
      }

      if (action.type === 'resume game') {
        this.onResumeGame(store)
        next(action)
        return
      }

      if (action.type === 'guess') {
        this.onGuess(store.getState().play, store.dispatch, action.payload)
        next(action)
        return
      }

      if (action.type.match(/guess wrong|miss aMatch|replay over/)) {
        this.resetTimers()
        next(action) // let reducer update the state before saving state to DB
        return
      }

      next(action)
    }
  }

  onStartGame (store) {
    const { speed } = store.getState().play
    this.interval = setInterval(() => {
      this.onTick(store.getState().play, store.dispatch)
    }, speed)
  }

  onReplay (store) {
    const { speed } = store.getState().play
    this.interval = setInterval(() => {
      this.onReplayTick(store.getState().play, store.dispatch)
    }, speed)
  }

  onTick ({ speed, history, nBack, modes, guessed }, dispatch) {
    const missed = utils.missingMatches(history, nBack, modes, guessed)
    if (missed.length) {
      dispatch(missAMatch(missed))
      return
    }
    dispatch(playInterval())
    this.resetBoardTimeout = setTimeout(() => {
      dispatch(resetBoard())
    }, speed * 0.8)
  }

  onReplayTick ({ speed, historyReplay }, dispatch) {
    if (!historyReplay.length) {
      dispatch(replayOver())
      return
    }
    dispatch(playInterval())
    this.resetBoardTimeout = setTimeout(() => {
      dispatch(resetBoard())
    }, speed * 0.8)
  }

  onPauseGame () {
    this.resetTimers()
  }

  onResumeGame (store) {
    store.dispatch(resetBoard())
    this.onStartGame(store)
  }

  onGuess ({ history, nBack }, dispatch, guess) {
    if (!utils.isMatch(history, nBack, guess)) {
      dispatch(guessWrong(guess))
      return
    }

    dispatch(guessCorrect(guess))
  }

  resetTimers () {
    clearInterval(this.interval)
    clearTimeout(this.resetBoardTimeout)
  }

}
