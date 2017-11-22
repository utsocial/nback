import React, { Component, PropTypes } from 'react'
import { View, Text } from 'react-native'

export default class Button extends Component {

  static propTypes = {
    isProcessing: PropTypes.bool.isRequired,
    onPress: PropTypes.func.isRequired,
    children: PropTypes.node.isRequired,
  }

  render () {
    const { isProcessing, onPress, children } = this.props
    return (
      <View style={ styles.container }>
        <Text
          style={ Object.assign({}, styles.button, isProcessing ? styles.buttonDisabled : {}) }
          disabled={ isProcessing }
          onPress={ onPress }
        >
          { children }
        </Text>
        { isProcessing ? <Text style={ styles.spinner } /> : null }
      </View>
    )
  }

}

const styles = {

  container: {
    position: 'relative',
  },

  button: {
    backgroundColor: 'rgb(0, 100, 255)',
    borderColor: 'rgb(30, 30, 30)',
    borderRadius: 3,
    color: '#fff',
    textAlign: 'center',
    fontSize: 20,
    paddingBottom: 10,
    paddingTop: 10,
  },

  buttonDisabled: {
    background: '#999',
    borderColor: 'rgba(0, 0, 0, 0.07)',
    color: '#fff',
  },

}
