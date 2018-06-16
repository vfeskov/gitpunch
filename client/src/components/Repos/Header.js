import React from 'react'
import { withStyles } from 'material-ui/styles'
import PropTypes from 'prop-types'
import moment from 'moment'
import Radio, { RadioGroup } from 'material-ui/Radio'
import { FormControl, FormControlLabel } from 'material-ui/Form'
import Switch from 'material-ui/Switch'
import Hourpicker from '../Hourpicker'

function Header ({
  checkAt,
  classes,
  frequency,
  saveCheckAt,
  saveFrequency,
  shownRepos,
  signedIn,
  toggleWatching,
  watching
}) {
  function handleFrequencyChange (e, frequency) {
    if (frequency !== 'daily') { return saveFrequency({ frequency }) }
    const checkAt = +moment('9', 'H').utc().format('H')
    saveFrequency({ frequency, checkAt })
  }
  return signedIn && shownRepos.length ? (
    <div className={classes.controlGroup}>
      <FormControlLabel
        classes={{ label: classes.titleLabel }}
        control={
          <Switch
            checked={watching}
            onChange={toggleWatching}
          />
        }
        label={watching ? 'Watching' : 'Not watching'}
      />
      {watching && <div>
        <FormControl component="div" style={{flexDirection: 'row', alignItems: 'center', marginLeft: '-12px', display: 'flex'}}>
          <RadioGroup
            aria-label="Check for updates"
            name="frequency"
            value={frequency}
            className={classes.frequencyOptions}
            onChange={handleFrequencyChange}
          >
            <FormControlLabel value="realtime" control={<Radio />} className={classes.realtimeOption} label="Realtime" />
            <FormControlLabel value="daily" control={<Radio />} className={classes.dailyOption} label="Daily" />
            {frequency === 'daily' && <Hourpicker utcHour={checkAt} onSave={saveCheckAt} />}
          </RadioGroup>
        </FormControl>
      </div>}
    </div>
  ) : (
    shownRepos.length ? (
      <h2 className={classes.title}>Sign in to start watching</h2>
    ) : (
      <h2 className={classes.title}>Get <a href="/email.png" target="_blank" rel="noopener noreferrer">emails</a> in realtime or daily</h2>
    )
  )
}

Header.propTypes = {
  checkAt: PropTypes.number.isRequired,
  classes: PropTypes.object.isRequired,
  className: PropTypes.string,
  frequency: PropTypes.string.isRequired,
  saveCheckAt: PropTypes.func.isRequired,
  saveFrequency: PropTypes.func.isRequired,
  shownRepos: PropTypes.arrayOf(PropTypes.object).isRequired,
  signedIn: PropTypes.bool.isRequired,
  toggleWatching: PropTypes.func.isRequired,
  watching: PropTypes.bool.isRequired
}

export const propTypes = Header.propTypes

const styles = theme => ({
  checkAtText: {
    cursor: 'pointer',
    textDecoration: 'underline'
  },
  controlGroup: {
    display: 'flex',
    justifyContent: 'space-between',
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column'
    }
  },
  dailyOption: {
    marginRight: 0
  },
  frequencyOptions: {
    alignItems: 'center',
    flexDirection: 'row'
  },
  realtimeOption: {
    marginLeft: 0
  },
  title: {
    ...theme.typography.title,
    marginBottom: theme.spacing.unit * 2,
    marginTop: 0,
    [theme.breakpoints.down('xs')]: {
      textAlign: 'center'
    }
  },
  titleLabel: theme.typography.title
})

export default withStyles(styles)(Header)
