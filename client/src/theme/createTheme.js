import { createMuiTheme } from 'material-ui/styles'
import { grey, deepOrange } from 'material-ui/colors'

export default () => createMuiTheme({
  palette: {
    primary: grey,
    secondary: deepOrange,
    type: 'light'
  },
})
