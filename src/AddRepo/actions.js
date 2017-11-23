export const setValue = value => ({
  type: 'ADD_REPO_SET_VALUE',
  value
})

export const requestSuggestions = reqTimestamp => ({
  type: 'ADD_REPO_REQUEST_SUGGESTIONS',
  reqTimestamp
})

export const receiveSuggestions = (reqTimestamp, suggestions) => ({
  type: 'ADD_REPO_RECEIVE_SUGGESTIONS',
  suggestions,
  reqTimestamp
})

export const errorSuggestions = (reqTimestamp, error) => ({
  type: 'ADD_REPO_ERROR_SUGGESTIONS',
  error,
  reqTimestamp
})

export const setConfirming = confirming => ({
  type: 'ADD_REPO_SET_CONFIRMING',
  confirming
})

export function fetchSuggestions (value) {
  return dispatch => {
    const reqTimestamp = Date.now()
    dispatch(requestSuggestions(reqTimestamp))
    fetch(`https://api.github.com/search/repositories?q=${value}`)
      .then(response => {
        if (response.status === 200) {
          return response.json()
        }
        throw new Error(response.statusText)
      })
      .then(
        json => dispatch(receiveSuggestions(reqTimestamp, json.items)),
        error => dispatch(errorSuggestions(reqTimestamp, error))
      )
  }
}
