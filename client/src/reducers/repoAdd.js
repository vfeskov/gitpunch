import { SET_REPO_ADD_VALUE, ADD_STARS, SUCCESS, REQUEST, FAILURE, CREATE_REPO_IN_BUFFER, CREATE_REPO_IN_DB } from '../actions'
import { combineReducers } from 'redux'

function value (state = '', action) {
  switch (action.type) {
    case SET_REPO_ADD_VALUE:
      return action.value
    case CREATE_REPO_IN_BUFFER:
    case CREATE_REPO_IN_DB[SUCCESS]:
      return ''
    default:
      return state
  }
}

function disabled (state = false, action) {
  switch (action.type) {
    case CREATE_REPO_IN_DB[REQUEST]:
      return true
    case CREATE_REPO_IN_DB[SUCCESS]:
    case CREATE_REPO_IN_DB[FAILURE]:
      return false
    default:
      return state
  }
}

function error (state = null, { type, ...payload }) {
  switch (type) {
    case SET_REPO_ADD_VALUE:
    case CREATE_REPO_IN_DB[REQUEST]:
    case CREATE_REPO_IN_DB[SUCCESS]:
    case ADD_STARS[SUCCESS]:
    case CREATE_REPO_IN_BUFFER:
      return null
    case CREATE_REPO_IN_DB[FAILURE]:
      return payload.error.headers.get('x-error-message')
    default:
      return state
  }
}

export default combineReducers({
  value,
  disabled,
  error
})
