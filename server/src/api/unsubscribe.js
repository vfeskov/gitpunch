import { saveWatching } from '../db'
import { success, badRequest, logErrAndNext500 } from '../util/http'
import { verifyUnsubscribeToken } from '../util/token'

export function unsubscribe ({ body }, res, next) {
  if (!body || !body.lambdajwt) { return next(badRequest()) }

  verifyUnsubscribeToken(
    body.lambdajwt,
    async (error, { email }) => {
      try {
        if (error) { return next(badRequest()) }

        await saveWatching(email, false)

        success(res, { email, watching: false })
      } catch (err) {
        logErrAndNext500(err, next)
      }
    }
  )
}
