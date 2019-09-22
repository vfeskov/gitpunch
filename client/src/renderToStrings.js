import React from 'react'
import { renderToString } from 'react-dom/server'
import Root from './components/Root'
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider'
import configureStore from './store/configureStore'
import rootSaga from './sagas'
import createTheme from './theme/createTheme'
import * as api from './services/api'
import * as cookieSvc from './services/cookie'
import { StaticRouter } from 'react-router-dom'
import { ServerStyleSheets } from '@material-ui/styles'

export function renderToStrings (serverPort, cookie, url) {
  api.setBase({
    url: `http://localhost:${serverPort}`,
    opts: { headers: { cookie } }
  })
  cookieSvc.setSource(cookie)

  const store = configureStore()
  const theme = createTheme()
  const sheets = new ServerStyleSheets();
  const routerContext = {}
  const rootComp = sheets.collect(
    <StaticRouter location={url} context={routerContext}>
      <MuiThemeProvider theme={theme} sheetsManager={new Map()}>
        <Root store={store} />
      </MuiThemeProvider>
    </StaticRouter>
  )

  const stringsPromise = store.runSaga(rootSaga).toPromise().then(() => {
    const html = renderToString(rootComp)
    const css = sheets.toString()
    const state = JSON.stringify(store.getState())
    return { html, css, state }
  })

  renderToString(rootComp)
  store.close()

  return stringsPromise
}
