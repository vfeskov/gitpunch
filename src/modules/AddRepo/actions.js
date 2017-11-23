export function createActions(actionPrefix) {
  const setValue = value => ({
    type: `${actionPrefix}SET_VALUE`,
    value
  })

  const requestSuggestions = reqTimestamp => ({
    type: `${actionPrefix}REQUEST_SUGGESTIONS`,
    reqTimestamp
  })

  const receiveSuggestions = (reqTimestamp, suggestions) => ({
    type: `${actionPrefix}RECEIVE_SUGGESTIONS`,
    suggestions,
    reqTimestamp
  })

  const errorSuggestions = (reqTimestamp, error) => ({
    type: `${actionPrefix}ERROR_SUGGESTIONS`,
    error,
    reqTimestamp
  })

  const setConfirming = confirming => ({
    type: `${actionPrefix}SET_CONFIRMING`,
    confirming
  })

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
    setValue,
    requestSuggestions,
    receiveSuggestions,
    errorSuggestions,
    setConfirming,
    fetchSuggestions
  }
}
