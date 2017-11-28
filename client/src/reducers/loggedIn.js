export function loggedIn (state = false, action) {
  switch (action.type) {
    case 'RECEIVE_LOGIN':
    case 'RECEIVE_REGISTER':
    case 'RECEIVE_PROFILE':
      return true
    case 'RECEIVE_LOGOUT':
      return false
    case 'ERROR_CREATE_REPO':
    case 'ERROR_DELETE_REPO':
    case 'ERROR_PROFILE':
      return action.error.message !== 'Unauthorized'
    default:
      return state
  }
}
