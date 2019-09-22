import React from 'react'
import withStyles from '@material-ui/core/styles/withStyles'
import PropTypes from 'prop-types'
import moment from 'moment'
import Radio from '@material-ui/core/Radio'
import RadioGroup from '@material-ui/core/RadioGroup'
import FormControl from '@material-ui/core/FormControl'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Switch from '@material-ui/core/Switch'
import Hourpicker from '../Hourpicker'

function ReposHeader ({
  checkAt,
  classes,
  frequency,
  patchProfile,
  shownRepos,
  signedIn,
  toggleWatching,
  watching,
  watchingStars
}) {
  function handleFrequencyChange (e, frequency) {
    if (frequency !== 'daily') { return patchProfile({ frequency }) }
    const checkAt = +moment('9', 'H').utc().format('H')
    patchProfile({ frequency, checkAt })
  }
  return signedIn && (shownRepos.length || watchingStars) ? (
    <div className={classes.controlGroup}>
      <FormControlLabel
        classes={{ label: classes.titleLabel }}
        control={
          <Switch
            checked={watching}
            onChange={toggleWatching}
          />
        }
        label={watching ? 'Emails are ON' : 'Emails are OFF'}
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
            {frequency === 'daily' && <Hourpicker utcHour={checkAt} onSave={v => patchProfile({ checkAt: v })} />}
          </RadioGroup>
        </FormControl>
      </div>}
    </div>
  ) : (
    shownRepos.length ? (
      <h2 className={classes.title}>Sign in to start watching</h2>
    ) : (
      <h2 className={classes.title}>Subscribe to <a href="/email.png" target="_blank" rel="noopener noreferrer">emails</a> in realtime or daily, <br/>filter out minor releases and more</h2>
    )
  )
}

ReposHeader.propTypes = {
  checkAt: PropTypes.number.isRequired,
  classes: PropTypes.object.isRequired,
  className: PropTypes.string,
  frequency: PropTypes.string.isRequired,
  patchProfile: PropTypes.func.isRequired,
  shownRepos: PropTypes.arrayOf(PropTypes.object).isRequired,
  signedIn: PropTypes.bool.isRequired,
  toggleWatching: PropTypes.func.isRequired,
  watching: PropTypes.bool.isRequired,
  watchingStars: PropTypes.bool.isRequired
}

export const propTypes = ReposHeader.propTypes

const styles = theme => ({
  checkAtText: {
    cursor: 'pointer',
    textDecoration: 'underline'
  },
  controlGroup: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: theme.spacing(4),
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
    ...theme.typography.subtitle1,
    marginBottom: theme.spacing(2),
    marginTop: 0,
    [theme.breakpoints.down('xs')]: {
      textAlign: 'center'
    }
  },
  titleLabel: theme.typography.subtitle1
})

export default withStyles(styles)(ReposHeader)
