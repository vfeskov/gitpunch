import createMuiTheme from '@material-ui/core/styles/createMuiTheme'
import grey from '@material-ui/core/colors/grey'
import blue from '@material-ui/core/colors/blue'

export default () => createMuiTheme({
  typography: {
    useNextVariants: true,
  },
  palette: {
    primary: grey,
    secondary: blue,
    type: 'light'
  },
  overrides: {
    MuiButton: {
      root: {
        borderRadius: '24px'
      },
    },
  },
})
