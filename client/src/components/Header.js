import React, { PureComponent } from 'react'
import { withStyles } from 'material-ui/styles'

export class Header extends PureComponent {
  onClick = e => {
    e.preventDefault();
    this.props.signOut();
  }

  render () {
    const { className, classes, email } = this.props
    return (
      <div className={`${className} ${classes.container}`}>
        <span>
          <a href="" className={classes.logo}>Win A Beer</a>
          <a href="https://github.com/vfeskov/WinABeer" target="_blank">GitHub</a>
        </span>
        <span className={classes.spacer}></span>
        {email && (<span>
          <span style={{display: 'inline-block', paddingRight: '1em'}}>{email}</span>
          <a href="" onClick={this.onClick}>Sign Out</a>
        </span>)}
      </div>
    )
  }
}

export default withStyles(theme => ({
  container: {
    alignItems: 'center',
    background: 'linear-gradient(to bottom, rgba(216,216,216,0.65) 0%, rgba(214,214,214,0.65) 1%, rgba(0,0,0,0) 100%)',
    display: 'flex',
    marginBottom: theme.spacing.unit * 6,
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column',
      marginBottom: theme.spacing.unit * 4
    }
  },
  spacer: {
    flex: 1,
    [theme.breakpoints.down('xs')]: {
      height: theme.spacing.unit * 2
    }
  },
  logo: {
    ...theme.typography.headline,
    border: 'none',
    display: 'inline-block',
    marginRight: '1rem'
  }
}))(Header)
