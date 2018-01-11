importScripts('workbox-sw.prod.v2.1.2.js')

const workbox = new WorkboxSW({
  skipWaiting: true,
  clientsClaim: true
})

// following array will be filled with filenames
// from `build/` folder when `generate-sw` script runs
workbox.precache([])

// cache index.html when service worker gets installed
self.addEventListener('install', updateIndexCache)

// listen to all http requests coming from
// the browser on my website
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url)
  // I want to let event through without modifying it if
  // any of the following conditions are met
  if (
    // if it's a request for a precached file
    isPrecached(url) ||
    // if it's a request for a static file (not index.html)
    isStaticFile(url) ||
    // if it's an external request to another domain
    isExternal(url) ||
    // if it's a GET request to /api/* url
    isGetApi(event, url)
  ) { return }

  // when an API action happens, e.g., "DELETE /sign_out" that signs user out,
  // I let the request through and update index.html cache after it's done.
  if (event.request.method !== 'GET') {
    return event.respondWith(
      fetch(event.request)
        .then(response => {
          updateIndexCache()
          return response
        })
    )
  }

  // I serve index.html network-first on any request that
  // reaches this line
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
