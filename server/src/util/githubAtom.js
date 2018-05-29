import { internalServerError, badRequest } from './http'
import * as githubAtom from 'gitpunch-lib/githubAtom'

export async function withTags (repos) {
  repos = await Promise.all(
    repos.map(
      repo => githubAtom.fetchTags(repo).then(tags => ({ repo, tags }), () => null)
    )
  )
  return repos.filter(Boolean)
}

export async function fetchTags (repo) {
  try {
    await githubAtom.fetchTags(repo)
  } catch (e) {
    if (e instanceof githubAtom.BadRequest) {
      throw badRequest('Repo doesn\'t exist')
    }
    throw internalServerError('Try again')
  }
}
