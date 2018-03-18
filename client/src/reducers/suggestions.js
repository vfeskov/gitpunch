import { FETCH_SUGGESTIONS, CREATE_REPO, ADD_REPO_TO_BUFFER, REQUEST, SUCCESS, FAILURE } from '../actions'

const initState = { loading: false, items: [], error: null }
export default function suggestions (state = initState, action) {
  switch (action.type) {
    case FETCH_SUGGESTIONS[REQUEST]:
      return { loading: true, error: null, items: state.items }
    case FETCH_SUGGESTIONS[SUCCESS]:
      return { loading: false, error: null, items: action.items }
    case FETCH_SUGGESTIONS[FAILURE]:
      return { loading: false, error: action.error, items: [] }
    case ADD_REPO_TO_BUFFER:
    case CREATE_REPO[FAILURE]:
    case CREATE_REPO[SUCCESS]:
      return initState
    default:
      return state
  }
}
