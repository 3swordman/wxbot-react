var cacheAssets = ["vite.svg"]
var cacheVersion = "v1"
self.addEventListener("install", function (event) {
  event.waitUntil(caches.open(cacheVersion).then(function (cache) {
    return cache.addAll(cacheAssets)
  }).then(function () {
    return self.skipWaiting()
  }))
})
self.addEventListener("activate", function (event) {
  return self.clients.claim()
})
self.addEventListener("fetch", function (event) {
  var allowedHosts = /(localhost|fonts\.google\.com|fonts\.googleapis\.com|fonts\.gstatic\.com|www\.3swordman\.tk)/i
  var deniedAssets = /(sw\.js|sw-install\.js|@|node_modules)/i
  var htmlDocument = /(\/|\.html)$/i
  if (!(allowedHosts.test(event.request.url) && !deniedAssets.test(event.request.url))) {
    return
  }
  if (htmlDocument.test(event.request.url)) {
    event.respondWith(
      fetch(event.request).then(function (response) {
        caches.open(cacheVersion).then(function (cache) {
          cache.put(event.request, response.clone())
        })
        return response
      }).catch(function (err) {
        return caches.match(event.request)
      })
    )
    return
  }
  event.respondWith(
    caches.match(event.request).then(function (cachedResponse) {
      return cachedResponse || (
        fetch(event.request).then(function (fetchedResponse) {
          caches.open(cacheVersion).then(function (cache) {
            cache.put(event.request, fetchedResponse.clone())
            return fetchedResponse
          })
        }).catch(function (err) {
          console.error(err)
        })
      )
    })
  )
})
