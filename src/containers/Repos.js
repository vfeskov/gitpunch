import React from 'react'
import IconButton from 'material-ui/IconButton'
import Paper from 'material-ui/Paper'
import DeleteIcon from 'material-ui-icons/Delete'
import { withStyles } from 'material-ui/styles'
import Typography from 'material-ui/Typography'
import PropTypes from 'prop-types'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as actionCreators from '../actions'

function ReposComponent ({ user, removeRepo, classes, className }) {
  const { loggedIn, shownRepos } = user
  const title = !shownRepos.length ?
    'Not watching any repo yet' :
    loggedIn ?
      'Watching' :
      'Register to start watching'
  return (
    <Paper className={className}>
      <Typography type="title">{title}</Typography>
      {shownRepos.map(repo =>
        <div className={classes.item} key={repo}>
          <a href={`https://github.com/${repo}`} target="_blank">{repo}</a>
          <IconButton aria-label="Delete" onClick={() => removeRepo(loggedIn, repo)}>
            <DeleteIcon />
          </IconButton>
        </div>
      )}
    </Paper>
  )
}

ReposComponent.propTypes = {
  className: PropTypes.string,
  user: PropTypes.shape({
    loggedIn: PropTypes.bool.isRequired,
    shownRepos: PropTypes.arrayOf(PropTypes.string).isRequired
  }).isRequired,
  removeRepo: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired
}

const styles = theme => ({
  item: {
    display: 'flex',
    alignItems: 'center'
  }
})

const ReposComponentWithStyles = withStyles(styles)(ReposComponent)

export const Repos = connect(
  state => ({ user: state.user }),
  dispatch => bindActionCreators(actionCreators, dispatch)
)(ReposComponentWithStyles)
