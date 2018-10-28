import { SIGN_IN, FETCH_PROFILE, CREATE_REPO_IN_BUFFER, DELETE_REPO_IN_BUFFER, SUCCESS, PATCH_REPO_IN_BUFFER, PATCH_ALL_REPOS_IN_BUFFER, DELETE_ALL_REPOS_IN_BUFFER } from '../actions'

export default function bufferRepos (state = [], { type, ...payload }) {
  switch (type) {
    case SIGN_IN[SUCCESS]:
    case FETCH_PROFILE[SUCCESS]:
    case DELETE_ALL_REPOS_IN_BUFFER:
      return []
    case CREATE_REPO_IN_BUFFER:
      return state.find(r => r.repo === payload.repo) ? state : [payload, ...state]
    case DELETE_REPO_IN_BUFFER:
      return state.find(r => r.repo === payload.repo) ? state.filter(r => r.repo !== payload.repo) : state
    case PATCH_REPO_IN_BUFFER:
      return state.map(r => {
        if (r.repo !== payload.repo) {
          return r
        }
        return Object.assign(r, payload)
      })
    case PATCH_ALL_REPOS_IN_BUFFER:
      return state.map(r => ({
        ...payload,
        repo: r.repo
      }))
    default:
      return state
  }
}
