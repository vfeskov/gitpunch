import { Observable as $ } from 'rxjs/Observable'
import { badImplementation, badData } from 'boom'
import { saveWatching } from '../../db'
import { validWatching } from '../validations'

export function watchingRouteHandler ({ payload, auth }, reply) {
  const { watching } = payload
  if (!validWatching(watching)) {
    return reply(badData('payload required'))
  }
  const { email } = auth.credentials
  saveWatching(email, watching)
    .catch(error => {
      console.error(error)
      return $.of(badImplementation())
    })
    .subscribe(reply)
}
