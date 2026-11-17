// Service worker de DuoSwift: permite instalar la app y usarla sin conexión.
// Las rutas se resuelven contra el scope, así funciona igual en local ("/") y en GitHub Pages ("/<repo>/").
const VERSION = 'v1'
const SHELL_CACHE = `duoswift-shell-${VERSION}`
const RUNTIME_CACHE = `duoswift-runtime-${VERSION}`
const SCOPE = self.registration.scope
const INDEX_URL = SCOPE // index.html servido en la raíz del scope

const PRECACHE = [
  INDEX_URL,
  `${SCOPE}manifest.webmanifest`,
  `${SCOPE}favicon.svg`,
  `${SCOPE}icons/icon-192.png`,
  `${SCOPE}icons/icon-512.png`,
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(SHELL_CACHE).then((cache) => cache.addAll(PRECACHE)).then(() => self.skipWaiting()),
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((k) => k.startsWith('duoswift-') && k !== SHELL_CACHE && k !== RUNTIME_CACHE)
            .map((k) => caches.delete(k)),
        ),
      )
      .then(() => self.clients.claim()),
  )
})

const FONT_HOSTS = ['fonts.googleapis.com', 'fonts.gstatic.com']

self.addEventListener('fetch', (event) => {
  const { request } = event
  if (request.method !== 'GET') return
  const url = new URL(request.url)

  // Navegación (abrir la app o cambiar de ruta): red primero para ver siempre la última versión;
  // sin conexión se sirve el index.html guardado y React Router resuelve la ruta.
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const copy = response.clone()
            caches.open(SHELL_CACHE).then((cache) => cache.put(INDEX_URL, copy))
          }
          return response
        })
        .catch(() => caches.match(INDEX_URL)),
    )
    return
  }

  // Archivos propios (JS/CSS con hash, íconos, imágenes): caché primero, se guardan al usarse.
  if (url.origin === self.location.origin && url.href.startsWith(SCOPE)) {
    event.respondWith(
      caches.match(request).then(
        (cached) =>
          cached ||
          fetch(request).then((response) => {
            if (response.ok) {
              const copy = response.clone()
              caches.open(RUNTIME_CACHE).then((cache) => cache.put(request, copy))
            }
            return response
          }),
      ),
    )
    return
  }

  // Google Fonts: responde con la copia guardada y la actualiza en segundo plano.
  if (FONT_HOSTS.includes(url.hostname)) {
    event.respondWith(
      caches.open(RUNTIME_CACHE).then((cache) =>
        cache.match(request).then((cached) => {
          const network = fetch(request)
            .then((response) => {
              if (response.ok || response.type === 'opaque') cache.put(request, response.clone())
              return response
            })
            .catch(() => cached)
          return cached || network
        }),
      ),
    )
  }
  // Todo lo demás (Firebase, etc.) va directo a la red.
})
