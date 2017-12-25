import finalhandler from 'finalhandler'

export function error (req, res, next, err) {
  return finalhandler(req, res)(err)
}
