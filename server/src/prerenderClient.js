import fs from 'fs'
import { renderToStrings } from '../../client/src/renderToStrings'
import { loadProfile } from './db'

export function prerenderClient () {
  const layout = fs.readFileSync('./public/layout.html').toString()

  return async (req, res, next) => {
    if (req.method !== 'GET') { return next() }

    const profile = await getProfile(req)

    const { html, state, css } = renderToStrings(profile)

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

async function getProfile ({ token }) {
  try {
    if (!token) { return null }
    return await loadProfile(token.email)
  } catch (err) {
    return null
  }
}
