import { SIGN_IN, FETCH_PROFILE, ADD_REPO_TO_BUFFER, REMOVE_REPO_FROM_BUFFER, SUCCESS, MUTE_REPO_IN_BUFFER, MUTE_ALL_REPOS_IN_BUFFER, REMOVE_ALL_REPOS_FROM_BUFFER } from '../actions'

export default function bufferRepos (state = [], action) {
  switch (action.type) {
    case SIGN_IN[SUCCESS]:
    case FETCH_PROFILE[SUCCESS]:
    case REMOVE_ALL_REPOS_FROM_BUFFER:
      return []
    case ADD_REPO_TO_BUFFER:
      return state.find(r => r.repo === action.repo) ? state : [{ repo: action.repo, muted: false }, ...state]
    case REMOVE_REPO_FROM_BUFFER:
      return state.find(r => r.repo === action.repo) ? state.filter(r => r.repo !== action.repo) : state
    case MUTE_REPO_IN_BUFFER:
      return state.map(r => ({
        repo: r.repo,
        muted: r.repo === action.repo ? action.muted : r.muted
      }))
    case MUTE_ALL_REPOS_IN_BUFFER:
      return state.map(r => ({
        repo: r.repo,
        muted: action.muted
      }))
    default:
      return state
  }
}
