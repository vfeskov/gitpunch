import { load } from '../db'
import { success, logErrAndNext500, badRequest } from '../util/http'
import { compareHash } from '../util/bcrypt'
import { validEmail, validPassword } from '../util/validations'
import { setCookieTokenHeader, signToken } from '../util/token'
import { serialize } from '../util/serialize'

export async function login (req, res, next) {
  if (!valid(req.body)) { return next(badRequest()) }
  const { email, password } = req.body
  const user = await load({ email })
  if (!user) { return next(badRequest()) }
  const match = await compareHash(password, user.passwordEncrypted)
  if (!match) { return next(badRequest()) }
  const token = signToken({ id: user.id })
  success(res, serialize(user), setCookieTokenHeader(token))
}

function valid (body) {
  const { email, password } = body
  if (!email || !validEmail(email)) { return false }
  if (!password || !validPassword(password)) { return false }
  return true
}
