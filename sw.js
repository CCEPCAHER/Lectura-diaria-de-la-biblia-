const CACHE_NAME = 'biblia-progreso-cache-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/style.css',
    '/script.js',
    '/manifest.json',
    '/icon-192x192.png', // Asegúrate que los nombres de tus iconos coincidan
    '/icon-512x512.png'  // Asegúrate que los nombres de tus iconos coincidan
];

// Instalación del Service Worker y almacenamiento en caché de los assets iniciales
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Cache abierta');
                return cache.addAll(urlsToCache);
            })
            .catch(err => {
                console.error('Fallo al cachear durante la instalación:', err);
            })
    );
});

// Activación del Service Worker y limpieza de cachés antiguas
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Service Worker: borrando caché antigua', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    return self.clients.claim(); // Permite que el SW activo controle clientes inmediatamente
});

// Interceptar peticiones de red
self.addEventListener('fetch', event => {
    // Solo para peticiones GET
    if (event.request.method !== 'GET') {
        return;
    }

    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Si la respuesta está en caché, devolverla
                if (response) {
                    return response;
                }

                // Si no, intentar obtenerla de la red
                return fetch(event.request).then(
                    networkResponse => {
                        // Comprobar si recibimos una respuesta válida
                        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
                            return networkResponse;
                        }

                        // Clonar la respuesta porque es un stream y solo se puede consumir una vez
                        const responseToCache = networkResponse.clone();

                        caches.open(CACHE_NAME)
                            .then(cache => {
                                cache.put(event.request, responseToCache);
                            });

                        return networkResponse;
                    }
                ).catch(error => {
                    console.error('Service Worker: Fallo al obtener de la red y no está en caché.', error);
                    // Podrías devolver una página offline por defecto aquí si lo deseas
                    // Por ejemplo: return caches.match('/offline.html');
                });
            })
    );
});
