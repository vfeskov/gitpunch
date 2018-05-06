import { fetchAtom, trackFetchErrors } from 'gitpunch-lib/githubAtom'
import shuffle from 'gitpunch-lib/shuffle'
import timeout from 'gitpunch-lib/timeout'
import { RepoGroup, RepoGroupWithTags } from './interfaces'

const CONCURRENT_REQUESTS = +(process.env.CONCURRENT_REQUESTS || 100)

export default async function fetchTags (byRepo: RepoGroup[]) {
  const errors = trackFetchErrors()
  let shuffled = shuffle(byRepo)
  const concurrentGroups: RepoGroup[][] = shuffled.reduce((r, v, i) => {
    const gI = i % CONCURRENT_REQUESTS
    r[gI] = r[gI] || []
    r[gI].push(v)
    return r
  }, [])
  const groupResults = await Promise.all(
    concurrentGroups.map(async group => {
      const result: RepoGroupWithTags[] = []
      for (const { repo, users } of group) {
        try {
          const url = `https://github.com/${repo}/tags.atom`
          const tags = await fetchAtom(url, false)
          result.push({ repo, users, tags })
        } catch (error) {
          errors.push(repo, error)
        }
      }
      return result;
    })
  )
  errors.log('fetchTagsErrors')
  return groupResults.reduce((r, g) => [...r, ...g], [])
}
