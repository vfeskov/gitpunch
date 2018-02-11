import React from 'react'
import { renderToString } from 'react-dom/server'
import Root from './containers/Root'
import { SheetsRegistry } from 'react-jss/lib/jss'
import JssProvider from 'react-jss/lib/JssProvider'
import { MuiThemeProvider, createGenerateClassName } from 'material-ui/styles'
import configureStore from './store/configureStore'
import rootSaga from './sagas'
import createTheme from './theme/createTheme'
import * as api from './services/api'

export async function renderToStrings (serverPort, fetchOpts) {
  api.setBase({
    url: `http://localhost:${serverPort}`,
    opts: fetchOpts
  })

  const store = configureStore()
  const sagaDone = store.runSaga(rootSaga).done
  store.close()
  await sagaDone
  const sheetsRegistry = new SheetsRegistry()
  const theme = createTheme()
  const generateClassName = createGenerateClassName()

  const html = renderToString(
    <JssProvider registry={sheetsRegistry} generateClassName={generateClassName}>
      <MuiThemeProvider theme={theme} sheetsManager={new Map()}>
        <Root store={store} />
      </MuiThemeProvider>
    </JssProvider>
  )
  const css = sheetsRegistry.toString()
  const state = JSON.stringify(store.getState())

  return { html, css, state }
}
