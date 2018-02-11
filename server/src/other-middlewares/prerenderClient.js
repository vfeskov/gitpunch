import fs from 'fs'
import { renderToStrings } from '../../../client/src/renderToStrings'
import globalLocation from '../util/globalLocation'

export function prerenderClient (port) {
  globalLocation()
  const layout = fs.readFileSync('./public/layout.html').toString()
  return async ({ method, headers }, res, next) => {
    if (method !== 'GET') { return next() }
    const fetchOpts = { headers: { cookie: headers.cookie } }
    const { html, state, css } = await renderToStrings(port, fetchOpts)
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
      'Content-Type': 'text-html',
      'Content-Length': Buffer.from(content).length
    })
    res.end(content)
  }
}
