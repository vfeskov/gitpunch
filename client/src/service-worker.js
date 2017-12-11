importScripts('workbox-sw.prod.v2.1.2.js')

const workbox = new WorkboxSW({
  skipWaiting: true,
  clientsClaim: true
})

workbox.precache([])

self.addEventListener('fetch', event => {
  if (isPrecached(event)) { return }

  const isGET = event.request.method === 'GET'

  // if it's a get request and not index then fallback to index
  const request = isGET && !isIndex(event) ? indexRequest() : event.request

  // if it's not a GET request, don't fallback to index cache if it fails
  if (!isGET) {
    return event.respondWith(
      fetch(request)
        .then(response => {
          // user profile gets updated with a delay because of simpledb
          setTimeout(updateIndexCache, 1000)
          return response
        })
    )
  }

  // otherwise fallback to index cache if request fails
  event.respondWith(
    fetch(request)
      .then(response => {
        updateIndexCache()
        return response
      })
      .catch(() => caches.match('index.html'))
  )
})

function isIndex({ request }) {
  const url = new URL(request.url)
  return url.origin == location.origin && url.pathname == '/'
}

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
