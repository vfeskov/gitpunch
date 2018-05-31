import { createMuiTheme } from 'material-ui/styles'
import { grey, blue } from 'material-ui/colors'

export default () => createMuiTheme({
  palette: {
    primary: grey,
    secondary: blue,
    type: 'light'
  },
})
