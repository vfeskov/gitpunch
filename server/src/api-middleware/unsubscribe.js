import { update } from '../db'
import { success, badRequest, logErrAndNext500 } from '../util/http'
import { verifyUnsubscribeToken } from '../util/token'

export async function unsubscribe ({ body }, res, next) {
  if (!body || !body.lambdajwt) { return next(badRequest()) }
  try {
    const token = await verifyUnsubscribeToken(body.lambdajwt)
    const attrs = { watching: false }
    await update(token, attrs)
    success(res, attrs)
  } catch (e) {
    return next(badRequest())
  }
}
