export function styles (theme) {
  return {
    container: {
      flexGrow: 1,
      position: 'relative'
    },
    suggestionsContainerOpen: {
      position: 'absolute',
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
  }
}
