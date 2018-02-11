export default function oathUrl ({ repos, returnTo }) {
  // eslint-disable-next-line no-restricted-globals
  let { hostname, protocol, port } = location
  if (hostname === 'localhost') { port = 3001 }
  let params = [];
  if (repos && repos.length) { params.push(`repos=${JSON.stringify(repos)}`); }
  if (returnTo) { params.push(`returnTo=${returnTo}`)}
  params = params.join('&')
  return `${protocol}//${hostname}${port && ':' + port}/api/oauth/start${params && '?' + params}`
}
