export const requestUserData = () => ({
  type: 'REQUEST_USER_DATA'
})

export const receiveUserData = userData => ({
  type: 'RECEIVE_USER_DATA',
  userData
})

export const errorUserData = error => ({
  type: 'ERROR_USER_DATA',
  error
})

export function fetchUserData () {
  return dispatch => {
    dispatch(requestUserData())
    return fetch('http://localhost:3001/api/userData', { credentials: 'include' })
      .then(response => {
        if (response.status === 200) {
          return response.json()
        }
        throw new Error(response.statusText)
      })
      .then(
        json => dispatch(receiveUserData(json)),
        error => dispatch(errorUserData(error))
      )
  }
}
