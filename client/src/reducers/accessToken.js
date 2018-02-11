import { SIGN_IN, FETCH_PROFILE, SIGN_OUT } from '../actions'

export default function accessToken (state = '', action) {
  switch (action.type) {
    case SIGN_IN.SUCCESS:
    case FETCH_PROFILE.SUCCESS:
      return action.profile.accessToken
    case SIGN_OUT.SUCCESS:
      return ''
    default:
      return state
  }
}
