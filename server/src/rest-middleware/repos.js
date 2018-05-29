import { success, unauthorized, badRequest, internalServerError } from '../util/http'
import { validRepos, validRepo } from '../util/validations'
import { fetchTags, withTags } from '../util/githubAtom'
import { updateUser, loadUser } from '../db'

export async function create ({ body, token }, res, next) {
  try {
    if (!token) {
      throw unauthorized()
    }
    if (!body || !validRepo(body.repo)) {
      throw badRequest('Invalid repo')
    }
    const { repo } = body
    await fetchTags(repo)
    const { repos } = await loadUser(token)
    if (repos.includes(repo)) {
      return success(res, { repos })
    }
    const attrs = { repos: [repo, ...repos] }
    await updateUser(token, attrs)
    success(res, attrs)
  } catch (error) {
    next(error)
  }
}

export async function createBulk ({ body, token }, res, next) {
  try {
    if (!token) {
      throw unauthorized()
    }
    if (!body || !validRepos(body.repos)) {
      throw badRequest('Invalid repos')
    }
    const reqRepos = await withTags(body.repos)
    const { repos } = await loadUser(token)
    if (reqRepos.every(({ repo }) => repos.includes(repo))) {
      return success(res, { repos })
    }
    const newRepos = reqRepos.filter(({ repo }) => !repos.includes(repo));
    const attrs = { repos: [...newRepos, ...repos] }
    await updateUser(token, attrs)
    success(res, attrs)
  } catch (error)   {
    next(error)
  }
}

export async function remove ({ params, token }, res, next) {
  if (!token) { return next(unauthorized()) }
  if (!params || !validRepo(params.repo)) { return next(badRequest()) }
  const { repos } = await loadUser(token)
  if (!repos.includes(params.repo)) { return success(res, { repos }) }
  const attrs = { repos: repos.filter(r => r !== params.repo) }
  await updateUser(token, attrs)
  success(res, attrs)
}
