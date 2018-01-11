export function signedIn (state = false, action) {
  switch (action.type) {
    case 'RECEIVE_SIGN_IN':
    case 'RECEIVE_PROFILE':
      return true
    case 'RECEIVE_SIGN_OUT':
    case 'ERROR_PROFILE':
      return false
    case 'ERROR_CREATE_REPO':
    case 'ERROR_DELETE_REPO':
      return action.error.status !== 401
    default:
      return state
  }
}
