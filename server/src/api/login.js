import { loadFullProfile } from '../db'
import { success, logErrAndNext500, badRequest } from '../util/http'
import { compareHash } from '../util/bcrypt'
import { validEmail, validPassword } from '../util/validations'
import { setCookieTokenHeader, signToken } from '../util/token'

export async function login (req, res, next) {
  if (!valid(req.body)) { return next(badRequest()) }

  const { email, password } = req.body

  const { found, passwordEncrypted, watching, repos } = await loadFullProfile(email)
  if (!found) { return next(badRequest()) }

  const match = await compareHash(password, passwordEncrypted)
  if (!match) { return next(badRequest()) }

  const token = signToken({ email })
  const body = { email, watching, repos }

  success(res, body, setCookieTokenHeader(token))
}

function valid (body) {
  const { email, password } = body
  if (!email || !validEmail(email)) { return false }
  if (!password || !validPassword(password)) { return false }
  return true
}
