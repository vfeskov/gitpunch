import { combineReducers } from 'redux'
import { repoAdd } from './repoAdd'
import { watching } from './watching'
import { email } from './email'
import { bufferRepos } from './bufferRepos'
import { savedRepos } from './savedRepos'
import { signedIn } from './signedIn'
import { inited } from './inited'
import { unsubscribeMessage } from './unsubscribeMessage'
import hasAccessToken from './hasAccessToken'
import frequency from './frequency'
import checkAt from './checkAt'

const allButShownRepos = combineReducers({
  email,
  inited,
  repoAdd,
  bufferRepos,
  savedRepos,
  signedIn,
  watching,
  unsubscribeMessage,
  hasAccessToken,
  frequency,
  checkAt
})

export function reducer (prevState, action) {
  const state = allButShownRepos(prevState, action)
  const { signedIn, savedRepos, bufferRepos } = state
  return {
    ...state,
    shownRepos: signedIn ? savedRepos : bufferRepos
  }
}
