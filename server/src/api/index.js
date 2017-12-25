import { routes as rawRoutes } from './_routes'
import { prepareRoutes, routeMatchesRequest, parseRouteParams } from '../util/routes'
const { assign, keys } = Object

export function api () {
  const routes = prepareRoutes(rawRoutes)

  return (req, res, next) => {
    const route = routes.find(routeMatchesRequest(req))
    if (!route) { return next() }

    parseRouteParams(req, route)

    route.handler(req, res, next)
  }
}
