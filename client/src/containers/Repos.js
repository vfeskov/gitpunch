import React from 'react'
import IconButton from 'material-ui/IconButton'
import Paper from 'material-ui/Paper'
import DeleteIcon from 'material-ui-icons/Delete'
import { withStyles } from 'material-ui/styles'
import Typography from 'material-ui/Typography'
import PropTypes from 'prop-types'
import { FormControlLabel } from 'material-ui/Form'
import Switch from 'material-ui/Switch'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as actionCreators from '../actions'

function ReposComponent ({ signedIn, shownRepos, watching, toggleWatching, removeRepo, classes, className }) {
  const title = !shownRepos.length ?
    'Not watching any repo yet' :
    !signedIn ?
      'Sign in to start watching' :
      watching ? 'Watching' : 'Not watching'
  const header = signedIn && shownRepos.length ? (
    <FormControlLabel
      classes={{ label: classes.titleLabel }}
      control={
        <Switch
          checked={watching}
          onChange={(event, checked) => toggleWatching(checked)}
        />
      }
      label={title}
    />
  ) : (
    <Typography type="title">{title}</Typography>
  )
  return (
    <Paper className={className}>
      {header}
      {shownRepos.map(repo =>
        <div className={classes.item} key={repo}>
          <a href={`https://github.com/${repo}`} target="_blank">{repo}</a>
          <IconButton aria-label="Delete" onClick={() => removeRepo(signedIn, repo)}>
            <DeleteIcon />
          </IconButton>
        </div>
      )}
    </Paper>
  )
}

ReposComponent.propTypes = {
  className: PropTypes.string,
  signedIn: PropTypes.bool.isRequired,
  shownRepos: PropTypes.arrayOf(PropTypes.string).isRequired,
  removeRepo: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
  watching: PropTypes.bool.isRequired,
  toggleWatching: PropTypes.func.isRequired
}

const styles = theme => ({
  item: {
    display: 'flex',
    alignItems: 'center'
  },
  titleLabel: theme.typography.title
})

const ReposComponentWithStyles = withStyles(styles)(ReposComponent)

export const Repos = connect(
  state => ({
    signedIn: state.signedIn,
    shownRepos: state.shownRepos,
    watching: state.watching
  }),
  dispatch => bindActionCreators(actionCreators, dispatch)
)(ReposComponentWithStyles)
