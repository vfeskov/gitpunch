import React from 'react'
import PropTypes from 'prop-types'
import Autosuggest from 'react-autosuggest'
import TextField from 'material-ui/TextField'
import Paper from 'material-ui/Paper'
import { MenuItem } from 'material-ui/Menu'
import match from 'autosuggest-highlight/match'
import parse from 'autosuggest-highlight/parse'
import { EyeIcon, StarIcon, ForkIcon } from './github-icons'
import { withStyles } from 'material-ui/styles'
import { LinearProgress } from 'material-ui/Progress'
import Typography from 'material-ui/Typography'
import { styles } from './styles'

function AddRepoComponent ({
  // props coming from parent component
  className,
  value,
  disabled,
  classes,
  onConfirm,
  onChange,
  // props connected to redux via AddRepoContainer
  suggestions,
  suggestionsError,
  suggestionsLoading,
  onSuggestionsFetchRequested,
  onSuggestionsClearRequested
}) {
  const confirm = repo => {
    onSuggestionsClearRequested()
    onConfirm(repo)
  }
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
        onSuggestionsFetchRequested={onSuggestionsFetchRequested}
        onSuggestionsClearRequested={onSuggestionsClearRequested}
        shouldRenderSuggestions={value => value.trim().length > 1}
        renderSuggestionsContainer={renderSuggestionsContainer}
        getSuggestionValue={suggestion => suggestion.full_name}
        onSuggestionSelected={(ev, { suggestionValue }) => confirm(suggestionValue)}
        renderSuggestion={(...args) => renderSuggestion(classes, ...args)}
        inputProps={{
          autoFocus: true,
          classes,
          suggestionsLoading,
          value,
          onChange: (ev, { newValue }) => onChange(newValue),
          disabled,
          onKeyPress: ev => onInputKeyPress(ev, confirm)
        }}
      />
      <small>Select from suggestions or simply hit Enter</small>
    </Paper>
  )
}

function onInputKeyPress (ev, confirm) {
  if (ev.key !== 'Enter') { return }
  const repo = ev.target.value
  if (/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(repo)) {
    confirm(repo)
  }
}

function renderSuggestionsContainer (options) {
  const { containerProps, children } = options

  return (
    <Paper {...containerProps} square>
      {children}
    </Paper>
  )
}

function renderInput (inputProps) {
  const { classes, autoFocus, value, ref, suggestionsLoading, ...other } = inputProps
  return (
    <div>
      <TextField
        autoFocus={autoFocus}
        className={classes.textField}
        value={value}
        inputRef={ref}
        placeholder="Enter repo full name, e.g. facebook/react"
        InputProps={{
          classes: {
            input: classes.input,
          },
          ...other,
        }}
      />
      {suggestionsLoading ? <LinearProgress className={classes.progress} /> : null}
    </div>
  )
}

function renderSuggestion (classes, suggestion, { query, isHighlighted }) {
  const matches = match(suggestion.full_name, query)
  const parts = parse(suggestion.full_name, matches)

  return (
    <MenuItem selected={isHighlighted} component="div">
      <div className={classes.suggestionInner}>
        {parts.map((part, index) => {
          return part.highlight ? (
            <strong key={index}>
              {part.text}
            </strong>
          ) : (
            <span key={index}>
              {part.text}
            </span>
          )
        })}
        <span className={classes.divider}></span>
        {EyeIcon(classes.suggestionIcon)}{suggestion.watchers_count} &middot;
        {StarIcon(classes.suggestionIcon)}{suggestion.stargazers_count} &middot;
        {ForkIcon(classes.suggestionIcon)}{suggestion.forks_count}
      </div>
    </MenuItem>
  )
}

AddRepoComponent.propTypes = {
  value: PropTypes.string,
  diabled: PropTypes.bool,
  className: PropTypes.string,
  suggestions: PropTypes.arrayOf(PropTypes.object).isRequired,
  suggestionsLoading: PropTypes.bool,
  onSuggestionsFetchRequested: PropTypes.func.isRequired,
  onSuggestionsClearRequested: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
}

export const AddRepo = withStyles(styles)(AddRepoComponent)

