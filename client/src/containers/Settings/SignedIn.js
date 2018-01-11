import React from 'react'
import Button from 'material-ui/Button'
import PropTypes from 'prop-types'

export default function SignedIn ({ signOut, classes, email }) {
  return (
    <div className={classes.form}>
      <div className={classes.formControl}>{email}</div>
      <Button raised onClick={signOut}>
        Sign Out
      </Button>
    </div>
  )
}

SignedIn.propTypes = {
  email: PropTypes.string.isRequired,
  classes: PropTypes.object.isRequired,
  signOut: PropTypes.func.isRequired
}
