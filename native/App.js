import React, { Component } from 'react'
import { Provider } from 'react-redux'
import KeepAwake from 'react-native-keep-awake'

import Routes from './routes'

import configureStore from '../shared/store'
import middlewares from '../shared/middlewares'

import { initApp } from '../shared/actions/play'

const store = configureStore(middlewares())

export default class memoryNBack extends Component {

  componentWillMount () {
    if (!__DEV__) {
      return
    }
    KeepAwake.activate()
  }

  componentWillUnmount () {
    if (!__DEV__) {
      return
    }
    KeepAwake.deactivate()
  }

  render () {
    return (
      <Provider store={ store }>
        <Routes dispatch={ store.dispatch } />
      </Provider>
    )
  }
}

store.dispatch(initApp())

const isDebuggingInChrome = __DEV__ && !!window.navigator.userAgent
if (isDebuggingInChrome) {
  require('../shared/utils/dev')(store)
}
