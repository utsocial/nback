import { createAction } from 'redux-actions'

export const toggleAuthMode = createAction('toggle authMode')

export const updateName = createAction('update name')
export const updateEmail = createAction('update email')
export const updatePassword = createAction('update password')
export const updateRePassword = createAction('update rePassword')
export const toggleShowPassword = createAction('toggle showPassword')

export const onNameBlur = createAction('on nameBlur')
export const onEmailBlur = createAction('on emailBlur')
export const onPasswordBlur = createAction('on passwordBlur')
export const onRePasswordBlur = createAction('on rePasswordBlur')

export const showLoginErrors = createAction('show loginErrors')
export const showSignupErrors = createAction('show signupErrors')

export const login = createAction('login')
export const loginSuccess = createAction('login success')
export const loginError = createAction('login error')
export const logout = createAction('logout')

export const signup = createAction('signup')
export const signupSuccess = createAction('signup success')
export const signupError = createAction('signup error')

export const facebookAuthClicked = createAction('facebook authClicked')
export const facebookAuth = createAction('facebook auth')
export const facebookAuthSuccess = createAction('facebook authSuccess')
export const facebookAuthError = createAction('facebook authError')

export const syncUser = createAction('sync user')
