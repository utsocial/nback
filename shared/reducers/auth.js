import { handleActions } from 'redux-actions'
import isEmail from 'validator/lib/isEmail'

const initialState = {
  user: {},
  mode: 'signup',
  name: '',
  nameValid: false,
  nameError: null,
  email: '',
  emailValid: false,
  emailError: null,
  password: '',
  passwordValid: false,
  passwordError: null,
  rePassword: '',
  showPassword: false,
  isProcessing: false,
  serverError: null,
}

export default handleActions({

  'sync user' (state, action) {
    return {
      ...state,
      user: action.payload,
    }
  },

  'toggle authMode' (state, action) {
    return {
      ...state,
      mode: state.mode === 'login' ? 'signup' : 'login',
    }
  },

  'update name' (state, action) {
    return {
      ...state,
      name: action.payload,
      nameValid: action.payload.length > 1,
      nameError: null,
    }
  },

  'update email' (state, action) {
    return {
      ...state,
      email: action.payload,
      emailValid: isEmail(action.payload),
      emailError: null,
    }
  },

  'update password' (state, action) {
    return {
      ...state,
      password: action.payload,
      passwordValid: !!action.payload && !!action.payload.length,
      passwordError: null,
    }
  },

  'update rePassword' (state, action) {
    return {
      ...state,
      rePassword: action.payload,
      passwordError: null,
    }
  },

  'toggle showPassword' (state, action) {
    return {
      ...state,
      showPassword: !state.showPassword,
    }
  },

  'on nameBlur' (state, action) {
    return {
      ...state,
      nameError: state.name.length > 1 ? null : 'At least 2 characters for name please!',
    }
  },

  'on emailBlur' (state, action) {
    return {
      ...state,
      emailError: isEmail(state.email) ? null : 'Email is invalid',
    }
  },

  'on passwordBlur' (state, action) {
    return {
      ...state,
      passwordError: (state.password === state.rePassword || !state.rePassword) ? null : 'Passwords do not match',
    }
  },

  'on rePasswordBlur' (state, action) {
    return {
      ...state,
      passwordError: state.password === state.rePassword ? null : 'Passwords do not match',
    }
  },

  'show loginErrors' (state, action) {
    return {
      ...state,
      nameError: state.name.length > 1 ? null : 'At least 2 characters for name please!',
      passwordError: (state.password && state.password.length) ? null : 'Password cant be empty',
    }
  },

  'show signupErrors' (state, action) {
    return {
      ...state,
      nameError: state.name.length > 1 ? null : 'At least 2 characters for name please!',
      emailError: isEmail(state.email) ? null : 'Email is invalid',
      passwordError: getSignupPasswordError(state),
    }
  },

  'facebook authClicked' (state, action) {
    return {
      ...state,
      isProcessing: true,
    }
  },

  'facebook authSuccess' (state, action) {
    return {
      ...state,
      isProcessing: false,
      user: action.payload,
    }
  },

  'facebook authError' (state, action) {
    return {
      ...state,
      isProcessing: false,
      serverError: action.payload,
    }
  },

  'login' (state, action) {
    return {
      ...state,
      isProcessing: true,
    }
  },

  'login success' (state, action) {
    return {
      ...state,
      isProcessing: false,
      user: action.payload,
    }
  },

  'login error' (state, action) {
    return {
      ...state,
      isProcessing: false,
      serverError: action.payload,
    }
  },

  'signup' (state, action) {
    return {
      ...state,
      isProcessing: true,
    }
  },

  'signup success' (state, action) {
    return {
      ...state,
      isProcessing: false,
      user: action.payload,
    }
  },

  'signup error' (state, action) {
    return {
      ...state,
      isProcessing: false,
      serverError: action.payload,
    }
  },

  'logout' (state, action) {
    return {
      ...state,
      user: {},
    }
  },

}, initialState)

function getSignupPasswordError ({ password, rePassword }) {
  if (password !== rePassword) {
    return 'Passwords do not match'
  }
  if (!rePassword) {
    return 'Password and rePassword must be set'
  }
  return null
}
