import React, { Component } from 'react'
import { withStyles } from 'material-ui/styles'
import PropTypes from 'prop-types'
import Paper from 'material-ui/Paper'
import styles from './styles'
import SignedIn from './SignedIn'
import SignedOut from './SignedOut'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as actionCreators from '../../actions'

class SettingsComponent extends Component {
  render () {
    const { bufferRepos, signedIn, email, signOut, signIn, className, classes } = this.props
    return (
      <Paper className={className}>
        {signedIn ? (
          SignedIn({ signOut, classes, email })
        ) : (
          <SignedOut signIn={signIn} classes={classes} bufferRepos={bufferRepos} />
        )}
      </Paper>
    )
  }
}

SettingsComponent.propTypes = {
  className: PropTypes.string,
  classes: PropTypes.object.isRequired,
  signedIn: PropTypes.bool.isRequired,
  bufferRepos: PropTypes.arrayOf(PropTypes.string).isRequired,
  signIn: PropTypes.func.isRequired,
  signOut: PropTypes.func.isRequired
}

const SettingsComponentWithStyles = withStyles(styles)(SettingsComponent)

export const Settings = connect(
  state => ({
    signedIn: state.signedIn,
    bufferRepos: state.bufferRepos,
    watching: state.watching,
    email: state.email
  }),
  dispatch => bindActionCreators(actionCreators, dispatch)
)(SettingsComponentWithStyles)
