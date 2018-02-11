import { UNWATCH } from '../actions'

export default function unwatchMessage (state = null, action) {
  switch (action.type) {
    case UNWATCH.FAILURE:
      return { success: false }
    case UNWATCH.SUCCESS:
      return {
        sameUser: action.sameUser,
        success: true
      }
    default:
      return state
  }
}
