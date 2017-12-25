import { saveWatching } from '../db'
import { success, unauthorized, internalServerError, badRequest, logAndNextError } from '../util/http'
import { validWatching } from '../util/validations'

export function watching ({ body, token }, res, next) {
  if (!token) { return next(unauthorized()) }
  if (!body || !validWatching(body.watching)) { return next(badRequest()) }

  const { watching } = body
  const { email } = token
  saveWatching(email, watching)
    .then(
      success(res),
      logAndNextError(next, internalServerError())
    )
}
