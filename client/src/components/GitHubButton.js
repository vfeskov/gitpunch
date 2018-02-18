import React, { Component } from 'react'
import { withStyles } from 'material-ui/styles'
import Button from 'material-ui/Button'
import { GitHubIcon } from './icons'
import oauthUrl from '../lib/oauthUrl'

class GitHubButton extends Component {
  render () {
    const { bufferRepos: repos, classes, className, text } = this.props
    const link = oauthUrl({ repos })
    return (
      <Button href={link} variant="raised" className={`${classes.theButton} ${className}`}>
        {GitHubIcon()}&nbsp;{text}
      </Button>
    )
  }
}

export default withStyles(() => ({
  theButton: {
    marginBottom: '16px',
    backgroundColor: '#24292e',
    color: 'rgba(255, 255, 255, 0.75)',
    width: '100%',
    '&:hover, &:focus': {
      backgroundColor: '#24292e',
      color: '#fff'
    }
  },
  svg: {
    fill: 'currentColor',
    width: '1em',
    height: '1em'
  }
}))(GitHubButton)
