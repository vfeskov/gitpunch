import http from 'http'
import parseCookies from 'cookie-parser'
import parseBody from 'body-parser'
import compression from 'compression'
import api from './api-middleware'
import parseParams from './other-middlewares/parseParams'
import parseToken from './other-middlewares/parseToken'
import error from './other-middlewares/error'
import chain from './util/chain'

const envSpecificMiddlewares = []

if (process.env.NODE_ENV === 'production') {
  const serveStatic = require('serve-static')
  const { prerenderClient } = require('./other-middlewares/prerenderClient')

  envSpecificMiddlewares.push(
    serveStatic('./public'),
    prerenderClient()
  )
}

const middlewares = [
  compression(),
  parseParams,
  parseCookies(),
  parseBody.json(),
  parseToken,
  api(),
  ...envSpecificMiddlewares,
  error
]

const server = http.createServer(chain(middlewares))

server.listen(process.env.PORT || 3000)
