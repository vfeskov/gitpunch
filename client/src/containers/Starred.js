import React, { Component } from 'react'
import Dialog, { DialogActions, DialogContent, DialogTitle, withMobileDialog } from 'material-ui/Dialog'
import { withStyles } from 'material-ui/styles'
import Button from 'material-ui/Button'
import IconButton from 'material-ui/IconButton'
import CloseIcon from 'material-ui-icons/Close'
import Switch from 'material-ui/Switch'
import { connect } from 'react-redux'
import { setStarredOpen, addRepo, removeRepo } from '../actions'
import { loadStarred, load } from '../services/github'
const { assign } = Object

const emptyState = {
  links: {},
  repos: [],
  accessToken: '',
  starred: [],
  loading: false
}

class StarredDialog extends Component {
  constructor (props) {
    super(props)
    this.state = {...emptyState}
    this.componentWillReceiveProps(props)
  }

  render () {
    const { classes, starredOpen, setStarredOpen, fullScreen, width } = this.props
    const { starred, links } = this.state
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
            Pick starred repos to watch
            <IconButton color="inherit" onClick={() => setStarredOpen(false)} aria-label="Close">
              <CloseIcon />
            </IconButton>
          </div>
        </DialogTitle>
        <DialogContent id="starred-dialog-content">
          {starred.map(repo => (
            <div key={repo.id}>
              <div>
                <Switch
                  checked={repo.winabeering}
                  onChange={() => this.toggleWinabeering(repo)}
                />
                <a href={`https://github.com/${repo.full_name}`} target="_blank" rel="noopener noreferrer">{repo.full_name}</a>
              </div>
              <div className={classes.description}>{repo.description || 'No description'}</div>
            </div>
          ))}
        </DialogContent>
        <DialogActions classes={{ root: classes.actions }}>
          {['first', 'prev', 'next', 'last'].map(rel => (
            <Button key={rel} disabled={!links[rel]}
              onClick={() => links[rel] && this.load(links[rel])}
            >
              {rel}
            </Button>
          ))}
        </DialogActions>
      </Dialog>
    )
  }

  async componentWillReceiveProps (nextProps) {
    const { accessToken, starredOpen, repos } = nextProps
    if (!starredOpen) { return }
    if (accessToken === this.state.accessToken) {
      if (repos !== this.props.repos) {
        this.persist({
          starred: this.appendWinabeering(this.state.starred, repos)
        })
      }
      return
    }
    try {
      if (!accessToken) { throw new Error() }
      this.persist({ loading: true })
      const { links, items = [] } = await loadStarred(accessToken)
      this.persist({
        links,
        loading: false,
        accessToken,
        starred: this.appendWinabeering(items, repos)
      })
    } catch (e) {
      this.persist(emptyState)
    }
  }

  persist (part) {
    this.setState(state => assign(state, part))
  }

  toggleWinabeering (repo) {
    const { full_name, winabeering } = repo
    winabeering ? this.props.removeRepo(full_name) : this.props.addRepo(full_name)
  }

  appendWinabeering (starred, repos) {
    if (!starred.length) { return starred }
    return starred.map(repo => {
      repo.winabeering = repos.indexOf(repo.full_name) > -1
      return repo
    })
  }

  async load (link) {
    try {
      const { items, links } = await load({ link, accessToken: this.state.accessToken })
      this.persist({
        starred: this.appendWinabeering(items, this.props.repos),
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
      display: 'flex',
      justifyContent: 'space-between'
    },
    actions: {
      display: 'flex',
      justifyContent: 'center'
    }
  }
}

export default connect(
  state => ({
    accessToken: state.accessToken,
    repos: state.shownRepos,
    starredOpen: state.starredOpen
  }),
  {
    setStarredOpen,
    addRepo,
    removeRepo
  }
)(withMobileDialog({ breakpoint: 'xs' })(withStyles(styles)(StarredDialog)))
