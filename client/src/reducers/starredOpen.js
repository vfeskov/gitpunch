import { SET_STARRED_OPEN } from '../actions'

export default function starredOpen (state = false, action) {
  switch (action.type) {
    case SET_STARRED_OPEN:
      return action.value
    default:
      return state
  }
}
