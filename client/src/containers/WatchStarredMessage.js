import React, { Component } from 'react'
import Snackbar from '@material-ui/core/Snackbar'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import Button from '@material-ui/core/Button'

import { connect } from 'react-redux'
import { mapDispatchToProps } from '../actions'

export class WatchStarredMessage extends Component {
  constructor (props) {
    super(props)
    this.state = { open: true }
  }

  render () {
    const { unwatchMessage, watching } = this.props
    if (!unwatchMessage) { return null }
    const { success, sameUser } = unwatchMessage
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
}

export default connect(
  state => ({
    starredStatus: state.starredStatus
  })
)(WatchStarredMessage)
