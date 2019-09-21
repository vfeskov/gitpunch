import { success, badRequest } from '../util/http'
import { validRepos, validRepo } from '../util/validations'
import { fetchTags, withTags } from '../util/githubAtom'
import { serialize } from '../util/serialize'

export async function create ({ body, user }, res, next) {
  try {
    if (!body || !validRepo(body)) {
      return next(badRequest('Invalid repo'))
    }
    await fetchTags(body)
    if (!user.repos.find(r => r.repo === body.repo)) {
      await user.addRepos([body])
    }
    success(res, serialize({ repos: user.repos }))
  } catch (error) {
    next(error)
  }
}

export async function createBulk ({ body, user }, res, next) {
  if (!body || !validRepos(body.repos)) {
    return next(badRequest('Invalid repos'))
  }
  const repos = await withTags(body.repos)
  await user.addRepos(
    repos.filter(({ repo }) => !user.repos.find(r => r.repo === repo.repo))
  )
  success(res, serialize({ repos: user.repos }))
}

export async function remove ({ params, user }, res, next) {
  if (!params || !params.repo) {
    return next(badRequest())
  }
  const repo = user.repos.find(r => r.repo === params.repo)
  if (repo) {
    await user.removeRepos([repo])
  }
  success(res, serialize({ repos: user.repos }))
}

export async function removeAll ({ user }, res, next) {
  await user.update({ repos: [] })
  success(res, serialize({ repos: [] }))
}

const EDITABLE = ['muted', 'filter']
export async function patch ({ user, params, body }, res, next) {
  const repo = user.repos.find(r => r.repo === params.repo)
  if (!repo || !body) {
    return next(badRequest())
  }
  EDITABLE.forEach(param => {
    if (typeof body[param] !== 'undefined') {
      repo[param] = body[param]
    }
  })
  if (user.validate({ repos: [repo] })) {
    return next(badRequest())
  }
  await user.updateRepo(repo)
  success(res, serialize({ repos: user.repos }))
}

export async function patchAll ({ body, user }, res, next) {
  if (!body) {
    return next(badRequest())
  }
  await user.updateAllRepos(body)
  success(res, serialize({ repos: user.repos }))
}
