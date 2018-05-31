import 'isomorphic-fetch'
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
import Privacy from '../components/Privacy'
import * as cookie from '../services/cookie'
import { withStyles } from 'material-ui/styles'
import { Route, withRouter } from 'react-router-dom'

import { connect } from 'react-redux'
import { mapDispatchToProps } from '../actions'

const homePath = '/(starred|unsubscribe/.+)?'
const homePathRegExp = new RegExp(`^${homePath}$`)
class App extends PureComponent {
  skip = () => {
    cookie.set('dontShowIntro', 1)
    this.props.setShowIntro('n')
  }

  showIntro = () => {
    this.props.setShowIntro('y')
  }

  render () {
    const { classes, signedIn, email, signOut, showIntro, location } = this.props
    const isHome = homePathRegExp.test(location.pathname)
    return (
      <div className={classes.app}>
        <div className={classes.contentContainer + ' ' + (showIntro === 'n' || !isHome ? classes.contentOn : '')}>
          <div className={classes.content}>
            <Header className={classes.block} email={email} signOut={signOut} />
            <Route exact path={homePath} render={() => <div>
              <RepoAdd className={`${classes.block} ${classes.maxWidth}`} />
              <div className={`${classes.container} ${classes.maxWidth}`}>
                <Repos className={`${classes.block} ${classes.repos}`} />
                {!signedIn && <SignIn className={classes.block} />}
              </div>
            </div>}/>
            <Route path="/privacy" render={() =>
              <Privacy className={`${classes.block} ${classes.maxWidthWide}`}/>
            }/>
          </div>
          <Footer className={classes.block} watchIntro={this.showIntro}></Footer>
        </div>
        <Starred />
        <UnwatchMessage />
        <div className={
          classes.introContainer + ' ' +
          (showIntro === 'y' && isHome ?
            classes.introOn :
            classes.introOff
          )
        }>
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
    this.possiblyShowStarred();
    window.location.pathname.match(/^\/(privacy)?$/) || window.history.pushState(null, '', '/')
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

const styles = theme => {
  const maxWidth = {
    boxSizing: 'border-box',
    marginLeft: 'auto',
    marginRight: 'auto',
    maxWidth: '600px',
    position: 'relative'
  }
  return ({
    '@global': {
      body: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        margin: 0,
        padding: 0
      },
      'html, body, #root': {
        height: '100%'
      },
      a: {
        color: theme.palette.secondary.main,
        textDecoration: 'none'
      },
      'a.soft': {
        color: 'rgba(0, 0, 0, 0.87)',
        textDecoration: 'none !important'
      },
      'a:hover': {
        textDecoration: 'underline',
        color: theme.palette.secondary.main,
        cursor: 'pointer'
      },
      svg: {
        fill: 'currentColor'
      }
    },
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
    maxWidth,
    maxWidthWide: { ...maxWidth, maxWidth: '1000px' },
    repos: {
      flex: 1
    },
    introContainer: {
      height: '100%',
      left: 0,
      top: 0,
      position: 'absolute',
      width: '100%',
      transition: 'opacity 500ms, top 500ms',
    },
    introOn: {
      opacity: 1,
      zIndex: 10
    },
    introOff: {
      opacity: 0,
      pointerEvents: 'none',
      top: '-500px',
      zIndex: 0
    },
    contentContainer: {
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      opacity: 0,
      overflow: 'auto',
      pointerEvents: 'none',
      paddingTop: '500px',
      transition: 'opacity 500ms, padding-top 500ms',
      width: '100%'
    },
    contentOn: {
      opacity: 1,
      pointerEvents: 'all',
      paddingTop: 0
    },
    content: {
      flex: '1 0 auto'
    }
  })
}

export default withRouter(
  connect(
    state => ({
      email: state.email,
      signedIn: state.signedIn,
      accessToken: state.accessToken,
      showIntro: state.showIntro
    }),
    mapDispatchToProps()
  )(withStyles(styles)(App))
)
