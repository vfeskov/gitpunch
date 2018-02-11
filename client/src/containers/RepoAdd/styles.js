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
      display: 'flex',
      [theme.breakpoints.down('xs')]: {
        display: 'block'
      }
    },
    autosuggestWrapper: {
      flex: 1,
      [theme.breakpoints.down('xs')]: {
        marginBottom: theme.spacing.unit
      }
    },
    starredLink: {
      [theme.breakpoints.up('sm')]: {
        paddingTop: '6px'
      },
      [theme.breakpoints.down('xs')]: {
        marginBottom: theme.spacing.unit,
        textAlign: 'center'
      }
    },
    or: {
      padding: '6px 1em 0',
      [theme.breakpoints.down('xs')]: {
        marginBottom: theme.spacing.unit,
        padding: 0,
        textAlign: 'center'
      }
    }
  }
}
