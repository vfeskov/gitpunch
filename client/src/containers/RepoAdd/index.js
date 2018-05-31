import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import Autosuggest from 'react-autosuggest'
import { renderInput, renderSuggestion, renderSuggestionsContainer } from './components'
import Button from 'material-ui/Button'
import SendIcon from 'material-ui-icons/Send'
import { withStyles } from 'material-ui/styles'
import { styles } from './styles'
import oauthUrl from '../../lib/oauthUrl'
import { StarIcon } from '../../components/icons'
import Tooltip from 'material-ui/Tooltip'

import { connect } from 'react-redux'
import { mapDispatchToProps } from '../../actions'

const valueReplaceArgs = [
  [new RegExp('^https?://'), ''],
  [new RegExp('^github.com/'), ''],
  [new RegExp('^([^/]+/[^/]+)[/#?].*'), '$1'],
]

class RepoAdd extends PureComponent {
  componentDidMount () {
    this.props.showIntro === 'n' && this.inputRef && this.inputRef.focus()
  }

  componentWillReceiveProps ({ showIntro }) {
    if (showIntro !== 'n') { return }
    setTimeout(() => this.inputRef && this.inputRef.focus(), 500)
  }

  render () {
    const { className, classes, repoAdd, accessToken, bufferRepos: repos, suggestions } = this.props
    const { value, disabled, error } = repoAdd
    const { loading, items } = suggestions
    const starredLink = accessToken ? '/starred' : oauthUrl({ repos, returnTo: '/starred' })
    const watchStarredLink = <a href={starredLink} className={classes.inlineVCentered} onClick={this.starredClicked}>{StarIcon()} starred</a>
    return (
      <div className={className}>
        <h2 className={classes.title}>Watch GitHub repo for releases</h2>
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
              suggestions={items}
              onSuggestionsFetchRequested={() => {}}
              onSuggestionsClearRequested={() => {}}
              shouldRenderSuggestions={value => value.trim().length > 1}
              renderSuggestionsContainer={renderSuggestionsContainer}
              getSuggestionValue={suggestion => suggestion.full_name}
              onSuggestionSelected={(ev, { suggestionValue }) => this.confirm(suggestionValue)}
              renderSuggestion={(...args) => renderSuggestion(classes, ...args)}
              inputProps={{
                inputRef: inputRef => this.inputRef = inputRef,
                classes,
                loading: loading || disabled,
                value,
                onChange: (ev, { newValue }) => disabled || this.setValue(newValue),
              }}
            />
            {error && <div className={classes.error}>{error}</div>}
            <Button type="submit" size="small" className={classes.addButton}>
              <SendIcon />
            </Button>
          </form>
          <div className={classes.or}>/</div>
          <div className={classes.starredLinkContainer}>
            <span className={classes.inlineVCentered}>
              watch {
                accessToken ?
                  watchStarredLink :
                  <Tooltip title={'It\'ll also sign you in'}>{watchStarredLink}</Tooltip>
              }
            </span>
          </div>
        </div>
      </div>
    )
  }

  confirm (repo) {
    this.props.addRepo(repo)
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
    } else {
      this.inputRef && this.inputRef.focus()
    }
  }

  starredClicked = ev => {
    if (!this.props.accessToken) { return }
    ev.preventDefault()
    this.props.setStarredOpen(true)
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
  accessToken: PropTypes.string.isRequired,
  showIntro: PropTypes.string.isRequired,
  suggestions: PropTypes.object.isRequired
}

export default connect(
  state => ({
    repoAdd: state.repoAdd,
    accessToken: state.accessToken,
    bufferRepos: state.bufferRepos,
    showIntro: state.showIntro,
    suggestions: state.suggestions
  }),
  mapDispatchToProps()
)(withStyles(styles)(RepoAdd))
