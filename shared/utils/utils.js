import { SUPPORTED_MODES } from '../constants'

export function isMatch (history, nBack, mode) {
  return history[history.length - 1 - nBack][mode] === history[history.length - 1][mode]
}

export function missingMatches (history, nBack, modes, guessed) {
  if (history.length - 1 < nBack) {
    return false
  }
  return SUPPORTED_MODES.filter(mode => isMatch(history, nBack, mode) && !guessed[mode] && modes[mode])
}

export function getBestScore (modes, nBack, bestScores) {
  return bestScores[getModeKey(modes, nBack)] || 0
}

export function updateBestScores (modes, nBack, bestScores, score) {
  bestScores = Object.assign({}, bestScores)
  bestScores[getModeKey(modes, nBack)] = score
  return bestScores
}

export function getModeKey (modes, nBack) {
  let activeModes = ''
  if (modes.audio) { activeModes += 'audio' }
  if (modes.position) { activeModes += 'position' }
  if (modes.color) { activeModes += 'color' }
  return activeModes + nBack
}

export function isGuessDisabled (history, nBack, status, isReplayMode) {
  return history.length - 1 < nBack || status !== 'active' || isReplayMode
}

export function speedDisplay (speed) {
  switch (speed) {
    case 2500: return 'Turtle'
    case 2000: return 'Slow'
    case 1500: return 'Normal'
    case 1000: return 'Fast'
    case 500: return 'INSANE'
  }
}
