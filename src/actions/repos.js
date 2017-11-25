export const setAddRepoValue = value => ({
  type: 'SET_ADD_REPO_VALUE',
  value
})

export const requestCreateRepo = () => ({
  type: 'REQUEST_CREATE_REPO'
})

export const receiveCreateRepo = repos => ({
  type: 'RECEIVE_CREATE_REPO',
  repos
})

export const errorCreateRepo = error => ({
  type: 'CREATE_CREATE_REPO',
  error
})

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

export const requestDeleteRepo = () => ({
  type: 'REQUEST_DELETE_REPO'
})

export const receiveDeleteRepo = repos => ({
  type: 'RECEIVE_DELETE_REPO',
  repos
})

export const errorDeleteRepo = error => ({
  type: 'CREATE_DELETE_REPO',
  error
})

export function deleteRepo (fullName) {
  return dispatch => {
    dispatch(requestDeleteRepo)
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

export const requestReplaceRepos = () => ({
  type: 'REQUEST_REPLACE_REPOS'
})

export const receiveReplaceRepos = repos => ({
  type: 'RECEIVE_REPLACE_REPOS',
  repos
})

export const errorReplaceRepos = error => ({
  type: 'CREATE_REPLACE_REPOS',
  error
})

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
