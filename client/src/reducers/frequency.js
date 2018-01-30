const defaultFrequency = 'hourly'

export default function frequency (state = defaultFrequency, action) {
  switch (action.type) {
    case 'RECEIVE_SIGN_IN':
    case 'RECEIVE_PROFILE':
      return action.profile.frequency || defaultFrequency
    case 'RECEIVE_FREQUENCY':
      return action.json.frequency
    case 'RECEIVE_SIGN_OUT':
      return defaultFrequency
    default:
      return state
  }
}
