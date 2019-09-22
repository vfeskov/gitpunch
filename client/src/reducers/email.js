import { SIGN_IN, FETCH_PROFILE, SIGN_OUT, SUCCESS, PATCH_PROFILE } from '../actions'

export default function email (state = '', { type, ...payload }) {
  switch (type) {
    case PATCH_PROFILE[SUCCESS]:
      return payload.email ? payload.email : state
    case SIGN_IN[SUCCESS]:
    case FETCH_PROFILE[SUCCESS]:
      return payload.email
    case SIGN_OUT[SUCCESS]:
      return ''
    default:
      return state
  }
}
