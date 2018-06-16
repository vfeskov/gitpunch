import { SUCCESS, SIGN_IN, FETCH_PROFILE, CREATE_REPO, CREATE_REPOS, DELETE_REPO, SIGN_OUT, MUTE_SAVED_REPO } from '../actions'

export default function savedRepos (state = [], action) {
  switch (action.type) {
    case SIGN_IN[SUCCESS]:
    case FETCH_PROFILE[SUCCESS]:
      const { repos } = action.profile || {}
      return repos ? [...repos] : []
    case CREATE_REPOS[SUCCESS]:
    case CREATE_REPO[SUCCESS]:
    case DELETE_REPO[SUCCESS]:
    case MUTE_SAVED_REPO[SUCCESS]:
      return action.repos ? [...action.repos] : []
    case SIGN_OUT[SUCCESS]:
      return []
    default:
      return state
  }
}
