import { combineReducers } from 'redux'
import { repoAdd } from './repoAdd'
import { user } from './user'
import { inited } from './inited'

export const reducer = combineReducers({
  inited,
  repoAdd,
  user
})
