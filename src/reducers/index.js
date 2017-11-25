import { combineReducers } from 'redux'
import { addRepo } from './addRepo'
import { repos } from './repos'
import { loggedIn } from './loggedIn'
import { buffer } from './buffer'
import { AddRepo as AddRepoModule } from '../modules'

export const reducer = combineReducers({
  addRepo,
  repos,
  loggedIn,
  buffer,
  ...AddRepoModule.reducerConfig
})
