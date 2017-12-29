import http from 'http'
import parseCookies from 'cookie-parser'
import parseBody from 'body-parser'
import compression from 'compression'
import { parseToken } from './parseToken'
import { api } from './api'
import { error } from './error'
import { chain } from './util/chain'

const envSpecificMiddlewares = []

if (process.env.NODE_ENV === 'production') {
  const serveStatic = require('serve-static')
  const { prerenderClient } = require('./prerenderClient')

  envSpecificMiddlewares.push(
    serveStatic('./public'),
    prerenderClient()
  )
}

const middlewares = [
  compression(),
  parseCookies(),
  parseBody.json(),
  parseToken,
  api(),
  ...envSpecificMiddlewares,
  error
]

const server = http.createServer(chain(middlewares))

server.listen(process.env.PORT || 3000)
