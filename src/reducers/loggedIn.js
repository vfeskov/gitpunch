export function loggedIn (state = false, action) {
  switch (action.type) {
    case 'RECEIVE_LOGOUT':
    case 'ERROR_USER_DATA':
      return false
    case 'RECEIVE_REPOS':
    case 'RECEIVE_USER_DATA':
      return true
    default:
      return state
  }
}
