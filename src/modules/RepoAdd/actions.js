export function createActions(actionPrefix) {
  const requestSuggestions = prefix(reqTimestamp => ({
    type: 'REQUEST_SUGGESTIONS',
    reqTimestamp
  }))

  const receiveSuggestions = prefix((reqTimestamp, suggestions) => ({
    type: 'RECEIVE_SUGGESTIONS',
    suggestions,
    reqTimestamp
  }))

  const errorSuggestions = prefix((reqTimestamp, error) => ({
    type: 'ERROR_SUGGESTIONS',
    error,
    reqTimestamp
  }))

  function fetchSuggestions (value) {
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

  return {
    requestSuggestions,
    receiveSuggestions,
    errorSuggestions,
    fetchSuggestions
  }

  function prefix (actionCreator) {
    return (...args) => {
      const action = actionCreator(...args)
      return Object.assign({}, action, { type: actionPrefix + action.type })
    }
  }
}
