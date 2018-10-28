import { routes as rawRoutes } from './_routes'
import { prepareRoutes, routeMatchesRequest, parseRouteParams } from '../util/routes'
import { logErrAndNext500, unauthorized, badRequest } from '../util/http'

export default function api () {
  const routes = prepareRoutes(rawRoutes)
  return async (req, res, next) => {
    const route = routes.find(routeMatchesRequest(req))
    if (!route) { return next() }
    try {
      parseRouteParams(req, route)
    } catch (err) {
      return next(badRequest())
    }
    try {
      parseRouteParams(req, route)
      if (!route.options.skipAuth && !req.user) {
        return next(unauthorized())
      }
      await route.handler(req, res, next)
    } catch (err) {
      logErrAndNext500(err, next)
    }
  }
}
