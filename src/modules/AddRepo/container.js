import { connect } from 'react-redux'
import { AddRepo as AddRepoComponent } from './component'
import debounce from 'lodash.debounce'

export function createAddRepoContainer (lens, actions) {
  return connect(
    rootState => mapStateToProps(lens(rootState)),
    dispatch => mapDispatchToProps(dispatch, actions)
  )(AddRepoComponent)
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
  const onSuggestionsFetchRequested = debounce(
    ({ value }) => dispatch(fetchSuggestions(value)),
    300
  )
  return {
    onSuggestionsFetchRequested,
    onSuggestionsClearRequested: () => {
      onSuggestionsFetchRequested.cancel()
      dispatch(receiveSuggestions(Date.now(), []))
    }
  }
}
