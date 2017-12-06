import React, { Component } from 'react'
import { Repos, Settings, RepoAdd, UnsubscribeMessage } from './containers'
import { withStyles } from 'material-ui/styles'
import PropTypes from 'prop-types'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as actionCreators from './actions'

class AppComponent extends Component {
  render () {
    const { classes } = this.props
    return (
      <div className={classes.app}>
        <RepoAdd className={classes.sectionContainer} />
        <div className={classes.container}>
          <Repos className={`${classes.sectionContainer} ${classes.repos}`} />
          <Settings className={classes.sectionContainer} />
        </div>
        <UnsubscribeMessage />
      </div>
    )
  }

  componentDidMount () {
    const jssStyles = document.getElementById('jss-server-side')
    if (jssStyles && jssStyles.parentNode) {
      jssStyles.parentNode.removeChild(jssStyles)
    }
    const { inited, email, fetchProfile } = this.props
    if (inited) {
      return this.processProfile({ email })
    }
    fetchProfile()
      .then(({ profile = {} }) => this.processProfile(profile))
  }

  processProfile ({ email }) {
    this.possiblyUnsubscribe(email)
    window.location.pathname === '/' || window.history.pushState(null, '', '/')
  }

  possiblyUnsubscribe (email) {
    const { pathname } = window.location
    if (pathname.indexOf('/unsubscribe/') !== 0) { return }
    const lambdajwt = (pathname.match(/^\/unsubscribe\/(.+)$/) || [0, 0])[1]
    if (!lambdajwt) { return }
    this.props.unsubscribe(email, lambdajwt)
  }
}

AppComponent.propTypes = {
  classes: PropTypes.object.isRequired,
  email: PropTypes.string.isRequired,
  inited: PropTypes.bool.isRequired
}

const styles = theme => ({
  app: {
    height: '100%',
    maxWidth: '900px',
    margin: '0 auto'
  },
  container: {
    '@media (min-width:700px)': {
      flexDirection: 'row'
    },
    display: 'flex',
    flexDirection: 'column'
  },
  sectionContainer: {
    '@media (min-width:700px)': {
      padding: theme.spacing.unit * 4,
      margin: theme.spacing.unit * 2
    },
    padding: theme.spacing.unit * 2,
    margin: theme.spacing.unit
  },
  repos: {
    flex: 1
  }
})

const AppComponentWithStyles = withStyles(styles)(AppComponent)

export const App = connect(
  state => ({
    email: state.email,
    inited: state.inited
  }),
  dispatch => bindActionCreators(actionCreators, dispatch)
)(AppComponentWithStyles)
