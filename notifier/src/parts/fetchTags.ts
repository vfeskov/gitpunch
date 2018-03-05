import fetchThem, { trackFetchErrors } from './fetchThem'
import { RepoGroupWithTags, RepoGroup, User } from './interfaces'

export default async function fetchTags (byRepo: RepoGroup[]) {
  const errors = trackFetchErrors()
  const byRepoWithTags = await Promise.all(
    byRepo.map(async ({ repo, users }) => {
      try {
        const url = `https://github.com/${repo}/tags.atom`
        const tags = await fetchThem(url, false)
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
