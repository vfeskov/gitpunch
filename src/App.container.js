import { connect } from 'react-redux'
import {
  fetchUserData,
  createRepo,
  deleteRepo,
  addRepoToBuffer,
  removeRepoFromBuffer,
  logout,
  register,
  setAddRepoValue
} from './actions'
import { App as AppComponent } from './App.component'

export const App = connect(
  state => ({
    repos: state.repos,
    buffer: state.buffer,
    loggedIn: state.loggedIn,
    addRepo: state.addRepo
  }),
  dispatch => ({
    onAddRepoValueChange: value => dispatch(setAddRepoValue(value)),
    onCreateRepo: repo => dispatch(createRepo(repo)),
    onDeleteRepo: repo => dispatch(deleteRepo(repo)),
    onAddRepoToBuffer: repo => dispatch(addRepoToBuffer(repo)),
    onRemoveRepoFromBuffer: repo => dispatch(removeRepoFromBuffer(repo)),
    onInit: () => dispatch(fetchUserData()),
    onLogout: () => dispatch(logout()),
    onRegister: buffer => dispatch(register(buffer))
  })
)(AppComponent)
