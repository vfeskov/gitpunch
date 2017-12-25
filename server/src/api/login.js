import { loadFullProfile } from '../db'
import { success, internalServerError, badRequest, logAndNextError } from '../util/http'
import { compareHash } from '../util/bcrypt'
import { validEmail, validPassword } from '../util/validations'
import { setCookieTokenHeader, signToken } from '../util/token'

export function login ({ body }, res, next) {
  if (!valid(body)) { return next(badRequest()) }

  const { email, password } = body
  loadFullProfile(email)
    .then(({ found, passwordEncrypted, watching, repos }) => {
      const error = badRequest()
      if (!found) { return { error } }

      return compareHash(password, passwordEncrypted)
        .then(match => match ?
          { token: signToken({ email }), watching, repos } :
          { error }
        )
    })
    .then(
      ({ error, token, watching, repos }) => {
        if (error) { return next(error) }

        const body = { email, watching, repos }
        success(res)(body, setCookieTokenHeader(token))
      },
      logAndNextError(next, internalServerError())
    )
}

function valid (body) {
  const { email, password } = body
  if (!email || !validEmail(email)) { return false }
  if (!password || !validPassword(password)) { return false }
  return true
}
