export function user (state = {}, action) {
  const _loggedIn = loggedIn(state.loggedIn, action)
  const _savedRepos = savedRepos(state.savedRepos, action)
  const _bufferRepos = bufferRepos(state.bufferRepos, action)
  const shownRepos = _loggedIn ? _savedRepos : _bufferRepos

  return {
    loggedIn: _loggedIn,
    savedRepos: _savedRepos,
    bufferRepos: _bufferRepos,
    shownRepos
  }
}

function loggedIn (state = false, action) {
  switch (action.type) {
    case 'RECEIVE_REPLACE_REPOS':
    case 'RECEIVE_USER_DATA':
      return true
    case 'RECEIVE_LOGOUT':
      return false
    case 'ERROR_CREATE_REPO':
    case 'ERROR_REPLACE_REPOS':
    case 'ERROR_DELETE_REPO':
    case 'ERROR_USER_DATA':
      return action.error.message !== 'Unauthorized'
    default:
      return state
  }
}

function savedRepos (state = [], action) {
  switch (action.type) {
    case 'RECEIVE_USER_DATA':
      const { repos } = action.userData || {}
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

function bufferRepos (state = [], action) {
  switch (action.type) {
    case 'RECEIVE_USER_DATA':
    case 'RECEIVE_REPLACE_REPOS':
      return []
    case 'ADD_REPO_TO_BUFFER':
      return state.includes(action.repo) ? state : state.concat(action.repo)
    case 'REMOVE_REPO_FROM_BUFFER':
      return state.includes(action.repo) ? state.filter(r => r !== action.repo) : state
    default:
      return state
  }
}
