importScripts('workbox-sw.prod.v2.1.2.js')

const workbox = new WorkboxSW({
  skipWaiting: true,
  clientsClaim: true
})

workbox.precache([])

self.addEventListener('fetch', event => {
  // don't do anything
  if (
    // if request was precached by Workbox
    isPrecached(event) ||
    // if it's a request for static file that wasn't precached
    isStaticFile(event) ||
    // if request is for external resource
    isExternal(event)
  ) { return }

  // if it's not a GET request, fire it and update index cache with a delay,
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

async function updateIndexCache() {
  const cache = await caches.open('dynamic-v1')
  cache.add(indexRequest())
}

function indexRequest() {
  return new Request('index.html', { credentials: 'same-origin' })
}
