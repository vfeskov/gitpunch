import { loadUser } from '../db'
import { unauthorized, success } from '../util/http'
import { serializeUser } from '../util/serialize'

export async function profile ({ token }, res, next) {
  if (!token) { return next(unauthorized()) }
  const user = await loadUser(token)
  user ? success(res, serializeUser(user)) : next(unauthorized())
}
