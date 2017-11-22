import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { View, Text, TextInput } from 'react-native'
import { FBLogin, FBLoginManager } from 'react-native-facebook-login'
import { Actions, ActionConst } from 'react-native-router-flux'
import FaIcon from 'react-native-vector-icons/FontAwesome'
import _ from 'lodash'

import Button from '../../components/Button'
import * as actions from '../../../shared/actions/auth'

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
      <View style={ styles.container }>
        <View style={ styles.leadContainer }>
          <FaIcon onPress={ this.routeHome } style={ styles.backIcon } name='arrow-left' />
          <Text style={ styles.lead }>
            { _.capitalize(this.props.mode) } to backup and sync your progress between devices
          </Text>
        </View>
        { this.renderFacebookAuth() }
        <Text style={ styles.or }>Or use the form below</Text>
        <Text style={ styles.toggleMode } onPress={ this.toggleAuthMode }>
          switch to { this.props.mode === 'signup' ? 'login' : 'singup' }
        </Text>
        { this.renderForm() }
      </View>
    )
  }

  renderFacebookAuth () {
    return (
      <FBLogin
        permissions={ [''] }
        ref={ fbLogin => this.fbLogin = fbLogin }
        loginBehavior={ FBLoginManager.LoginBehaviors.Native }
        buttonView={ this.facebookAuthButton() }
        onLogin={ this.props.actions.facebookAuth }
        onLogout={ evt => {} }
        onLoginFound={ evt => {} }
        onLoginNotFound={ evt => {} }
        onError={ evt => {} }
        onCancel={ evt => {} }
        onPermissionsMissing={ evt => {} }
      />
    )
  }

  renderForm () {
    const { mode, name, nameError, email, emailError, password, passwordError, rePassword, showPassword, serverError } = this.props
    return (
      <View>
        { mode === 'signup' && (
          <View style={ styles.formControl }>
            <Text style={ styles.label }>Name <Text style={ styles.small }>(public)</Text></Text>
            <TextInput style={ styles.input } onChangeText={ this.onNameChange } value={ name } onBlur={ this.onNameBlur } placeholder='put your user name here' />
            <Text style={ styles.error }>{ !nameError ? '' : nameError }</Text>
          </View>
          )
        }
        <View style={ styles.formControl }>
          <Text style={ styles.label }>Email</Text>
          <TextInput style={ styles.input } onChangeText={ this.onEmailChange } value={ email } keyboardType='email-address' onBlur={ this.onEmailBlur } placeholder='put your email here' />
          <Text style={ styles.error }>{ !emailError ? '' : emailError }</Text>
        </View>
        <View style={ styles.formControl }>
          <Text style={ styles.label }>Password</Text>
          <View style={ styles.inputContainer }>
            <TextInput style={ styles.input } onChangeText={ this.onPasswordChange } value={ password } secureTextEntry={ !showPassword } onBlur={ this.onPasswordBlur } placeholder='put your password here' />
            <Text style={ styles.error }>{ !passwordError ? '' : passwordError }</Text>
            <FaIcon style={ styles.eyeIcon } name={ showPassword ? 'eye-slash' : 'eye' } onPress={ this.toggleShowPassword } title={ showPassword ? 'hide password' : 'show password' } />
          </View>
        </View>
        { mode === 'signup' && (
          <View style={ styles.formControl }>
            <Text style={ styles.label }>Repeat Password</Text>
            <View style={ styles.inputContainer }>
              <TextInput style={ styles.input } onChangeText={ this.onRePasswordChange } value={ rePassword } secureTextEntry={ !showPassword } onBlur={ this.onRePasswordBlur } placeholder='put your password again here' />
              <FaIcon style={ styles.eyeIcon } name={ showPassword ? 'eye-slash' : 'eye' } onPress={ this.toggleShowPassword } title={ showPassword ? 'hide password' : 'show password' } />
            </View>
          </View>
          )
        }
        <Text style={ styles.error }>{ serverError }</Text>
        <View style={ styles.actions }>
          { this.renderActions() }
        </View>
      </View>
    )
  }

  renderActions () {
    const { isProcessing, mode } = this.props
    if (mode === 'signup') {
      return <Button onPress={ this.signup } isProcessing={ isProcessing }>Signup</Button>
    }
    return <Button onPress={ this.login } isProcessing={ isProcessing }>Login</Button>
  }

  facebookAuthButton () {
    return (
      <View style={ styles.fb }>
        <FaIcon name='facebook' style={ styles.fbIcon } />
        <Text style={ styles.fbText }>LOG IN WITH FACEBOOK</Text>
      </View>
    )
  }

  toggleAuthMode = () => {
    this.props.actions.toggleAuthMode()
  }

  onNameChange = name => {
    this.props.actions.updateName(name)
  }

  onEmailChange = email => {
    this.props.actions.updateEmail(email)
  }

  onPasswordChange = password => {
    this.props.actions.updatePassword(password)
  }

  onRePasswordChange = rePassword => {
    this.props.actions.updateRePassword(rePassword)
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

  routeHome () {
    Actions.home({ type: ActionConst.RESET })
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

const styles = {
  container: {
    padding: 20,
  },

  leadContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },

  backIcon: {
    color: 'rgb(0, 100, 255)',
    fontSize: 30,
    marginRight: 10,
  },

  lead: {
    fontSize: 18,
  },

  fb: {
    flexDirection: 'row',
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginBottom: 20,
    backgroundColor: 'rgb(0, 100, 255)',
  },

  fbIcon: {
    marginRight: 10,
    color: '#fff',
    fontSize: 25,
  },

  fbText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },

  or: {
    textAlign: 'center',
  },

  toggleMode: {
    color: 'blue',
    marginBottom: 20,
    marginTop: 10,
    paddingBottom: 5,
    paddingTop: 5,
    textAlign: 'center',
    textDecorationStyle: 'solid',
  },

  formControl: {
    marginBottom: 5,
  },

  input: {
    paddingTop: 0,
  },

  label: {
    fontSize: 18,
    marginBottom: 5,
  },

  error: {
    color: 'red',
    fontSize: 12,
  },

  inputContainer: {
    position: 'relative',
    borderWidth: 1,
    borderColor: 'red',
    borderStyle: 'dotted',
  },

  eyeIcon: {
    top: 5,
    color: '#d3cfcf',
    fontSize: 25,
    position: 'absolute',
    right: 10,
    zIndex: 10,
  },

}
