import http from 'http'
import parseCookies from 'cookie-parser'
import parseBody from 'body-parser'
import compression from 'compression'
import rest from './rest-middleware'
import parseParams from './other-middlewares/parseParams'
import parseToken from './other-middlewares/parseToken'
import error from './other-middlewares/error'
import chain from './util/chain'
import * as publicEvents from './public-events'

const port = process.env.PORT || 3000

const production = process.env.NODE_ENV === 'production'

const middlewares = []

middlewares.push(
  parseParams,
  parseCookies(),
  parseBody.json(),
  parseToken,
  compression(),
  rest()
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

publicEvents.monitor()
