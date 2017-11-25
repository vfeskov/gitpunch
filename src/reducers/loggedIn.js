export function loggedIn (state = false, action) {
  switch (action.type) {
    case 'RECEIVE_REPLACE_REPOS':
    case 'RECEIVE_USER_DATA':
      return true
    case 'RECEIVE_LOGOUT':
      return false
    case 'ERROR_CREATE_REPO':
    case 'ERROR_REPLACE_REPOS':
    case 'ERROR_DELETE_REPO':
    case 'ERROR_USER_DATA':
      return action.error.message !== 'Unauthorized'
    default:
      return state
  }
}
