export function requestFrequency () {
  return { type: 'REQUEST_FREQUENCY' }
}

export function receiveFrequency (json) {
  return { type: 'RECEIVE_FREQUENCY', json }
}

export function errorFrequency (error) {
  return { type: 'ERROR_FREQUENCY', error }
}

export function saveFrequency (params) {
  return dispatch => {
    dispatch(requestFrequency())
    return fetch('/api/frequency', {
      credentials: 'same-origin',
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(params)
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
        json => dispatch(receiveFrequency(json)),
        error => dispatch(errorFrequency(error))
      )
  }
}
