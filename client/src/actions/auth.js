export const requestSignOut = () => ({
  type: 'REQUEST_SIGN_OUT'
})

export const receiveSignOut = () => ({
  type: 'RECEIVE_SIGN_OUT'
})

export const errorSignOut = error => ({
  type: 'ERROR_SIGN_OUT',
  error
})

export function signOut () {
  return dispatch => {
    dispatch(requestSignOut())
    return fetch('/api/sign_out', {
      method: 'DELETE',
      credentials: 'same-origin'
    })
      .then(response => {
        if (response.status === 200) { return }
        const error = new Error(response.statusText)
        error.status = response.status
        throw error
      })
      .then(
        () => dispatch(receiveSignOut()),
        error => dispatch(errorSignOut(error))
      )
  }
}

export const requestSignIn = () => ({
  type: 'REQUEST_SIGN_IN'
})

export const receiveSignIn = profile => ({
  type: 'RECEIVE_SIGN_IN',
  profile
})

export const errorSignIn = error => ({
  type: 'ERROR_SIGN_IN',
  error
})

export function signIn (email, password, repos) {
  return dispatch => {
    dispatch(requestSignIn())
    return fetch('/api/sign_in', {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email,
        password,
        repos
      })
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
        profile => dispatch(receiveSignIn(profile)),
        error => dispatch(errorSignIn(error))
      )
  }
}

