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
      credentials: 'same-origin',
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
        const error = new Error(response.statusText)
        error.status = response.status
        throw error
      })
      .then(
        json => dispatch(receiveWatching(json)),
        error => dispatch(errorWatching(error))
      )
  }
}
