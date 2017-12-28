import { loadProfile } from '../db'
import { unauthorized, success, logErrAndNext500 } from '../util/http'

export async function profile ({ token }, res, next) {
  if (!token) { return next(unauthorized()) }

  const profile  = await loadProfile(token.email)

  success(res, profile)
}
