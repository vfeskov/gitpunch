import fetch from 'node-fetch'
import { RepoGroupWithTags, RepoGroup, Tag } from './interfaces'
import log from './log'
const accessToken = process.env.GITHUB_ACCESS_TOKEN
const userAgent = process.env.GITHUB_API_USER_AGENT

export default async function fetchTags (byRepo: RepoGroup[]): Promise<RepoGroupWithTags[]> {
  const byRepoWithTags = await Promise.all(byRepo
    .map(async ({ repo, users }) => {
      try {
        log('fetchTags', { repo })
        const response = await fetch(tagsUrl(repo), { headers: { 'User-Agent': userAgent } })
        if (response.status !== 200) { throw Error(`Status ${response.status}`) }
        const tags = await response.json() as Tag[]
        if (!tags || !tags.length) { throw Error('No tags') }
        return { repo, users, tags }
      } catch (e) {
        log('fetchTagsError', { repo, message: e.message })
        return null
      }
    })
  )
  return byRepoWithTags.filter(b => b)
}

function tagsUrl (repo) {
  return `https://api.github.com/repos/${ repo }/tags?access_token=${ accessToken }`
}
