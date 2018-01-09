import { DBUser, RepoGroup } from './interfaces'

export default function groupByRepo (users: DBUser[]): RepoGroup[] {
  const byRepo = users.reduce((byRepo, { _id, email, alerted, repos }) => {
    repos.forEach(repo => {
      byRepo[repo] = byRepo[repo] || { repo, users: [] }
      byRepo[repo].users.push({ _id, email, alerted })
    })
    return byRepo
  }, {})
  return Object.keys(byRepo).map(r => byRepo[r])
}
