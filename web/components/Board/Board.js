import React, { Component, PropTypes } from 'react'
import Square from '../Square'

import styles from './Board.css'

export default class Board extends Component {

  static propTypes = {
    nBack: PropTypes.number.isRequired,
    activeSquareColor: PropTypes.string,
    activeSquarePosition: PropTypes.number,
    status: PropTypes.string.isRequired,
    modes: PropTypes.object.isRequired,
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
      <div className={ styles.container }>
        <div className={ styles.row }>
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
        </div>
        <div className={ styles.row }>
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
        </div>
        <div className={ styles.row }>
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
        </div>
      </div>
    )
  }

  renderOnLose (idx) {
    const { status, modes, nBack, lastTurn, nBackTurn } = this.props
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
        <div style={ { color: lastTurn.color } }>
          Last turn
        </div>
      )
    }
    if (nBackTurn.position === idx) {
      nBackTurnText = (
        <div style={ { color: nBackTurn.color } }>
          { nBack } { nBack === 1 ? 'turn ' : 'turns' } ago
        </div>
      )
    }
    return (
      <div className={ styles.onLose }>
        { lastTurnText }
        { nBackTurnText }
      </div>
    )
  }

  renderOnLoseWithoutPosition (idx) {
    const { nBack, lastTurn, nBackTurn } = this.props
    if (idx !== 5) {
      return
    }
    return (
      <div className={ styles.onLose }>
        <div style={ { color: lastTurn.color } }>
          Last turn
        </div>
        <div style={ { color: nBackTurn.color } }>
          { nBack } { nBack === 1 ? 'turn ' : 'turns' } ago
        </div>
      </div>
    )
  }

}
