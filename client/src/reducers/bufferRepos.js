import { SIGN_IN, FETCH_PROFILE, ADD_REPO_TO_BUFFER, REMOVE_REPO_FROM_BUFFER } from '../actions'

export default function bufferRepos (state = [], action) {
  switch (action.type) {
    case SIGN_IN.SUCCESS:
    case FETCH_PROFILE.SUCCESS:
      return []
    case ADD_REPO_TO_BUFFER:
      return state.includes(action.repo) ? state : [action.repo, ...state]
    case REMOVE_REPO_FROM_BUFFER:
      return state.includes(action.repo) ? state.filter(r => r !== action.repo) : state
    default:
      return state
  }
}
