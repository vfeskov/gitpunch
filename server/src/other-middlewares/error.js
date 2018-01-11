import finalhandler from 'finalhandler'

export default function error (req, res, next, err) {
  return finalhandler(req, res)(err)
}
