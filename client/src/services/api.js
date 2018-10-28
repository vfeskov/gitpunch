const { assign } = Object

let base = { url: '', opts: { credentials: 'same-origin' } }
export function setBase (_base) {
  base = _base
}

function fetchApi (endpoint, opts = {}) {
  opts = assign({
    headers: {
      'Content-Type': 'application/json'
    }
  }, base.opts, opts)
  return fetch(`${base.url}/api/${endpoint}`, opts)
    .then(response => {
      if (response.status !== 200) { throw response }
      switch (response.headers.get('Content-Type')) {
        case 'application/json': return response.json()
        default: return response.text()
      }
    })
}

export function signOut () {
  return fetchApi('sign_out', {
    method: 'DELETE'
  })
}

export function signIn ({ email, password, repos }) {
  return fetchApi('sign_in', {
    method: 'POST',
    body: JSON.stringify({
      email,
      password,
      repos
    })
  })
}

export function patchProfile (params) {
  return fetchApi('profile', {
    method: 'PATCH',
    body: JSON.stringify(params)
  })
}

export function fetchProfile () {
  return fetchApi('profile')
}

export function createRepoInDb (repo) {
  return fetchApi('repos', {
    method: 'POST',
    body: JSON.stringify(repo)
  })
}

export function createRepos (repos) {
  return fetchApi('repos/bulk', {
    method: 'POST',
    body: JSON.stringify(repos)
  })
}

export function deleteRepoInDb (repo) {
  return fetchApi(`repos/${encodeURIComponent(repo.repo)}`, {
    method: 'DELETE'
  })
}

export function deleteAllReposInDb () {
  return fetchApi('profile', {
    method: 'PATCH',
    body: JSON.stringify({ repos: [] })
  })
}

export function patchRepoInDb (repo) {
  return fetchApi(`repos/${encodeURIComponent(repo.repo)}`, {
    method: 'PATCH',
    body: JSON.stringify(repo)
  })
}

export function patchAllReposInDb (params) {
  return fetchApi('repos/all', {
    method: 'PATCH',
    body: JSON.stringify(params)
  })
}

export function unwatch (lambdajwt) {
  return fetchApi('unsubscribe', {
    method: 'PUT',
    body: JSON.stringify(lambdajwt)
  })
}
