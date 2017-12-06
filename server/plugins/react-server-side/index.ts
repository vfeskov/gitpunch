import { Server } from 'hapi'
import { makeHandler } from './response'

export function register (server: Server, options, callback) {
  const handler = makeHandler()
  server.route({
    method: 'GET',
    path: '/',
    config: { auth: false },
    handler
  })
  server.ext('onPostHandler', (request, reply) => {
    const response = request.response
    if (response.isBoom && (response as any).output.statusCode === 404) {
      return handler(request, reply)
    }
    return reply.continue()
  })
  callback()
}

(register as any).attributes = {
  name: 'react-server-side',
  version: '1.0.0'
}
