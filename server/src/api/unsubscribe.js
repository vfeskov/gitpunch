import { saveWatching } from '../db'
import { success, badRequest, logErrAndNext500 } from '../util/http'
import { verifyUnsubscribeToken } from '../util/token'

export async function unsubscribe ({ body }, res, next) {
  if (!body || !body.lambdajwt) { return next(badRequest()) }

  let email
  try {
    const payload = await verifyUnsubscribeToken(body.lambdajwt)
    email = payload.email
  } catch (e) {
    return next(badRequest())
  }

  await saveWatching(email, false)

  success(res, { email, watching: false })
}
