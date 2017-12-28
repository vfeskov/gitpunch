importScripts('workbox-sw.prod.v2.1.2.js')

const workbox = new WorkboxSW({
  skipWaiting: true,
  clientsClaim: true
})

workbox.precache([])

self.addEventListener('fetch', event => {
  if (
    isPrecached(event) ||
    isStaticFile(event) ||
    isExternal(event) ||
    isGetApi(event)
  ) { return }

  // if it's not a GET request, e.g., POST /api/repos to add a repo
  // to the list, fire it and update index cache. Delay is there
  // because SimpleDB doesn't return updated data right away
  if (event.request.method !== 'GET') {
    return event.respondWith(
      fetch(event.request)
        .then(response => {
          setTimeout(updateIndexCache, 1000)
          return response
        })
    )
  }

  // otherwise ignore the original request and fetch index.html,
  // updating index cache in parallel
  event.respondWith(
    fetch(indexRequest())
      .then(response => {
        updateIndexCache()
        return response
      })
      .catch(() => caches.match(indexRequest()))
  )
})

function isPrecached({ request }) {
  return workbox._revisionedCacheManager._parsedCacheUrls.includes(request.url)
}

function isStaticFile({ request }) {
  return /\.[^/]+$/.test(request.url)
}

function isExternal({ request }) {
  const url = new URL(request.url)
  return url.origin !== location.origin
}

function isGetApi({ request }) {
  return request.method === 'GET' &&  /^\/api\/.+/.test(request.url)
}

async function updateIndexCache() {
  const cache = await caches.open('dynamic-v1')
  cache.add(indexRequest())
}

function indexRequest() {
  return new Request('index.html', { credentials: 'same-origin' })
}
