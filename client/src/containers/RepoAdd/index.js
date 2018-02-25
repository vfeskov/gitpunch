import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Autosuggest from 'react-autosuggest'
import { renderInput, renderSuggestion, renderSuggestionsContainer } from './components'
import Button from 'material-ui/Button'
import SendIcon from 'material-ui-icons/Send'
import { withStyles } from 'material-ui/styles'
import debounce from 'lodash.debounce'
import { styles } from './styles'
import oauthUrl from '../../lib/oauthUrl'

import { connect } from 'react-redux'
import { mapDispatchToProps } from '../../actions'

const { assign } = Object
const valueReplaceArgs = [
  [new RegExp('^https?://'), ''],
  [new RegExp('^github.com/'), ''],
  [new RegExp('^([^/]+/[^/]+)[/#?].*'), '$1'],
]

class RepoAdd extends Component {
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
    const { className, classes, repoAdd, accessToken, bufferRepos: repos } = this.props
    const { value, disabled } = repoAdd
    const { suggestions, suggestionsLoading } = this.state
    const starredLink = accessToken ? '/starred' : oauthUrl({ repos, returnTo: '/starred' })
    return (
      <div className={className}>
        {/* <h2 className={classes.title}>Watch repo for new releases</h2> */}
        <div className={classes.contentWrapper}>
          <form className={classes.autosuggestWrapper} onSubmit={this.onSubmit}>
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
              onSuggestionsClearRequested={this.clearSuggestions}
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
                onChange: (ev, { newValue }) => disabled || this.setValue(newValue),
              }}
            />
            <Button type="submit" size="small" className={classes.addButton}>
              <SendIcon />
            </Button>
          </form>
          <div className={classes.or}>/</div>
          <div className={classes.starredLink}>
            <a href={starredLink} onClick={this.starredClicked}>pick starred repos</a>
          </div>
        </div>
      </div>
    )
  }

  confirm (repo) {
    this.clearSuggestions()
    this.props.addRepo(repo)
  }

  clearSuggestions = () => {
    this.fetchSuggestionsDebounced.cancel()
    this.receiveSuggestions(Date.now(), [])
  }

  setValue(value) {
    valueReplaceArgs.forEach(args => value = value.replace(...args));
    this.props.setRepoAddValue(value)
  }

  onSubmit = ev => {
    ev.preventDefault()
    const { value, disabled } = this.props.repoAdd
    if (disabled) { return }
    if (/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(value)) {
      this.confirm(value)
    }
  }

  starredClicked = ev => {
    if (!this.props.accessToken) { return }
    ev.preventDefault()
    this.props.setStarredOpen(true)
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

RepoAdd.propTypes = {
  repoAdd: PropTypes.shape({
    value: PropTypes.string.isRequired,
    disabled: PropTypes.bool.isRequired
  }),
  className: PropTypes.string,
  addRepo: PropTypes.func.isRequired,
  setRepoAddValue: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
  accessToken: PropTypes.string.isRequired
}

export default connect(
  state => ({
    repoAdd: state.repoAdd,
    accessToken: state.accessToken,
    bufferRepos: state.bufferRepos
  }),
  mapDispatchToProps()
)(withStyles(styles)(RepoAdd))
