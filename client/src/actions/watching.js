export function requestWatching () {
  return { type: 'REQUEST_WATCHING' }
}

export function receiveWatching (json) {
  return { type: 'RECEIVE_WATCHING', json }
}

export function errorWatching (error) {
  return { type: 'ERROR_WATCHING', error }
}

export function toggleWatching (watching) {
  return dispatch => {
    dispatch(requestWatching())
    return fetch('/api/watching', {
      credentials: 'include',
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ watching })
    })
      .then(response => {
        if (response.status === 200) {
          return response.json()
        }
        throw new Error(response.statusText)
      })
      .then(
        json => dispatch(receiveWatching(json)),
        error => dispatch(errorWatching(error))
      )
  }
}
