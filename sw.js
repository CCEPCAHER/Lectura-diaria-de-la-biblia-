// Red primero y caché como respaldo: con conexión siempre llega la última versión publicada,
// sin conexión la app sigue funcionando con lo último que se guardó.
const CACHE = 'lectura-diaria-v17';
const STATE_CACHE = 'lectura-diaria-estado'; // plan y fecha de inicio que deja reminders.js
const ASSETS = [
  './',
  './index.html',
  './style.css',
  './pwa.js',
  './script.js',
  './stats.js',
  './reminders.js',
  './onboarding.js',
  './sync.js',
  './friends.js',
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
      .then(keys => Promise.all(keys.filter(k => k !== CACHE && k !== STATE_CACHE).map(k => caches.delete(k))))
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

// ---- Recordatorio diario ----

const scopeUrl = path => new URL(path, self.registration.scope).href;

async function todaysReading() {
  try {
    const res = await caches.match(scopeUrl('__estado-recordatorio.json'), { cacheName: STATE_CACHE });
    if (!res) return null;
    const state = await res.json();
    // «A mi ritmo»: la siguiente lectura sin leer que dejó la app.
    if (state.mode === 'pace') return state.next && state.next.text ? { day: state.next.day, text: state.next.text, pace: true } : null;
    if (!state.start || !Array.isArray(state.plan)) return null;
    const now = new Date();
    const index = Math.floor((Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) - Date.parse(state.start + 'T00:00:00Z')) / 86400000);
    if (index < 0 || index >= state.plan.length) return null;
    return { day: index + 1, text: state.plan[index] };
  } catch {
    return null;
  }
}

self.addEventListener('push', event => {
  let data = {};
  try { data = event.data ? event.data.json() : {}; } catch { /* mensaje sin JSON */ }
  event.waitUntil((async () => {
    let title = data.title || '📖 Tu lectura de hoy';
    let body = data.body || 'Dedica unos minutos a la lectura bíblica de hoy.';
    if (data.kind === 'streak') {
      // Aviso de racha por la noche: se mantiene el título del servidor y se añade la lectura de hoy.
      const reading = await todaysReading();
      if (reading) body = `Aún estás a tiempo: hoy toca ${reading.text} 📖`;
    } else if (!data.test && !data.kind) {
      const reading = await todaysReading();
      if (reading) {
        title = reading.pace ? `📖 Te toca: ${reading.text}` : `📖 Día ${reading.day}: ${reading.text}`;
        body = 'Toca para abrir tu lectura de hoy.';
      }
    }
    await self.registration.showNotification(title, {
      body,
      icon: 'icons/icon-192x192.png',
      tag: 'lectura-diaria',
      renotify: true,
      data: { url: './?desde=recordatorio' }
    });
  })());
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  const target = scopeUrl((event.notification.data && event.notification.data.url) || './');
  event.waitUntil((async () => {
    fetch(scopeUrl('api/push.php'), { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'click' }) }).catch(() => {});
    const windows = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    const open = windows.find(w => w.url.startsWith(self.registration.scope));
    if (open) return open.focus();
    return self.clients.openWindow(target);
  })());
});

// El navegador renovó la suscripción: la registramos de nuevo conservando la hora elegida.
self.addEventListener('pushsubscriptionchange', event => {
  event.waitUntil((async () => {
    let sub = event.newSubscription;
    if (!sub) {
      const { publicKey } = await (await fetch(scopeUrl('api/push.php?action=key'))).json();
      const padded = (publicKey + '='.repeat((4 - publicKey.length % 4) % 4)).replace(/-/g, '+').replace(/_/g, '/');
      sub = await self.registration.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: Uint8Array.from(atob(padded), c => c.charCodeAt(0)) });
    }
    await fetch(scopeUrl('api/push.php'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'resubscribe', oldEndpoint: event.oldSubscription ? event.oldSubscription.endpoint : null, subscription: sub.toJSON() })
    });
  })());
});
