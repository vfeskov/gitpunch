import 'typeface-roboto'
import './index.css'
import '@babel/polyfill'
import React from 'react'
import { render } from 'react-dom'
import { MuiThemeProvider } from 'material-ui/styles'

import configureStore from './store/configureStore'
import rootSaga from './sagas'
import createTheme from './theme/createTheme'
import Root from './containers/Root'
import registerServiceWorker from './registerServiceWorker'

const store = configureStore(window.__INITIAL_STATE__)
store.runSaga(rootSaga)
const theme = createTheme()

render(
  <MuiThemeProvider theme={theme}>
    <Root store={store} />
  </MuiThemeProvider>,
  document.getElementById('root')
)

registerServiceWorker()
