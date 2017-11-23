import { combineReducers } from 'redux'
import { repos } from './repos'
import { loggedIn } from './loggedIn'
import { buffer } from './buffer'
import { AddRepo } from '../modules'

export const reducer = combineReducers({
  repos,
  loggedIn,
  buffer,
  ...AddRepo.reducerConfig
})
