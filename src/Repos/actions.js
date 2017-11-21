export const receiveRepos = repos => ({
  type: 'RECEIVE_REPOS',
  repos
})

export function removeRepo (fullName) {
  return dispatch => {
    fetch(`http://localhost:3001/api/repos/${encodeURIComponent(fullName)}`, {
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

