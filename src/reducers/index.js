import { combineReducers } from 'redux'
import { repoAdd } from './repoAdd'
import { watching } from './watching'
import { email } from './email'
import { bufferRepos } from './bufferRepos'
import { savedRepos } from './savedRepos'
import { loggedIn } from './loggedIn'
import { inited } from './inited'

const allButShownRepos = combineReducers({
  email,
  inited,
  repoAdd,
  bufferRepos,
  savedRepos,
  loggedIn,
  watching
})

export function reducer (prevState, action) {
  const state = allButShownRepos(prevState, action)
  const { loggedIn, savedRepos, bufferRepos } = state
  return {
    ...state,
    shownRepos: loggedIn ? savedRepos : bufferRepos
  }
}
