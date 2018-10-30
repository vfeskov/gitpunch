export function oauthUrl ({ repos, returnTo }) {
  // eslint-disable-next-line no-restricted-globals
  let { hostname, protocol, port } = location
  if (process.env.NODE_ENV === 'development' && port === 3000) { port = 3001 }
  let params = [];
  if (repos && repos.length) { params.push(`repos=${JSON.stringify([...repos].reverse())}`); }
  if (returnTo) { params.push(`returnTo=${returnTo}`)}
  params = params.join('&')
  return `${protocol}//${hostname}${port && ':' + port}/api/oauth/start${params && '?' + params}`
}
