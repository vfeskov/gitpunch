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
    return fetch('/api/profile', { credentials: 'include' })
      .then(response => {
        if (response.status === 200) {
          return response.json()
        }
        throw new Error(response.statusText)
      })
      .then(
        json => dispatch(receiveProfile(json)),
        error => dispatch(errorProfile(error))
      )
  }
}
