import { Server } from 'hapi'
import * as hapiAuthJWT from 'hapi-auth-jwt2'
import { Observable as $ } from 'rxjs/Observable'
import { registerRouteHandler } from './register'
import { loginRouteHandler } from './login'
import * as jwtSettings from '../jwt-settings'
const { WAB_JWT_SECRET } = process.env
const COOKIE_OPTIONS = {
  ttl: 365 * 24 * 60 * 60 * 1000,
  encoding: 'none',
  isSecure: false,
  isHttpOnly: true,
  clearInvalid: false,
  strictHeader: true,
  path: '/'
}

export function register (server: Server, options, callback) {
  server.register(hapiAuthJWT, error => {
    server.auth.strategy('jwt', 'jwt', jwtSettings)

    server.auth.default('jwt')

    server.route([{
      method: 'POST',
      path: '/api/register',
      config: { auth: false },
      handler: registerRouteHandler(COOKIE_OPTIONS, WAB_JWT_SECRET)
    }, {
      method: 'POST',
      path: '/api/login',
      config: { auth: false },
      handler: loginRouteHandler(COOKIE_OPTIONS, WAB_JWT_SECRET)
    }, {
      method: 'DELETE',
      path: '/api/logout',
      handler(request, reply) {
        reply('success').unstate('token', COOKIE_OPTIONS as any)
      }
    }])

    callback()
  })
}

(register as any).attributes = {
  name: 'auth',
  version: '1.0.0'
}
