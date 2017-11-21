export const receiveRepos = repos => ({
  type: 'RECEIVE_REPOS',
  repos
})

export function createRepo (fullName) {
  return dispatch => {
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
        json => dispatch(receiveRepos(json)),
        console.log
      )
  }
}

export function deleteRepo (fullName) {
  return dispatch => {
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
        json => dispatch(receiveRepos(json)),
        console.log
      )
  }
}

export function replaceRepos (repos) {
  return dispatch => {
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
        json => dispatch(receiveRepos(json)),
        console.log
      )
  }
}
