import fetch from 'node-fetch'
import log from './log'

const ATTEMPTS = 3
const FETCH_OPTIONS = { timeout: 5000 }

export default async function fetchAtom (url: string, includeEntry: boolean) {
  let error
  for (let i = 0; i < ATTEMPTS; i++) {
    try {
      const response = await fetch(url, FETCH_OPTIONS)
      const { status } = response
      if (status >= 400 && status < 500) { break }
      if (status !== 200) { throw new BadStatus(status) }
      const xml = await response.text()
      const entries = parse(xml, includeEntry)
      if (!entries.length) { break }
      return entries
    } catch (e) {
      error = e
    }
  }
  if (error) { throw error }
  throw new NoTags()
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

export function trackFetchErrors () {
  const errors: BaseError[] = []
  return {
    push (repo: string, error: BaseError) {
      error.repo = repo
      errors.push(error)
    },
    log (logPrefix: string) {
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
        r[k].length && log(logPrefix + k, {
          errors: r[k],
          count: r[k].length
        })
      )
    }
  }
}

export class BaseError extends Error {
  repo: string
}

export class BadStatus extends BaseError {
  constructor (public status) {
    super()
  }
}

export class NoTags extends BaseError {}
