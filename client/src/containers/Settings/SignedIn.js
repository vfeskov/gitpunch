import React from 'react'
import Button from 'material-ui/Button'
import PropTypes from 'prop-types'
import GitHubButton from './GitHubButton'
import GitHubIcon from './GitHubIcon'

export default function SignedIn ({ signOut, classes, email, hasAccessToken }) {
  return (
    <div className={classes.form}>
      <div className={classes.formControl}>{email}</div>
      {hasAccessToken ? (
        <div className={classes.formControl}><small>{GitHubIcon()} GitHub is connected</small></div>
      ) : (
        <GitHubButton text="Connect with GitHub" className={classes.formControl}/>
      )}
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
