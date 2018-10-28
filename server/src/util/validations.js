export function validEmail (email) {
  return typeof email === 'string' && /\S+@\S+\.\S+/.test(email)
}

export function validRepo (repo) {
  return typeof repo.repo === 'string' &&
    /^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(repo.repo) &&
    ['boolean', 'undefined'].includes(typeof repo.muted) &&
    [undefined, 0, 1, 2, 3].includes(repo.filter)
}

export function validRepos (repos) {
  return Array.isArray(repos) && repos.every(r => r && validRepo(r))
}

export function validPassword (password) {
  return typeof password === 'string' && password.length > 0
}
