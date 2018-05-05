import { fetchAtom, trackFetchErrors } from 'gitpunch-lib/githubAtom'
import shuffle from 'gitpunch-lib/shuffle'
import timeout from 'gitpunch-lib/timeout'
import { RepoGroup } from './interfaces'

const DELAY_EVERY = 10 // repos
const DELAY_DURATION = 100 // ms

export default async function fetchTags (byRepo: RepoGroup[]) {
  const errors = trackFetchErrors()
  const byRepoWithTags = await Promise.all(
    shuffle(byRepo).map(async ({ repo, users }, index) => {
      try {
        const delayMs = Math.floor(index / DELAY_EVERY) * DELAY_DURATION
        if (delayMs) { await timeout(delayMs) }
        const url = `https://github.com/${repo}/tags.atom`
        const tags = await fetchAtom(url, false)
        return { repo, users, tags }
      } catch (error) {
        errors.push(repo, error)
        return null
      }
    })
  )
  errors.log('fetchTagsErrors')
  return byRepoWithTags.filter(Boolean)
}
