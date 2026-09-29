// Estadísticas anónimas de uso: un identificador aleatorio del dispositivo, aperturas, tiempo de uso
// y capítulos marcados. Nada de nombres, correos ni IP. Se desactivan desde Menú → Acerca de.
(() => {
  const ENDPOINT = 'api/collect.php';
  const APP_VERSION = '2.7.2';
  const MAX_SECONDS_PER_PING = 4 * 3600;
  const NEW_SESSION_AFTER_MS = 30 * 60 * 1000; // volver tras 30 min cuenta como nueva apertura
  const IDLE_AFTER_MS = 90 * 1000;             // sin tocar nada 90 s: deja de contar tiempo
  const TICK_MS = 15 * 1000;

  const store = {
    get(k) { try { return localStorage.getItem(k); } catch { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch { /* sin almacenamiento */ } }
  };

  const isLocalhost = ['localhost', '127.0.0.1'].includes(location.hostname);
  const isEnabled = () => store.get('statsOptOut') !== '1' && (location.protocol === 'https:' || isLocalhost);

  function deviceId() {
    let id = store.get('statsDeviceId');
    if (!id || !/^[a-z0-9-]{16,40}$/i.test(id)) {
      id = (crypto.randomUUID && crypto.randomUUID()) ||
        Array.from(crypto.getRandomValues(new Uint8Array(16)), b => b.toString(16).padStart(2, '0')).join('');
      store.set('statsDeviceId', id);
    }
    return id;
  }

  function platform() {
    const ua = navigator.userAgent;
    if (/Android/i.test(ua)) return 'android';
    if (/iPhone|iPad|iPod/i.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)) return 'ios';
    if (/Windows/i.test(ua)) return 'windows';
    if (/Macintosh/i.test(ua)) return 'mac';
    if (/Linux|CrOS/i.test(ua)) return 'linux';
    return 'otro';
  }

  const isStandalone = () => window.matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;

  let summary = null;
  document.addEventListener('lectura:summary', (e) => { summary = e.detail; });

  // Si no hay conexión, acumulamos tiempo y capítulos y los enviamos en la siguiente apertura.
  function loadPending() { try { return JSON.parse(store.get('statsPending')) || { read: 0, time: 0 }; } catch { return { read: 0, time: 0 }; } }
  function queue(event, n) {
    if (event !== 'read' && event !== 'time') return;
    const pending = loadPending();
    pending[event] = (pending[event] || 0) + n;
    store.set('statsPending', JSON.stringify(pending));
  }

  function send(event, n = 0, { beacon = false } = {}) {
    if (!isEnabled()) return;
    if (!navigator.onLine) { queue(event, n); return; }
    const payload = JSON.stringify({ d: deviceId(), e: event, n, v: APP_VERSION, p: platform(), s: isStandalone() ? 1 : 0, sum: summary });
    if (beacon && navigator.sendBeacon && navigator.sendBeacon(ENDPOINT, new Blob([payload], { type: 'text/plain' }))) return;
    fetch(ENDPOINT, { method: 'POST', body: payload, keepalive: true, headers: { 'Content-Type': 'text/plain' } })
      .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); })
      .catch(() => queue(event, n));
  }

  function flushPending() {
    const pending = loadPending();
    store.set('statsPending', JSON.stringify({ read: 0, time: 0 }));
    if (pending.read > 0) send('read', pending.read);
    if (pending.time > 0) send('time', Math.min(pending.time, MAX_SECONDS_PER_PING));
  }

  // Tiempo de uso activo: solo cuenta mientras la app está visible y hubo interacción reciente.
  let activeMs = 0;
  let lastTick = Date.now();
  let lastInteraction = Date.now();
  let hiddenAt = null;

  ['pointerdown', 'keydown', 'scroll', 'touchstart'].forEach(type =>
    window.addEventListener(type, () => { lastInteraction = Date.now(); }, { passive: true, capture: true }));

  function tick() {
    const now = Date.now();
    if (document.visibilityState === 'visible' && now - lastInteraction < IDLE_AFTER_MS) activeMs += now - lastTick;
    lastTick = now;
  }
  setInterval(tick, TICK_MS);

  let readPending = 0;
  let readTimer = null;
  function flushRead(beacon = false) {
    clearTimeout(readTimer);
    if (readPending > 0) { send('read', readPending, { beacon }); readPending = 0; }
  }
  document.addEventListener('lectura:read', (e) => {
    readPending += Math.max(0, Number(e.detail && e.detail.count) || 0);
    clearTimeout(readTimer);
    readTimer = setTimeout(flushRead, 5000);
  });

  function flushTime() {
    tick();
    const secs = Math.round(activeMs / 1000);
    activeMs = 0;
    if (secs >= 1) send('time', Math.min(secs, MAX_SECONDS_PER_PING), { beacon: true });
    flushRead(true);
  }

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      flushTime();
      hiddenAt = Date.now();
    } else {
      lastTick = Date.now();
      lastInteraction = Date.now();
      if (hiddenAt && Date.now() - hiddenAt > NEW_SESSION_AFTER_MS) send('open');
      hiddenAt = null;
    }
  });
  window.addEventListener('pagehide', flushTime);
  window.addEventListener('appinstalled', () => send('install'));

  window.addEventListener('load', () => {
    send('open');
    flushPending();
  });

  // Interruptor en Menú → Acerca de.
  document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.getElementById('statsOptInToggle');
    if (!toggle) return;
    toggle.checked = store.get('statsOptOut') !== '1';
    toggle.addEventListener('change', () => {
      store.set('statsOptOut', toggle.checked ? '0' : '1');
      notify(toggle.checked ? 'Gracias por ayudar a mejorar la app.' : 'Estadísticas anónimas desactivadas en este dispositivo.');
    });
  });
})();
