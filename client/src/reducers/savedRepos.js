import { SUCCESS, SIGN_IN, FETCH_PROFILE, CREATE_REPO_IN_DB, CREATE_REPOS, PATCH_REPO_IN_DB, PATCH_ALL_REPOS_IN_DB, DELETE_REPO_IN_DB, SIGN_OUT, DELETE_ALL_REPOS_IN_DB } from '../actions'

export default function savedRepos (state = [], { type, ...payload }) {
  switch (type) {
    case SIGN_IN[SUCCESS]:
    case FETCH_PROFILE[SUCCESS]:
    case CREATE_REPOS[SUCCESS]:
    case CREATE_REPO_IN_DB[SUCCESS]:
    case DELETE_REPO_IN_DB[SUCCESS]:
    case PATCH_REPO_IN_DB[SUCCESS]:
    case PATCH_ALL_REPOS_IN_DB[SUCCESS]:
      return payload.repos ? [...payload.repos] : []
    case DELETE_ALL_REPOS_IN_DB[SUCCESS]:
    case SIGN_OUT[SUCCESS]:
      return []
    default:
      return state
  }
}
