export function requestCheckAt () {
  return { type: 'REQUEST_CHECK_AT' }
}

export function receiveCheckAt (json) {
  return { type: 'RECEIVE_CHECK_AT', json }
}

export function errorCheckAt (error) {
  return { type: 'ERROR_CHECK_AT', error }
}

export function saveCheckAt (checkAt) {
  return dispatch => {
    dispatch(requestCheckAt())
    return fetch('/api/check_at', {
      credentials: 'same-origin',
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ checkAt })
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
        json => dispatch(receiveCheckAt(json)),
        error => dispatch(errorCheckAt(error))
      )
  }
}
