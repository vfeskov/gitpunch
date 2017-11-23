import React from 'react'
import { withStyles } from 'material-ui/styles'
import Typography from 'material-ui/Typography'
import PropTypes from 'prop-types'
import Button from 'material-ui/Button'
import Paper from 'material-ui/Paper'

function SettingsComponent ({ onLogout, onRegister, loggedIn, className }) {
  return (
    <Paper className={className}>
      {loggedIn ? (
      <Button raised onClick={onLogout}>
        Logout
      </Button>
      ) : (
      <Button raised onClick={onRegister}>
        Register
      </Button>
      )}
    </Paper>
  )
}

SettingsComponent.propTypes = {
  className: PropTypes.string,
  loggedIn: PropTypes.bool.isRequired,
  onRegister: PropTypes.func.isRequired,
  onLogout: PropTypes.func.isRequired
}

const styles = theme => ({

})

export const Settings = withStyles(styles)(SettingsComponent)
