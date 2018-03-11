import { RepoGroupWithTags, FullUser } from '../lib/interfaces'

export default function backToUsers (byRepoWithTags: RepoGroupWithTags[]): FullUser[] {
  const usersMap = byRepoWithTags.reduce((usersMap, { repo, users, tags }) => {
    users.forEach(({ _id, email, alerted }) => {
      usersMap[email] = usersMap[email] || { _id, email, alerted, repos: [] }
      usersMap[email].repos.push({ repo, tags })
    })
    return usersMap
  }, {})
  return Object.keys(usersMap).map(email => usersMap[email])
}
