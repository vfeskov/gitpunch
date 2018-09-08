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
  state = {
    confirmationOpen: false,
    sortKey: 'date',
    sortDir: 'desc',
    shownRepos: [],
    repos: [],
    sortedRepos: []
  }

  componentWillReceiveProps ({ shownRepos } = {}) {
    if (this.state.shownRepos === shownRepos) {
      return
    }
    const repos = shownRepos.map(({ repo, muted }) => {
      const repoLC = repo.toLowerCase()
      return { repo, muted, repoLC, name: repoLC.split('/', 2)[1] }
    })
    const sortedRepos = this.sortedRepos(repos, this.state.sortKey, this.state.sortDir)
    this.setState({ ...this.state, shownRepos, repos, sortedRepos })
  }

  handleConfirmationClose = value => {
    value === true && this.props.removeAllRepos()
    this.setState({ confirmationOpen: false })
  }

  sortClass (key) {
    return this.state.sortKey === key ? this.state.sortDir : ''
  }

  sort (key) {
    const { sortKey, sortDir, repos } = this.state
    let dir
    if (sortKey === key) {
      dir = sortDir === 'asc' ? 'desc' : 'asc'
    } else {
      dir = key === 'date' ? 'desc' : 'asc'
    }
    this.setState({
      ...this.state,
      sortKey: key,
      sortDir: dir,
      sortedRepos: this.sortedRepos(repos, key, dir)
    })
  }

  sortedRepos (repos, sortKey, sortDir) {
    if (sortKey === 'date') {
      return sortDir === 'desc' ? repos : [...repos].reverse()
    }
    if (sortKey === 'org') {
      return [...repos].sort(sorter('repoLC'))
    }
    if (sortKey === 'name') {
      return [...repos].sort(sorter('name'))
    }
    return repos

    function sorter (key) {
      return (a, b) => {
        if (a[key] < b[key]) return sortDir === 'asc' ? -1 : 1;
        if (a[key] > b[key]) return sortDir === 'asc' ? 1 : -1;
        return 0;
      }
    }
  }

  render () {
    const { classes, ...headerProps } = this.props
    const { className, removeRepo, muteRepo, unwatchingNonstars, starsWorking, muteAllRepos } = this.props
    const { sortedRepos } = this.state
    const allMuted = sortedRepos.every(({ muted }) => muted)
    return (
      <div className={`${className} ${classes.container}`}>
        <Header {...headerProps} />
        {sortedRepos.length > 2 && <div className={classes.itemsHeader}>
          <span className={classes.sorting}>
            Sort by <a className={this.sortClass('org')} onClick={() => this.sort('org')}>org</a>/<a className={this.sortClass('name')} onClick={() => this.sort('name')}>name</a> or <a className={this.sortClass('date')} onClick={() => this.sort('date')}>date</a>
          </span>
          <span style={{ flex: 1 }}></span>
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
        {sortedRepos.map(({ repo, muted }) =>
          <div className={classes.item} key={repo}>
            <span className={muted ? classes.muted : ''}>{repo}</span>
            <span style={{ flex: 1 }}></span>
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
  },
  sorting: {
    '@global': {
      a: {
        display: 'inline-block',
        position: 'relative',
        '&.asc::after, &.desc::after': {
          content: '"▾"',
          left: '0',
          position: 'absolute',
          right: '0',
          textAlign: 'center',
          top: '12px'
        },
        '&.asc::after': {
          top: '14px',
          transform: 'rotate(180deg)'
        }
      }
    }
  },
})

export default withStyles(styles)(Repos)
