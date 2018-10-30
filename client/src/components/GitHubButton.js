import React, { PureComponent } from 'react'
import withStyles from '@material-ui/core/styles/withStyles'
import Button from '@material-ui/core/Button'
import { GitHubIcon } from './icons'
import { oauthUrl } from '../services/oauth'

class GitHubButton extends PureComponent {
  render () {
    const { bufferRepos: repos, classes, className } = this.props
    const link = oauthUrl({ repos })
    return (
      <Button href={link} variant="contained" color="secondary" className={`${classes.theButton} ${className}`} testid="github-sign-in">
        {GitHubIcon()}&nbsp;GitHub&nbsp;Sign&nbsp;In
      </Button>
    )
  }
}

export default withStyles(() => ({
  theButton: {
    borderRadius: '36px',
    display: 'inline-flex',
    marginBottom: '16px',
    '&:hover, &:focus': {
      color: '#fff'
    }
  }
}))(GitHubButton)
