import { RepoGroupWithTags, FullUser } from './interfaces'

export default function backToUsers (byRepoWithTags: RepoGroupWithTags[]): FullUser[] {
  const usersMap = byRepoWithTags.reduce((usersMap, { repo, users, tags }) => {
    users.forEach(user => {
      const { email } = user
      usersMap[email] = usersMap[email] || { ...user, repos: [] }
      usersMap[email].repos.push({ repo, tags })
    })
    return usersMap
  }, {})
  return Object.keys(usersMap).map(email => usersMap[email])
}
