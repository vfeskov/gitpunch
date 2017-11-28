export function savedRepos (state = [], action) {
  switch (action.type) {
    case 'RECEIVE_REGISTER':
    case 'RECEIVE_LOGIN':
    case 'RECEIVE_PROFILE':
      const { repos } = action.profile || {}
      return repos ? [...repos] : []
    case 'RECEIVE_CREATE_REPO':
    case 'RECEIVE_DELETE_REPO':
    case 'RECEIVE_REPLACE_REPOS':
      return action.repos ? [...action.repos] : []
    case 'RECEIVE_LOGOUT':
      return []
    default:
      return state
  }
}
