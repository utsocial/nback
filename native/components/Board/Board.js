import React, { Component, PropTypes } from 'react'
import { View, Text } from 'react-native'
import Square from '../Square'

export default class Board extends Component {

  static propTypes = {
    nBack: PropTypes.number.isRequired,
    modes: PropTypes.object.isRequired,
    status: PropTypes.string.isRequired,
    activeSquareColor: PropTypes.string,
    activeSquarePosition: PropTypes.number,
    lastTurn: PropTypes.shape({
      color: PropTypes.string,
      position: PropTypes.number,
    }),
    nBackTurn: PropTypes.shape({
      color: PropTypes.string,
      position: PropTypes.number,
    }),
  }

  render () {
    const { activeSquarePosition, activeSquareColor } = this.props
    return (
      <View style={ styles.container }>
        <View style={ styles.row }>
          <Square
            idx={ 1 }
            style={ { marginRight: 3 } }
            activeSquareColor={ activeSquareColor }
            activeSquarePosition={ activeSquarePosition }
          >
            { this.renderOnLose(1) }
          </Square>
          <Square
            idx={ 2 }
            style={ { marginRight: 3 } }
            activeSquareColor={ activeSquareColor }
            activeSquarePosition={ activeSquarePosition }
          >
            { this.renderOnLose(2) }
          </Square>
          <Square
            idx={ 3 }
            activeSquareColor={ activeSquareColor }
            activeSquarePosition={ activeSquarePosition }
          >
            { this.renderOnLose(3) }
          </Square>
        </View>
        <View style={ styles.row }>
          <Square
            idx={ 4 }
            style={ { marginRight: 3 } }
            activeSquareColor={ activeSquareColor }
            activeSquarePosition={ activeSquarePosition }
          >
            { this.renderOnLose(4) }
          </Square>
          <Square
            idx={ 5 }
            style={ { marginRight: 3 } }
            activeSquareColor={ activeSquareColor }
            activeSquarePosition={ activeSquarePosition }
          >
            { this.renderOnLose(5) }
          </Square>
          <Square
            idx={ 6 }
            activeSquareColor={ activeSquareColor }
            activeSquarePosition={ activeSquarePosition }
          >
            { this.renderOnLose(6) }
          </Square>
        </View>
        <View style={ styles.row }>
          <Square
            idx={ 7 }
            style={ { marginRight: 3 } }
            activeSquareColor={ activeSquareColor }
            activeSquarePosition={ activeSquarePosition }
          >
            { this.renderOnLose(7) }
          </Square>
          <Square
            idx={ 8 }
            style={ { marginRight: 3 } }
            activeSquareColor={ activeSquareColor }
            activeSquarePosition={ activeSquarePosition }
          >
            { this.renderOnLose(8) }
          </Square>
          <Square
            idx={ 9 }
            activeSquareColor={ activeSquareColor }
            activeSquarePosition={ activeSquarePosition }
          >
            { this.renderOnLose(9) }
          </Square>
        </View>
      </View>
    )
  }

  renderOnLose (idx) {
    const { modes, status, nBack, lastTurn, nBackTurn } = this.props
    if (status !== 'gameOver') {
      return
    }
    if (!modes.position) {
      return this.renderOnLoseWithoutPosition(idx)
    }
    let lastTurnText
    let nBackTurnText
    if (lastTurn.position === idx) {
      lastTurnText = (
        <Text style={ { color: lastTurn.color } }>
          Last turn
        </Text>
      )
    }
    if (nBackTurn.position === idx) {
      nBackTurnText = (
        <Text style={ { color: nBackTurn.color } }>
          { nBack } turns back
        </Text>
      )
    }
    return (
      <Text>
        { lastTurnText }
        { lastTurnText && nBackTurnText && '\n' } { /* line break only if both texts are in same square */ }
        { nBackTurnText }
      </Text>
    )
  }

  renderOnLoseWithoutPosition (idx) {
    const { nBack, lastTurn, nBackTurn } = this.props
    if (idx !== 5) {
      return
    }
    return (
      <Text>
        <Text style={ { color: lastTurn.color } }>
          Last turn
        </Text>
        { '\n' }
        <Text style={ { color: nBackTurn.color } }>
          { nBack } turns back
        </Text>
      </Text>
    )
  }

}

const styles = {
  container: {
    flex: 1,
    justifyContent: 'center',
  },

  row: {
    flexDirection: 'row',
    marginBottom: 3,
    justifyContent: 'center',
  },

}
