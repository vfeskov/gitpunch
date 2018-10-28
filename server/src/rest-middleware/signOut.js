import { unsetCookieTokenHeader } from '../util/token'

export default function signOut (req, res) {
  res.writeHead(200, { 'Set-Cookie': unsetCookieTokenHeader() })
  res.end()
}
