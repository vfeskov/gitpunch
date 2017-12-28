importScripts('workbox-sw.prod.v2.1.2.js')

const workbox = new WorkboxSW({
  skipWaiting: true,
  clientsClaim: true
})

workbox.precache([])

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url)
  if (
    isPrecached(url) ||
    isStaticFile(url) ||
    isExternal(url) ||
    isGetApi(event, url)
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

function isPrecached({ href }) {
  return workbox._revisionedCacheManager._parsedCacheUrls.includes(href)
}

function isStaticFile({ pathname }) {
  return pathname.includes('.') && pathname !== '/index.html'
}

function isExternal({ origin }) {
  return origin !== location.origin
}

function isGetApi({ request }, { pathname }) {
  return request.method === 'GET' && /^\/api\/.+/.test(pathname)
}

async function updateIndexCache() {
  const cache = await caches.open('dynamic-v1')
  cache.add(indexRequest())
}

function indexRequest() {
  return new Request('index.html', { credentials: 'same-origin' })
}
