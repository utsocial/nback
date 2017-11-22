import React, { Component, PropTypes } from 'react'
import { View, Text, TouchableHighlight } from 'react-native'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Actions, ActionConst } from 'react-native-router-flux'

import FaIcon from 'react-native-vector-icons/FontAwesome'
import FdIcon from 'react-native-vector-icons/Foundation'
import Sound from 'react-native-sound'
import _ from 'lodash'

import utils from '../../../shared/utils'
import logger from '../../../shared/utils/logger'
import * as actions from '../../../shared/actions/play'

import Board from '../../components/Board'

class PlayPage extends Component {

  static propTypes = {
    isReplayMode: PropTypes.bool.isRequired,
    nBack: PropTypes.number.isRequired,
    modes: PropTypes.object.isRequired,
    letters: PropTypes.arrayOf(PropTypes.string).isRequired,
    status: PropTypes.string.isRequired,
    activeSquareColor: PropTypes.string,
    activeAudioLetter: PropTypes.string,
    activeSquarePosition: PropTypes.number,
    score: PropTypes.number.isRequired,
    bestScores: PropTypes.object.isRequired,
    loseReason: PropTypes.string,
    history: PropTypes.arrayOf(PropTypes.shape({
      color: PropTypes.string,
      audio: PropTypes.string,
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
    this.loadSoundFiles()
  }

  componentWillReceiveProps (nextProps) {
    this.playSound(nextProps)
  }

  render () {
    return (
      <View style={ styles.container }>
        { this.renderHeader() }
        { this.renderGameOverAudio() }
        { this.renderLoseReason() }
        { this.renderBoard() }
        { this.renderControls() }
        { this.renderGameOverControls() }
        { this.renderGameOverStats() }
      </View>
    )
  }

  renderHeader () {
    const { status, score } = this.props
    if (status === 'idle') {
      return (
        <View style={ styles.header }>
          <FaIcon onPress={ this.routeToHome } name='arrow-left' style={ styles.home } />
          <Text onPress={ this.startGame } style={ styles.headerText }>Start</Text>
        </View>
      )
    }
    if (status === 'gameOver') {
      return (
        <View style={ styles.header }>
          <FaIcon style={ styles.headerGameOverIcon } name='frown-o' />
        </View>
      )
    }
    return (
      <View style={ styles.header }>
        <Text style={ styles.headerText }>{ score }</Text>
        { this.renderPauseResume() }
      </View>
    )
  }

  renderPauseResume () {
    if (this.props.status === 'paused') {
      return (
        <FaIcon onPress={ this.onResume } style={ styles.headerPauseResumeIcon } name='play' />
      )
    }

    return (
      <FaIcon onPress={ this.onPause } style={ styles.headerPauseResumeIcon } name='pause' />
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

  renderControls () {
    const { status, modes } = this.props
    if (status === 'gameOver') {
      return
    }
    return (
      <View style={ styles.controls }>
        {
          modes.position && (
            <TouchableHighlight style={ styles.control } onPress={ this.guessPosition } disabled={ this.isGuessDisabled() }>
              <FaIcon style={ styles.controlIcon } name='th' />
            </TouchableHighlight>
          )
        }
        {
          modes.color && (
            <TouchableHighlight style={ styles.control } onPress={ this.guessColor } disabled={ this.isGuessDisabled() }>
              <FdIcon style={ styles.controlIcon } name='paint-bucket' />
            </TouchableHighlight>
          )
        }
        {
          modes.audio && (
            <TouchableHighlight style={ styles.control } onPress={ this.guessAudio } disabled={ this.isGuessDisabled() }>
              <FaIcon style={ styles.controlIcon } name='headphones' />
            </TouchableHighlight>
          )
        }
      </View>
    )
  }

  renderGameOverControls () {
    if (this.props.status !== 'gameOver') {
      return
    }
    return (
      <View style={ styles.gameOverControls }>
        <Text style={ Object.assign({}, styles.gameOverControl, styles.gameOverControlFirst) } onPress={ this.routeToHome }>MENU</Text>
        <Text style={ styles.gameOverControl } onPress={ this.startGame }>RETRY</Text>
        <Text style={ styles.gameOverControl } onPress={ this.replay }>REPLAY</Text>
      </View>
    )
  }

  renderGameOverStats () {
    const { modes, status, score, nBack, bestScores } = this.props
    if (status !== 'gameOver') {
      return
    }
    return (
      <View style={ styles.gameOverStats }>
        <Text>
          Score / Best Score:
          <Text style={ styles.strong }>
            { score }/{ utils.getBestScore(modes, nBack, bestScores) }
          </Text>
        </Text>
        <Text style={ styles.gameOverMode }>{ nBack }-Back </Text>
      </View>
    )
  }

  renderGameOverAudio () {
    const { modes, status, nBack, history } = this.props
    if (!modes.audio || status !== 'gameOver') {
      return
    }
    return (
      <View style={ styles.gameOverAudio }>
        <Text>{ nBack } ago</Text>
        <FaIcon name='long-arrow-right' />
        <Text>{ _.last(history).audio.toUpperCase() }/{ _.nth(history, -nBack - 1).audio.toUpperCase() }</Text>
        <FaIcon name='long-arrow-left' />
        <Text>last</Text>
      </View>
    )
  }

  renderLoseReason () {
    if (!this.props.loseReason) {
      return
    }
    return (
      <Text style={ styles.loseReason }>
        { this.props.loseReason }
      </Text>
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

  isGuessDisabled () {
    const { history, nBack, status, isReplayMode } = this.props
    return utils.isGuessDisabled(history, nBack, status, isReplayMode)
  }

  loadSoundFiles () {
    if (!this.props.modes.audio) {
      return
    }
    this.sounds = {}
    this.props.letters.forEach(l => {
      this.sounds[l] = new Sound(l + '.wav', Sound.MAIN_BUNDLE, err => {
        if (err) {
          logger.error('load sound err:', l, err)
          return
        }
        logger.log('load sound success:', l)
      })
    })
  }

  playSound (nextProps) {
    if (!this.props.modes.audio) {
      return
    }
    if (!nextProps.isReplayMode && this.props.history.length >= nextProps.history.length) {
      return
    }
    if (nextProps.isReplayMode && this.props.historyReplay.length <= nextProps.historyReplay.length) {
      return
    }
    this.sounds[nextProps.activeAudioLetter].play()
  }

  routeToHome = () => {
    Actions.home({ type: ActionConst.RESET })
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
)(PlayPage)

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  header: {
    flex: 0.2,
    backgroundColor: 'gray',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },

  home: {
    position: 'absolute',
    left: 10,
    color: '#eee',
    fontSize: 30,
    top: 30,
  },

  headerText: {
    fontSize: 40,
    textAlign: 'center',
    textAlignVertical: 'center',
  },

  headerPauseResumeIcon: {
    position: 'absolute',
    right: 20,
    top: 20,
    fontSize: 40,
    color: '#fff',
  },

  headerGameOverIcon: {
    fontSize: 50,
  },

  gameOverAudio: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  loseReason: {
    fontSize: 20,
    color: 'red',
  },

  controls: {
    flex: 0.2,
    flexDirection: 'row',
  },

  control: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgb(122, 122, 122)',
  },

  controlIcon: {
    fontSize: 45,
    color: 'white',
  },

  gameOverControls: {
    flexDirection: 'row',
  },

  gameOverControl: {
    marginTop: 5,
    flex: 1,
    height: 60,
    fontSize: 25,
    textAlign: 'center',
    padding: 10,
    textAlignVertical: 'center',
    backgroundColor: 'gray',
    marginLeft: 1,
    color: 'black',
  },

  gameOverControlFirst: {
    marginLeft: 0,
  },

  gameOverStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  strong: {
    fontWeight: 'bold',
  },

}
