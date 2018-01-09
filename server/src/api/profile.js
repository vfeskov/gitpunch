import { load } from '../db'
import { unauthorized, success, logErrAndNext500 } from '../util/http'
import { serialize } from '../util/serialize'

export async function profile ({ token }, res, next) {
  if (!token) { return next(unauthorized()) }
  const user = await load(token)
  success(res, serialize(user))
}
