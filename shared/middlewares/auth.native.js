import axios from 'axios'
import { Actions } from 'react-native-router-flux'
import _ from 'lodash'
import { API_URL } from '../constants'
import { facebookAuthSuccess, facebookAuthError, loginSuccess, loginError, signupSuccess, signupError } from '../actions/auth'

export default class AuthMiddleware {

  toMiddleware () {
    return store => next => action => {
      if (action.type === 'facebook auth') {
        this.onFacebookAuth(store.dispatch, action.payload)
        next(action)
        return
      }

      if (action.type === 'signup') {
        this.onSignup(store)
        next(action)
        return
      }

      if (action.type === 'login') {
        this.onLogin(store)
        next(action)
        return
      }

      next(action)
    }
  }

  async onFacebookAuth (dispatch, fbResponse) {
    const params = {
      isMobile: true,
      email: fbResponse.profile.email,
      name: fbResponse.profile.name,
      userID: fbResponse.credentials.userId,
      accessToken: fbResponse.credentials.token,
      fbPictureUrl: fbResponse.profile.picture && fbResponse.profile.picture.data && fbResponse.profile.picture.data.url,
    }
    try {
      const { data: user } = await axios.get(`${API_URL}/users/fbAuth`, { params })
      dispatch(facebookAuthSuccess(user))
      global.alert('successfully logged in as ' + user.name)
      Actions.home()
    } catch ({ message }) {
      dispatch(facebookAuthError(message))
    }
  }

  async onLogin ({ dispatch, getState }) {
    const params = _.pick(getState().auth, 'email', 'password')
    try {
      const { data: user } = await axios.post(`${API_URL}/users/login`, params)
      dispatch(loginSuccess(user))
      global.alert('successfully logged in as ' + user.name)
      Actions.home()
    } catch (err) {
      let { message } = err
      if (message.match(400)) {
        message = err.response.data
      }
      dispatch(loginError(message))
    }
  }

  async onSignup ({ dispatch, getState }) {
    const params = _.pick(getState().auth, 'name', 'email', 'password')
    try {
      const { data: user } = await axios.post(`${API_URL}/users/`, params)
      dispatch(signupSuccess(user))
      global.alert('successfully signed up as ' + user.name)
      Actions.home()
    } catch (err) {
      let { message } = err
      if (message.match(400)) {
        message = err.response.data
      }
      dispatch(signupError(message))
    }
  }

}
