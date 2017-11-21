import { combineReducers } from 'redux'
import { AddRepo } from './AddRepo/reducer'
import { Repos } from './Repos/reducer'
import { Settings } from './Settings/reducer'

export default combineReducers({
  AddRepo,
  Repos,
  Settings
})
