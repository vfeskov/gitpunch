import fetch from 'node-fetch'
import { internalServerError, badRequest } from './http'

export async function checkTags (repo) {
  const response = await fetch(`https://github.com/${repo}/tags.atom`)
  if (response.status >= 500) {
    throw internalServerError('Try again')
  }
  if (response.status !== 200) {
    throw badRequest('Repo doesn\'t exist')
  }
  const xml = await response.text()
  if (!xml.includes('<entry>')) {
    throw badRequest('Repo has no releases')
  }
}

export async function filterWatchable (repos) {
  repos = await Promise.all(
    repos.map(
      repo => checkTags(repo).then(() => repo, () => null)
    )
  )
  return repos.filter(Boolean)
}
