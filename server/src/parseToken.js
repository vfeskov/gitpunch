import { verifyToken } from './util/token'

export function parseToken (req, res, next) {
  if (req.cookies && req.cookies.token) {
    return verify(req.cookies.token, req, next)
  }
  next()
}

function verify (token, req, next) {
  verifyToken(
    token,
    (err, payload) => {
      if (!err) { req.token = payload }
      next()
    }
  )
}
