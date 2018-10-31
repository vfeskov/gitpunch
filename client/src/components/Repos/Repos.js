import React, { Component } from 'react'
import DeleteIcon from '@material-ui/icons/Delete'
import NotificationsActiveIcon from '@material-ui/icons/NotificationsActive'
import NotificationsOffIcon from '@material-ui/icons/NotificationsOff'
import LaunchIcon from '@material-ui/icons/Launch'
import withStyles from '@material-ui/core/styles/withStyles'
import PropTypes from 'prop-types'
import Header, { propTypes as HeaderPropTypes } from './ReposHeader'
import ReposConfirmDeleteAll from './ReposConfirmDeleteAll'
import Slider from 'rc-slider'

const filterTexts = {
  0: 'Major',
  1: 'Minor',
  2: 'Patch',
  3: 'All'
}

class Repos extends Component {
  state = {
    confirmationOpen: false,
    sortKey: 'date',
    sortDir: 'desc'
  }

  handleConfirmationClose = value => {
    value === true && this.props.deleteAllRepos()
    this.setState({ confirmationOpen: false })
  }

  sortClass (key) {
    return this.state.sortKey === key ? this.state.sortDir : ''
  }

  sort (key) {
    const { sortKey, sortDir } = this.state
    let dir
    if (sortKey === key) {
      dir = sortDir === 'asc' ? 'desc' : 'asc'
    } else {
      dir = key === 'date' ? 'desc' : 'asc'
    }
    this.setState({
      ...this.state,
      sortKey: key,
      sortDir: dir
    })
  }

  sortedRepos () {
    const { shownRepos: repos } = this.props
    if (!repos || !repos.length) {
      return repos
    }
    const { sortKey, sortDir } = this.state
    if (sortKey === 'date') {
      return sortDir === 'desc' ? repos : [...repos].reverse()
    }
    if (sortKey === 'org') {
      return [...repos].sort((a, b) =>
        sorter(
          a.repo.toLowerCase(),
          b.repo.toLowerCase()
        )
      )
    }
    if (sortKey === 'name') {
      return [...repos].sort((a, b) =>
        sorter(
          a.repo.split('/', 2)[1].toLowerCase(),
          b.repo.split('/', 2)[1].toLowerCase()
        )
      )
    }
    return repos

    function sorter (a, b) {
      if (a < b) return sortDir === 'asc' ? -1 : 1;
      if (a > b) return sortDir === 'asc' ? 1 : -1;
      return 0;
    }
  }

  selectRepo (repo) {
    this.setState({
      ...this.state,
      selectedRepo: this.state.selectedRepo === repo ? null : repo
    })
  }

  filterBadge (filter) {
    switch (filter) {
      case 0: return 'Ma'
      case 1: return 'Mi'
      case 2: return 'Pa'
      case 3: return 'Al'
    }
  }

  filterDesc (filter) {
    const base = 'You\'ll be notified about '
    switch (filter) {
      case 0: return base + 'major releases, pattern: *.0.0'
      case 1: return base + 'major & minor releases, pattern: *.*.0'
      case 2: return base + 'major, minor & patch releases, pattern: *.*.*'
      case 3: return base + 'all releases'
    }
  }

  render () {
    const { classes, ...headerProps } = this.props
    const { className, deleteRepo, patchRepo, unwatchingNonstars, starsWorking, patchAllRepos, selectedRepo, selectRepo } = this.props
    const sortedRepos = this.sortedRepos()
    const allMuted = sortedRepos.every(({ muted }) => muted)
    return (
      <div className={`${className} ${classes.container}`}>
        <Header {...headerProps} />
        {sortedRepos.length > 2 && <div className={classes.itemsHeader}>
          <span className={classes.sorting}>
            Sort by <a className={this.sortClass('org')} onClick={() => this.sort('org')}>org</a>/<a className={this.sortClass('name')} onClick={() => this.sort('name')}>name</a> or <a className={this.sortClass('date')} onClick={() => this.sort('date')}>date</a>
          </span>
          <span style={{ flex: 1 }}></span>
          <button
            className="action"
            aria-label={allMuted ? 'Unmute All' : 'Mute All'}
            onClick={() => patchAllRepos({ muted: !allMuted })}
            disabled={starsWorking}
          >
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
        {sortedRepos.map(r => {
          const { repo, muted, filter = 3 } = r
          return <div className={classes.item + (selectedRepo === repo ? ' ' + classes.selected : '')} key={repo}>
            <div className={classes.itemTop} onClick={() => selectRepo({ repo })}>
              <span className={muted ? classes.muted : ''}>{repo}</span>
              <span className={classes.filterBadge + ' ' + classes[`filterBadge${filter}`]}>
                {this.filterBadge(filter)}
              </span>
              <span style={{ flex: 1 }}></span>
              <a className="action" target="_blank" rel="noopener noreferrer" title="Open on GitHub" href={`https://github.com/${repo}`} onClick={(event) => event.stopPropagation()}>
                <LaunchIcon />
              </a>
              <button className="action" aria-label={muted ? 'Unmute' : 'Mute'} onClick={(event) => { event.stopPropagation(); patchRepo({ ...r, muted: !muted }) }} testid="mute-repo">
                {muted ? <NotificationsOffIcon /> : <NotificationsActiveIcon />}
              </button>
              {unwatchingNonstars ||
              <button
                className={`${classes.deleteButton} action`}
                aria-label="Remove"
                onClick={(event) => { event.stopPropagation(); deleteRepo(r) }}
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
            {selectedRepo === repo && (
            <div>
              <div className={classes.filterSlider}>
                <Slider
                  dots
                  min={0}
                  max={3}
                  marks={filterTexts}
                  value={filter}
                  onChange={value => patchRepo({ repo, filter: value })}
                />
              </div>
            </div>
            )}
          </div>
        })}
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
  patchRepo: PropTypes.func.isRequired,
  deleteRepo: PropTypes.func.isRequired,
  deleteAllRepos: PropTypes.func.isRequired,
  patchAllRepos: PropTypes.func.isRequired,
  shownRepos: PropTypes.arrayOf(PropTypes.object).isRequired,
  unwatchingNonstars: PropTypes.bool.isRequired,
  ...HeaderPropTypes
}

const styles = theme => {
  const itemHover = {
    background: 'rgba(53,114,156,0.075)',
    borderRadius: '24px',
    margin: '4px -10px',
    padding: '0 10px',
    '@global': {
      '.action': {
        visibility: 'visible'
      }
    }
  }
  return {
    container: {
      [theme.breakpoints.down('xs')]: {
        textAlign: 'center'
      }
    },
    itemsHeader: {
      alignItems: 'center',
      display: 'flex',
      fontSize: '0.9em',
      minHeight: '48px',
      '@global': {
        '.action': {
          marginLeft: theme.spacing.unit
        }
      }
    },
    item: {
      margin: '4px 0',
      '@global': {
        '.action': {
          marginLeft: theme.spacing.unit,
          // visibility: 'hidden'
        }
      },
      '&:hover': itemHover
    },
    itemTop: {
      alignItems: 'center',
      cursor: 'pointer',
      display: 'flex',
      minHeight: '48px',
    },
    selected: {
      ...itemHover
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
            top: '10px'
          },
          '&.asc::after': {
            top: '12px',
            transform: 'rotate(180deg)'
          }
        }
      }
    },
    filterBadge: {
      borderRadius: '8px',
      color: '#fafafa',
      fontSize: '10px',
      height: '16px',
      lineHeight: '16px',
      marginLeft: '4px',
      textAlign: 'center',
      width: '16px'
    },
    filterBadge0: {
      background: '#ff8000'
    },
    filterBadge1: {
      background: '#a335ee'
    },
    filterBadge2: {
      background: '#0070dd'
    },
    filterBadge3: {
      background: '#9d9d9d'
    },
    filterSlider: {
      padding: '8px 24px 32px'
    },
    filterDesc: {
      fontSize: '12px',
      paddingBottom: '10px'
    }
  }
}

export default withStyles(styles)(Repos)
