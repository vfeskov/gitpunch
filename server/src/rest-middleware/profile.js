import { loadUser } from '../db'
import { unauthorized, success, logErrAndNext500 } from '../util/http'
import serialize from '../util/serialize'

export async function profile ({ token, headers }, res, next) {
  if (!token) { return next(unauthorized()) }
  const user = await loadUser(token)
  user ? success(res, serialize(user)) : next(unauthorized())
}
