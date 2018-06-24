import { ADD_STARS, REQUEST, SUCCESS, FAILURE } from '../actions'

export default function starsWorking (state = false, action) {
  switch (action.type) {
    case ADD_STARS[REQUEST]:
      return true
    case ADD_STARS[FAILURE]:
    case ADD_STARS[SUCCESS]:
      return false
    default:
      return state
  }
}
