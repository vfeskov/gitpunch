import fs from 'fs'
import { renderToStrings } from '../../../client/src/renderToStrings'
import globalLocation from '../util/globalLocation'

export function prerenderClient (port) {
  globalLocation()
  const layout = fs.readFileSync('./public/layout.html').toString()
  return async ({ method, headers, url }, res, next) => {
    if (method !== 'GET') { return next() }
    const { html, state, css } = await renderToStrings(port, headers.cookie, url)
    const content = layout
      .replace(
        '<div id="root"></div>',
        `<div id="root">${html}</div>`
      )
      .replace(
        '</head>',
        `<script>window.__INITIAL_STATE__=${state}</script></head>`
      )
      .replace(
        '<body>',
        `<body><style id="jss-server-side">${css}</style>`
      )
    res.writeHead(200, {
      'Content-Type': 'text/html; charset=UTF-8',
      'Content-Length': Buffer.from(content).length
    })
    res.end(content)
  }
}
