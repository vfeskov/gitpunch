export function savedRepos (state = [], action) {
  switch (action.type) {
    case 'RECEIVE_SIGN_IN':
    case 'RECEIVE_PROFILE':
      const { repos } = action.profile || {}
      return repos ? [...repos] : []
    case 'RECEIVE_CREATE_REPO':
    case 'RECEIVE_DELETE_REPO':
    case 'RECEIVE_REPLACE_REPOS':
      return action.repos ? [...action.repos] : []
    case 'RECEIVE_SIGN_OUT':
      return []
    default:
      return state
  }
}
