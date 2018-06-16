import { loadUser, createUser } from '../db'
import { success, badRequest, logErrAndNext500 } from '../util/http'
import { hash } from '../util/bcrypt'
import { validEmail, validPassword, validSignUpRepos } from '../util/validations'
import { setCookieTokenHeader, signToken } from '../util/token'
import { serializeUser } from '../util/serialize'
import { compareHash } from '../util/bcrypt'
import signUpReposToDbRepos from '../util/signUpReposToDbRepos'

export default async function signIn (req, res, next) {
  if (!valid(req.body)) { return next(badRequest()) }
  let { email, password, repos: reqRepos } = req.body
  let user = await loadUser({ email })
  if (user) {
    if (!user.passwordEncrypted) { return next(badRequest()) }
    const match = await compareHash(password, user.passwordEncrypted)
    if (!match) { return next(badRequest()) }
  } else {
    const passwordEncrypted = await hash(password, 10)
    const { repos, mutedRepos } = await signUpReposToDbRepos(reqRepos)
    user = await createUser({ email, passwordEncrypted, repos, mutedRepos })
  }
  const token = signToken({ id: user.id })
  const headers = { 'Set-Cookie': setCookieTokenHeader(token) }
  success(res, serializeUser(user), headers)
}

function valid (payload) {
  const { email, password, repos } = payload
  if (!email || !validEmail(email)) { return false }
  if (!password || !validPassword(password)) { return false }
  if (repos && !validSignUpRepos(repos)) { return false }
  return true
}
