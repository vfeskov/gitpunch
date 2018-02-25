import { SET_SHOW_SPLASH } from '../actions'

export default function showIntro (state = '?', action) {
  switch (action.type) {
    case SET_SHOW_SPLASH:
      return action.state
    default:
      return state
  }
}
