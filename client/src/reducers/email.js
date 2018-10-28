import { SIGN_IN, FETCH_PROFILE, SIGN_OUT, SUCCESS } from '../actions'

export default function email (state = '', { type, ...payload }) {
  switch (type) {
    case SIGN_IN[SUCCESS]:
    case FETCH_PROFILE[SUCCESS]:
      return payload.email
    case SIGN_OUT[SUCCESS]:
      return ''
    default:
      return state
  }
}
