import { User } from '../db'
import { success, badRequest } from '../util/http'
import { verifyUnsubscribeToken } from '../util/token'

export default async function unsubscribe ({ body, user }, res, next) {
  if (!body || !body.lambdajwt) { return next(badRequest()) }
  try {
    const unsubscribeToken = await verifyUnsubscribeToken(body.lambdajwt)
    await User.update(unsubscribeToken, { watching: false })
    const sameUser = user ? (user.email === unsubscribeToken.email) : false
    success(res, {
      watching: false,
      sameUser
    })
  } catch (e) {
    return next(badRequest())
  }
}
