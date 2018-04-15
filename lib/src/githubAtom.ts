// Reusable service to work with GitHub's Atom feeds
import fetch from 'node-fetch'
import { Agent } from 'https'
import log from './log'

const FETCH_ATTEMPTS = 3
const agent = new Agent({ keepAlive: true, keepAliveMsecs: 30000 })
const fetchOptions = { agent, timeout: 5000 }

export function checkTags (repo: string) {
  return fetchAtom(`https://github.com/${repo}/tags.atom`, false)
}

export async function fetchAtom (url: string, includeEntry: boolean) {
  let error = new Unknown()
  for (let i = 0; i < FETCH_ATTEMPTS; i++) {
    try {
      const response = await fetch(url, fetchOptions)
      const { status } = response
      if (status >= 400 && status < 500) { throw new NotFound() }
      if (status !== 200) { throw new BadStatus(status) }
      const xml = await response.text()
      const entries = parse(xml, includeEntry)
      if (!entries.length) { throw new NoTags() }
      return entries
    } catch (e) {
      error = e
      if (isClientError(e)) { break }
    }
  }
  throw error
}

export function trackFetchErrors () {
  const errors: BaseError[] = []
  return {
    errors () {
      return errors
    },
    push (repo: string, error: BaseError) {
      error.repo = repo
      errors.push(error)
    },
    log (logPrefix: string) {
      if (!errors.length) { return }
      const r: { [key: string]: any[] } = {
        BadStatus: [],
        NoTags: [],
        Other: []
      }
      errors.forEach(e => {
        if (e instanceof BadStatus) {
          r.BadStatus.push([e.repo, e.status])
        } else if (e instanceof NoTags || e instanceof NotFound) {
          r.NoTags.push(e.repo)
        } else {
          r.Other.push([e.repo, e.message])
        }
      })
      Object.keys(r).forEach(k =>
        r[k].length && log(logPrefix + k, {
          errors: r[k],
          count: r[k].length
        })
      )
    }
  }
}

export function closeHttpsConnections () {
  agent.destroy()
}

export class BaseError extends Error {
  repo: string
}

export class Unknown extends BaseError {
  message = 'unknown'
}

export class BadStatus extends BaseError {
  constructor (public status: number) {
    super('bad status')
  }
}

export class NotFound extends BaseError {
  message = 'not found'
}

export class NoTags extends BaseError {
  message = 'no tags'
}

function isClientError (err: BaseError) {
  return [NotFound, NoTags].some(type => err instanceof type)
}

const ENTRY_REGEXP = /<entry>[\s\S]*?<\/entry>/gm
const ID_REGEXP = new RegExp('<id>[^<]+/([^/<]+)</id>')

function parse (xml: string, includeEntry: boolean) {
  return (xml.match(ENTRY_REGEXP) || [])
    .map(entry => {
      const match = entry.match(ID_REGEXP)
      if (!match) { return }
      return {
        name: match[1],
        entry: includeEntry ? entry : ''
      }
    })
    .filter(Boolean)
}
