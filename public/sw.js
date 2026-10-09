const CACHE_NAME = 'alemu-portfolio-v1'
const OFFLINE_URL = '/offline.html'
const PRECACHE_URLS = [
  '/',
  OFFLINE_URL,
  '/pwa-icon.svg',
  '/alemu-portrait.png',
  '/icon.svg',
  '/icon-light-32x32.png',
  '/icon-dark-32x32.png',
  '/apple-icon.png',
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting()),
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys.filter((key) => key.startsWith('alemu-portfolio-') && key !== CACHE_NAME)
          .map((key) => caches.delete(key)),
      ))
      .then(() => self.clients.claim()),
  )
})

self.addEventListener('fetch', (event) => {
  const request = event.request
  const url = new URL(request.url)

  if (request.method !== 'GET' || url.origin !== self.location.origin) return

  if (request.mode === 'navigate') {
    if (url.pathname !== '/') {
      event.respondWith(fetch(request).catch(() => caches.match(OFFLINE_URL)))
      return
    }

    event.respondWith(
      fetch(request).then((response) => {
        if (response.ok) {
          const copy = response.clone()
          caches.open(CACHE_NAME).then((cache) => cache.put('/', copy))
        }
        return response
      }).catch(async () => (await caches.match('/')) || caches.match(OFFLINE_URL)),
    )
    return
  }

  if (url.pathname.startsWith('/api/') || url.pathname.startsWith('/_next/data/')) return

  const isStaticAsset = url.pathname.startsWith('/_next/static/') ||
    ['script', 'style', 'image', 'font'].includes(request.destination)

  if (!isStaticAsset) return

  event.respondWith(
    caches.match(request).then((cached) => cached || fetch(request).then((response) => {
      if (response.ok) {
        const copy = response.clone()
        caches.open(CACHE_NAME).then((cache) => cache.put(request, copy))
      }
      return response
    })),
  )
})