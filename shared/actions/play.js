import { createAction } from 'redux-actions'

export const initApp = createAction('init app')

export const startGame = createAction('start game')
export const playInterval = createAction('play interval')
export const resetBoard = createAction('reset board')
export const missAMatch = createAction('miss aMatch')
export const pauseGame = createAction('pause game')
export const resumeGame = createAction('resume game')
export const replay = createAction('replay')
export const replayOver = createAction('replay over')

export const guess = createAction('guess')
export const guessCorrect = createAction('guess correct')
export const guessWrong = createAction('guess wrong')

export const toggleMode = createAction('toggle mode')
export const incrementN = createAction('increment n')
export const decrementN = createAction('decrement n')
export const incrementSpeed = createAction('increment speed')
export const decrementSpeed = createAction('decrement speed')

export const syncBestScores = createAction('sync bestScores')
export const syncGameConfig = createAction('sync gameConfig')
export const syncLosingMoves = createAction('sync losingMoves')
