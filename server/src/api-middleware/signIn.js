import { load, create } from '../db'
import { success, badRequest, logErrAndNext500 } from '../util/http'
import { hash } from '../util/bcrypt'
import { validEmail, validPassword, validRepos } from '../util/validations'
import { setCookieTokenHeader, signToken } from '../util/token'
import serialize from '../util/serialize'
import { compareHash } from '../util/bcrypt'

export default async function signIn (req, res, next) {
  if (!valid(req.body)) { return next(badRequest()) }
  const { email, password, repos } = req.body
  let user = await load({ email })
  if (user) {
    if (!user.passwordEncrypted) { return next(badRequest()) }
    const match = await compareHash(password, user.passwordEncrypted)
    if (!match) { return next(badRequest()) }
  } else {
    const passwordEncrypted = await hash(password, 10)
    user = await create({ email, passwordEncrypted, repos })
  }
  const token = signToken({ id: user.id })
  const headers = { 'Set-Cookie': setCookieTokenHeader(token) }
  success(res, serialize(user), headers)
}

function valid (payload) {
  const { email, password, repos } = payload
  if (!email || !validEmail(email)) { return false }
  if (!password || !validPassword(password)) { return false }
  if (repos && !validRepos(repos)) { return false }
  return true
}
