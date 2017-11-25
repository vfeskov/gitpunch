import { connect } from 'react-redux'
import { RepoAdd as RepoAddComponent } from './component'
import debounce from 'lodash.debounce'

export function createRepoAddContainer (lens, actions) {
  return connect(
    rootState => mapStateToProps(lens(rootState)),
    dispatch => mapDispatchToProps(dispatch, actions)
  )(RepoAddComponent)
}

function mapStateToProps (state) {
  return {
    suggestions: state.suggestions,
    suggestionsError: state.suggestionsError,
    suggestionsLoading: state.suggestionsLoading
  }
}

function mapDispatchToProps (dispatch, actions) {
  const { fetchSuggestions, receiveSuggestions } = actions
  const fetchSuggestionsDebounced = debounce(
    ({ value }) => dispatch(fetchSuggestions(value)),
    300
  )
  return {
    fetchSuggestions: fetchSuggestionsDebounced,
    clearSuggestions: () => {
      fetchSuggestionsDebounced.cancel()
      dispatch(receiveSuggestions(Date.now(), []))
    }
  }
}
