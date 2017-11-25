import React from 'react'
import { withStyles } from 'material-ui/styles'
import Typography from 'material-ui/Typography'
import PropTypes from 'prop-types'
import Button from 'material-ui/Button'
import Paper from 'material-ui/Paper'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as actionCreators from '../actions'

function SettingsComponent ({ user, logout, register, className }) {
  const { shownRepos, loggedIn } = user
  return (
    <Paper className={className}>
      {loggedIn ? (
      <Button raised onClick={logout}>
        Logout
      </Button>
      ) : (
      <Button raised onClick={() => register(shownRepos)}>
        Register
      </Button>
      )}
    </Paper>
  )
}

SettingsComponent.propTypes = {
  className: PropTypes.string,
  user: PropTypes.shape({
    loggedIn: PropTypes.bool.isRequired,
    shownRepos: PropTypes.arrayOf(PropTypes.string).isRequired
  }).isRequired,
  register: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired
}

const styles = theme => ({
})

const SettingsComponentWithStyles = withStyles(styles)(SettingsComponent)

export const Settings = connect(
  state => ({ user: state.user }),
  dispatch => bindActionCreators(actionCreators, dispatch)
)(SettingsComponentWithStyles)
