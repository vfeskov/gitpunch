import { SIGN_IN, PATCH_PROFILE, FETCH_PROFILE, SIGN_OUT, SUCCESS } from '../actions'

export default function watchingStars (state = false, { type, ...payload }) {
  switch (type) {
    case PATCH_PROFILE[SUCCESS]:
      if (typeof payload.watchingStars === 'undefined') {
        return state
      }
      return !!payload.watchingStars
    case SIGN_IN[SUCCESS]:
    case FETCH_PROFILE[SUCCESS]:
      return !!payload.watchingStars
    case SIGN_OUT[SUCCESS]:
      return false
    default:
      return state
  }
}
