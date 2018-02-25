import { createMuiTheme } from 'material-ui/styles'
import { purple, grey } from 'material-ui/colors'

export default () => createMuiTheme({
  palette: {
    primary: grey,
    accent: purple,
    type: 'light'
  },
})
