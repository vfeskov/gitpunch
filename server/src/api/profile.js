import { loadProfile } from '../db'
import { unauthorized, success, logErrAndNext500 } from '../util/http'

export async function profile ({ token }, res, next) {
  try {
    if (!token) { return next(unauthorized()) }

    const profile  = await loadProfile(token.email)

    success(res, profile)
  } catch (err) {
    logErrAndNext500(err, next)
  }
}
