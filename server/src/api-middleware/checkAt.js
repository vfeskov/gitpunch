import { update, load } from '../db'
import { success, unauthorized, badRequest, logErrAndNext500 } from '../util/http'
import { validCheckAt } from '../util/validations'

export default async function checkAt ({ body, token }, res, next) {
  if (!token) { return next(unauthorized()) }
  if (!body || !validCheckAt(body.checkAt)) { return next(badRequest()) }
  const user = await load(token)
  if (user.frequency !== 'daily') { return next(badRequest()) }
  const attrs = { checkAt: body.checkAt }
  await update(token, attrs)
  success(res, attrs)
}
