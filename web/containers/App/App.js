
import React, { Component, PropTypes } from 'react'
import styles from './App.css'

export default class AppContainer extends Component {

  static propTypes = {
    children: PropTypes.object.isRequired,
  }

  render () {
    return (
      <div className={ styles.container }>
        { this.props.children }
      </div>
    )
  }

}
