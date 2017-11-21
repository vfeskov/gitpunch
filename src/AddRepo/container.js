import { connect } from 'react-redux'
import { AddRepo as AddRepoComponent } from './component'
import { fetchSuggestions, receiveSuggestions, setValue, setConfirming } from './actions'
import debounce from 'lodash.debounce'

export const AddRepo = connect(
  state => ({
    suggestions: state.AddRepo.items,
    suggestionsLoading: state.AddRepo.loading,
    value: state.AddRepo.value,
    confirming: state.AddRepo.confirming
  }),
  dispatch => {
    const onSuggestionsFetchRequested = debounce(({ value }) => dispatch(fetchSuggestions(value)), 300)
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
)(AddRepoComponent)
