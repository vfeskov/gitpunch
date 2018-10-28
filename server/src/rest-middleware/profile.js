import { success } from '../util/http'
import { serialize } from '../util/serialize'
import pick from 'lodash.pick'

export async function get ({ user }, res) {
  success(res, serialize(user))
}

const EDITABLE = ['checkAt', 'frequency', 'watching', 'watchingStars', 'repos']
export async function patch ({ body, user }, res, next) {
  if (!body) { return next(badRequest()) }
  EDITABLE.forEach(param => {
    if (typeof body[param] !== 'undefined') {
      user[param] = body[param]
    }
  })
  if (user.errors()) { return next(badRequest()) }
  await user.save()
  success(res, serialize(pick(user, EDITABLE)))
}
