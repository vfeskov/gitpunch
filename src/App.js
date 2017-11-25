import React, { Component } from 'react'
import { Repos, Settings, RepoAdd } from './containers'
import { withStyles } from 'material-ui/styles'

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
          <Repos className={classes.sectionContainer} />
          <Settings className={classes.sectionContainer} />
        </div>
      </div>
    )
  }

  componentDidMount () {
    this.props.fetchUserData()
  }
}

const styles = theme => ({
  app: {
    maxWidth: '1000px',
    margin: '0 auto'
  },
  container: {
    display: 'flex'
  },
  sectionContainer: {
    padding: '20px',
    margin: '10px'
  }
})

const AppComponentWithStyles = withStyles(styles)(AppComponent)

export const App = connect(
  state => ({ user: state.user }),
  dispatch => bindActionCreators(actionCreators, dispatch)
)(AppComponentWithStyles)
