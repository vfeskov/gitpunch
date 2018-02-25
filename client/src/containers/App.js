import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import Repos from './Repos'
import SignIn from './SignIn'
import RepoAdd from './RepoAdd'
import UnwatchMessage from './UnwatchMessage'
import Starred from './Starred'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Intro from '../components/Intro'
import * as cookie from '../services/cookie'
import { withStyles } from 'material-ui/styles'

import { connect } from 'react-redux'
import { mapDispatchToProps } from '../actions'

class App extends PureComponent {
  skip = () => {
    cookie.set('dontShowIntro', 1)
    this.props.setShowIntro('n')
  }

  showIntro = () => {
    this.props.setShowIntro('y')
  }

  render () {
    const { classes, signedIn, email, signOut, showIntro } = this.props
    return (
      <div className={classes.app}>
        <div className={classes.contentContainer + ' ' + (showIntro === 'n' ? classes.contentOn : '')}>
          <div className={classes.content}>
            <Header className={classes.block} email={email} signOut={signOut} />
            <RepoAdd className={`${classes.block} ${classes.maxWidth}`} />
            <div className={`${classes.container} ${classes.maxWidth}`}>
              <Repos className={`${classes.block} ${classes.repos}`} />
              {!signedIn && <SignIn className={classes.block} />}
            </div>
          </div>
          <Footer className={classes.block} watchIntro={this.showIntro}></Footer>
        </div>
        <Starred />
        <UnwatchMessage />
        <div className={classes.introContainer + ' ' + (showIntro === 'y' ? classes.introOn : classes.introOff)}>
          <div className={classes.maxWidth}>
            <Intro onSkip={this.skip} showIntro={showIntro} />
          </div>
        </div>
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
  showIntro: PropTypes.string.isRequired,
  signedIn: PropTypes.bool.isRequired,
  accessToken: PropTypes.string.isRequired,
  signOut: PropTypes.func.isRequired,
  setShowIntro: PropTypes.func.isRequired
}

const styles = theme => ({
  app: {
    boxSizing: 'border-box',
    height: '100%',
    overflow: 'hidden',
    position: 'relative'
  },
  container: {
    [theme.breakpoints.up('sm')]: {
      flexDirection: 'row'
    },
    display: 'flex',
    flexDirection: 'column'
  },
  block: {
    [theme.breakpoints.up('sm')]: {
      marginBottom: theme.spacing.unit * 3,
      padding: theme.spacing.unit * 4
    },
    marginBottom: theme.spacing.unit * 1.5,
    padding: theme.spacing.unit * 2
  },
  maxWidth: {
    boxSizing: 'border-box',
    marginLeft: 'auto',
    marginRight: 'auto',
    maxWidth: '600px',
    position: 'relative'
  },
  repos: {
    flex: 1
  },
  introContainer: {
    left: 0,
    position: 'absolute',
    top: 0,
    width: '100%',
    transition: 'all 500ms'
  },
  introOn: {
    opacity: 1,
    zIndex: 10000
  },
  introOff: {
    opacity: 0,
    pointerEvents: 'none',
    top: '-500px',
    zIndex: 0
  },
  contentContainer: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    opacity: 0,
    overflow: 'auto',
    position: 'relative',
    top: '500px',
    transition: 'opacity 500ms, top 500ms'
  },
  contentOn: {
    opacity: 1,
    top: 0
  },
  content: {
    flex: '1 0 auto'
  }
})

export default connect(
  state => ({
    email: state.email,
    signedIn: state.signedIn,
    accessToken: state.accessToken,
    showIntro: state.showIntro
  }),
  mapDispatchToProps()
)(withStyles(styles)(App))
