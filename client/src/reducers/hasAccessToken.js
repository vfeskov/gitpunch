export default function hasAccessToken (state = false, action) {
  switch (action.type) {
    case 'RECEIVE_SIGN_IN':
    case 'RECEIVE_PROFILE':
      return action.profile.hasAccessToken
    case 'RECEIVE_SIGN_OUT':
      return false
    default:
      return state
  }
}
