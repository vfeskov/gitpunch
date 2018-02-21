import fetch from 'node-fetch'
import { RepoGroupWithTags, RepoGroup, Tag, User } from './interfaces'
import log from './log'

export default async function fetchTags (byRepo: RepoGroup[]) {
  const errors: BaseError[] = []
  const byRepoWithTags = await Promise.all(byRepo
    .map(async ({ repo, users }) => {
      try {
        const tags = await fetchThem(repo)
        if (!tags || !tags.length) { throw new NoTags() }
        return { repo, users, tags }
      } catch (error) {
        error.repo = repo
        errors.push(error)
        return null
      }
    })
  )
  logErrors(errors)
  return byRepoWithTags.filter(Boolean)
}

const ATTEMPTS = 3
const FETCH_OPTIONS = { timeout: 10000 }

async function fetchThem (repo: string) {
  const url = `https://github.com/${repo}/releases.atom`
  let error
  for (let i = 0; i < ATTEMPTS; i++) {
    try {
      const response = await fetch(url, FETCH_OPTIONS)
      const { status } = response
      if (status >= 400 && status < 500) { return [] }
      if (status !== 200) { throw new BadStatus(status) }
      const xml = await response.text()
      return parseTags(xml)
    } catch (e) {
      error = e
    }
  }
  if (error) { throw error }
  return []
}

const ENTRY_REGEXP = /<entry>[\s\S]*?<\/entry>/gm
const ID_REGEXP = new RegExp('<id>[^<]+/([^/<]+)</id>')

function parseTags (xml: string) {
  return (xml.match(ENTRY_REGEXP) || [])
    .map(entry => {
      const match = entry.match(ID_REGEXP)
      if (!match) { return }
      return { name: match[1], entry }
    })
    .filter(Boolean)
}

function logErrors (errors: BaseError[]) {
  if (!errors.length) { return }
  const r = {
    BadStatus: [],
    NoTags: [],
    Other: []
  }
  errors.forEach(e => {
    if (e instanceof BadStatus) {
      r.BadStatus.push([e.repo, e.status])
    } else if (e instanceof NoTags) {
      r.NoTags.push(e.repo)
    } else {
      r.Other.push([e.repo, e.message])
    }
  })
  Object.keys(r).forEach(k =>
    r[k].length && log(`fetchTagsErrors${k}`, {
      errors: r[k],
      count: r[k].length
    })
  )
}

class BaseError extends Error {
  repo: string
}
class BadStatus extends BaseError {
  constructor (public status) {
    super()
  }
}
class NoTags extends BaseError {}
