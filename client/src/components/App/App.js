import 'isomorphic-fetch'
import 'rc-slider/assets/index.css'
import React, { PureComponent, Fragment } from 'react'
import PropTypes from 'prop-types'
import Repos from '../../containers/Repos'
import SignIn from '../../containers/SignIn'
import RepoAdd from '../../containers/RepoAdd'
import UnwatchMessage from '../../containers/UnwatchMessage'
import Stars from '../../containers/Stars'
import Header from '../Header'
import Footer from '../Footer'
import Intro from '../Intro'
import Privacy from '../Privacy'
import * as cookie from '../../services/cookie'
import withStyles from '@material-ui/core/styles/withStyles'
import { Route } from 'react-router-dom'
import styles from './App-styles'
import CssBaseline from '@material-ui/core/CssBaseline'

const homePath = '/(stars|unsubscribe/.+)?'
const homePathRegExp = new RegExp(`^${homePath}$`)
class App extends PureComponent {
  skip = () => {
    cookie.set('dontShowIntro', 1)
    if (this.props.showIntro !== 'n') {
      this.props.setShowIntro({ state: 'n' })
    }
  }

  showIntro = () => {
    this.props.setShowIntro({ state: 'y' })
  }

  render () {
    const { classes, signedIn, email, signOut, showIntro, location } = this.props
    const isHome = homePathRegExp.test(location.pathname)
    return (
      <Fragment>
        <CssBaseline />
        <div className={classes.app}>
          <div className={classes.contentContainer + ' ' + (showIntro === 'n' || !isHome ? classes.contentOn : '')} id="scroll-container">
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
          <Stars />
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
      </Fragment>
    )
  }

  componentDidMount () {
    const jssStyles = document.getElementById('jss-server-side')
    if (jssStyles && jssStyles.parentNode) {
      jssStyles.parentNode.removeChild(jssStyles)
    }
    this.possiblyUnwatch()
    this.possiblyShowStars()
    window.location.pathname.match(/^\/(privacy)?$/) || window.history.pushState(null, '', '/')
  }

  possiblyUnwatch () {
    const match = window.location.pathname.match(/^\/unsubscribe\/(.+)$/)
    if (!match) { return }
    this.props.unwatch({ lambdajwt: match[1] })
    this.skip()
  }

  possiblyShowStars() {
    if (window.location.pathname !== '/stars') { return }
    this.props.setStarsOpen({ open: true })
    this.skip()
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired,
  email: PropTypes.string.isRequired,
  showIntro: PropTypes.string.isRequired,
  signedIn: PropTypes.bool.isRequired,
  accessToken: PropTypes.string.isRequired,
  signOut: PropTypes.func.isRequired,
  setShowIntro: PropTypes.func.isRequired,
  unwatch: PropTypes.func.isRequired,
  setStarsOpen: PropTypes.func.isRequired,
}

export default withStyles(styles)(App)
