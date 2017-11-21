import React from 'react'
import IconButton from 'material-ui/IconButton'
import Paper from 'material-ui/Paper'
import DeleteIcon from 'material-ui-icons/Delete'
import { withStyles } from 'material-ui/styles'
import Typography from 'material-ui/Typography'

function ReposComponent({ repos, onRemove, classes }) {
  return (
    <Paper style={{padding: '20px', margin: '10px'}}>
      <Typography type="title">{repos.length ? 'Watching' : 'Not watching any repo yet'}</Typography>
      {repos.map(repo =>
        <div className={classes.item}>
          <a href={`https://github.com/${repo}`} target="_blank">{repo}</a>
          <IconButton aria-label="Delete" onClick={() => onRemove(repo)}>
            <DeleteIcon />
          </IconButton>
        </div>
      )}
    </Paper>
  )
}

const styles = {
  item: {
    display: 'flex',
    alignItems: 'center'
  }
}

export const Repos = withStyles(styles)(ReposComponent)
