import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Link, browserHistory } from 'react-router'
import Sound from 'react-sound'
import _ from 'lodash'
import mPath from '../../../shared/assets/m.wav'
import qPath from '../../../shared/assets/q.wav'
import rPath from '../../../shared/assets/r.wav'
import utils from '../../../shared/utils'
import * as actions from '../../../shared/actions/play'
import Board from '../../components/Board'

import styles from './Play.css'

class PlayContainer extends Component {

  static propTypes = {
    isReplayMode: PropTypes.bool.isRequired,
    nBack: PropTypes.number.isRequired,
    modes: PropTypes.object.isRequired,
    status: PropTypes.string.isRequired,
    bestScores: PropTypes.object.isRequired,
    activeAudioLetter: PropTypes.string,
    activeSquareColor: PropTypes.string,
    activeSquarePosition: PropTypes.number,
    score: PropTypes.number.isRequired,
    loseReason: PropTypes.string,
    history: PropTypes.arrayOf(PropTypes.shape({
      color: PropTypes.string,
      letter: PropTypes.string,
      position: PropTypes.number,
    })).isRequired,
    historyReplay: PropTypes.arrayOf(PropTypes.shape({
      color: PropTypes.string,
      letter: PropTypes.string,
      position: PropTypes.number,
    })).isRequired,
    actions: PropTypes.shape({
      startGame: PropTypes.func.isRequired,
      pauseGame: PropTypes.func.isRequired,
      resumeGame: PropTypes.func.isRequired,
      replay: PropTypes.func.isRequired,
      guess: PropTypes.func.isRequired,
    }).isRequired,
  }

  componentDidMount () {
    document.addEventListener('keypress', this.onKeyPress)
  }

  componentWillReceiveProps (nextProps) {
    if (!this.props.modes.audio) {
      return
    }
    if (!nextProps.isReplayMode && nextProps.history.length === this.props.history.length) {
      return
    }
    if (nextProps.isReplayMode && nextProps.historyReplay.length === this.props.historyReplay.length) {
      return
    }
    this.audioPlayed = false
  }

  componentDidUpdate (prevProps, prevState) {
    if (!this.props.modes.audio) {
      return
    }
    if (!prevProps.isReplayMode && prevProps.history.length === this.props.history.length) {
      return
    }
    if (prevProps.isReplayMode && prevProps.history.length === this.props.history.length) {
      return
    }
    this.audioPlayed = true
  }

  componentWillUnmount () {
    document.removeEventListener('keypress', this.onKeyPress)
  }

  render () {
    return (
      <div className={ styles.container }>
        { this.renderHeader() }
        { this.renderGameOverAudio() }
        { this.renderLoseReason() }
        { this.renderBoard() }
        { this.renderControls() }
        { this.renderGameOverControls() }
        { this.renderGameOverStats() }
        { this.renderSound() }
      </div>
    )
  }

  renderHeader () {
    const { status, score } = this.props
    if (status === 'idle') {
      return (
        <div className={ styles.header }>
          <Link to='/home' { ...this._test('home') } className={ styles.home }><i className='fa fa-arrow-left' /></Link>
          <a onClick={ this.startGame } className={ styles.start } { ...this._test('start') }>Start</a>
        </div>
      )
    }
    if (status === 'gameOver') {
      return (
        <div className={ styles.header } { ...this._test('gameOverHeader') }>
          <i className='fa fa-frown-o' />
        </div>
      )
    }
    return (
      <div className={ styles.header }>
        <span className={ styles.headerText } { ...this._test('score') }>{ score }</span>
        { this.renderPauseResume() }
      </div>
    )
  }

  renderGameOverAudio () {
    const { modes, status, nBack, history } = this.props
    if (!modes.audio || status !== 'gameOver') {
      return
    }
    return (
      <div className={ styles.gameOverAudio } { ...this._test('gameOverAudio') }>
        <span>{ nBack } ago</span>
        <i className='fa fa-long-arrow-right' />
        <span>{ _.last(history).audio.toUpperCase() }/{ _.nth(history, -nBack - 1).audio.toUpperCase() }</span>
        <i className='fa fa-long-arrow-left' />
        <span>last</span>
      </div>
    )
  }

  renderLoseReason () {
    if (!this.props.loseReason) {
      return
    }
    return (
      <div className={ styles.loseReason }>
        { this.props.loseReason }
      </div>
    )
  }

  renderBoard () {
    const { modes, history, nBack, status, activeSquareColor, activeSquarePosition } = this.props
    if (!modes.color && !modes.position) {
      return
    }
    return (
      <Board
        modes={ modes }
        nBack={ nBack }
        status={ status }
        lastTurn={ history[history.length - 1] }
        nBackTurn={ history[history.length - 1 - nBack] }
        activeSquareColor={ activeSquareColor }
        activeSquarePosition={ activeSquarePosition }
      />
    )
  }

  renderPauseResume () {
    if (this.props.status === 'paused') {
      return (
        <i onClick={ this.onResume } className={ [styles.headerPauseResumeIcon, 'fa fa-play'].join(' ') } { ...this._test('resume') } />
      )
    }

    return (
      <i onClick={ this.onPause } className={ [styles.headerPauseResumeIcon, 'fa fa-pause'].join(' ') } { ...this._test('pause') } />
    )
  }

  renderControls () {
    if (this.props.status === 'gameOver') {
      return
    }
    const { color, position, audio } = this.props.modes
    return (
      <div className={ styles.controls }>
        {
          position && (
            <a className={ styles.control } onClick={ this.guessPosition } { ...this._test('guessPosition') }>
              <i className={ ['fa fa-th', styles.controlIcon].join(' ') } />
            </a>
          )
        }
        {
          color && (
            <a className={ styles.control } onClick={ this.guessColor } { ...this._test('guessColor') }>
              <i className={ ['fa fa-paint-brush', styles.controlIcon].join(' ') } />
            </a>
          )
        }
        {
          audio && (
            <a className={ styles.control } onClick={ this.guessAudio } { ...this._test('guessAudio') }>
              <i className={ ['fa fa-headphones', styles.controlIcon].join(' ') } />
            </a>
          )
        }
      </div>
    )
  }

  renderGameOverControls () {
    if (this.props.status !== 'gameOver') {
      return
    }
    return (
      <div className={ styles.gameOverControls }>
        <Link to='/home' className={ styles.gameOverControl } { ...this._test('menu') }>MENU</Link>
        <div className={ styles.gameOverControl } onClick={ this.startGame } { ...this._test('retry') }>RETRY</div>
        <div className={ styles.gameOverControl } onClick={ this.replay } { ...this._test('replay') }>REPLAY</div>
      </div>
    )
  }

  renderGameOverStats () {
    const { modes, status, score, nBack, bestScores } = this.props
    if (status !== 'gameOver') {
      return
    }
    return (
      <div>
        <div className={ styles.gameOverMode } { ...this._test('gameOverNBack') }>{ nBack }-Back </div>
        Score / Best Score:
        <span className={ styles.strong } { ...this._test('gameOverScore') }>
          { score }/{ utils.getBestScore(modes, nBack, bestScores) }
        </span>
      </div>
    )
  }

  renderSound () {
    const { modes, activeAudioLetter } = this.props
    if (!modes.audio || this.audioPlayed) {
      return
    }
    return (
      <div>
        <Sound
          url={ mPath }
          playStatus={ activeAudioLetter === 'm' ? Sound.status.PLAYING : 'STOPPED' }
        />
        <Sound
          url={ qPath }
          playStatus={ activeAudioLetter === 'q' ? Sound.status.PLAYING : 'STOPPED' }
        />
        <Sound
          url={ rPath }
          playStatus={ activeAudioLetter === 'r' ? Sound.status.PLAYING : 'STOPPED' }
        />
      </div>
    )
  }

  startGame = () => {
    this.props.actions.startGame()
  }

  replay = () => {
    this.props.actions.replay()
  }

  guessPosition = () => {
    if (this.isGuessDisabled()) {
      return
    }
    this.props.actions.guess('position')
  }

  guessColor = () => {
    if (this.isGuessDisabled()) {
      return
    }
    this.props.actions.guess('color')
  }

  guessAudio = () => {
    if (this.isGuessDisabled()) {
      return
    }
    this.props.actions.guess('audio')
  }

  onPause = () => {
    this.props.actions.pauseGame()
  }

  onResume = () => {
    this.props.actions.resumeGame()
  }

  onKeyPress = ({ keyCode }) => {
    const { modes, status } = this.props
    if (keyCode === 112 && modes.position) { // p
      this.guessPosition()
      return
    }
    if (keyCode === 99 && modes.color) { // c
      this.guessColor()
      return
    }
    if (keyCode === 97 && modes.audio) { // a
      this.guessAudio()
      return
    }
    if (keyCode === 114 && status === 'gameOver') { // r
      this.startGame()
      return
    }

    if (keyCode === 109 && status === 'gameOver') { // m
      browserHistory.push('/home')
      return
    }

    if (keyCode === 104 && status.match(/idle|gameOver/)) { // m
      browserHistory.push('/home')
      return
    }

    if (keyCode === 115 && status === 'idle') { // s
      this.startGame()
      return
    }
  }

  isGuessDisabled () {
    const { history, nBack, status, isReplayMode } = this.props
    return utils.isGuessDisabled(history, nBack, status, isReplayMode)
  }

}

function mapStateToProps (state) {
  return state.play
}

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PlayContainer)
