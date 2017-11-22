import React, { Component, PropTypes } from 'react'
import { Scene, Router, Reducer } from 'react-native-router-flux'
import { LOCATION_CHANGE } from 'react-router-redux'

import Home from '../pages/Home'
import Play from '../pages/Play'
import Auth from '../pages/Auth'

export default class Routes extends Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
  }

  render () {
    return (
      <Router hideNavBar createReducer={ this.createReducer }>
        <Scene key='root'>
          <Scene key='home' component={ Home } />
          <Scene key='auth' component={ Auth } />
          <Scene key='play' component={ Play } />
        </Scene>
      </Router>
    )
  }

  createReducer = params => {
    const defaultReducer = Reducer(params)
    return (state, action) => {
      const pathname = action.key
      if (pathname) {
        this.props.dispatch({ type: LOCATION_CHANGE, payload: { pathname } })
      }
      return defaultReducer(state, action)
    }
  }

}
