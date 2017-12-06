
import * as jwtSettings from '../jwt-settings'
import * as JWT from 'jsonwebtoken'
import * as fs from 'fs'
import { loadProfile } from '../../db'
import { Observable as $ } from 'rxjs/Observable'
import { badImplementation } from 'boom'
import { validEmail } from '../validations'
import { reactApp } from '../../../client/src/serverSide'

export function makeHandler () {
  const layout = fs.readFileSync('public/index.html').toString()

  return (request, reply) => getProfile(request, profile => {
    const app = reactApp(profile)
    const initState = JSON.stringify(app.state)
    const content = layout
      .replace(
        '<div id="root"></div>',
        `<div id="root">${app.html}</div>`
      )
      .replace(
        '</head>',
        `<script>window.__INITIAL_STATE__='${initState}'</script></head>`
      )
      .replace(
        '<body>',
        `<body><style id="jss-server-side">${app.css}</style>`
      )
    const response = reply(content)
    response.type('text/html')
    response.bytes(Buffer.from(content).length)
  })
}

function getProfile (request, cb) {
  const { token } = request.state
  if (!token) { return cb() }

  JWT.verify(
    token,
    jwtSettings.key,
    jwtSettings.verifyOptions,
    (error, { email }: any) => {
      if (error || !email || !validEmail(email)) { return cb() }
      loadProfile(email).subscribe(
        profile => cb(profile),
        () => cb()
      )
    }
  )
}
