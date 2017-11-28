export function validEmail (email: string) {
  return typeof email === 'string' && /^[^@]+@[^@]+$/.test(email)
}

export function validRepo (repo: string) {
  return typeof repo === 'string' && /^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(repo)
}

export function validRepos (repos: string[]) {
  return Array.isArray(repos) && !repos.some(r => !validRepo(r))
}

export function validPassword (password: string) {
  return typeof password === 'string' && password.length > 0
}

export function validWatching (watching: boolean) {
  return typeof watching === 'boolean'
}
