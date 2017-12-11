importScripts('workbox-sw.prod.v2.1.2.js')

const workbox = new WorkboxSW({
  skipWaiting: true,
  clientsClaim: true
})

workbox.precache([])

self.addEventListener('fetch', event => {
  // if request was precached by Workbox, let Workbox handle it
  if (isPrecached(event)) { return }

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

  // otherwise ignore the original request and fetch index.html instead,
  // updating index cache in parallel
  event.respondWith(
    fetch(indexRequest())
      .then(response => {
        updateIndexCache()
        return response
      })
      .catch(() => caches.match('index.html'))
  )
})

function isPrecached({ request }) {
  return workbox._revisionedCacheManager._parsedCacheUrls.includes(request.url)
}

async function updateIndexCache() {
  const cache = await caches.open('dynamic-v1')
  cache.add(indexRequest())
}

function indexRequest() {
  return new Request('index.html', { credentials: 'same-origin' })
}
