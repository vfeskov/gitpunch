import { updateUser } from '../db'
import { success, unauthorized, badRequest, logErrAndNext500 } from '../util/http'
import { validWatching } from '../util/validations'

export async function watching ({ body, token }, res, next) {
  if (!token) { return next(unauthorized()) }
  if (!body || !validWatching(body.watching)) { return next(badRequest()) }
  const attrs = { watching: body.watching }
  await updateUser(token, attrs)
  success(res, attrs)
}
