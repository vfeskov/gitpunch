import { loadFullProfile, addUser } from '../db'
import { success, badRequest, logErrAndNext500 } from '../util/http'
import { hash } from '../util/bcrypt'
import { validEmail, validPassword, validRepos } from '../util/validations'
import { setCookieTokenHeader, signToken } from '../util/token'

export async function register (req, res, next) {
  if (!valid(req.body)) { return next(badRequest()) }

  const { email, password, repos } = req.body

  const { found } = await loadFullProfile(email)
  if (found) { return next(badRequest()) }

  const passwordEncrypted = await hash(password, 10)
  await addUser(email, passwordEncrypted, repos)

  const token = signToken({ email })
  const body = { email, watching: true, repos }
  success(res, body, setCookieTokenHeader(token))
}

function valid (payload) {
  const { email, password, repos } = payload
  if (!email || !validEmail(email)) { return false }
  if (!password || !validPassword(password)) { return false }
  if (repos && !validRepos(repos)) { return false }
  return true
}
