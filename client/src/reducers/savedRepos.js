import { SIGN_IN, FETCH_PROFILE, CREATE_REPO, DELETE_REPO, SIGN_OUT } from '../actions'

export default function savedRepos (state = [], action) {
  switch (action.type) {
    case SIGN_IN.SUCCESS:
    case FETCH_PROFILE.SUCCESS:
      const { repos } = action.profile || {}
      return repos ? [...repos] : []
    case CREATE_REPO.SUCCESS:
    case DELETE_REPO.SUCCESS:
      return action.repos ? [...action.repos] : []
    case SIGN_OUT.SUCCESS:
      return []
    default:
      return state
  }
}
