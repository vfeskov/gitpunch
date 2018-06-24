import { loadUsers, addReposToUser, updateUser } from '../db'
import fetch from 'node-fetch'
const INTERVAL = process.env.SYNC_STARS_INTERVAL || 90000

export default async function syncStars () {
  try {
    console.log('Star Sync started')
    const users = await loadUsers({
      accessToken: { $ne: null },
      watchingStars: true
    })
    await Promise.all(users.map(syncUser))
  } catch (e) {
    console.log(`Star Sync Error: ${e.message}`, e.stack)
  }
  console.log('Star Sync finished')
  setTimeout(syncStars, INTERVAL)
}

async function syncUser (user) {
  try {
    const stars = await fetchStars(user)
    const newRepos = stars.filter(repo => !user.repos.includes(repo))
    if (newRepos.length) {
      await addReposToUser(user, newRepos)
      console.log(`New stars added to ${user.email}`)
    }
  } catch (e) {
    if (e instanceof RevokedTokenError) {
      console.log(`Revoked token ${user.email}`)
      await updateUser(user, { watchingStars: false }).catch(() => {
        console.log(`Failed to update watchingStars of ${user.email}`)
      })
    } else {
      console.log(`Sync User Error: ${e.message}`, e.stack)
    }
  }
}

async function fetchStars (user) {
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
  return body.map(item => item.full_name).reverse()
}

async function fetchGitHubApi (url, user) {
  try {
    console.log(`Fetching github api ${url}`)
    const response = await fetch(url, {
      headers: { Authorization: `token ${user.accessToken}` }
    })
    if (response.status === 403) {
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
  } catch (e) {
    if (e instanceof RevokedTokenError) {
      throw e
    }
    console.log(`Fetch GitHub API Error: ${e.message}`, e.stack)
    return {}
  }
}

const parseRegexp = /<([^>]+)>; rel="([^"]+)"/
function extractLinks (response) {
  try {
    return response.headers.get('Link').split(',').reduce((links, part) => {
      const match = part.match(parseRegexp)
      if (match) { links[match[2]] = match[1] }
      return links
    }, {})
  } catch (e) {
    return {}
  }
}

class RevokedTokenError extends Error {
  constructor (user) {
    super(`Revoked token ${user.accessToken}`)
  }
}
class FetchError extends Error {
  constructor (url, response) {
    super(`Failed to load ${url}, response status: ${response.status}`)
  }
}
