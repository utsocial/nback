import React, { Component, PropTypes } from 'react'

import styles from './Square.css'

export default class Square extends Component {

  static propTypes = {
    style: PropTypes.object,
    idx: PropTypes.number.isRequired,
    activeSquarePosition: PropTypes.number,
    activeSquareColor: PropTypes.string,
    children: PropTypes.node,
  }

  render () {
    return (
      <div style={ this.getContainerStyle() } className={ styles.container } { ...this._test() }>
        { this.props.children }
      </div>
    )
  }

  getContainerStyle () {
    const style = Object.assign({}, this.props.style)

    if (this.isActive()) {
      style.backgroundColor = this.props.activeSquareColor
    }

    return style
  }

  isActive () {
    return this.props.activeSquarePosition === this.props.idx
  }
}
