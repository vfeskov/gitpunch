import React, { Component } from 'react'
import Dialog, { DialogActions, DialogContent, DialogTitle, withMobileDialog } from 'material-ui/Dialog'
import { withStyles } from 'material-ui/styles'
import Button from 'material-ui/Button'
import IconButton from 'material-ui/IconButton'
import CloseIcon from 'material-ui-icons/Close'
import Switch from 'material-ui/Switch'
import { CircularProgress } from 'material-ui/Progress';
import { connect } from 'react-redux'
import { StarIcon } from '../components/icons'
import { setStarredOpen, addRepo, removeRepo, watchAllStarredRepos } from '../actions'
import { loadStarredFirstPage, loadStarredLink } from '../services/github'
const { assign } = Object

const emptyState = {
  links: {},
  repos: [],
  accessToken: '',
  starred: [],
  loading: false,
  loadedOnce: false
}

class StarredDialog extends Component {
  constructor (props) {
    super(props)
    this.state = {...emptyState}
    this.componentWillReceiveProps(props)
  }

  render () {
    const { classes, starredOpen, starredWorking, setStarredOpen, fullScreen, width, watchAllStarredRepos } = this.props
    const { starred, links, loading, loadedOnce } = this.state
    return (
      <Dialog
        aria-labelledby="starred-dialog-title"
        onClose={() => setStarredOpen(false)}
        open={starredOpen}
        fullScreen={fullScreen}
        width={width}
      >
        <DialogTitle id="starred-dialog-title">
          <div className={classes.title}>
            <span>Watch {StarIcon()} Starred</span>
            <span style={{ flex: 1 }}></span>
            <IconButton color="inherit" onClick={() => setStarredOpen(false)} aria-label="Close">
              <CloseIcon />
            </IconButton>
          </div>
        </DialogTitle>
        <DialogContent id="starred-dialog-content">
          {starred.map(repo => (
            <div key={repo.id}>
              <div style={ { display: 'flex', alignItems: 'center' } }>
                <Switch
                  checked={repo.gitpunching}
                  onChange={() => this.toggleGitpunching(repo)}
                />
                <a href={`https://github.com/${repo.full_name}`} className="soft" target="_blank" rel="noopener noreferrer">{repo.full_name}</a>
              </div>
              <div className={classes.description} style={ { color: '#777' } }>{repo.description || 'No description'}</div>
            </div>
          ))}
          {!starred.length && !loading && loadedOnce && 'Looks like you haven\'t starred anything on GitHub yet'}
        </DialogContent>
        {!!starred.length && ([
          <DialogActions key="pagination" classes={{ root: classes.actions }}>
            {['first', 'prev', 'next', 'last'].map(rel => (
              <Button key={rel} disabled={!links[rel]}
                onClick={() => links[rel] && this.load(links[rel])}
              >
                {rel}
              </Button>
            ))}
          </DialogActions>,
          <DialogActions key="select-all" classes={{ root: classes.actions }}>
            <Button variant="raised" color="secondary" style={{ minWidth: '110px' }} onClick={watchAllStarredRepos} disabled={starredWorking}>
              {starredWorking ? (
                <CircularProgress size={19} color="secondary"/>
              ) : (
                <span>Select all</span>
              )}
            </Button>
          </DialogActions>
        ])}
      </Dialog>
    )
  }

  async componentWillReceiveProps (nextProps) {
    const { accessToken, starredOpen, repos } = nextProps
    if (!starredOpen) { return }
    if (accessToken === this.state.accessToken) {
      if (repos !== this.props.repos) {
        this.persist({
          starred: this.appendGitpunching(this.state.starred, repos)
        })
      }
      return
    }
    try {
      if (!accessToken) { throw new Error() }
      this.persist({ loading: true })
      const { links, items = [] } = await loadStarredFirstPage(accessToken)
      this.persist({
        links,
        loading: false,
        accessToken,
        starred: this.appendGitpunching(items, repos),
        loadedOnce: true
      })
    } catch (e) {
      this.persist({ ...emptyState, loadedOnce: true })
    }
  }

  persist (part) {
    this.setState(state => assign(state, part))
  }

  toggleGitpunching (repo) {
    const { full_name, gitpunching } = repo
    gitpunching ? this.props.removeRepo(full_name) : this.props.addRepo(full_name)
  }

  appendGitpunching (starred, repos) {
    if (!starred.length) { return starred }
    return starred.map(repo => {
      repo.gitpunching = repos.indexOf(repo.full_name) > -1
      return repo
    })
  }

  async load (link) {
    try {
      const { items, links } = await loadStarredLink({ link, accessToken: this.state.accessToken })
      this.persist({
        starred: this.appendGitpunching(items, this.props.repos),
        links
      })
      document.getElementById('starred-dialog-content').scrollTop = 0
    } catch (e) {}
  }
}

function styles(theme) {
  return {
    repo: {
      fontSize: '1rem'
    },
    description: {
      fontSize: '0.85rem',
      paddingLeft: '62px'
    },
    title: {
      alignItems: 'center',
      display: 'flex'
    },
    actions: {
      justifyContent: 'center',
      '@global': {
        button: {
          borderRadius: '24px'
        }
      }
    }
  }
}

export default connect(
  state => ({
    accessToken: state.accessToken,
    repos: state.shownRepos,
    starredOpen: state.starredOpen,
    starredWorking: state.starredWorking
  }),
  {
    setStarredOpen,
    addRepo,
    removeRepo,
    watchAllStarredRepos: watchAllStarredRepos.request
  }
)(withMobileDialog({ breakpoint: 'xs' })(withStyles(styles)(StarredDialog)))
