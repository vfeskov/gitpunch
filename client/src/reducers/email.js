export function email (state = '', action) {
  switch (action.type) {
    case 'RECEIVE_SIGN_IN':
    case 'RECEIVE_PROFILE':
      return action.profile.email
    case 'RECEIVE_SIGN_OUT':
      return ''
    default:
      return state
  }
}
