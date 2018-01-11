import url from 'url'
const { assign } = Object

export default function parseParams (req, res, next) {
  const parsed = url.parse(req.url)
  if (parsed.query) {
    req.params = parsed.query
      .split('&')
      .map(p => p.split('='))
      .reduce((r, [ k, v ]) => assign(r, { [k]: v }), {})
  }
  next()
}
