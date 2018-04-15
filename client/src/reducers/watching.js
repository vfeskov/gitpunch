import { SIGN_IN, SAVE_WATCHING, FETCH_PROFILE, SIGN_OUT, UNWATCH, SUCCESS } from '../actions'

export default function watching (state = false, action) {
  switch (action.type) {
    case SAVE_WATCHING[SUCCESS]:
      return action.watching
    case SIGN_IN[SUCCESS]:
    case FETCH_PROFILE[SUCCESS]:
      return action.profile.watching
    case SIGN_OUT[SUCCESS]:
      return false
    case UNWATCH[SUCCESS]:
      return action.sameUser ? action.watching : state
    default:
      return state
  }
}
