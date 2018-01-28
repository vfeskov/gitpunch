import React from 'react'
import { createStore } from 'redux'
import { reducer as rootReducer } from './reducers'
import { receiveProfile, errorProfile } from './actions'
import { Provider } from 'react-redux'
import { renderToString } from 'react-dom/server'
import { App } from './App'
import { SheetsRegistry } from 'react-jss/lib/jss'
import JssProvider from 'react-jss/lib/JssProvider'
import { MuiThemeProvider, createMuiTheme, createGenerateClassName } from 'material-ui/styles'
import { indigo, purple } from 'material-ui/colors'

export function renderToStrings (profile) {
  const store = createStore(rootReducer)
  store.dispatch(
    profile ? receiveProfile(profile) : errorProfile()
  )
  const sheetsRegistry = new SheetsRegistry()
  const theme = createMuiTheme({
    palette: {
      primary: indigo,
      accent: purple,
      type: 'light',
    },
  })
  const generateClassName = createGenerateClassName()

  const html = renderToString(
    <JssProvider registry={sheetsRegistry} generateClassName={generateClassName}>
      <MuiThemeProvider theme={theme} sheetsManager={new Map()}>
        <Provider store={store}>
          <App />
        </Provider>
      </MuiThemeProvider>
    </JssProvider>
  )
  const css = sheetsRegistry.toString()
  const state = JSON.stringify(JSON.stringify(store.getState()))

  return { html, css, state }
}
