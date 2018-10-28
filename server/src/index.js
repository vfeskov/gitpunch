import http from 'http'
import parseCookies from 'cookie-parser'
import parseBody from 'body-parser'
import compression from 'compression'
import rest from './rest-middleware'
import parseParams from './other-middlewares/parseParams'
import loadUser from './other-middlewares/loadUser'
import error from './other-middlewares/error'
import chain from './util/chain'
import * as publicEvents from './public-events'
import syncStars from './sync-stars'

const port = process.env.PORT || 3000

const middlewares = []

middlewares.push(
  parseParams,
  parseCookies(),
  parseBody.json(),
  loadUser,
  compression(),
  rest()
)

if (process.env.NODE_ENV === 'production') {
  const serveStatic = require('serve-static')
  const { prerenderClient } = require('./other-middlewares/prerenderClient')

  middlewares.push(
    serveStatic('./public'),
    prerenderClient(port)
  )
}

middlewares.push(error)

const server = http.createServer(chain(middlewares))

server.listen(port, (e, s) => {
  if (e) { return console.error(e) }
  console.log('Listening on ', server.address())
})

if (!process.env.DONT_MONITOR_EVENTS) {
  console.log('Monitoring public github events')
  publicEvents.monitor()
}

if (!process.env.DONT_SYNC_STARS) {
  console.log('Syncing stars')
  syncStars()
}
