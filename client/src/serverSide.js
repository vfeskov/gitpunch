import React from 'react'
import { createStore } from 'redux'
import { reducer as rootReducer } from './reducers'
import { receiveProfile, errorProfile } from './actions'
import { Provider } from 'react-redux'
import { renderToString } from 'react-dom/server'
import { App } from './App'
import { SheetsRegistry } from 'react-jss/lib/jss'
import JssProvider from 'react-jss/lib/JssProvider'
import { create } from 'jss'
import preset from 'jss-preset-default'
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles'
import createGenerateClassName from 'material-ui/styles/createGenerateClassName'
import { indigo, purple } from 'material-ui/colors'

export function reactApp (profile) {
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
  const jss = create(preset())
  jss.options.createGenerateClassName = createGenerateClassName
  const html = renderToString(
    <JssProvider registry={sheetsRegistry} jss={jss}>
      <MuiThemeProvider theme={theme} sheetsManager={new Map()}>
        <Provider store={store}>
          <App />
        </Provider>
      </MuiThemeProvider>
    </JssProvider>
  )
  const css = sheetsRegistry.toString()
  return {
    html,
    css,
    state: store.getState()
  }
}
