import { success, unauthorized, badRequest, logErrAndNext500 } from '../util/http'
import { validRepos, validRepo } from '../util/validations'
import { update as updateDb, load as loadDb } from '../db'

export async function create ({ body, token }, res, next) {
  if (!token) { return next(unauthorized()) }
  if (!body || !validRepo(body.repo)) { return next(badRequest()) }
  const { repos } = await loadDb(token)
  if (repos.includes(body.repo)) { return success(res, { repos }) }
  const attrs = { repos: [body.repo].concat(repos) }
  await updateDb(token, attrs)
  success(res, attrs)
}

export async function remove ({ params, token }, res, next) {
  if (!token) { return next(unauthorized()) }
  if (!params || !validRepo(params.repo)) { return next(badRequest()) }
  const { repos } = await loadDb(token)
  if (!repos.includes(params.repo)) { return success(res, { repos }) }
  const attrs = { repos: repos.filter(r => r !== params.repo) }
  await updateDb(token, attrs)
  success(res, attrs)
}
