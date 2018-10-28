import { SIGN_IN, PATCH_PROFILE, FETCH_PROFILE, SIGN_OUT, UNWATCH, SUCCESS } from '../actions'

export default function watching (state = false, { type, ...payload }) {
  switch (type) {
    case PATCH_PROFILE[SUCCESS]:
      if (typeof payload.watching === 'undefined') {
        return state
      }
      return payload.watching
    case SIGN_IN[SUCCESS]:
    case FETCH_PROFILE[SUCCESS]:
      return payload.watching
    case SIGN_OUT[SUCCESS]:
      return false
    case UNWATCH[SUCCESS]:
      return payload.sameUser ? payload.watching : state
    default:
      return state
  }
}
