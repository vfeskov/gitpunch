export function setRepoAddValue (value) {
  return { type: 'SET_REPO_ADD_VALUE', value }
}

export function addRepo (loggedIn, repo) {
  return loggedIn ? createRepo(repo) : addRepoToBuffer(repo)
}

export function removeRepo (loggedIn, repo) {
  return loggedIn ? deleteRepo(repo) : removeRepoFromBuffer(repo)
}

export function requestCreateRepo () {
  return { type: 'REQUEST_CREATE_REPO' }
}

export function receiveCreateRepo (repos) {
  return { type: 'RECEIVE_CREATE_REPO', repos }
}

export function errorCreateRepo (error) {
  return { type: 'ERROR_CREATE_REPO', error }
}

export function createRepo (repo) {
  return dispatch => {
    dispatch(requestCreateRepo())
    return fetch('/api/repos', {
      credentials: 'include',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ repo })
    })
      .then(response => {
        if (response.status === 200) {
          return response.json()
        }
        throw new Error(response.statusText)
      })
      .then(
        json => dispatch(receiveCreateRepo(json)),
        error => dispatch(errorCreateRepo(error))
      )
  }
}

export function requestDeleteRepo () {
  return { type: 'REQUEST_DELETE_REPO' }
}

export function receiveDeleteRepo (repos) {
  return { type: 'RECEIVE_DELETE_REPO', repos }
}

export function errorDeleteRepo (error) {
  return { type: 'ERROR_DELETE_REPO', error }
}

export function deleteRepo (repo) {
  return dispatch => {
    dispatch(requestDeleteRepo())
    fetch(`/api/repos/${encodeURIComponent(repo)}`, {
      credentials: 'include',
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        if (response.status === 200) {
          return response.json()
        }
        throw new Error(response.statusText)
      })
      .then(
        json => dispatch(receiveDeleteRepo(json)),
        error => dispatch(errorDeleteRepo(error))
      )
  }
}

export function addRepoToBuffer (repo) {
  return { type: 'ADD_REPO_TO_BUFFER', repo }
}

export function removeRepoFromBuffer (repo) {
  return { type: 'REMOVE_REPO_FROM_BUFFER', repo }
}
