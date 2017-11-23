import React, { Component } from 'react'
import { createAddRepo }  from './AddRepo/container'
import { AddRepoLens } from './reducers'
import { Repos, Settings } from './components'
import { withStyles } from 'material-ui/styles'
import { styles } from './App.styles'

const AddRepo = createAddRepo(AddRepoLens)

class AppComponent extends Component {
  render() {
    const { classes, repos, buffer, loggedIn, onLogout, onRegister } = this.props
    const shownRepos = loggedIn ? repos : buffer
    const reposTitle = !shownRepos.length ?
      'Not watching any repo yet' :
      loggedIn ?
        'Watching' :
        'Register to start watching'
    return (
      <div className={classes.app}>
        <AddRepo onConfirm={repo => this.addRepo(repo)} />
        <div className={classes.container}>
          <Repos
            repos={shownRepos}
            title={reposTitle}
            onRemove={repo => this.removeRepo(repo)} />
          <Settings
            loggedIn={loggedIn}
            onLogout={onLogout}
            onRegister={() => onRegister(buffer)} />
        </div>
      </div>
    )
  }

  componentDidMount() {
    this.props.onInit()
  }

  addRepo(repo) {
    const { loggedIn, onCreateRepo, onAddRepoToBuffer } = this.props
    return loggedIn ? onCreateRepo(repo) : onAddRepoToBuffer(repo)
  }

  removeRepo(repo) {
    const { loggedIn, onDeleteRepo, onRemoveRepoFromBuffer } = this.props
    return loggedIn ? onDeleteRepo(repo) : onRemoveRepoFromBuffer(repo)
  }
}

export const App = withStyles(styles)(AppComponent)
