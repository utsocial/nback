import React, { Component, PropTypes } from 'react'
import { Text } from 'react-native'

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
      <Text style={ this.getContainerStyle() }>
        { this.props.children }
      </Text>
    )
  }

  getContainerStyle () {
    const _style = Object.assign({}, this.props.style, style.container)

    if (this.isActive()) {
      _style.backgroundColor = this.props.activeSquareColor
    }

    return _style
  }

  isActive () {
    return this.props.activeSquarePosition === this.props.idx
  }
}

const style = {
  container: {
    backgroundColor: 'black',
    width: 100,
    height: 100,
    fontSize: 20,
    textAlignVertical: 'center',
    textAlign: 'center',
    justifyContent: 'center',
  },
}
