import { WATCH_ALL_STARRED_REPOS, REQUEST, SUCCESS, FAILURE } from '../actions'

export default function starredWorking (state = false, action) {
  switch (action.type) {
    case WATCH_ALL_STARRED_REPOS[REQUEST]:
      return true
    case WATCH_ALL_STARRED_REPOS[FAILURE]:
    case WATCH_ALL_STARRED_REPOS[SUCCESS]:
      return false
    default:
      return state
  }
}
