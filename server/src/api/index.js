import { routes as rawRoutes } from './_routes'
import { prepareRoutes, routeMatchesRequest, parseRouteParams } from '../util/routes'
import { logErrAndNext500 } from '../util/http'
const { assign, keys } = Object

export function api () {
  const routes = prepareRoutes(rawRoutes)

  return async (req, res, next) => {
    const route = routes.find(routeMatchesRequest(req))
    if (!route) { return next() }

    parseRouteParams(req, route)

    try {
      await route.handler(req, res, next)
    } catch (err) {
      logErrAndNext500(err, next)
    }
  }
}
