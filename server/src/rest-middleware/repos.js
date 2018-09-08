import { success, unauthorized, badRequest } from '../util/http'
import { validRepos, validRepo, validMuted } from '../util/validations'
import { fetchTags, withTags } from '../util/githubAtom'
import { addReposToUser, removeReposFromUser, removeAllReposFromUser, loadUser, muteRepoOfUser, unmuteRepoOfUser, setMutedReposOfUser } from '../db'
import { serializeRepos } from '../util/serialize'

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
    let { repos, mutedRepos } = await loadUser(token)
    if (!repos.includes(repo)) {
      await addReposToUser(token, [repo])
      repos = [...repos, repo]
    }
    success(res, { repos: serializeRepos(repos, mutedRepos) })
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
    let { repos, mutedRepos } = await loadUser(token)
    if (!reqRepos.every(({ repo }) => repos.includes(repo))) {
      const newRepos = reqRepos
        .filter(({ repo }) => !repos.includes(repo))
        .map(r => r.repo)
      await addReposToUser(token, newRepos)
      repos = [...repos, ...newRepos]
    }
    success(res, { repos: serializeRepos(repos, mutedRepos) })
  } catch (error)   {
    next(error)
  }
}

export async function remove ({ params, token }, res, next) {
  if (!token) {
    return next(unauthorized())
  }
  if (!params || !validRepo(params.repo)) {
    return next(badRequest())
  }
  const { repo } = params
  let { repos, mutedRepos } = await loadUser(token)
  if (repos.includes(repo)) {
    await removeReposFromUser(token, [repo])
    repos = repos.filter(r => r !== repo)
  }
  success(res, { repos: serializeRepos(repos, mutedRepos) })
}

export async function removeAll ({ token }, res, next) {
  if (!token) {
    return next(unauthorized())
  }
  const { repos, mutedRepos } = await loadUser(token)
  if (repos.length || mutedRepos.length) {
    await removeAllReposFromUser(token)
  }
  success(res, { repos: serializeRepos([], []) })
}

export async function updateMuted ({ params, body, token }, res, next) {
  if (!token) {
    return next(unauthorized())
  }
  if (!params || !validRepo(params.repo) || !validMuted(body.muted)) {
    return next(badRequest())
  }
  const { muted } = body
  const { repo } = params
  let { repos, mutedRepos } = await loadUser(token)
  if (!repos.includes(repo)) {
    return next(badRequest())
  }
  if (muted && !mutedRepos.includes(repo)) {
    await muteRepoOfUser(token, repo)
    mutedRepos = [...mutedRepos, repo]
  } else if (!muted && mutedRepos.includes(repo)) {
    await unmuteRepoOfUser(token, repo)
    mutedRepos = mutedRepos.filter(r => r !== repo)
  }
  success(res, { repos: serializeRepos(repos, mutedRepos) })
}

export async function updateAllMuted ({ body, token }, res, next) {
  if (!token) {
    return next(unauthorized())
  }
  if (!validMuted(body.muted)) {
    return next(badRequest())
  }
  const { muted } = body
  const { repos } = await loadUser(token)
  const mutedRepos = muted ? repos : []
  await setMutedReposOfUser(token, mutedRepos)
  success(res, { repos: serializeRepos(repos, mutedRepos) })
}
