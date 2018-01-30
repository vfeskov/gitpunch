import React from 'react'
import Button from 'material-ui/Button'
import PropTypes from 'prop-types'
import GitHubButton from '../../components/GitHubButton'
import GitHubIcon from '../../components/GitHubIcon'
import Hourpicker from '../../components/Hourpicker'
import Radio, { RadioGroup } from 'material-ui/Radio'
import { FormLabel, FormControl, FormControlLabel } from 'material-ui/Form'
import moment from 'moment'

export default function SignedIn ({ signOut, classes, email, hasAccessToken, frequency, saveFrequency, checkAt, saveCheckAt }) {
  function handleFrequencyChange (e, frequency) {
    if (frequency !== 'daily') { return saveFrequency({ frequency }) }
    const checkAt = +moment('9', 'H').utc().format('H')
    saveFrequency({ frequency, checkAt })
  }
  return (
    <div className={classes.form}>
      <div className={classes.formControl + ' ' + classes.email}>{email}</div>
      {hasAccessToken ? (
        <div className={classes.formControl}><small>{GitHubIcon()} GitHub is connected</small></div>
      ) : (
        <GitHubButton text="Connect to GitHub" className={classes.formControl}/>
      )}
      <div className={classes.formControl}>
        <FormControl component="fieldset">
          <FormLabel component="legend">Check repos:</FormLabel>
          <RadioGroup
            aria-label="Check for updates"
            name="frequency"
            value={frequency}
            className={classes.frequencyOptions}
            onChange={handleFrequencyChange}
          >
            <FormControlLabel value="hourly" control={<Radio />} label="Hourly" />
            <FormControlLabel value="daily" control={<Radio />} className={classes.dailyOption} label="Daily" />
            {frequency === 'daily' && <Hourpicker utcHour={checkAt} onSave={saveCheckAt} />}
          </RadioGroup>
        </FormControl>
      </div>
      <Button raised onClick={signOut}>
        Sign Out
      </Button>
    </div>
  )
}

SignedIn.propTypes = {
  email: PropTypes.string.isRequired,
  classes: PropTypes.object.isRequired,
  signOut: PropTypes.func.isRequired,
  hasAccessToken: PropTypes.bool.isRequired,
  frequency: PropTypes.string.isRequired,
  saveFrequency: PropTypes.func.isRequired
}
