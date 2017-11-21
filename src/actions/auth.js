import { replaceRepos } from './repos'

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

export const receiveRegister = json => ({
  type: 'RECEIVE_REGISTER',
  json
})

export const errorRegister = error => ({
  type: 'ERROR_REGISTER',
  error
})

export function register (buffer) {
  return dispatch => {
    dispatch(requestRegister())
    return fetch('/api/register', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        login: '' + Date.now(),
        password: '123456',
        passwordConfirmation: '123456'
      })
    })
      .then(response => {
        if (response.status === 200) {
          return response.json()
        }
        throw new Error(response.statusText)
      })
      .then(
        json => {
          dispatch(receiveRegister(json))
          dispatch(replaceRepos(buffer))
        },
        error => dispatch(errorRegister(error))
      )
  }
}
