import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Repos from './Repos'
import SignIn from './SignIn'
import RepoAdd from './RepoAdd'
import UnwatchMessage from './UnwatchMessage'
import Starred from './Starred'
import SignOut from '../components/SignOut'
import { withStyles } from 'material-ui/styles'
import './App.css'

import { connect } from 'react-redux'
import { mapDispatchToProps } from '../actions'

class App extends Component {
  render () {
    const { classes, signedIn, email, signOut } = this.props
    const { app, sectionContainer, container, repos } = classes;
    return (
      <div className={app}>
        <div style={{fontSize: '1.5rem'}}>
          <div style={{margin: '1em 0'}} className="direct-speech">
            <div>
              <span className="first">I bet a <strong>beer</strong>&#32;</span>
              <span className="second">that you can't watch&#32;</span>
              <span className="third">for <strong>releases</strong>&#32;</span>
              <span className="fourth">on <strong>GitHub</strong></span>
            </div>
          </div>
          <div style={{margin: '1em 0'}} className="fifth direct-speech">Game on, sucker!</div>
          <div style={{margin: '1em 0'}} className="sixth">And then he won that beer.</div>
        </div>
        <div style={{fontSize: '1.5rem', margin: '1em 0'}} className="seventh">Win A Beer</div>
        {/* {SignOut({ className: sectionContainer, email, signOut })}
        <RepoAdd className={sectionContainer} />
        <div className={container}>
          <Repos className={`${sectionContainer} ${repos}`} />
          {!signedIn && <SignIn className={sectionContainer} />}
        </div>
        <Starred />
        <UnwatchMessage /> */}
      </div>
    )
  }

  componentDidMount () {
    const jssStyles = document.getElementById('jss-server-side')
    if (jssStyles && jssStyles.parentNode) {
      jssStyles.parentNode.removeChild(jssStyles)
    }
    this.possiblyUnwatch()
    this.possiblyShowStarred()
    window.location.pathname === '/' || window.history.pushState(null, '', '/')
  }

  possiblyUnwatch () {
    const match = window.location.pathname.match(/^\/unsubscribe\/(.+)$/)
    if (!match) { return }
    this.props.unwatch(match[1])
  }

  possiblyShowStarred() {
    if (window.location.pathname !== '/starred') { return }
    this.props.setStarredOpen(true)
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired,
  email: PropTypes.string.isRequired,
  signedIn: PropTypes.bool.isRequired,
  signOut: PropTypes.func.isRequired
}

const styles = theme => {
  return {
    app: {
      boxSizing: 'border-box',
      height: '100%',
      maxWidth: '800px',
      marginLeft: 'auto',
      marginRight: 'auto',
      marginTop: -theme.spacing.unit,
      paddingTop: theme.spacing.unit,
      [theme.breakpoints.up('sm')]: {
        marginTop: -theme.spacing.unit * 2,
        paddingTop: theme.spacing.unit * 2
      }
    },
    container: {
      [theme.breakpoints.up('sm')]: {
        flexDirection: 'row'
      },
      display: 'flex',
      flexDirection: 'column'
    },
    sectionContainer: {
      [theme.breakpoints.up('sm')]: {
        padding: theme.spacing.unit * 4,
        margin: theme.spacing.unit * 2
      },
      padding: theme.spacing.unit * 2,
      margin: theme.spacing.unit
    },
    repos: {
      flex: 1
    }
  }
}

export default connect(
  state => ({
    email: state.email,
    inited: state.inited,
    signedIn: state.signedIn
  }),
  mapDispatchToProps()
)(withStyles(styles)(App))
