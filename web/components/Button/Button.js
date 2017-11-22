import React, { Component, PropTypes } from 'react'
import styles from './Button.css'

export default class Button extends Component {

  static propTypes = {
    isProcessing: PropTypes.bool.isRequired,
    type: PropTypes.string.isRequired,
    onClick: PropTypes.func, // not required if it's a submit button for a form
    children: PropTypes.node.isRequired,
  }

  defaultProps = {
    type: 'button',
  }

  render () {
    const { isProcessing, onClick, children, type } = this.props
    return (
      <div className={ styles.container }>
        <button
          type={ type }
          className={ styles.button }
          disabled={ isProcessing }
          onClick={ onClick }
        >
          { children }
        </button>
        { isProcessing ? <span className={ styles.spinner } /> : null }
      </div>
    )
  }

}
