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
      zIndex: 2
    },
    suggestion: {
      display: 'block',
    },
    suggestionsList: {
      margin: 0,
      padding: 0,
      listStyleType: 'none',
    },
    title: {
      ...theme.typography.title,
      marginBottom: theme.spacing.unit,
      marginTop: 0,
      [theme.breakpoints.down('xs')]: {
        textAlign: 'center'
      }
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
    divider: {
      flex: 1
    },
    suggestionIcon: {
      margin: '0 5px'
    },
    contentWrapper: {
      alignItems: 'center',
      display: 'flex',
      [theme.breakpoints.down('xs')]: {
        flexDirection: 'column'
      }
    },
    autosuggestWrapper: {
      alignItems: 'center',
      display: 'flex',
      flex: 1,
      width: '290px',
      maxWidth: '100%',
      position: 'relative',
      [theme.breakpoints.down('xs')]: {
        marginBottom: theme.spacing.unit
      }
    },
    addButton: {
      bottom: 0,
      minWidth: '32px',
      position: 'absolute',
      right: 0
    },
    starredLink: {
      [theme.breakpoints.down('xs')]: {
        marginBottom: theme.spacing.unit,
        textAlign: 'center'
      }
    },
    or: {
      padding: '0 1em',
      [theme.breakpoints.down('xs')]: {
        display: 'none'
      }
    }
  }
}
