export const requestProfile = () => ({
  type: 'REQUEST_PROFILE'
})

export const receiveProfile = profile => ({
  type: 'RECEIVE_PROFILE',
  profile
})

export const errorProfile = error => ({
  type: 'ERROR_PROFILE',
  error
})

export function fetchProfile () {
  return dispatch => {
    dispatch(requestProfile())
    return fetch('/api/profile', { credentials: 'same-origin' })
      .then(response => {
        if (response.status === 200) {
          return response.json()
        }
        const error = new Error(response.statusText)
        error.status = response.status
        throw error
      })
      .then(
        json => dispatch(receiveProfile(json)),
        error => dispatch(errorProfile(error))
      )
  }
}
