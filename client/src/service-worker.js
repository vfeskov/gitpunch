importScripts('workbox-sw.prod.v2.1.2.js')

const workbox = new WorkboxSW({
  skipWaiting: true,
  clientsClaim: true
})

workbox.precache([])

self.addEventListener('fetch', event => {
  const isGET = event.request.method === 'GET'
  const isIndex = getIsIndex(event)
  const isPrecached = getIsPrecached(event)
  if (isGET && !isIndex || isPrecached) { return }

  const indexRequest = new Request('index.html', { credentials: 'same-origin' })
  // if it's a get request and not index then fallback to index
  const request = isGET && !isIndex ? indexRequest : event.request

  const fetchUpdatingIndexCache = fetch(request)
    .then(async response => {
      const cache = await caches.open('dynamic-v1')
      cache.add(new Request('index.html', { credentials: 'same-origin' }))
      return response
    })

  // if it's not a GET request, then it's AJAX, don't serve index cache if fails
  if (!isGET) { return event.respondWith(fetchUpdatingIndexCache) }

  // otherwise it's index request, serve index cache if fails
  event.respondWith(
    fetchUpdatingIndexCache
      .catch(() => caches.match('index.html'))
  )
})

function getIsIndex({ request }) {
  const url = new URL(request.url)
  return url.origin == location.origin && url.pathname == '/'
}

function getIsPrecached({ request }) {
  return workbox._revisionedCacheManager._parsedCacheUrls.includes(request.url)
}
