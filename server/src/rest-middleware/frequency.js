import { updateUser } from '../db'
import { success, unauthorized, badRequest, logErrAndNext500 } from '../util/http'
import { validFrequency, validCheckAt } from '../util/validations'

export default async function frequency ({ body, token }, res, next) {
  if (!token) { return next(unauthorized()) }
  if (!body || !validFrequency(body.frequency)) { return next(badRequest()) }
  const { frequency, checkAt } = body
  const attrs = { $set: { frequency } }
  let finalCheckAt
  if (frequency === 'daily') {
    finalCheckAt = checkAt && validCheckAt(checkAt) ? checkAt : 0
    attrs.$set.checkAt = finalCheckAt
  } else {
    finalCheckAt = 0
    attrs.$unset = { checkAt: finalCheckAt }
  }
  await updateUser(token, attrs)
  success(res, { frequency, checkAt: finalCheckAt })
}
