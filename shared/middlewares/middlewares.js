import Play from './play'
import createLogger from 'redux-logger'
import Storage from './storage'
import Auth from './auth'
import GameConf from './gameConf'
import User from './user'

export default function middlewares () {
  const logger = createLogger({
    collapsed: true,
    predicate: () => global.IS_LOGGING,
  })
  const play = new Play()
  const storage = new Storage()
  const auth = new Auth()
  const gameConf = new GameConf()
  const user = new User()

  return [
    logger,
    play.toMiddleware(),
    storage.toMiddleware(),
    auth.toMiddleware(),
    gameConf.toMiddleware(),
    user.toMiddleware(),
  ]
}
