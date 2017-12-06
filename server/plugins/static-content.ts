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
          index: false
        }
      }
    })
    callback()
  })
}

(register as any).attributes = {
  name: 'static-content',
  version: '1.0.0'
}
