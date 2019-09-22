export function styles (theme) {
  return {
    container: {
      flexGrow: 1,
      position: 'relative'
    },
    suggestionsContainerOpen: {
      position: 'absolute',
      marginBottom: theme.spacing(3),
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
      ...theme.typography.h6,
      marginBottom: theme.spacing(1),
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
      width: '100%',
      position: 'relative',
      [theme.breakpoints.down('xs')]: {
        marginBottom: theme.spacing(4)
      }
    },
    newLine: {
      marginBottom: theme.spacing(4)
    },
    addButton: {
      color: `${theme.palette.secondary.main} !important`,
      minWidth: '32px',
      position: 'absolute',
      right: 0,
      top: 0
    },
    starsLinkContainer: {
      [theme.breakpoints.down('xs')]: {
        margin: `${theme.spacing(1)}px 0`,
        textAlign: 'center'
      }
    },
    inlineVCentered: {
      alignItems: 'center',
      display: 'inline-flex',
      whiteSpace: 'pre'
    },
    or: {
      padding: '0 1em',
      [theme.breakpoints.down('xs')]: {
        display: 'none'
      }
    },
    error: {
      paddingTop: theme.spacing(1),
      position: 'absolute',
      top: '100%',
      color: '#f00',
      fontSize: '90%'
    },
    syncHint: {
      color: theme.palette.primary[500],
      [theme.breakpoints.down('xs')]: {
        textAlign: 'center'
      }
    },
    displayBlock: {
      display: 'block'
    }
  }
}
