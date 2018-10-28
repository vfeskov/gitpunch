import { SIGN_IN, SIGN_OUT, FETCH_PROFILE, SUCCESS } from '../actions'

export default function alerted (state = {}, { type, ...payload }) {
  switch (type) {
    case SIGN_IN[SUCCESS]:
    case FETCH_PROFILE[SUCCESS]:
      const { alerted } = payload
      if (!alerted || !Array.isArray(alerted)) { return {} }
      return alerted.reduce((res, [repo, release]) => {
        res[repo] = release
        return res
      }, {})
    case SIGN_OUT[SUCCESS]:
      return {}
    default:
      return state
  }
}
