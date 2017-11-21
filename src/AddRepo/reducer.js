const { assign } = Object

export function AddRepo (state, action) {
  state = state || {
    value: '',
    latestReqTimestamp: 0,
    items: [],
    error: null,
    loading: false,
    confirming: false
  }
  switch (action.type) {
    case 'ADD_REPO_SET_CONFIRMING':
      return assign({}, state, { confirming: action.confirming })
    case 'ADD_REPO_SET_VALUE':
      return assign({}, state, { value: action.value })
    case 'ADD_REPO_REQUEST_SUGGESTIONS':
      return assign({}, state, {
        latestReqTimestamp: action.reqTimestamp,
        error: null,
        loading: true
      })
    case 'ADD_REPO_RECEIVE_SUGGESTIONS':
      // ignore responses if there's a more recent request pending
      if (state.latestReqTimestamp > action.reqTimestamp) { return state }
      return assign({}, state, {
        loading: false,
        error: null,
        items: action.items
      })
    case 'ADD_REPO_ERROR_SUGGESTIONS':
      // ignore errors if there's a more recent request pending
      if (state.latestReqTimestamp > action.reqTimestamp) { return state }
      return assign({}, state, {
        loading: false,
        error: action.error,
        items: []
      })
    default:
      return state
  }
}
