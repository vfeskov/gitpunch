import fetchAtom, { trackFetchErrors } from '../lib/fetchAtom'
import { RepoGroup } from '../lib/interfaces'

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
