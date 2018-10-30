import React, { PureComponent } from 'react'
import withStyles from '@material-ui/core/styles/withStyles'
import { SignOutIcon } from './icons'
import { Link } from 'react-router-dom'
import logo from '../big-logo.png'

export class Header extends PureComponent {
  onClick = e => {
    e.preventDefault();
    this.props.signOut();
  }

  render () {
    const { className, classes, email } = this.props
    return (
      <div className={`${className} ${classes.container}`}>
        <Link to="/" className={classes.logo}><img src={logo} alt="GitPunch" width="150px"/></Link>
        <span className={classes.spacer}></span>
        {email && (
        <span style={{ display: 'flex' }}>
          <span style={{ display: 'inline-block', paddingRight: '1em' }} testid="current-user-email">{email}</span>
          <a style={{ display: 'inline-flex' }} className="soft" onClick={this.onClick}>{SignOutIcon()}</a>
        </span>
        )}
      </div>
    )
  }
}

export default withStyles(theme => ({
  container: {
    alignItems: 'center',
    background: 'linear-gradient(to bottom, rgba(53,114,156,0.2) 1%,rgba(207,207,207,0) 100%)',
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
    ...theme.typography.h5,
    border: 'none',
    display: 'inline-block',
    marginRight: '1rem'
  }
}))(Header)
