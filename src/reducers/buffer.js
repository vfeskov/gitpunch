export function buffer (state = [], action) {
  switch (action.type) {
    case 'RECEIVE_USER_DATA':
    case 'RECEIVE_REPOS':
      return []
    case 'ADD_REPO_TO_BUFFER':
      return state.includes(action.repo) ? state : state.concat(action.repo)
    case 'REMOVE_REPO_FROM_BUFFER':
      return state.includes(action.repo) ? state.filter(r => r !== action.repo) : state
    default:
      return state
  }
}
