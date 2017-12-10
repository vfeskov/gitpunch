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

  const updateIndexCache = async () => {
    const cache = await caches.open('dynamic-v1')
    cache.add(new Request('index.html', { credentials: 'same-origin' }))
  }

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

function getIsIndex({ request }) {
  const url = new URL(request.url)
  return url.origin == location.origin && url.pathname == '/'
}

function getIsPrecached({ request }) {
  return workbox._revisionedCacheManager._parsedCacheUrls.includes(request.url)
}
