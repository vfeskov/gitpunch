import { SIGN_IN, SIGN_OUT, FETCH_PROFILE, PATCH_PROFILE, SUCCESS } from '../actions'
const defaultCheckAt = 0

export default function checkAt (state = defaultCheckAt, { type, ...payload }) {
  switch (type) {
    case SIGN_IN[SUCCESS]:
    case FETCH_PROFILE[SUCCESS]:
      return payload.checkAt || defaultCheckAt
    case PATCH_PROFILE[SUCCESS]:
      return typeof payload.checkAt === 'undefined' ? state : payload.checkAt
    case SIGN_OUT[SUCCESS]:
      return defaultCheckAt
    default:
      return state
  }
}
