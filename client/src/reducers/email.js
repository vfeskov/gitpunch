export function email (state = false, action) {
  switch (action.type) {
    case 'RECEIVE_REGISTER':
    case 'RECEIVE_LOGIN':
    case 'RECEIVE_PROFILE':
      return action.profile.email
    case 'RECEIVE_LOGOUT':
      return ''
    default:
      return state
  }
}
