import 'isomorphic-fetch'
const { assign } = Object

let base = { url: '', opts: { credentials: 'same-origin' } }
export function setBase (_base) {
  base = _base
}

function fetchApi (endpoint, opts = {}) {
  return fetch(`${base.url}/api/${endpoint}`, assign(base.opts, opts))
    .then(response => {
      if (response.status !== 200) { throw response }
      if (!response.headers.get('Content-Length')) { return '' }
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
    headers: {
      'Content-Type': 'application/json'
    },
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
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ checkAt })
  })
}

export function saveFrequency (params) {
  return fetchApi('frequency', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(params)
  })
}

export function fetchProfile () {
  return fetchApi('profile')
}

export function createRepo ({ repo }) {
  return fetchApi('repos', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ repo })
  })
}

export function deleteRepo ({ repo }) {
  return fetchApi(`repos/${encodeURIComponent(repo)}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

export function unwatch ({ lambdajwt }) {
  return fetchApi('unsubscribe', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ lambdajwt })
  })
}

export function saveWatching ({ watching }) {
  return fetchApi('watching', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ watching })
  })
}
