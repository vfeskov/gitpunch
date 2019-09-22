import { success, badRequest, internalServerError } from '../util/http'
import { serialize } from '../util/serialize'
import pick from 'lodash.pick'

export async function get ({ user }, res) {
  success(res, serialize(user))
}

const EDITABLE = ['checkAt', 'frequency', 'watching', 'watchingStars', 'repos', 'email']
export async function patch ({ body, user }, res, next) {
  if (!body) { return next(badRequest()) }
  const params = EDITABLE
    .filter(param => typeof body[param] !== 'undefined')
    .reduce((r, param) => ({ ...r, [param]: body[param] }), {});
  if (user.validate(params)) { return next(badRequest()) }
  try {
    await user.update(params)
    success(res, serialize(pick(user, EDITABLE)))
  } catch (e) {
    // if email is already taken by another account
    if (e.message.indexOf('E11000 duplicate key error') === 0) {
      return next(badRequest())
    } else {
      return next(internalServerError());
    }
  }

}
