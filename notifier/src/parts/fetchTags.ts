import { fetchAtom, trackFetchErrors } from 'gitpunch-lib/githubAtom'
import shuffle from 'gitpunch-lib/shuffle'
import { RepoGroup, RepoGroupWithTags } from './interfaces'

export default async function fetchTags (byRepo: RepoGroup[]) {
  const errors = trackFetchErrors()
  let shuffled = shuffle(byRepo)
  const result: RepoGroupWithTags[] = []
  for (const { repo, users } of shuffled) {
    try {
      const url = `https://github.com/${repo}/tags.atom`
      const tags = await fetchAtom(url, false)
      result.push({ repo, users, tags })
    } catch (error) {
      errors.push(repo, error)
    }
  }
  errors.log('fetchTagsErrors')
  return result
}
