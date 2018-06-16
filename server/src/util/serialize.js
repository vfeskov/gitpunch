export function serializeUser (user) {
  const { repos, mutedRepos, _id } = user
  return { ...user, repos: serializeRepos(repos, mutedRepos) }
}

export function serializeRepos (repos = [], mutedRepos = []) {
  return repos.map(repo => ({
    repo,
    muted: mutedRepos.includes(repo)
  })).reverse()
}
