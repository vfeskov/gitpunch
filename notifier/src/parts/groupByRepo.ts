import { DBUser, RepoGroup } from './interfaces'
import log from './log'

export default function groupByRepo (users: DBUser[]): RepoGroup[] {
  const byRepo = users.reduce((byRepo, { _id, email, alerted, accessToken, repos }) => {
    repos.forEach(repo => {
      byRepo[repo] = byRepo[repo] || { repo, users: [] }
      byRepo[repo].users.push({ _id, email, alerted, accessToken })
    })
    return byRepo
  }, {})
  const result = Object.keys(byRepo).map(r => byRepo[r])
  log('uniqueReposCount', result.length)
  return result
}
