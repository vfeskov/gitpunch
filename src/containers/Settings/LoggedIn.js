import React from 'react'
import Button from 'material-ui/Button'
import PropTypes from 'prop-types'

export function LoggedIn ({ logout, classes, email }) {
  return <div className={classes.container}>
    <div>{email}</div>
    <div className={classes.buttons}>
      <Button raised onClick={logout}>
        Logout
      </Button>
    </div>
  </div>
}

LoggedIn.propTypes = {
  email: PropTypes.string.isRequired,
  classes: PropTypes.object.isRequired,
  logout: PropTypes.func.isRequired
}
