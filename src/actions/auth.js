export const requestLogout = () => ({
  type: 'REQUEST_LOGOUT'
})

export const receiveLogout = () => ({
  type: 'RECEIVE_LOGOUT'
})

export const errorLogout = error => ({
  type: 'ERROR_LOGOUT',
  error
})

export function logout () {
  return dispatch => {
    dispatch(requestLogout())
    return fetch('/api/logout', {
      method: 'DELETE',
      credentials: 'include'
    })
      .then(response => {
        if (response.status === 200) { return }
        throw new Error(response.statusText)
      })
      .then(
        () => dispatch(receiveLogout()),
        error => dispatch(errorLogout(error))
      )
  }
}

export const requestRegister = () => ({
  type: 'REQUEST_REGISTER'
})

export const receiveRegister = profile => ({
  type: 'RECEIVE_REGISTER',
  profile
})

export const errorRegister = error => ({
  type: 'ERROR_REGISTER',
  error
})

export function register (email, password, repos) {
  return dispatch => {
    dispatch(requestRegister())
    return fetch('/api/register', {
      method: 'POST',
      credentials: 'include',
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
        throw new Error(response.statusText)
      })
      .then(
        profile => dispatch(receiveRegister(profile)),
        error => dispatch(errorRegister(error))
      )
  }
}

export const requestLogin = () => ({
  type: 'REQUEST_LOGIN'
})

export const receiveLogin = profile => ({
  type: 'RECEIVE_LOGIN',
  profile
})

export const errorLogin = error => ({
  type: 'ERROR_LOGIN',
  error
})

export function login (email, password, buffer) {
  return dispatch => {
    dispatch(requestLogin())
    return fetch('/api/login', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email,
        password
      })
    })
      .then(response => {
        if (response.status === 200) {
          return response.json()
        }
        throw new Error(response.statusText)
      })
      .then(
        profile => dispatch(receiveLogin(profile)),
        error => dispatch(errorLogin(error))
      )
  }
}

