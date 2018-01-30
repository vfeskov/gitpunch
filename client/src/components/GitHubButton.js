import React, { Component } from 'react'
import { withStyles } from 'material-ui/styles'
import Button from 'material-ui/Button'
import { GitHubIcon } from './icons'

class GitHubButton extends Component {
  render () {
    const { bufferRepos: repos, classes, className, text } = this.props
    // eslint-disable-next-line no-restricted-globals
    let { hostname, protocol, port } = location
    if (hostname === 'localhost') { port = 3001 }
    const baseUrl = `${protocol}//${hostname}${port && ':' + port}`
    const oauthLink = `${baseUrl}/api/oauth/start` +
      (repos && repos.length ? `?repos=${JSON.stringify(repos)}` : '')
    return (
      <Button href={oauthLink} raised className={`${classes.theButton} ${className}`}>
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
