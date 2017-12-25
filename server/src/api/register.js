import { loadFullProfile, addUser } from '../db'
import { success, internalServerError, badRequest, logAndNextError } from '../util/http'
import { hash } from '../util/bcrypt'
import { validEmail, validPassword, validRepos } from '../util/validations'
import { setCookieTokenHeader, signToken } from '../util/token'

export function register (req, res, next) {
  if (!valid(req.body)) { return next(badRequest()) }

  const { email, password, repos } = req.body
  loadFullProfile(email)
    .then(({ found }) => {
      if (found) { return { error: badRequest() } }
      return hash(password, 10)
        .then(passwordEncrypted => addUser(email, passwordEncrypted, repos))
        .then(() => ({ token: signToken({ email }) }))
    })
    .then(
      ({ error, token }) => {
        if (error) { return next(error) }

        const body = { email, watching: true, repos }
        success(res)(body, setCookieTokenHeader(token))
      },
      logAndNextError(next, internalServerError())
    )
}

function valid (payload) {
  const { email, password, repos } = payload
  if (!email || !validEmail(email)) { return false }
  if (!password || !validPassword(password)) { return false }
  if (repos && !validRepos(repos)) { return false }
  return true
}
