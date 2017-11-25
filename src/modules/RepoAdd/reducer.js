const { assign } = Object

export function createReducer (actionPrefix) {
  return function reducer (state, action) {
    state = state || {
      latestReqTimestamp: 0,
      suggestions: [],
      suggestionsError: null,
      suggestionsLoading: false
    }
    const actionType = unprefix(action.type)
    switch (actionType) {
      case 'REQUEST_SUGGESTIONS':
        return assign({}, state, {
          latestReqTimestamp: action.reqTimestamp,
          suggestionsError: null,
          suggestionsLoading: true
        })
      case 'RECEIVE_SUGGESTIONS':
        // ignore responses if there's a more recent request pending
        if (state.latestReqTimestamp > action.reqTimestamp) { return state }
        return assign({}, state, {
          suggestionsLoading: false,
          suggestionsError: null,
          suggestions: action.suggestions
        })
      case 'ERROR_SUGGESTIONS':
        // ignore errors if there's a more recent request pending
        if (state.latestReqTimestamp > action.reqTimestamp) { return state }
        return assign({}, state, {
          suggestionsLoading: false,
          suggestionsError: action.error,
          suggestions: []
        })
      default:
        return state
    }
  }

  function unprefix(actionType) {
    return actionPrefix ?
      actionType.replace(new RegExp(`^${actionPrefix}`), '') :
      actionType
  }
}


