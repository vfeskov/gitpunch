import React from 'react'
import IconButton from 'material-ui/IconButton'
import Paper from 'material-ui/Paper'
import DeleteIcon from 'material-ui-icons/Delete'
import { withStyles } from 'material-ui/styles'
import Typography from 'material-ui/Typography'
import PropTypes from 'prop-types'

function ReposComponent ({ repos, onRemove, classes, title, className }) {
  return (
    <Paper className={className}>
      <Typography type="title">{title}</Typography>
      {repos.map(repo =>
        <div className={classes.item} key={repo}>
          <a href={`https://github.com/${repo}`} target="_blank">{repo}</a>
          <IconButton aria-label="Delete" onClick={() => onRemove(repo)}>
            <DeleteIcon />
          </IconButton>
        </div>
      )}
    </Paper>
  )
}

ReposComponent.propTypes = {
  className: PropTypes.string,
  repos: PropTypes.arrayOf(PropTypes.string).isRequired,
  title: PropTypes.string.isRequired,
  onRemove: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired
}

const styles = theme => ({
  item: {
    display: 'flex',
    alignItems: 'center'
  }
})

export const Repos = withStyles(styles)(ReposComponent)
