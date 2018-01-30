export default function styles (theme) {
  return {
    form: {
      display: 'flex',
      flexDirection: 'column'
    },
    formControl: {
      marginBottom: theme.spacing.unit * 2
    },
    or: {
      textAlign: 'center'
    },
    frequencyOptions: {
      flexDirection: 'row',
      alignItems: 'center'
    },
    email: {
      fontSize: '1.2em'
    },
    checkAtText: {
      cursor: 'pointer',
      textDecoration: 'underline'
    },
    dailyOption: {
      marginRight: 0
    }
  }
}
