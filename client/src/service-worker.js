importScripts('workbox-sw.prod.v2.1.3.js')

const workbox = new WorkboxSW({
  skipWaiting: true,
  clientsClaim: true
})

// following array will be filled with filenames
// from `build/` folder when `generate-sw` script runs
workbox.precache([])

// cache index.html when service worker gets installed
self.addEventListener('install', () => updateCache(indexRequest()))

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
  // let the request through and update index.html cache after it's done.
  if (event.request.method !== 'GET') {
    return event.respondWith(
      fetch(event.request)
        .then(response => {
          updateCache(indexRequest())
          return response
        })
    )
  }

  // serve any other request network-first updating cache
  event.respondWith(
    fetch(event.request)
      .then(response => {
        updateCache(
          /\/(stars|unsubscribe)/.test(event.request.pathname) ?
            indexRequest() :
            event.request
        )
        return response
      })
      .catch(() => caches.match(event.request))
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

async function updateCache(request) {
  const cache = await caches.open('dynamic-v1')
  cache.add(request)
}

function indexRequest() {
  return new Request('/', { credentials: 'same-origin' })
}
