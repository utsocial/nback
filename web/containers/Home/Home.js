import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link, browserHistory } from 'react-router'

import utils from '../../../shared/utils'
import * as actions from '../../../shared/actions/play'
import * as authActions from '../../../shared/actions/auth'

import styles from './Home.css'

class HomeContainer extends Component {

  static propTypes = {
    modes: PropTypes.object.isRequired,
    nBack: PropTypes.number.isRequired,
    speed: PropTypes.number.isRequired,
    bestScores: PropTypes.object.isRequired,
    user: PropTypes.object,
    actions: PropTypes.shape({
      logout: PropTypes.func.isRequired,
      toggleMode: PropTypes.func.isRequired,
      incrementN: PropTypes.func.isRequired,
      decrementN: PropTypes.func.isRequired,
      incrementSpeed: PropTypes.func.isRequired,
      decrementSpeed: PropTypes.func.isRequired,
    }).isRequired,
  }

  componentDidMount () {
    document.addEventListener('keypress', this.onKeyPress)
  }
  componentWillUnmount () {
    document.removeEventListener('keypress', this.onKeyPress)
  }

  render () {
    const { modes, nBack, speed, bestScores } = this.props
    return (
      <div className={ styles.container }>
        <div className={ styles.headline }>MEMORY N-BACK</div>
        <div className={ `${styles.settings} ${styles.modes}` }>
          <i onClick={ () => this.toggleMode('position') } className={ `fa fa-th ${modes.position ? styles.active : ''}` } { ...this._test('modePosition') } />
          <i onClick={ () => this.toggleMode('audio') } className={ `fa fa-headphones ${modes.audio ? styles.active : ''}` } { ...this._test('modeAudio') } />
          <i onClick={ () => this.toggleMode('color') } className={ `fa fa-paint-brush ${modes.color ? styles.active : ''}` } { ...this._test('modeColor') } />
        </div>
        <div className={ styles.settings }>
          <a onClick={ this.decrementN } className={ styles.leftSetting } { ...this._test('nBackDecrement') }>
            <i className={ [styles.leftSettingIcon, 'fa fa-minus'].join(' ') } />
          </a>
          <div className={ styles.middleSetting }>
            <div className={ styles.middleSettingText } { ...this._test('nBack') }>{ nBack }</div>
          </div>
          <a onClick={ this.incrementN } className={ styles.rightSetting } { ...this._test('nBackIncrement') }>
            <i className={ [styles.rightSettingIcon, 'fa fa-plus'].join(' ') } />
          </a>
        </div>
        <div className={ styles.settings }>
          <a onClick={ this.decrementSpeed } className={ styles.leftSetting } { ...this._test('speedDecrement') }>
            <i className={ [styles.leftSettingIcon, 'fa fa-minus'].join(' ') } />
          </a>
          <div className={ styles.middleSetting }>
            <div className={ styles.middleSettingText } { ...this._test('speed') }>{ utils.speedDisplay(speed) }</div>
          </div>
          <a onClick={ this.incrementSpeed } className={ styles.rightSetting } { ...this._test('speedIncrement') }>
            <i className={ [styles.rightSettingIcon, 'fa fa-plus'].join(' ') } />
          </a>
        </div>
        <div className={ styles.actions }>
          { this.renderAuth() }
          <Link to={ '/play' } { ...this._test('routeToPlay') }>
            <i className={ [styles.actionsPlayIcon, 'fa fa-play-circle'].join(' ') } />
          </Link>
        </div>
        <div className={ styles.record } { ...this._test('bestScore') }>
          BEST SCORE: { utils.getBestScore(modes, nBack, bestScores) }
        </div>
      </div>
    )
  }

  renderAuth () {
    if (this.props.user.name) {
      return (
        <a className={ styles.actionsAuth } onClick={ this.onLogout } { ...this._test('logout') }>
          <i className={ [styles.actionsAuthIcon, 'fa fa-sign-out'].join(' ') } />
        </a>
      )
    }
    return (
      <Link to={ '/auth' } className={ styles.actionsAuth } { ...this._test('routeToAuth') }>
        <i className={ [styles.actionsAuthIcon, 'fa fa-sign-in'].join(' ') } />
      </Link>
    )
  }

  toggleMode = mode => {
    this.props.actions.toggleMode(mode)
  }

  incrementN = evt => {
    this.props.actions.incrementN()
  }

  decrementN = evt => {
    this.props.actions.decrementN()
  }

  incrementSpeed = evt => {
    this.props.actions.incrementSpeed()
  }

  decrementSpeed = evt => {
    this.props.actions.decrementSpeed()
  }

  onKeyPress = ({ keyCode }) => {
    if (keyCode === 13 || keyCode === 32) { // enter or spacebar
      browserHistory.push('/play')
    }
  }

  onLogout = () => {
    if (!global.confirm('logout?')) {
      return
    }
    this.props.actions.logout()
  }

}

function mapStateToProps (state) {
  return {
    ...state.play,
    user: state.auth.user,
  }
}

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators(Object.assign({}, actions, authActions), dispatch),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(HomeContainer)
