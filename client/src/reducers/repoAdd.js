import { combineReducers } from 'redux'

export const repoAdd = combineReducers({
  value,
  disabled
})

function value (state = '', action) {
  switch (action.type) {
    case 'SET_REPO_ADD_VALUE':
      return action.value
    case 'ADD_REPO_TO_BUFFER':
    case 'RECEIVE_CREATE_REPO':
      return ''
    default:
      return state
  }
}

function disabled (state = false, action) {
  switch (action.type) {
    case 'REQUEST_CREATE_REPO':
      return true
    case 'RECEIVE_CREATE_REPO':
    case 'ERROR_CREATE_REPO':
      return false
    default:
      return state
  }
}
