import { Server } from 'hapi'
import * as inert from 'inert'

export function register (server: Server, options, callback) {
  server.register(inert, error => {
    error && console.error(error)
    server.route({
      method: 'GET',
      path: '/{param*}',
      config: { auth: false },
      handler: {
        directory: {
          path: 'public',
          listing: false,
          index: true
        }
      }
    })
    server.ext('onPostHandler', (request, reply) => {
      const response = request.response
      if (response.isBoom && (response as any).output.statusCode === 404) {
        return (reply as any).file('public/index.html')
      }
      return reply.continue()
    })
    callback()
  })
}

(register as any).attributes = {
  name: 'static-content',
  version: '1.0.0'
}
