import React from 'react'
import TextField from 'material-ui/TextField'
import Paper from 'material-ui/Paper'
import { MenuItem } from 'material-ui/Menu'
import match from 'autosuggest-highlight/match'
import parse from 'autosuggest-highlight/parse'
import { EyeIcon, StarIcon, ForkIcon } from './github-icons'
import { LinearProgress } from 'material-ui/Progress'

export function renderSuggestionsContainer (options) {
  const { containerProps, children } = options

  return (
    <Paper {...containerProps} square>
      {children}
    </Paper>
  )
}

export function renderInput (inputProps) {
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
        {EyeIcon(classes.suggestionIcon)}{suggestion.watchers_count} &middot;
        {StarIcon(classes.suggestionIcon)}{suggestion.stargazers_count} &middot;
        {ForkIcon(classes.suggestionIcon)}{suggestion.forks_count}
      </div>
    </MenuItem>
  )
}
