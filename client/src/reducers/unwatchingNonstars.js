import { SIGN_IN, SAVE_WATCHING_STARS, FETCH_PROFILE, SIGN_OUT, SUCCESS } from '../actions'

export default function unwatchingNonstars (state = false, action) {
  switch (action.type) {
    case SAVE_WATCHING_STARS[SUCCESS]:
      return action.watchingStars === 2
    case SIGN_IN[SUCCESS]:
    case FETCH_PROFILE[SUCCESS]:
      return action.profile.watchingStars === 2
    case SIGN_OUT[SUCCESS]:
      return false
    default:
      return state
  }
}
