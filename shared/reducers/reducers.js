import { combineReducers } from 'redux'

import play from './play'
import auth from './auth'

const reducers = {
  play,
  auth,
}

if (process.env.IS_WEB) {
  const routing = require('react-router-redux').routerReducer
  reducers.routing = routing
}

export default combineReducers(reducers)
