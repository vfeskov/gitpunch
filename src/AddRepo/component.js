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

function AddRepoComponent ({
  classes,
  value,
  confirming,
  suggestions,
  suggestionsLoading,
  onSuggestionsFetchRequested,
  onSuggestionsClearRequested,
  onConfirming,
  onConfirm,
  onChange
}) {
  const confirm = repo => {
    onConfirming(true)
    onConfirm(repo)
      .then(() => {
        onChange('')
        onConfirming(false)
      })
  }

  return (
    <Paper style={{padding: '20px', margin: '10px'}}>
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
        shouldRenderSuggestions={shouldRenderSuggestions}
        renderSuggestionsContainer={renderSuggestionsContainer}
        getSuggestionValue={getSuggestionValue}
        onSuggestionSelected={(ev, { suggestionValue }) => confirm(suggestionValue)}
        renderSuggestion={(...args) => renderSuggestion(classes, ...args)}
        inputProps={{
          autoFocus: true,
          classes,
          suggestionsLoading,
          value,
          onChange: (ev, { newValue }) => onChange(newValue),
          disabled: confirming,
          onKeyPress: ev => onInputKeyPress(ev, confirm)
        }}
      />
      <small>Select from suggestions or simply hit Enter</small>
    </Paper>
  )
}

AddRepoComponent.propTypes = {
  value: PropTypes.string,
  confirming: PropTypes.bool,
  suggestions: PropTypes.arrayOf(PropTypes.object).isRequired,
  suggestionsLoading: PropTypes.bool,
  onSuggestionsFetchRequested: PropTypes.func.isRequired,
  onSuggestionsClearRequested: PropTypes.func.isRequired,
  onConfirming: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
}

function onInputKeyPress (ev, confirm) {
  if (ev.key !== 'Enter') { return }
  const repo = ev.target.value
  if (/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(repo)) {
    confirm(repo)
  }
}

function shouldRenderSuggestions (value) {
  return value.trim().length > 1
}

function renderSuggestionsContainer (options) {
  const { containerProps, children } = options

  return (
    <Paper {...containerProps} square style={{zIndex: 1}}>
      {children}
    </Paper>
  )
}

function getSuggestionValue (suggestion) {
  return suggestion.full_name
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
            <strong key={index} style={{ fontWeight: 500 }}>
              {part.text}
            </strong>
          ) : (
            <span key={index} style={{ fontWeight: 300 }}>
              {part.text}
            </span>
          )
        })}
        <span style={{flex: 1}}></span>
        {EyeIcon(classes.suggestionIcon)}{suggestion.watchers_count} &middot;
        {StarIcon(classes.suggestionIcon)}{suggestion.stargazers_count} &middot;
        {ForkIcon(classes.suggestionIcon)}{suggestion.forks_count}
      </div>
    </MenuItem>
  )
}

const styles = theme => ({
  container: {
    flexGrow: 1,
    position: 'relative'
  },
  suggestionsContainerOpen: {
    position: 'absolute',
    // marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit * 3,
    left: 0,
    right: 0,
  },
  suggestion: {
    display: 'block',
  },
  suggestionsList: {
    margin: 0,
    padding: 0,
    listStyleType: 'none',
  },
  textField: {
    width: '100%',
  },
  progress: {
    position: 'absolute',
    bottom: '0',
    width: '100%'
  },
  suggestionInner: {
    display: 'flex',
    width: '100%',
    alignItems: 'center'
  },
  suggestionIcon: {
    margin: '0 5px'
  }
})

export const AddRepo = withStyles(styles)(AddRepoComponent)

