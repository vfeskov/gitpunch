import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Autosuggest from 'react-autosuggest'
import { renderInput, renderSuggestion, renderSuggestionsContainer } from './components'
import Paper from 'material-ui/Paper'
import { withStyles } from 'material-ui/styles'
import Typography from 'material-ui/Typography'
import { styles } from './styles'
import debounce from 'lodash.debounce'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as actionCreators from '../../actions'

const { assign } = Object

class RepoAddComponent extends Component {
  constructor (props) {
    super(props)
    this.state = {
      latestReqTimestamp: 0,
      suggestions: [],
      suggestionsError: null,
      suggestionsLoading: false
    }
    this.fetchSuggestionsDebounced = debounce(
      ({ value }) => this.fetchSuggestions(value),
      300
    )
  }

  render () {
    const { className, classes, repoAdd, setRepoAddValue } = this.props
    const { value, disabled } = repoAdd
    const { suggestions, suggestionsLoading } = this.state
    return (
      <Paper className={className}>
        <Typography type="title">Watch repo for new releases</Typography>
        <Autosuggest
          theme={{
            container: classes.container,
            suggestionsContainerOpen: classes.suggestionsContainerOpen,
            suggestionsList: classes.suggestionsList,
            suggestion: classes.suggestion,
          }}
          renderInputComponent={renderInput}
          suggestions={suggestions}
          onSuggestionsFetchRequested={this.fetchSuggestionsDebounced}
          onSuggestionsClearRequested={() => this.clearSuggestions()}
          shouldRenderSuggestions={value => value.trim().length > 1}
          renderSuggestionsContainer={renderSuggestionsContainer}
          getSuggestionValue={suggestion => suggestion.full_name}
          onSuggestionSelected={(ev, { suggestionValue }) => this.confirm(suggestionValue)}
          renderSuggestion={(...args) => renderSuggestion(classes, ...args)}
          inputProps={{
            autoFocus: true,
            classes,
            suggestionsLoading,
            value,
            onChange: (ev, { newValue }) => disabled || setRepoAddValue(newValue),
            onKeyPress: ev => this.handleKeyPress(ev)
          }}
        />
        <small>Select from suggestions or simply hit Enter</small>
      </Paper>
    )
  }

  confirm (repo) {
    const { addRepo, loggedIn } = this.props
    this.clearSuggestions()
    addRepo(loggedIn, repo)
  }

  clearSuggestions () {
    this.fetchSuggestionsDebounced.cancel()
    this.receiveSuggestions(Date.now(), [])
  }

  handleKeyPress (ev) {
    if (ev.key !== 'Enter') { return }
    const repo = ev.target.value
    if (/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(repo)) {
      this.confirm(repo)
    }
  }

  fetchSuggestions (value) {
    const reqTimestamp = Date.now()
    this.requestSuggestions(reqTimestamp)
    fetch(`https://api.github.com/search/repositories?q=${value}`)
      .then(response => {
        if (response.status === 200) {
          return response.json()
        }
        throw new Error(response.statusText)
      })
      .then(
        json => this.receiveSuggestions(reqTimestamp, json.items),
        error => this.errorSuggestions(reqTimestamp, error)
      )
  }

  requestSuggestions (reqTimestamp) {
    this.setState(state => assign({}, state, {
      latestReqTimestamp: reqTimestamp,
      suggestionsError: null,
      suggestionsLoading: true
    }))
  }

  receiveSuggestions (reqTimestamp, suggestions) {
    // ignore responses if there's a more recent request pending
    if (this.state.latestReqTimestamp > reqTimestamp) { return }
    this.setState(state => assign({}, state, {
      suggestionsLoading: false,
      suggestionsError: null,
      suggestions
    }))
  }

  errorSuggestions (reqTimestamp, error) {
    // ignore errors if there's a more recent request pending
    if (this.state.latestReqTimestamp > reqTimestamp) { return }
    this.setState(state => assign({}, state, {
      suggestionsLoading: false,
      suggestionsError: error,
      suggestions: []
    }))
  }
}

RepoAddComponent.propTypes = {
  repoAdd: PropTypes.shape({
    value: PropTypes.string.isRequired,
    disabled: PropTypes.bool.isRequired
  }),
  className: PropTypes.string,
  addRepo: PropTypes.func.isRequired,
  loggedIn: PropTypes.bool.isRequired,
  setRepoAddValue: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired
}

const RepoAddComponentWithStyles = withStyles(styles)(RepoAddComponent)

export const RepoAdd = connect(
  state => ({
    repoAdd: state.repoAdd,
    loggedIn: state.loggedIn
  }),
  dispatch => bindActionCreators(actionCreators, dispatch)
)(RepoAddComponentWithStyles)

