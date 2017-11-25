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
  return { type: 'CREATE_CREATE_REPO', error }
}

export function createRepo (fullName) {
  return dispatch => {
    dispatch(requestCreateRepo())
    return fetch('/api/repos', {
      credentials: 'include',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ fullName })
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

export function deleteRepo (fullName) {
  return dispatch => {
    dispatch(requestDeleteRepo())
    fetch(`/api/repos/${encodeURIComponent(fullName)}`, {
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

export function requestReplaceRepos () {
  return { type: 'REQUEST_REPLACE_REPOS' }
}

export function receiveReplaceRepos (repos) {
  return { type: 'RECEIVE_REPLACE_REPOS', repos }
}

export function errorReplaceRepos (error) {
  return { type: 'CREATE_REPLACE_REPOS', error }
}

export function replaceRepos (repos) {
  return dispatch => {
    dispatch(requestReplaceRepos())
    return fetch('/api/repos', {
      credentials: 'include',
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(repos)
    })
      .then(response => {
        if (response.status === 200) {
          return response.json()
        }
        throw new Error(response.statusText)
      })
      .then(
        json => dispatch(receiveReplaceRepos(json)),
        error => dispatch(errorReplaceRepos(error))
      )
  }
}

export function addRepoToBuffer (repo) {
  return { type: 'ADD_REPO_TO_BUFFER', repo }
}

export function removeRepoFromBuffer (repo) {
  return { type: 'REMOVE_REPO_FROM_BUFFER', repo }
}
