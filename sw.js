// sw.js

const CACHE_NAME = 'lectura-biblica-cache-v1.1'; // Incrementa la versión si cambias los archivos cacheados
const urlsToCache = [
  '/',                        // Si tu servidor sirve index.html en la raíz
  '/index.html',
  '/style.css',
  '/script.js',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
  // No estamos cacheando Google Fonts aquí para simplificar,
  // pero se podría hacer con una estrategia más avanzada si es necesario.
];

// Evento 'install': se dispara cuando el SW se instala por primera vez.
self.addEventListener('install', event => {
  console.log('[Service Worker] Instalando...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[Service Worker] Abriendo caché y añadiendo archivos del app shell');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('[Service Worker] Archivos del app shell cacheados exitosamente');
        return self.skipWaiting(); // Fuerza al SW a activarse inmediatamente
      })
      .catch(error => {
        console.error('[Service Worker] Falló el cacheo del app shell:', error);
      })
  );
});

// Evento 'activate': se dispara después de la instalación.
// Limpia cachés antiguas.
self.addEventListener('activate', event => {
  console.log('[Service Worker] Activando...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('[Service Worker] Borrando caché antigua:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('[Service Worker] Reclamando clientes...');
      return self.clients.claim(); // Permite al SW activado controlar clientes inmediatamente
    })
  );
});

// Evento 'fetch': se dispara cada vez que la aplicación PWA hace una petición de red.
self.addEventListener('fetch', event => {
  // Estrategia: Cache First, then Network
  // Ignorar peticiones que no son GET (como POST, etc.)
  if (event.request.method !== 'GET') {
    return;
  }

  // Ignorar peticiones a Google Fonts para que siempre se sirvan de la red
  // (o se podría implementar una estrategia de caché específica para ellas)
  if (event.request.url.startsWith('https://fonts.googleapis.com') || event.request.url.startsWith('https://fonts.gstatic.com')) {
    event.respondWith(fetch(event.request));
    return;
  }
  
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          // Si está en caché, devolver la respuesta de la caché
          return response;
        }
        // Si no está en caché, ir a la red
        return fetch(event.request).then(
          networkResponse => {
            // Opcional: Cachear la respuesta obtenida de la red para futuras peticiones
            // Solo cachear si es una respuesta válida y no es una extensión de Chrome
            if (networkResponse && networkResponse.status === 200 && !event.request.url.startsWith('chrome-extension://')) {
              const responseToCache = networkResponse.clone();
              caches.open(CACHE_NAME)
                .then(cache => {
                  cache.put(event.request, responseToCache);
                });
            }
            return networkResponse;
          }
        ).catch(error => {
          console.error('[Service Worker] Error en fetch:', event.request.url, error);
          // Podrías devolver una página offline genérica aquí si lo deseas
          // Ejemplo: return caches.match('/offline.html');
          // Por ahora, simplemente dejamos que el error de red ocurra.
        });
      })
  );
});
