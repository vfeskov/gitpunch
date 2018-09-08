import React, { Component } from 'react'
import DeleteIcon from '@material-ui/icons/Delete'
import NotificationsActiveIcon from '@material-ui/icons/NotificationsActive'
import NotificationsOffIcon from '@material-ui/icons/NotificationsOff'
import LaunchIcon from '@material-ui/icons/Launch'
import withStyles from '@material-ui/core/styles/withStyles'
import PropTypes from 'prop-types'
import Header, { propTypes as HeaderPropTypes } from './ReposHeader'
import ReposConfirmDeleteAll from './ReposConfirmDeleteAll'

class Repos extends Component {
  state = { confirmationOpen: false }

  handleConfirmationClose = value => {
    value === true && this.props.removeAllRepos()
    this.setState({ confirmationOpen: false })
  }

  render () {
    const { classes, ...headerProps } = this.props
    const { className, removeRepo, shownRepos, muteRepo, unwatchingNonstars, starsWorking, muteAllRepos } = this.props
    const allMuted = shownRepos.every(({ muted }) => muted)
    return (
      <div className={`${className} ${classes.container}`}>
        <Header {...headerProps} />
        {shownRepos.length > 1 && <div className={classes.itemsHeader}>
          <div style={{ flex: 1 }}></div>
          <button className="action" aria-label={allMuted ? 'Unmute All' : 'Mute All'} onClick={() => muteAllRepos(!allMuted)}>
            {allMuted ? <NotificationsOffIcon /> : <NotificationsActiveIcon />}
          </button>
          {unwatchingNonstars ||
          <button
            className={`${classes.deleteButton} action`}
            aria-label="Remove All"
            onClick={() => this.setState({ confirmationOpen: true })}
            disabled={starsWorking}
          >
            <DeleteIcon />
          </button>
          }
        </div>}
        {shownRepos.map(({ repo, muted }) =>
          <div className={classes.item} key={repo}>
            <span className={muted ? classes.muted : ''}>{repo}</span>
            <div style={{ flex: 1 }}></div>
            <a className="action" target="_blank" rel="noopener noreferrer" title="Open on GitHub" href={`https://github.com/${repo}`}>
              <LaunchIcon />
            </a>
            <button className="action" aria-label={muted ? 'Unmute' : 'Mute'} onClick={() => muteRepo(repo, !muted)}>
              {muted ? <NotificationsOffIcon /> : <NotificationsActiveIcon />}
            </button>
            {unwatchingNonstars ||
            <button
              className={`${classes.deleteButton} action`}
              aria-label="Remove"
              onClick={() => removeRepo(repo)}
            >
              <DeleteIcon />
            </button>
            }
            {/* {alerted[repo] &&
              <a
                href={`https://github.com/${repo}/releases/tag/${alerted[repo]}`}
                target="_blank"
                rel="noopener noreferrer"
                className={classes.releaseLink}
              >
                {alerted[repo]}
              </a>
            } */}
          </div>
        )}
        <ReposConfirmDeleteAll
          open={this.state.confirmationOpen}
          onClose={this.handleConfirmationClose}
        />
      </div>
    )
  }
}


Repos.propTypes = {
  alerted: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  className: PropTypes.string,
  removeRepo: PropTypes.func.isRequired,
  removeAllRepos: PropTypes.func.isRequired,
  muteAllRepos: PropTypes.func.isRequired,
  shownRepos: PropTypes.arrayOf(PropTypes.object).isRequired,
  unwatchingNonstars: PropTypes.bool.isRequired,
  ...HeaderPropTypes
}

const styles = theme => ({
  container: {
    [theme.breakpoints.down('xs')]: {
      textAlign: 'center'
    }
  },
  itemsHeader: {
    alignItems: 'center',
    display: 'flex',
    minHeight: '48px',
    '@global': {
      '.action': {
        marginLeft: theme.spacing.unit
      }
    }
  },
  item: {
    alignItems: 'center',
    display: 'flex',
    minHeight: '48px',
    '@global': {
      '.action': {
        marginLeft: theme.spacing.unit,
        visibility: 'hidden'
      }
    },
    '&:hover': {
      background: 'rgba(53,114,156,0.075)',
      borderRadius: '24px',
      margin: '0 -10px',
      padding: '0 10px',
      '@global': {
        '.action': {
          visibility: 'visible'
        }
      }
    }
  },
  releaseLink: {
    fontSize: '0.8em'
  },
  deleteButton: {
    '&:hover, &:focus, &:active': {
      color: `${theme.palette.error.main} !important`
    },
    '&[disabled]': {
      color: `${theme.palette.primary[500]} !important`
    }
  },
  muted: {
    color: theme.palette.primary[500],
    textDecoration: 'line-through'
  },
  buttonContainer: {
    textAlign: 'right',
    [theme.breakpoints.down('xs')]: {
      textAlign: 'left'
    }
  }
})

export default withStyles(styles)(Repos)
