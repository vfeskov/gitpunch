import React, { Component } from 'react'
import Snackbar from 'material-ui/Snackbar'
import IconButton from 'material-ui/IconButton'
import CloseIcon from 'material-ui-icons/Close'
import Button from 'material-ui/Button'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as actionCreators from '../actions'

export class UnsubscribeMessageComponent extends Component {
  constructor (props) {
    super(props)
    this.state = { open: true }
  }

  render () {
    const { unsubscribeMessage, watching } = this.props
    if (!unsubscribeMessage) { return null }
    const { success, error, sameUser } = unsubscribeMessage
    const message = success ?
      'No more emails for you!' :
      'Couldn\'t stop them emails, sorry :('
    return (
      <Snackbar
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        open={this.state.open}
        SnackbarContentProps={{ 'aria-describedby': 'message-id' }}
        message={<span id="message-id">{message}</span>}
        action={[
          error || !sameUser || watching ? null : (
            <Button key="undo" color="accent" dense onClick={() => this.undo()}>
              UNDO
            </Button>
          ),
          <IconButton
            key="close"
            aria-label="Close"
            color="inherit"
            onClick={() => this.setState({ open: false })}
          >
            <CloseIcon />
          </IconButton>
        ]}
      />
    )
  }

  undo () {
    this.props.toggleWatching(true)
    this.setState({ open: false })
  }
}

export const UnsubscribeMessage = connect(
  state => ({
    unsubscribeMessage: state.unsubscribeMessage,
    watching: state.watching
  }),
  dispatch => bindActionCreators(actionCreators, dispatch)
)(UnsubscribeMessageComponent)
