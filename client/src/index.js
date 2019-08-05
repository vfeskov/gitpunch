import 'typeface-roboto'
import React from 'react'
import { render } from 'react-dom'
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider'
import configureStore from './store/configureStore'
import rootSaga from './sagas'
import createTheme from './theme/createTheme'
import Root from './components/Root'
import registerServiceWorker from './registerServiceWorker'
import { BrowserRouter } from 'react-router-dom'
import ScrollToTop from './components/ScrollToTop'

const store = configureStore(window.__INITIAL_STATE__)
store.runSaga(rootSaga)
const theme = createTheme()

render(
  <MuiThemeProvider theme={theme}>
    <BrowserRouter>
      <ScrollToTop>
        <Root store={store} />
      </ScrollToTop>
    </BrowserRouter>
  </MuiThemeProvider>,
  document.getElementById('root')
)

registerServiceWorker()
