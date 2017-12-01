import * as JWT from 'jsonwebtoken'
import * as Bcrypt from 'bcryptjs'
import { badData, badImplementation } from 'boom'
import { loadFullProfile } from '../../db'
import { Observable as $ } from 'rxjs/Observable'
import { validEmail, validPassword } from '../validations'
const compareHash: (data: any, encrypted: string) => $<boolean> = $.bindNodeCallback(Bcrypt.compare.bind(Bcrypt))

export function loginRouteHandler (cookieOptions, jwtSecret) {
  return ({ payload }, reply) => {
    if (!valid(payload)) { return reply(badData('Invalid payload')) }
    const { email, password } = payload
    loadFullProfile(email)
      .mergeMap(({ found, passwordEncrypted, watching, repos }) => {
        const error = badData('Incorrect email or password')
        if (!found) { return $.of({ error }) }
        return compareHash(password, passwordEncrypted)
          .map(isValid => isValid ?
            { token: JWT.sign({ email }, jwtSecret), watching, repos } :
            { error }
          )
      })
      .catch(error => {
        console.error(error)
        return $.of({ error: badImplementation() } as any)
      })
      .subscribe(({ error, token, watching, repos }) => {
        if (error) { return reply(error) }
        reply({ email, watching, repos }).state('token', token, cookieOptions)
      })
  }
}

function valid (payload) {
  const { email, password } = payload
  if (!email || !validEmail(email)) { return false }
  if (!password || !validPassword(password)) { return false }
  return true
}
