import { unsetCookieTokenHeader } from '../util/token'

export function logout (req, res, next) {
  res.writeHead(200, unsetCookieTokenHeader())
  res.end()
}
