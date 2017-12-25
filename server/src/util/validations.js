export function validEmail (email) {
  return typeof email === 'string' && /^[^@]+@[^@]+$/.test(email)
}

export function validRepo (repo) {
  return typeof repo === 'string' && /^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(repo)
}

export function validRepos (repos) {
  return Array.isArray(repos) && !repos.some(r => !validRepo(r))
}

export function validPassword (password) {
  return typeof password === 'string' && password.length > 0
}

export function validWatching (watching) {
  return typeof watching === 'boolean'
}
