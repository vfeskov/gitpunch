import React, { Component } from 'react'
import { withStyles } from 'material-ui/styles'
import PropTypes from 'prop-types'
import Paper from 'material-ui/Paper'
import { styles } from './styles'
import { LoggedIn } from './LoggedIn'
import { LoggedOut } from './LoggedOut'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as actionCreators from '../../actions'

class SettingsComponent extends Component {
  render () {
    const { user, email, logout, login, register, className, classes } = this.props
    const { shownRepos, loggedIn } = user
    return (
      <Paper className={`${className} ${classes.container}`}>
        {loggedIn ? (
          LoggedIn({ logout, classes, email })
        ) : (
          <LoggedOut login={login} register={register} classes={classes} shownRepos={shownRepos} />
        )}
      </Paper>
    )
  }
}

SettingsComponent.propTypes = {
  className: PropTypes.string,
  classes: PropTypes.object.isRequired,
  user: PropTypes.shape({
    loggedIn: PropTypes.bool.isRequired,
    shownRepos: PropTypes.arrayOf(PropTypes.string).isRequired
  }).isRequired,
  login: PropTypes.func.isRequired,
  register: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired
}

const SettingsComponentWithStyles = withStyles(styles)(SettingsComponent)

export const Settings = connect(
  state => ({
    user: state.user,
    watching: state.watching,
    email: state.email
  }),
  dispatch => bindActionCreators(actionCreators, dispatch)
)(SettingsComponentWithStyles)
