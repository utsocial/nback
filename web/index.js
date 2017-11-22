import React from 'react'
import { Provider } from 'react-redux'
import ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import '../shared/utils/test'
import './reset.css'
import './404.html'
import 'style-loader!css-loader!less-loader!font-awesome-webpack/font-awesome-styles.loader!font-awesome-webpack/font-awesome.config.js'
import middlewares from '../shared/middlewares'
import Routes from './routes'
import configureStore from '../shared/store'

import { initApp } from '../shared/actions/play'

const store = configureStore(middlewares())

const render = Component => {
  ReactDOM.render(
    <AppContainer>
      <Provider store={ store }>
        <Component store={ store } />
      </Provider>
    </AppContainer>,
    document.getElementById('root')
  )
}

render(Routes)

// Hot Module Replacement API
if (module.hot) {
  module.hot.accept('./routes', () => {
    const NewApp = require('./routes').default
    render(NewApp)
  })
}

if (__DEV__) {
  require('../shared/utils/dev')(store)
}

store.dispatch(initApp())
