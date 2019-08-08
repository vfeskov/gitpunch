import { User } from 'gitpunch-lib/db'
import log from 'gitpunch-lib/log'
import fetch, { Response } from 'node-fetch'
import * as mongoose from 'mongoose'

export async function handler (event: any, context: any, callback: (error?: any) => void) {
  try {
    const users = await User.find({
      accessToken: { $exists: true, $not: { $in: ['', null] } },
      watchingStars: { $in: [true, 1, 2] }
    })
    if (users && users.length) {
      await Promise.all(users.map(syncUser))
    } else {
      log('noUsersWatchingStars')
    }
  } catch (e) {
    log('error', { error: { message: e.message, stack: e.stack } })
  }
  try {
    await mongoose.disconnect()
  } catch (e) {
  }
  callback()
  process.exit(0)
}

async function syncUser (user: User) {
  try {
    const stars = await fetchStars(user)
    const repoNames = user.repos.map(r => r.repo)
    const newStars = stars.filter(repo => !repoNames.includes(repo))
    if (newStars.length) {
      const newRepos = newStars.map(repo => ({ repo, muted: false, filter: 3 }))
      await user.addRepos(newRepos)
      console.log(`New stars added to ${user.email}: ${JSON.stringify(newRepos)}`)
    }
    if (user.watchingStars !== 2) {
      return
    }
    const nonstars = user.repos.filter(({ repo }) => !stars.includes(repo))
    if (nonstars.length) {
      await user.removeRepos(nonstars)
      console.log(`Nonstars removed from ${user.email}: ${JSON.stringify(nonstars)}`)
    }
  } catch (e) {
    if (e instanceof RevokedTokenError) {
      console.log(`Revoked token ${user.email}`)
      await user.save({ watchingStars: 0 }).catch(() => {
        console.log(`Failed to update watchingStars of ${user.email}`)
      })
    } else {
      console.log(`Sync User Error: ${e.message}`, e.stack)
    }
  }
}

async function fetchStars (user: User) {
  const { id } = await fetchGitHubApi('https://api.github.com/user', user).then(r => r.body || {})
  if (!id) {
    return []
  }
  let { body = [], links = {} } = await fetchGitHubApi(`https://api.github.com/user/${id}/starred`, user)
  if (!Array.isArray(body)) {
    body = []
  }
  let { next } = links
  while (next) {
    const response = await fetchGitHubApi(next, user)
    if (Array.isArray(response.body)) {
      body = [...body, ...response.body]
    }
    next = response.links && response.links.next
  }
  return (body as { full_name: string }[]).map(item => item.full_name).reverse()
}

async function fetchGitHubApi (url: string, user: User) {
  console.log(`Fetching github api ${url} ${user.accessToken}`)
  const response = await fetch(url, {
    headers: { Authorization: `token ${user.accessToken}` }
  })
  if (response.status === 401 || response.status === 403) {
    throw new RevokedTokenError(user)
  }
  if (response.status !== 200) {
    throw new FetchError(url, response)
  }
  const body = await response.json()
  return {
    body,
    links: extractLinks(response)
  }
}

const parseRegexp = /<([^>]+)>; rel="([^"]+)"/
function extractLinks (response: Response): { [name: string]: string } {
  try {
    return response.headers.get('Link').split(',').reduce((links, part) => {
      const match = part.match(parseRegexp)
      if (match) { links[match[2]] = match[1] }
      return links
    }, {} as { [name: string]: string })
  } catch (e) {
    return {}
  }
}

class RevokedTokenError extends Error {
  constructor (user: User) {
    super(`Revoked token ${user.accessToken}`)
  }
}
class FetchError extends Error {
  constructor (url: string, response: Response) {
    super(`Failed to load ${url}, response status: ${response.status}`)
  }
}
