import { combineReducers } from 'redux'
import AddRepo from '../AddRepo/reducer'
import { repos } from './repos'
import { loggedIn } from './loggedIn'
import { buffer } from './buffer'

export const rootReducer = combineReducers({
  AddRepo,
  repos,
  loggedIn,
  buffer
})

export const AddRepoLens = state => state.AddRepo
