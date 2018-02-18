import { SIGN_IN, FETCH_PROFILE, SIGN_OUT, SAVE_FREQUENCY } from '../actions'

const defaultFrequency = 'realtime'

export default function frequency (state = defaultFrequency, action) {
  switch (action.type) {
    case SIGN_IN.SUCCESS:
    case FETCH_PROFILE.SUCCESS:
      return action.profile.frequency || defaultFrequency
    case SAVE_FREQUENCY.SUCCESS:
      return action.frequency
    case SIGN_OUT.SUCCESS:
      return defaultFrequency
    default:
      return state
  }
}
