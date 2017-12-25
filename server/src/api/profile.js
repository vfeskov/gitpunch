import { loadProfile } from '../db'
import { internalServerError, unauthorized, success, logAndNextError } from '../util/http'

export function profile ({ token }, res, next) {
  if (!token) { return next(unauthorized()) }

  const { email } = token
  loadProfile(email).then(
    success(res),
    logAndNextError(next, internalServerError())
  )
}
