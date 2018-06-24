import { SET_STARS_OPEN } from '../actions'

export default function starsOpen (state = false, action) {
  switch (action.type) {
    case SET_STARS_OPEN:
      return action.value
    default:
      return state
  }
}
