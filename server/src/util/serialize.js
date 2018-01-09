export function serialize (user) {
  return user && {
    email: user.email,
    watching: user.watching,
    repos: user.repos
  }
}
