export function repos (state = [], action) {
  switch (action.type) {
    case 'RECEIVE_USER_DATA':
      const { repos } = action.userData || {}
      return repos ? [...repos] : []
    case 'RECEIVE_CREATE_REPO':
    case 'RECEIVE_DELETE_REPO':
    case 'RECEIVE_REPLACE_REPOS':
      return action.repos ? [...action.repos] : []
    default:
      return state
  }
}
