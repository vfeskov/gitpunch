import { END } from 'redux-saga'

export default function serverRendered (state = false, action) {
  if (action === END) { return true }
  return state
}
