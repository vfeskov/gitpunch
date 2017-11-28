import React, { Component } from 'react'
import { Repos, Settings, RepoAdd } from './containers'
import { withStyles } from 'material-ui/styles'
import PropTypes from 'prop-types'
import { CircularProgress } from 'material-ui/Progress'
import Typography from 'material-ui/Typography'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as actionCreators from './actions'

class AppComponent extends Component {
  render () {
    const { classes, inited } = this.props
    return (
      <div className={classes.app}>
        {inited ? (
        <div>
          <RepoAdd className={classes.sectionContainer} />
          <div className={classes.container}>
            <Repos className={`${classes.sectionContainer} ${classes.repos}`} />
            <Settings className={classes.sectionContainer} />
          </div>
        </div>
        ) : (
        <div className={classes.progressContainer}>
          <Typography type="headline">Win A Beer</Typography>
          <CircularProgress />
        </div>
        )}
      </div>
    )
  }

  componentDidMount () {
    this.props.fetchProfile()
  }
}

AppComponent.propTypes = {
  classes: PropTypes.object.isRequired,
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
  progressContainer: {
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column'
  },
  repos: {
    flex: 1
  }
})

const AppComponentWithStyles = withStyles(styles)(AppComponent)

export const App = connect(
  state => ({ inited: state.inited }),
  dispatch => bindActionCreators(actionCreators, dispatch)
)(AppComponentWithStyles)
