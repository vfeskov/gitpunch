export default function styles (theme) {
  return {
    container: {
      textAlign: 'center'
    },
    form: {
      alignItems: 'center',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative'
    },
    formControl: {
      marginBottom: theme.spacing(2)
    },
    or: {
      textAlign: 'center'
    },
    frequencyOptions: {
      flexDirection: 'row',
      alignItems: 'center'
    },
    checkAtText: {
      cursor: 'pointer',
      textDecoration: 'underline'
    },
    dailyOption: {
      marginRight: 0
    },
    signIn: {
      borderRadius: '36px'
    },
    conditions: {
      color: '#888',
      display: 'inline-block',
      fontSize: '12px',
      width: '180px',
      marginTop: '32px',
      maxWidth: '158px',
      '@global': {
        'a:not(:hover)': {
          color: '#888'
        }
      }
    }
  }
}
