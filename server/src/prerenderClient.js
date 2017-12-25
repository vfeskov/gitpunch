import fs from 'fs'
import { renderToStrings } from '../../client/src/renderToStrings'
import { loadProfile } from './db'

export function prerenderClient () {
  const layout = fs.readFileSync('./public/layout.html').toString()

  return (req, res, next) => {
    if (req.method !== 'GET') { return next() }

    getProfile(req, profile => {
      const app = renderToStrings(profile)
      const content = layout
        .replace(
          '<div id="root"></div>',
          `<div id="root">${app.html}</div>`
        )
        .replace(
          '</head>',
          `<script>window.__INIT_STATE__=${app.state}</script></head>`
        )
        .replace(
          '<body>',
          `<body><style id="jss-server-side">${app.css}</style>`
        )
      res.writeHead(200, {
        'Content-Type': 'text-html',
        'Content-Length': Buffer.from(content).length
      })
      res.end(content)
    })
  }
}

function getProfile (req, cb) {
  if (!req.token) { return cb() }

  const { email } = req.token
  loadProfile(email)
    .then(
      profile => cb(profile),
      () => cb()
    )
}
