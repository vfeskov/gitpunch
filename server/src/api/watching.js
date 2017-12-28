import { saveWatching } from '../db'
import { success, unauthorized, badRequest, logErrAndNext500 } from '../util/http'
import { validWatching } from '../util/validations'

export async function watching ({ body, token }, res, next) {
  try {
    if (!token) { return next(unauthorized()) }
    if (!body || !validWatching(body.watching)) { return next(badRequest()) }

    const { watching } = body
    const { email } = token
    const payload = await saveWatching(email, watching)
    success(res, payload)
  } catch (err) {
    logErrAndNext500(err, next)
  }
}
