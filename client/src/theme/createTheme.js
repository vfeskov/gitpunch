import { createMuiTheme } from 'material-ui/styles'
import { indigo, purple } from 'material-ui/colors'

export default () => createMuiTheme({
  palette: {
    primary: indigo,
    accent: purple,
    type: 'light',
  },
})
