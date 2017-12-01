import * as JWT from 'jsonwebtoken'
import * as Bcrypt from 'bcryptjs'
import { badData, badImplementation } from 'boom'
import { loadFullProfile, addUser } from '../../db'
import { Observable as $ } from 'rxjs/Observable'
import { validEmail, validPassword, validRepos } from '../validations'
const hash: (data: any, rounds: number) => $<string> = $.bindNodeCallback(Bcrypt.hash.bind(Bcrypt))

export function registerRouteHandler (cookieOptions, jwtSecret) {
  return ({ payload }, reply) => {
    if (!valid(payload)) {
      return reply(badData('Invalid payload'))
    }
    const { email, password, repos } = payload
    loadFullProfile(email)
      .pluck('found')
      .mergeMap(found => {
        if (found) { return $.of({ error: badData('email is taken') } as any) }
        return hash(password, 10)
          .mergeMap(passwordEncrypted => addUser(email, passwordEncrypted, repos))
          .catch(() => $.of({ error: badImplementation() }))
          .map(() => {
            return { token: JWT.sign({ email }, jwtSecret) }
          })
      })
      .subscribe(({ error, token }) => {
        if (error) { return reply(error) }
        reply({ email, watching: true, repos }).state('token', token, cookieOptions)
      })
  }
}

function valid (payload) {
  const { email, password, repos } = payload
  if (!email || !validEmail(email)) { return false }
  if (!password || !validPassword(password)) { return false }
  if (repos && !validRepos(repos)) { return false }
  return true
}
