import { combineReducers } from 'redux'
import { repoAdd } from './repoAdd'
import { watching } from './watching'
import { email } from './email'
import { user } from './user'
import { inited } from './inited'

export const reducer = combineReducers({
  email,
  inited,
  repoAdd,
  user,
  watching
})
