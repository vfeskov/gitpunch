import { combineReducers } from 'redux'
import { repoAdd } from './repoAdd'
import { user } from './user'

export const reducer = combineReducers({
  repoAdd,
  user
})
