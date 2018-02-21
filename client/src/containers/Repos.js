import React from 'react'
import IconButton from 'material-ui/IconButton'
import Paper from 'material-ui/Paper'
import DeleteIcon from 'material-ui-icons/Delete'
import { withStyles } from 'material-ui/styles'
import Typography from 'material-ui/Typography'
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
  const title = !shownRepos.length ?
    'Not watching any repo yet' :
    !signedIn ?
      'Sign in to start watching' :
      watching ? 'Watching' : 'Not watching'
  function handleFrequencyChange (e, frequency) {
    if (frequency !== 'daily') { return saveFrequency({ frequency }) }
    const checkAt = +moment('9', 'H').utc().format('H')
    saveFrequency({ frequency, checkAt })
  }
  const header = signedIn && shownRepos.length ? (
    <div style={{ display: 'flex' }}>
      <FormControlLabel
        classes={{ label: classes.titleLabel }}
        control={
          <Switch
            checked={watching}
            onChange={toggleWatching}
          />
        }
        label={title}
      />
      {watching && <div>
        <FormControl component="div" style={{flexDirection: 'row', alignItems: 'center'}}>
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
    <Typography variant="title">{title}</Typography>
  )
  return (
    <div className={className}>
      {header}
      {shownRepos.map(repo =>
        <div className={classes.item} key={repo}>
          <IconButton aria-label="Delete" onClick={() => removeRepo(repo)}>
            <DeleteIcon />
          </IconButton>
          <a className={classes.repoLink} href={`https://github.com/${repo}`} target="_blank">{repo}</a>
          {/* {alerted[repo] &&
            <a
              href={`https://github.com/${repo}/releases/tag/${alerted[repo]}`}
              target="_blank"
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
  classes: PropTypes.object.isRequired,
  watching: PropTypes.bool.isRequired,
  toggleWatching: PropTypes.func.isRequired,
  frequency: PropTypes.string.isRequired,
  checkAt: PropTypes.number.isRequired,
  saveFrequency: PropTypes.func.isRequired,
  saveCheckAt: PropTypes.func.isRequired,
  alerted: PropTypes.object.isRequired
}

const styles = theme => ({
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
