// Red primero y caché como respaldo: con conexión siempre llega la última versión publicada,
// sin conexión la app sigue funcionando con lo último que se guardó.
const CACHE = 'lectura-diaria-v2';
const ASSETS = [
  './',
  './index.html',
  './style.css',
  './pwa.js',
  './script.js',
  './stats.js',
  './manifest.json',
  './icons/icon-192x192.png',
  './icons/icon-512x512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const { request } = event;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  // Solo recursos propios; las estadísticas y el panel de admin nunca pasan por la caché.
  if (url.origin !== self.location.origin || url.pathname.includes('/api/') || url.pathname.includes('/admin/')) return;

  event.respondWith(
    fetch(request)
      .then(response => {
        if (response.ok) {
          const copy = response.clone();
          caches.open(CACHE).then(cache => cache.put(request, copy));
        }
        return response;
      })
      .catch(() => caches.match(request, { ignoreSearch: true })
        .then(cached => cached || (request.mode === 'navigate' ? caches.match('./index.html') : Response.error())))
  );
});
