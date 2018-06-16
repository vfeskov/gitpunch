import { DBUser, RepoGroup } from './interfaces'
import log from 'gitpunch-lib/log'
const { keys } = Object

export default function groupByRelevantRepo (dbUsers: DBUser[], relevantRepos: String[]): RepoGroup[] {
  const byRepo = dbUsers.reduce((byRepo, dbUser) => {
    dbUser.repos.forEach(repo => {
      if (relevantRepos && !relevantRepos.includes(repo)) {
        return
      }
      byRepo[repo] = byRepo[repo] || { repo, users: [] }
      const { repos, ...user } = dbUser
      byRepo[repo].users.push(user)
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
