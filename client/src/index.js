import 'typeface-roboto'
import 'isomorphic-fetch'
import thunkMiddleware from 'redux-thunk'
import { createLogger } from 'redux-logger'
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import './index.css'
import { App } from './App'
import { reducer as rootReducer } from './reducers'
import { indigo, purple } from 'material-ui/colors'
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles'
import { unregister } from './registerServiceWorker'

const loggerMiddleware = createLogger()

const initState = window.__INITIAL_STATE__ && JSON.parse(window.__INITIAL_STATE__)

const store = createStore(
  rootReducer,
  initState,
  applyMiddleware(thunkMiddleware, loggerMiddleware)
)

const theme = createMuiTheme({
  palette: {
    primary: indigo,
    accent: purple,
    type: 'light',
  },
})

ReactDOM.render(
  <MuiThemeProvider theme={theme}>
    <Provider store={store}>
      <App />
    </Provider>
  </MuiThemeProvider>,
  document.getElementById('root')
)

unregister()
