
import React, { Component, PropTypes } from 'react'

import { Router, Route, browserHistory, IndexRedirect } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'

import AppContainer from '../containers/App'
import HomeContainer from '../containers/Home'
import PlayContainer from '../containers/Play'
import AuthContainer from '../containers/Auth'

export default class Routes extends Component {

  static propTypes = {
    store: PropTypes.object.isRequired,
  }

  render () {
    const history = syncHistoryWithStore(browserHistory, this.props.store)
    return (
      <Router history={ history }>
        <Route path={ '/' } component={ AppContainer }>
          <IndexRedirect to='home' />
          <Route path={ 'home' } component={ HomeContainer } />
          <Route path={ 'play' } component={ PlayContainer } />
          <Route path={ 'auth' } component={ AuthContainer } />
        </Route>
      </Router>
    )
  }

}
