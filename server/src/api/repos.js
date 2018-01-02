import { success, unauthorized, badRequest, logErrAndNext500 } from '../util/http'
import { validRepos, validRepo } from '../util/validations'
import { saveRepos, loadProfile } from '../db'

export async function create ({ body, token }, res, next) {
  if (!token) { return next(unauthorized()) }
  if (!body || !validRepo(body.repo)) { return next(badRequest()) }

  const { repo } = body
  const { repos } = await loadProfile(token.email)
  if (repos.includes(repo)) { return success(res, repos) }

  const newRepos = await saveRepos(token.email, [repo].concat(repos))
  success(res, newRepos)
}

export async function remove ({ params, token }, res, next) {
  try {
    if (!token) { return next(unauthorized()) }
    if (!params || !validRepo(params.repo)) { return next(badRequest()) }

    const { repo } = params
    const { repos } = await loadProfile(token.email)
    if (!repos.includes(repo)) { return success(res, repos) }

    const newRepos = await saveRepos(token.email, repos.filter(r => r !== repo))
    success(res, newRepos)
  } catch (err) {
    logErrAndNext500(err, next)
  }
}
