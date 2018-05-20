import { DBUser, RepoGroup } from './interfaces'
import log from 'gitpunch-lib/log'
const { keys } = Object

export default function groupByRepo (users: DBUser[], relevantRepos: String[]): RepoGroup[] {
  const byRepo = users.reduce((byRepo, { _id, email, alerted, accessToken, repos }) => {
    repos.forEach(repo => {
      if (relevantRepos && !relevantRepos.includes(repo)) {
        return
      }
      byRepo[repo] = byRepo[repo] || { repo, users: [] }
      byRepo[repo].users.push({ _id, email, alerted, accessToken })
    })
    return byRepo
  }, {})
  const repos = keys(byRepo)
  if (!repos.length) {
    return []
  }
  log('uniqueRepos', { count: repos.length })
  log('uniqueReposDetails', { repos })
  return repos.map(r => byRepo[r])
}
