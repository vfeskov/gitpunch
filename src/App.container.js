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
import { App as AppComponent } from './App.component'

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
