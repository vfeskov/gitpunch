import React from 'react'
import IconButton from 'material-ui/IconButton'
import DeleteIcon from 'material-ui-icons/Delete'
import { withStyles } from 'material-ui/styles'
import PropTypes from 'prop-types'
import moment from 'moment'
import Radio, { RadioGroup } from 'material-ui/Radio'
import { FormControl, FormControlLabel } from 'material-ui/Form'
import Switch from 'material-ui/Switch'
import Hourpicker from '../components/Hourpicker'

import { connect } from 'react-redux'
import { mapDispatchToProps } from '../actions'

function Repos ({
  signedIn,
  shownRepos,
  watching,
  toggleWatching,
  removeRepo,
  classes,
  className,
  frequency,
  checkAt,
  saveFrequency,
  saveCheckAt,
  alerted
}) {
  function handleFrequencyChange (e, frequency) {
    if (frequency !== 'daily') { return saveFrequency({ frequency }) }
    const checkAt = +moment('9', 'H').utc().format('H')
    saveFrequency({ frequency, checkAt })
  }
  const header = signedIn && shownRepos.length ? (
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
  return (
    <div className={`${className} ${classes.container}`}>
      {header}
      {shownRepos.map(repo =>
        <div className={classes.item} key={repo}>
          <IconButton aria-label="Delete" onClick={() => removeRepo(repo)}>
            <DeleteIcon />
          </IconButton>
          <a className="soft" href={`https://github.com/${repo}`} target="_blank" rel="noopener noreferrer">{repo}</a>
          {/* {alerted[repo] &&
            <a
              href={`https://github.com/${repo}/releases/tag/${alerted[repo]}`}
              target="_blank"
              rel="noopener noreferrer"
              className={classes.releaseLink}
            >
              {alerted[repo]}
            </a>
          } */}
        </div>
      )}
    </div>
  )
}

Repos.propTypes = {
  classes: PropTypes.object.isRequired,
  className: PropTypes.string,
  signedIn: PropTypes.bool.isRequired,
  shownRepos: PropTypes.arrayOf(PropTypes.string).isRequired,
  removeRepo: PropTypes.func.isRequired,
  watching: PropTypes.bool.isRequired,
  toggleWatching: PropTypes.func.isRequired,
  frequency: PropTypes.string.isRequired,
  checkAt: PropTypes.number.isRequired,
  saveFrequency: PropTypes.func.isRequired,
  saveCheckAt: PropTypes.func.isRequired,
  alerted: PropTypes.object.isRequired
}

const styles = theme => ({
  container: {
    [theme.breakpoints.down('xs')]: {
      textAlign: 'center'
    }
  },
  item: {
    alignItems: 'center',
    display: 'flex',
    marginLeft: '-12px'
  },
  titleLabel: theme.typography.title,
  frequencyOptions: {
    alignItems: 'center',
    flexDirection: 'row'
  },
  checkAtText: {
    cursor: 'pointer',
    textDecoration: 'underline'
  },
  realtimeOption: {
    marginLeft: 0
  },
  dailyOption: {
    marginRight: 0
  },
  releaseLink: {
    fontSize: '0.8em',
    marginLeft: '12px'
  },
  controlGroup: {
    display: 'flex',
    justifyContent: 'space-between',
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column'
    }
  },
  title: {
    ...theme.typography.title,
    marginBottom: theme.spacing.unit * 2,
    marginTop: 0,
    [theme.breakpoints.down('xs')]: {
      textAlign: 'center'
    }
  }
})

export default connect(
  state => ({
    signedIn: state.signedIn,
    shownRepos: state.shownRepos,
    watching: state.watching,
    frequency: state.frequency,
    checkAt: state.checkAt,
    alerted: state.alerted
  }),
  mapDispatchToProps()
)(withStyles(styles)(Repos))
