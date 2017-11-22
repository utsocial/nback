import testToMiddleware from 'redux-middleware-test-helper'
import axios from 'axios'
import * as router from 'react-router'
import { API_URL } from '../constants'
import { facebookAuthError, facebookAuthSuccess, loginError, loginSuccess, signupError, signupSuccess } from '../actions/auth'
import AuthMiddleware from './auth'

describe('shared/middlewares/auth', () => {
  let cut

  before('setup spies', () => {
    stub(axios, 'get')
    stub(axios, 'post')
    router.browserHistory = { push: spy() }
  })

  after('setup spies', () => {
    axios.get.restore()
    axios.post.restore()
  })

  beforeEach('mock cut, reset spies', () => {
    axios.get.reset()
    axios.post.reset()
    router.browserHistory.push.reset()
    cut = new AuthMiddleware()
  })

  describe('facebookAuth', () => {
    it('should call server', async function () {
      // given
      axios.get.returns('')

      // when
      await cut.onFacebookAuth(dispatch, {})

      // then
      expect(axios.get).to.have.been.calledWith(`${API_URL}/users/fbAuth`)
    })

    it('should call dispatch with success, and redirect user', async function () {
      // given
      const user = { name: 'test' }
      axios.get.returns({ data: user })

      // when
      await cut.onFacebookAuth(dispatch, {})
      expect(global.alert).to.have.been.calledOnce
      expect(router.browserHistory.push).to.have.been.calledOnce
      expect(router.browserHistory.push).to.have.been.calledWith('/home')
      expect(dispatch).to.have.been.calledOnce
      expect(dispatch).to.have.been.calledWith(facebookAuthSuccess(user))
    })

    it('should call dispatch with error', async function () {
      // given
      const err = 'err!'
      axios.get.throws(Error(err))

      // when
      await cut.onFacebookAuth(dispatch, {})
      expect(dispatch).to.have.been.calledOnce
      expect(dispatch).to.have.been.calledWith(facebookAuthError(err))
    })
  })

  describe('onLogin', () => {
    it('should call server', async function () {
      // given
      const auth = { email: 'test@email.com', password: 'pass' }
      const getState = stub().returns({ auth })

      // when
      await cut.onLogin({ dispatch, getState })

      // then
      expect(axios.post).to.have.been.calledOnce
    })

    it('should call dispatch with success', async function () {
      // given
      const auth = { email: 'test@email.com', password: 'pass' }
      const getState = stub().returns({ auth })
      axios.post.returns({ data: auth })

      // when
      await cut.onLogin({ dispatch, getState })

      // then
      expect(global.alert).to.have.been.calledOnce
      expect(router.browserHistory.push).to.have.been.calledOnce
      expect(router.browserHistory.push).to.have.been.calledWith('/home')
      expect(dispatch).to.have.been.calledOnce
      expect(dispatch).to.have.been.calledWith(loginSuccess(auth))
    })

    it('should call dispatch with error', async function () {
      // given
      const auth = { email: 'test@email.com', password: 'pass' }
      const getState = stub().returns({ auth })
      const msg = 'error'
      axios.post.throws(Error(msg))

      // when
      cut.onLogin({ dispatch, getState })

      // then
      expect(dispatch).to.have.been.calledOnce
      expect(dispatch).to.have.been.calledWith(loginError(msg))
    })
  })

  describe('onSignup', () => {
    it('should call server', async function () {
      // given
      const auth = { name: 'test', email: 'test@email.com', password: 'pass' }
      const getState = stub().returns({ auth })

      // when
      await cut.onSignup({ dispatch, getState })

      // then
      expect(axios.post).to.have.been.calledOnce
    })

    it('should call dispatch with success', async function () {
      // given
      const auth = { name: 'test', email: 'test@email.com', password: 'pass' }
      const getState = stub().returns({ auth })
      axios.post.returns({ data: auth })

      // when
      await cut.onSignup({ dispatch, getState })

      // then
      expect(global.alert).to.have.been.calledOnce
      expect(router.browserHistory.push).to.have.been.calledOnce
      expect(router.browserHistory.push).to.have.been.calledWith('/home')
      expect(dispatch).to.have.been.calledOnce
      expect(dispatch).to.have.been.calledWith(signupSuccess(auth))
    })

    it('should call dispatch with error', async function () {
      // given
      const auth = { name: 'test', email: 'test@email.com', password: 'pass' }
      const getState = stub().returns({ auth })
      const msg = 'error'
      axios.post.throws(Error(msg))

      // when
      cut.onSignup({ dispatch, getState })

      // then
      expect(dispatch).to.have.been.calledOnce
      expect(dispatch).to.have.been.calledWith(signupError(msg))
    })
  })

  testToMiddleware({
    cut: new AuthMiddleware({}),
    methods: [
      { methodName: 'onFacebookAuth', actionType: 'facebook auth' },
      { methodName: 'onSignup', actionType: 'signup' },
      { methodName: 'onLogin', actionType: 'login' },
    ],
  })
})
