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

export function saveCheckAt ({ checkAt }) {
  return fetchApi('check_at', {
    method: 'PUT',
    body: JSON.stringify({ checkAt })
  })
}

export function saveFrequency (params) {
  return fetchApi('frequency', {
    method: 'PUT',
    body: JSON.stringify(params)
  })
}

export function fetchProfile () {
  return fetchApi('profile')
}

export function createRepo ({ repo }) {
  return fetchApi('repos', {
    method: 'POST',
    body: JSON.stringify({ repo })
  })
}

export function createRepos ({ repos }) {
  return fetchApi('repos/bulk', {
    method: 'POST',
    body: JSON.stringify({ repos })
  })
}

export function deleteRepo ({ repo }) {
  return fetchApi(`repos/${encodeURIComponent(repo)}`, {
    method: 'DELETE'
  })
}

export function muteSavedRepo ({ repo, muted }) {
  return fetchApi(`repos/${encodeURIComponent(repo)}/muted`, {
    method: 'PUT',
    body: JSON.stringify({ muted })
  })
}

export function unwatch ({ lambdajwt }) {
  return fetchApi('unsubscribe', {
    method: 'PUT',
    body: JSON.stringify({ lambdajwt })
  })
}

export function saveWatching ({ watching }) {
  return fetchApi('watching', {
    method: 'PUT',
    body: JSON.stringify({ watching })
  })
}
