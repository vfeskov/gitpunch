import { SIGN_IN, FETCH_PROFILE, SIGN_OUT, isRequestFailure } from '../actions'

export default function signedIn (state = false, action) {
  switch (action.type) {
    case SIGN_IN.SUCCESS:
    case FETCH_PROFILE.SUCCESS:
      return true
    case SIGN_IN.FAILURE:
    case FETCH_PROFILE.FAILURE:
    case SIGN_OUT.SUCCESS:
      return false
    default:
      return isRequestFailure(action) ? action.error.status !== 401 : state
  }
}
