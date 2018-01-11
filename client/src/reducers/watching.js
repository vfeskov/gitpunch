export function watching (state = false, action) {
  switch (action.type) {
    case 'RECEIVE_WATCHING':
      return action.json.watching
    case 'RECEIVE_SIGN_IN':
    case 'RECEIVE_PROFILE':
      return action.profile.watching
    case 'RECEIVE_SIGN_OUT':
      return false
    case 'RECEIVE_UNSUBSCRIBE':
      return action.payloadEmail === action.currentEmail ? false : state
    default:
      return state
  }
}
