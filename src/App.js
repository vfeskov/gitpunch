import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  fetchUserData,
  createRepo,
  deleteRepo,
  addRepoToBuffer,
  removeRepoFromBuffer,
  logout,
  register
} from './actions'
import { AddRepo }  from './AddRepo/container'
import { Repos } from './components'
import Button from 'material-ui/Button'
import Paper from 'material-ui/Paper'

class AppComponent extends Component {
  render() {
    const { repos, buffer, loggedIn, onLogout, onRegister } = this.props
    const shownRepos = loggedIn ? repos : buffer
    const reposTitle = !shownRepos.length ?
      'Not watching any repo yet' :
      loggedIn ?
        'Watching' :
        'Register to start watching'
    return (
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <AddRepo onConfirm={repo => this.addRepo(repo)} />
        <div style={{display: 'flex'}}>
          <Repos repos={shownRepos} title={reposTitle} onRemove={repo => this.removeRepo(repo)} />
          <Paper style={{padding: '20px', margin: '10px'}}>
            {loggedIn ? (
            <Button raised onClick={onLogout}>
              Logout
            </Button>
            ) : (
            <Button raised onClick={() => onRegister(buffer)}>
              Register
            </Button>
            )}
          </Paper>
        </div>
      </div>
    )
  }

  componentDidMount() {
    this.props.onInit()
  }

  addRepo(repo) {
    const { loggedIn, onCreateRepo, onAddRepoToBuffer } = this.props
    loggedIn ? onCreateRepo(repo) : onAddRepoToBuffer(repo)
  }

  removeRepo(repo) {
    const { loggedIn, onDeleteRepo, onRemoveRepoFromBuffer } = this.props
    loggedIn ? onDeleteRepo(repo) : onRemoveRepoFromBuffer(repo)
  }
}

export const App = connect(
  state => ({
    repos: state.repos,
    buffer: state.buffer,
    loggedIn: state.loggedIn
  }),
  dispatch => ({
    onCreateRepo: repo => dispatch(createRepo(repo)),
    onDeleteRepo: repo => dispatch(deleteRepo(repo)),
    onAddRepoToBuffer: repo => dispatch(addRepoToBuffer(repo)),
    onRemoveRepoFromBuffer: repo => dispatch(removeRepoFromBuffer(repo)),
    onInit: () => dispatch(fetchUserData()),
    onLogout: () => dispatch(logout()),
    onRegister: buffer => dispatch(register(buffer))
  })
)(AppComponent)
