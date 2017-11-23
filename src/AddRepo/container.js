import { connect } from 'react-redux'
import { AddRepo as AddRepoComponent } from './component'
import { fetchSuggestions, receiveSuggestions, setValue, setConfirming } from './actions'
import debounce from 'lodash.debounce'

export function createAddRepo (lens) {
  return connect(
    rootState => mapStateToProps(lens(rootState)),
    mapDispatchToProps
  )(AddRepoComponent)
}

function mapStateToProps (state) {
  return {...state}
}

function mapDispatchToProps (dispatch) {
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
