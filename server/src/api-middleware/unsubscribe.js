import { update, load } from '../db'
import { success, badRequest, logErrAndNext500 } from '../util/http'
import { verifyUnsubscribeToken } from '../util/token'

export async function unsubscribe ({ body, token }, res, next) {
  if (!body || !body.lambdajwt) { return next(badRequest()) }
  try {
    const unsubscribeToken = await verifyUnsubscribeToken(body.lambdajwt)
    await update(unsubscribeToken, { watching: false })
    let sameUser = false
    if (token) {
      const currentUser = await load(token)
      sameUser = currentUser && currentUser.email === unsubscribeToken.email
    }
    success(res, {
      watching: false,
      sameUser
    })
  } catch (e) {
    return next(badRequest())
  }
}
