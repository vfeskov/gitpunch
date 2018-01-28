import fs from 'fs'
import { renderToStrings } from '../../../client/src/renderToStrings'
import { load } from '../db'
import serialize from '../util/serialize'
import globalLocation from '../util/globalLocation'

export function prerenderClient () {
  globalLocation()
  const layout = fs.readFileSync('./public/layout.html').toString()
  return async ({ method, token }, res, next) => {
    if (method !== 'GET') { return next() }
    const user = token && await load(token).catch(() => null)
    const { html, state, css } = renderToStrings(serialize(user))
    const content = layout
      .replace(
        '<div id="root"></div>',
        `<div id="root">${html}</div>`
      )
      .replace(
        '</head>',
        `<script>window.__INIT_STATE__=${state}</script></head>`
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
