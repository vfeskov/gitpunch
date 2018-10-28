import { SIGN_IN, FETCH_PROFILE, SIGN_OUT, PATCH_PROFILE, SUCCESS } from '../actions'

const defaultFrequency = 'realtime'

export default function frequency (state = defaultFrequency, { type, ...payload }) {
  switch (type) {
    case SIGN_IN[SUCCESS]:
    case FETCH_PROFILE[SUCCESS]:
      return payload.frequency || defaultFrequency
    case PATCH_PROFILE[SUCCESS]:
      return typeof payload.frequency === 'undefined' ? state : payload.frequency
    case SIGN_OUT[SUCCESS]:
      return defaultFrequency
    default:
      return state
  }
}
