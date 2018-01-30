const defaultCheckAt = 0

export default function checkAt (state = defaultCheckAt, action) {
  switch (action.type) {
    case 'RECEIVE_SIGN_IN':
    case 'RECEIVE_PROFILE':
      return action.profile.checkAt || defaultCheckAt
    case 'RECEIVE_FREQUENCY':
    case 'RECEIVE_CHECK_AT':
      return action.json.checkAt || defaultCheckAt
    case 'RECEIVE_SIGN_OUT':
      return defaultCheckAt
    default:
      return state
  }
}
