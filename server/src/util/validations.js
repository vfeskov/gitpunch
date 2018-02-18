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

export function validFrequency (frequency) {
  return typeof frequency === 'string' && ['realtime', 'daily'].includes(frequency)
}

export function validCheckAt (checkAt) {
  return typeof checkAt === 'number' &&
    Math.round(checkAt) === checkAt &&
    checkAt >= 0 && checkAt < 24
}
