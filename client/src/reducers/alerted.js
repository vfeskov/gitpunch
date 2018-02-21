import { SIGN_IN, SIGN_OUT, FETCH_PROFILE } from '../actions'

export default function alerted (state = {}, action) {
  switch (action.type) {
    case SIGN_IN.SUCCESS:
    case FETCH_PROFILE.SUCCESS:
      const { alerted } = action.profile
      if (!alerted || !Array.isArray(alerted)) { return {} }
      return alerted.reduce((res, [repo, release]) => {
        res[repo] = release
        return res
      }, {})
    case SIGN_OUT.SUCCESS:
      return {}
    default:
      return state
  }
}
