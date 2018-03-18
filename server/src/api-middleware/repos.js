import fetch from 'node-fetch'
import { success, unauthorized, badRequest, logErrAndNext500, internalServerError } from '../util/http'
import { validRepos, validRepo } from '../util/validations'
import { update as updateDb, load as loadDb } from '../db'

export async function create ({ body, token }, res, next) {
  try {
    if (!token) {
      throw unauthorized()
    }
    if (!body || !validRepo(body.repo)) {
      throw badRequest('Invalid repo')
    }
    const { repo } = body
    await checkTags(repo)
    const { repos } = await loadDb(token)
    if (repos.includes(repo)) {
      return success(res, { repos })
    }
    const attrs = { repos: [repo, ...repos] }
    await updateDb(token, attrs)
    success(res, attrs)
  } catch (error) {
    next(error)
  }
}

async function checkTags (repo) {
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

export async function remove ({ params, token }, res, next) {
  if (!token) { return next(unauthorized()) }
  if (!params || !validRepo(params.repo)) { return next(badRequest()) }
  const { repos } = await loadDb(token)
  if (!repos.includes(params.repo)) { return success(res, { repos }) }
  const attrs = { repos: repos.filter(r => r !== params.repo) }
  await updateDb(token, attrs)
  success(res, attrs)
}
