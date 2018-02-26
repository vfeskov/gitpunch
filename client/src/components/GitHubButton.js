import React, { Component } from 'react'
import { withStyles } from 'material-ui/styles'
import Button from 'material-ui/Button'
import { GitHubIcon } from './icons'
import oauthUrl from '../lib/oauthUrl'

class GitHubButton extends Component {
  render () {
    const { bufferRepos: repos, classes, className } = this.props
    const link = oauthUrl({ repos })
    return (
      <Button href={link} variant="raised" color="secondary" className={`${classes.theButton} ${className}`}>
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
  },
  svg: {
    fill: 'currentColor',
    width: '1em',
    height: '1em'
  }
}))(GitHubButton)
