import { saveWatching } from '../db'
import { success, badRequest, internalServerError, logAndNextError } from '../util/http'
import { verifyUnsubscribeToken } from '../util/token'

export function unsubscribe ({ body }, res, next) {
  if (!body || !body.lambdajwt) { return next(badRequest()) }

  verifyUnsubscribeToken(
    body.lambdajwt,
    (error, data) => {
      if (error) { return next(badRequest()) }

      saveWatching(data.email, false)
        .then(() => ({ email: data.email, watching: false }))
        .then(
          success(res),
          logAndNextError(next, internalServerError())
        )
    }
  )
}
