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
    value: state.value,
    suggestions: state.suggestions,
    error: state.error,
    suggestionsLoading: state.suggestionsLoading,
    confirming: state.confirming
  }
}

function mapDispatchToProps (dispatch, actions) {
  const { fetchSuggestions, receiveSuggestions, setValue, setConfirming } = actions
  const onSuggestionsFetchRequested = debounce(
    ({ value }) => dispatch(fetchSuggestions(value)),
    300
  )
  return {
    onSuggestionsFetchRequested,
    onSuggestionsClearRequested: () => {
      onSuggestionsFetchRequested.cancel()
      dispatch(receiveSuggestions(Date.now(), []))
    },
    onChange: value => dispatch(setValue(value)),
    onConfirming: confirming => dispatch(setConfirming(confirming))
  }
}
