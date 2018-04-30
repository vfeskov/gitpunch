import http from 'http'
import parseCookies from 'cookie-parser'
import parseBody from 'body-parser'
import compression from 'compression'
import api from './api-middleware'
import redirectToMainDomain from './other-middlewares/redirectToMainDomain'
import parseParams from './other-middlewares/parseParams'
import parseToken from './other-middlewares/parseToken'
import error from './other-middlewares/error'
import chain from './util/chain'

const port = process.env.PORT || 3000

const production = process.env.NODE_ENV === 'production'

const middlewares = []

if (production) {
  middlewares.push(redirectToMainDomain)
}

middlewares.push(
  compression(),
  parseParams,
  parseCookies(),
  parseBody.json(),
  parseToken,
  api()
)

if (production) {
  const serveStatic = require('serve-static')
  const { prerenderClient } = require('./other-middlewares/prerenderClient')

  middlewares.push(
    serveStatic('./public'),
    prerenderClient(port)
  )
}

middlewares.push(error)

const server = http.createServer(chain(middlewares))

server.listen(port)
