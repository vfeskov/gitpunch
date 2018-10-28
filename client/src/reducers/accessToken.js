import { SIGN_IN, FETCH_PROFILE, SIGN_OUT, SUCCESS } from '../actions'

export default function accessToken (state = '', { type, ...payload }) {
  switch (type) {
    case SIGN_IN[SUCCESS]:
    case FETCH_PROFILE[SUCCESS]:
      return payload.accessToken
    case SIGN_OUT[SUCCESS]:
      return ''
    default:
      return state
  }
}
