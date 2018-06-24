import { updateUser } from '../db'
import { success, unauthorized, badRequest } from '../util/http'
import { validWatchingStars } from '../util/validations'

export default async function watchingStars ({ body, token }, res, next) {
  if (!token) { return next(unauthorized()) }
  if (!body || !validWatchingStars(body.watchingStars)) { return next(badRequest()) }
  const attrs = { watchingStars: body.watchingStars }
  await updateUser(token, attrs)
  success(res, attrs)
}
