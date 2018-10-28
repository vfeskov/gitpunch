const { assign, keys } = Object

export function prepareRoutes (routes) {
  return keys(routes)
    .map(route => {
      const [method, url] = route.split(' ', 2)
      const urlRegExp = new RegExp(`^${url.replace(/\:[^\/]+/g, '([^/]+)')}(\\?.+)?$`)
      const paramNames = (url.match(/\:[^\/]+/g) || []).map(n => n.substr(1))
      const [handler, options] = Array.isArray(routes[route]) ? routes[route] : [routes[route], {}]
      return { method, url, urlRegExp, paramNames, handler, options }
    })
}

export function routeMatchesRequest (req) {
  return ({ method, urlRegExp }) => {
    return req.method === method && urlRegExp.test(req.url)
  }
}

export function parseRouteParams (req, { paramNames, urlRegExp }) {
  if (!paramNames.length) { return }

  const values = req.url.match(urlRegExp).slice(1)
  req.params = assign(
    (req.params || {}),
    ...paramNames.map((name, i) => ({
      [name]: decodeURIComponent(values[i])
    })
  ))
}
