import React from 'react'
import TextField from '@material-ui/core/TextField'
import Paper from '@material-ui/core/Paper'
import MenuItem from '@material-ui/core/MenuItem'
import match from 'autosuggest-highlight/match'
import parse from 'autosuggest-highlight/parse'
import { StarIcon, ForkIcon } from '../icons'
import LinearProgress from '@material-ui/core/LinearProgress'

export function renderSuggestionsContainer (options) {
  const { containerProps, children } = options

  return (
    <Paper {...containerProps} square>
      {children}
    </Paper>
  )
}

export function renderInput (inputProps) {
  const { classes, autoFocus, value, ref, inputRef, loading, ...other } = inputProps
  return (
    <div>
      <TextField
        autoFocus={autoFocus}
        className={classes.textField}
        value={value}
        inputRef={input => {
          inputRef(input)
          ref(input)
        }}
        placeholder="Enter name or paste link"
        InputProps={{
          classes: {
            input: classes.input
          },
          ...other
        }}
        inputProps={{
          testid: "repo-add-input"
        }}
      />
      {loading ? <LinearProgress className={classes.progress} /> : null}
    </div>
  )
}

export function renderSuggestion (classes, suggestion, { query, isHighlighted }) {
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
        {StarIcon(classes.suggestionIcon)}{suggestion.stargazers_count} &middot;
        {ForkIcon(classes.suggestionIcon)}{suggestion.forks_count}
      </div>
    </MenuItem>
  )
}
