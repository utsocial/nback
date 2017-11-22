import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Link } from 'react-router'
import FacebookLogin from 'react-facebook-login'
import _ from 'lodash'

import Button from '../../components/Button'
import * as actions from '../../../shared/actions/auth'

import styles from './Auth.css'

class AuthContainer extends Component {

  static propTypes = {
    mode: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    password: PropTypes.string.isRequired,
    rePassword: PropTypes.string.isRequired,
    showPassword: PropTypes.bool.isRequired,
    isProcessing: PropTypes.bool.isRequired,
    nameError: PropTypes.string,
    emailError: PropTypes.string,
    passwordError: PropTypes.string,
    serverError: PropTypes.string,
    nameValid: PropTypes.bool,
    emailValid: PropTypes.bool,
    passwordValid: PropTypes.bool,
    actions: PropTypes.shape({
      toggleAuthMode: PropTypes.func.isRequired,
      updateName: PropTypes.func.isRequired,
      updateEmail: PropTypes.func.isRequired,
      updatePassword: PropTypes.func.isRequired,
      updateRePassword: PropTypes.func.isRequired,
      toggleShowPassword: PropTypes.func.isRequired,
      login: PropTypes.func.isRequired,
      signup: PropTypes.func.isRequired,
      onNameBlur: PropTypes.func.isRequired,
      onEmailBlur: PropTypes.func.isRequired,
      onPasswordBlur: PropTypes.func.isRequired,
      onRePasswordBlur: PropTypes.func.isRequired,
      showLoginErrors: PropTypes.func.isRequired,
      showSignupErrors: PropTypes.func.isRequired,
      facebookAuthClicked: PropTypes.func.isRequired,
      facebookAuth: PropTypes.func.isRequired,
    }).isRequired,
  }

  render () {
    return (
      <div className={ styles.container }>
        <div className={ styles.leadContainer }>
          <Link to='home' className={ styles.backIcon }><i className='fa fa-arrow-left' /></Link>
          <p className={ styles.lead }>
            { _.capitalize(this.props.mode) } to backup and sync your progress between devices
          </p>
        </div>
        { this.renderFacebookAuth() }
        <div className={ styles.or }>Or use the form below</div>
        <a className={ styles.toggleMode } onClick={ this.toggleAuthMode }>
          switch to { this.props.mode === 'signup' ? 'login' : 'singup' }
        </a>
        { this.renderForm() }
      </div>
    )
  }

  renderFacebookAuth () {
    return (
      <FacebookLogin
        appId={ FB_ID }
        isDisabled={ this.props.isProcessing }
        fields='name,email,picture'
        icon={ <i className='fa fa-facebook' /> }
        onClick={ () => this.props.actions.facebookAuthClicked() }
        callback={ res => this.props.actions.facebookAuth(res) }
      />
    )
  }

  renderForm () {
    const { mode, name, nameError, email, emailError, password, passwordError, rePassword, showPassword, serverError } = this.props
    return (
      <form onSubmit={ this.onSubmit }>
        { mode === 'signup' && (
          <div className={ styles.formControl }>
            <label>Name <small>(public)</small></label>
            <input onChange={ this.onNameChange } value={ name } type='text' onBlur={ this.onNameBlur } placeholder='put your user name here' />
            { !nameError ? '' : <span className={ styles.error }>{ nameError }</span> }
          </div>
          )
        }
        <div className={ styles.formControl }>
          <label>Email</label>
          <input onChange={ this.onEmailChange } value={ email } type='email' onBlur={ this.onEmailBlur } placeholder='put your email here' />
          { !emailError ? '' : <span className={ styles.error }>{ emailError }</span> }
        </div>
        <div className={ styles.formControl }>
          <label>Password</label>
          <div className={ styles.inputContainer }>
            <input onChange={ this.onPasswordChange } value={ password } type={ showPassword ? 'text' : 'password' } onBlur={ this.onPasswordBlur } placeholder='put your password here' />
            { !passwordError ? '' : <span className={ styles.error }>{ passwordError }</span> }
            <i className={ `fa ${styles.eyeIcon} ${showPassword ? 'fa-eye-slash' : 'fa-eye'}` } onClick={ this.toggleShowPassword } title={ showPassword ? 'hide password' : 'show password' } />
          </div>
        </div>
        { mode === 'signup' && (
          <div className={ styles.formControl }>
            <label>Repeat Password</label>
            <div className={ styles.inputContainer }>
              <input onChange={ this.onRePasswordChange } value={ rePassword } type={ showPassword ? 'text' : 'password' } onBlur={ this.onRePasswordBlur } placeholder='put your password again here' />
              <i className={ `fa ${styles.eyeIcon} ${showPassword ? 'fa-eye-slash' : 'fa-eye'}` } onClick={ this.toggleShowPassword } title={ showPassword ? 'hide password' : 'show password' } />
            </div>
          </div>
          )
        }
        <div className={ styles.error }>{ serverError }</div>
        <div className={ styles.actions }>
          { this.renderActions() }
        </div>
      </form>
    )
  }

  renderActions () {
    const { isProcessing, mode } = this.props
    if (mode === 'signup') {
      return <Button type='submit' isProcessing={ isProcessing }>Signup</Button>
    }
    return <Button type='submit' isProcessing={ isProcessing }>Login</Button>
  }

  toggleAuthMode = () => {
    this.props.actions.toggleAuthMode()
  }

  onNameChange = evt => {
    this.props.actions.updateName(evt.target.value)
  }

  onEmailChange = evt => {
    this.props.actions.updateEmail(evt.target.value)
  }

  onPasswordChange = evt => {
    this.props.actions.updatePassword(evt.target.value)
  }

  onRePasswordChange = evt => {
    this.props.actions.updateRePassword(evt.target.value)
  }

  onSubmit = evt => {
    evt.preventDefault()
    this.props.mode === 'signup' ? this.signup() : this.login()
  }

  signup = () => {
    const { nameValid, emailValid, passwordValid } = this.props
    if (!nameValid || !emailValid || !passwordValid) {
      this.props.actions.showSignupErrors()
      return
    }
    this.props.actions.signup()
  }

  login = () => {
    if (!this.props.emailValid) {
      this.props.actions.showLoginErrors()
      return
    }
    this.props.actions.login()
  }

  onNameBlur = evt => {
    this.props.actions.onNameBlur()
  }

  onEmailBlur = evt => {
    this.props.actions.onEmailBlur()
  }

  onPasswordBlur = evt => {
    this.props.actions.onPasswordBlur()
  }

  onRePasswordBlur = evt => {
    this.props.actions.onRePasswordBlur()
  }

  toggleShowPassword = evt => {
    this.props.actions.toggleShowPassword()
  }

}

function mapStateToProps (state) {
  return state.auth
}

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AuthContainer)
