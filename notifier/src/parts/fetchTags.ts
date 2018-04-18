import { fetchAtom, trackFetchErrors } from 'win-a-beer-lib/githubAtom'
import { RepoGroup } from './interfaces'

export default async function fetchTags (byRepo: RepoGroup[]) {
  const errors = trackFetchErrors()
  const byRepoWithTags = await Promise.all(
    byRepo.map(async ({ repo, users }) => {
      try {
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
