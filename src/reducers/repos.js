export function repos (state = [], action) {
  switch (action.type) {
    case 'RECEIVE_USER_DATA':
      const { repos } = action.userData || {}
      return repos ? [...repos] : []
    case 'RECEIVE_REPOS':
      return action.repos ? [...action.repos] : []
    default:
      return state
  }
}
