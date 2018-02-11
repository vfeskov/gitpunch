import { SIGN_IN, SIGN_OUT, FETCH_PROFILE, SAVE_FREQUENCY, SAVE_CHECK_AT } from '../actions'
const defaultCheckAt = 0

export default function checkAt (state = defaultCheckAt, action) {
  switch (action.type) {
    case SIGN_IN.SUCCESS:
    case FETCH_PROFILE.SUCCESS:
      return action.profile.checkAt || defaultCheckAt
    case SAVE_FREQUENCY.SUCCESS:
    case SAVE_CHECK_AT.SUCCESS:
      return action.checkAt || defaultCheckAt
    case SIGN_OUT.SUCCESS:
      return defaultCheckAt
    default:
      return state
  }
}
