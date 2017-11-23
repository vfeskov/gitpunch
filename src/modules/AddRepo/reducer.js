const { assign } = Object

export function createReducer (actionPrefix) {
  return function reducer (state, action) {
    state = state || {
      value: '',
      latestReqTimestamp: 0,
      suggestions: [],
      error: null,
      suggestionsLoading: false,
      confirming: false
    }

    const actionType = actionPrefix ?
      action.type.replace(new RegExp(`^${actionPrefix}`), '') :
      action.type
    switch (actionType) {
      case 'SET_CONFIRMING':
        return assign({}, state, { confirming: action.confirming })
      case 'SET_VALUE':
        return assign({}, state, { value: action.value })
      case 'REQUEST_SUGGESTIONS':
        return assign({}, state, {
          latestReqTimestamp: action.reqTimestamp,
          error: null,
          suggestionsLoading: true
        })
      case 'RECEIVE_SUGGESTIONS':
        // ignore responses if there's a more recent request pending
        if (state.latestReqTimestamp > action.reqTimestamp) { return state }
        return assign({}, state, {
          suggestionsLoading: false,
          error: null,
          suggestions: action.suggestions
        })
      case 'ERROR_SUGGESTIONS':
        // ignore errors if there's a more recent request pending
        if (state.latestReqTimestamp > action.reqTimestamp) { return state }
        return assign({}, state, {
          suggestionsLoading: false,
          error: action.error,
          suggestions: []
        })
      default:
        return state
    }
  }
}


