import { withTags } from './githubAtom'

export default async function signUpReposToDbRepos (repos) {
  if (!repos || !repos.length) {
    return { repos: [], mutedRepos: [] }
  }
  const mutedRepos = repos.filter(r => r.muted).map(r => r.repo)
  repos = await withTags(repos.map(r => r.repo))
    .then(repos => repos.map(r => r.repo))
  return {
    repos,
    mutedRepos: mutedRepos.filter(r => repos.includes(r))
  }
}
