import { combineReducers } from 'redux'
import { AddRepo } from '../AddRepo/reducer'
import { repos } from './repos'
import { loggedIn } from './loggedIn'
import { buffer } from './buffer'

export default combineReducers({
  AddRepo,

  repos,
  loggedIn,
  buffer
})
