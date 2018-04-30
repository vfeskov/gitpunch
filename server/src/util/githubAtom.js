import { internalServerError, badRequest } from './http'
import * as lib from 'gitpunch-lib/githubAtom'

const { NotFound, NoTags, BadStatus } = lib

export async function filterWatchable (repos) {
  repos = await Promise.all(
    repos.map(
      repo => lib.checkTags(repo).then(() => repo, () => null)
    )
  )
  return repos.filter(Boolean)
}

export async function checkTags (repo) {
  try {
    await lib.checkTags(repo)
  } catch (e) {
    if (e instanceof BadStatus) {
      throw internalServerError('Try again')
    } else if (e instanceof NotFound) {
      throw badRequest('Repo doesn\'t exist')
    } else if (e instanceof NoTags) {
      throw badRequest('Repo has no releases')
    }
  }
}
