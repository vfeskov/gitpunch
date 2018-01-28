import fetch from 'node-fetch'
import { RepoGroupWithTags, RepoGroup, Tag, User } from './interfaces'
import log from './log'
const { keys } = Object
const fallbackToken = process.env.GITHUB_ACCESS_TOKEN
const userAgent = process.env.GITHUB_API_USER_AGENT

export default async function fetchTags (byRepo: RepoGroup[]) {
  const revoked: {[email: string]: User} = {}
  const byRepoWithTags = await Promise.all(byRepo
    .map(async ({ repo, users }) => {
      try {
        const response = await fetchThem(repo, users, user => revoked[user.email] = user)
        const tags = await response.json() as Tag[]
        if (!tags || !tags.length) { throw Error('No tags') }
        return { repo, users, tags }
      } catch (e) {
        log('fetchTagsError', { repo, message: e.message })
        return null
      }
    })
  )
  const revokedTokenUsers = keys(revoked).map(email => revoked[email]);
  if (revokedTokenUsers.length) { log('revokedTokenUsers', { revokedTokenUsers }); }
  return {
    byRepoWithTags: byRepoWithTags.filter(b => b),
    revokedTokenUsers
  }
}

// shuffles list of users who watch given repo and fetches tags using access token of the first user.
// if request fails with 401 (token revoked) or 403 (rate limit exceeded), it will fetch using token
// of the next user in the shuffled list and so on. Finally it will fallback to my personal token
// specified in environment variable
//
// `revoked` callback is used to track revoked tokens, which are later deleted from db
async function fetchThem(repo: string, users: User[], revoked: (user: User) => void) {
  const withTokens = shuffle(users.filter(u => u.accessToken))
  const fallback = { accessToken: fallbackToken }
  log('fetchThem', { repo, withTokens })

  const attempts = [...withTokens, fallback].map(user =>
    async () => {
      const r = await attemptFetch(repo, user.accessToken)
      r.status === 401 && revoked(user)
      return r
    }
  )
  return attempts
    .reverse()
    .reduce((next, attempt) =>
      async () => {
        const r = await attempt()
        if (r.status === 200) { return r }
        if ([401, 403].includes(r.status)) { return next() }
        throw Error(`Status ${r.status}`)
      }
    )()
}

async function attemptFetch (repo: string, accessToken: string) {
  const url = `https://api.github.com/repos/${ repo }/tags?access_token=${ accessToken }`
  const response = await fetch(url, { headers: { 'User-Agent': userAgent } })
  log('attemptFetch', {
    repo,
    accessToken,
    status: response.status,
    remaining: response.headers.get('x-ratelimit-remaining')
  })
  return response
}

function shuffle (items: any[]) {
  let i = items.length, tmp, randomI
  while (0 !== i) {
    randomI = Math.floor(Math.random() * i)
    i -= 1
    tmp = items[i]
    items[i] = items[randomI]
    items[randomI] = tmp
  }
  return items
}
