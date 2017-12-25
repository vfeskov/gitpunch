import { success, unauthorized, internalServerError, badRequest, logAndNextError } from '../util/http'
import { validRepos, validRepo } from '../util/validations'
import { saveRepos, loadProfile } from '../db'

export function create ({ body, token }, res, next) {
  if (!token) { return next(unauthorized()) }
  if (!body || !validRepo(body.repo)) { return next(badRequest()) }

  const { repo } = body
  const { email } = token
  loadProfile(email)
    .then(({ repos }) => {
      if (repos.includes(repo)) { return repos }
      return saveRepos(email, [repo].concat(repos))
    })
    .then(
      success(res),
      logAndNextError(next, internalServerError())
    )
}

export function remove ({ params, token }, res, next) {
  if (!token) { return next(unauthorized()) }
  if (!params || !validRepo(params.repo)) { return next(badRequest()) }

  const { repo } = params
  const { email } = token
  loadProfile(email)
    .then(({ repos }) => {
      if (!repos.includes(repo)) { return repos }
      repos = repos.filter(r => r !== repo)
      return saveRepos(email, repos)
    })
    .then(
      success(res),
      logAndNextError(next, internalServerError())
    )
}
