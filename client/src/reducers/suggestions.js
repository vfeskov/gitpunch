import { FETCH_SUGGESTIONS, CREATE_REPO_IN_DB, CREATE_REPO_IN_BUFFER, REQUEST, SUCCESS, FAILURE } from '../actions'

const initState = { loading: false, items: [] }
export default function suggestions (state = initState, action) {
  switch (action.type) {
    case FETCH_SUGGESTIONS[REQUEST]:
      return { loading: true, items: state.items }
    case FETCH_SUGGESTIONS[SUCCESS]:
      return { loading: false, items: action.items }
    case FETCH_SUGGESTIONS[FAILURE]:
      return { loading: false, items: [] }
    case CREATE_REPO_IN_BUFFER:
    case CREATE_REPO_IN_DB[FAILURE]:
    case CREATE_REPO_IN_DB[SUCCESS]:
      return initState
    default:
      return state
  }
}
