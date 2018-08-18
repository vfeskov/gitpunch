import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import Autosuggest from 'react-autosuggest'
import { renderInput, renderSuggestion, renderSuggestionsContainer } from './RepoAdd-components'
import SendIcon from '@material-ui/icons/Send'
import withStyles from '@material-ui/core/styles/withStyles'
import { styles } from './RepoAdd-styles'
import { oauthUrl } from '../../services/oauth'
import { StarIcon } from '../../components/icons'

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
    const { className, classes, repoAdd, accessToken, bufferRepos: repos, suggestions, unwatchingNonstars, watchingStars } = this.props
    const { value, disabled, error } = repoAdd
    const { loading, items } = suggestions
    const starsLink = accessToken ? '/stars' : oauthUrl({ repos, returnTo: '/stars' })
    const watchingStarsLink = <a href={starsLink} className={classes.inlineVCentered} onClick={this.starsClicked}>{StarIcon()} stars</a>
    return unwatchingNonstars ? (
      <div className={className}>
        <h2 className={classes.title}><span className={classes.inlineVCentered}>Watching {watchingStarsLink} for releases</span></h2>
        <p className={classes.syncHint}><small>syncs list every 15 minutes</small></p>
      </div>
    ) : (
      <div className={className}>
        <h2 className={classes.title}>Watch GitHub repo for releases</h2>
        <div className={classes.contentWrapper + (watchingStars ? ` ${classes.displayBlock}` : '')}>
          <form className={classes.autosuggestWrapper + (watchingStars ? ` ${classes.newLine}` : '')} onSubmit={this.onSubmit}>
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
            <button type="submit" className={`action ${classes.addButton}`}>
              <SendIcon />
            </button>
          </form>
          {watchingStars || <div className={classes.or}>/</div>}
          <div className={classes.starsLinkContainer} style={{textAlign: 'center'}}>
            {watchingStars ? (<span className={classes.inlineVCentered}>
              adds new {watchingStarsLink} every 15 min
            </span>) : (<span className={classes.inlineVCentered}>
              watch {
                accessToken ?
                  watchingStarsLink :
                  <span data-tip="It'll also sign you in">{watchingStarsLink}</span>
              }
            </span>)}
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

  starsClicked = ev => {
    if (!this.props.accessToken) { return }
    ev.preventDefault()
    this.props.setStarsOpen(true)
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
  suggestions: PropTypes.object.isRequired,
  unwatchingNonstars: PropTypes.bool.isRequired
}

export default withStyles(styles)(RepoAdd)
