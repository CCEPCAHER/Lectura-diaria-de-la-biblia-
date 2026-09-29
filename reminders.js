// Recordatorio diario con notificaciones push (Menú → Recordatorio diario).
(() => {
  const API = 'api/push.php';
  const STATE_CACHE = 'lectura-diaria-estado';
  const STATE_URL = new URL('__estado-recordatorio.json', document.baseURI).href;

  const store = {
    get(k) { try { return localStorage.getItem(k); } catch { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch { /* sin almacenamiento */ } }
  };

  const supported = 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;
  const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const isStandalone = () => window.matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
  const timeZone = () => { try { return Intl.DateTimeFormat().resolvedOptions().timeZone || 'Europe/Madrid'; } catch { return 'Europe/Madrid'; } };

  let today = null; // { start, plan, todayRead, date } publicado por script.js
  let els = {};

  function urlBase64ToUint8Array(base64) {
    const padded = (base64 + '='.repeat((4 - base64.length % 4) % 4)).replace(/-/g, '+').replace(/_/g, '/');
    return Uint8Array.from(atob(padded), c => c.charCodeAt(0));
  }

  async function post(body) {
    const res = await fetch(API, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw Object.assign(new Error(data.error || `HTTP ${res.status}`), { status: res.status });
    return data;
  }

  // Si el Service Worker no llega a registrarse, no nos quedamos esperando para siempre.
  function serviceWorkerReady(ms) {
    return Promise.race([
      navigator.serviceWorker.ready,
      new Promise((_, reject) => setTimeout(() => reject(new Error('Service Worker no disponible')), ms))
    ]);
  }

  async function getSubscription() {
    if (!supported) return null;
    const reg = await serviceWorkerReady(4000);
    return reg.pushManager.getSubscription();
  }

  // El Service Worker no puede leer localStorage: le dejamos el plan en la caché para personalizar el aviso.
  async function saveStateForServiceWorker(detail) {
    if (!('caches' in window)) return;
    const cache = await caches.open(STATE_CACHE);
    await cache.put(STATE_URL, new Response(JSON.stringify({ start: detail.start, plan: detail.plan }), { headers: { 'Content-Type': 'application/json' } }));
  }

  // Si ya leyó hoy, avisamos al servidor para no mandarle el recordatorio.
  async function reportDone() {
    if (!today || !today.todayRead || store.get('reminderEnabled') !== '1' || store.get('reminderDoneSent') === today.date) return;
    const sub = await getSubscription().catch(() => null);
    if (!sub) return;
    post({ action: 'done', endpoint: sub.endpoint, date: today.date })
      .then(() => store.set('reminderDoneSent', today.date))
      .catch(() => {});
  }

  async function enable() {
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      notify('Para recibir el recordatorio tienes que permitir las notificaciones.', { type: 'error', duration: 6000 });
      return false;
    }
    const { publicKey } = await (await fetch(`${API}?action=key`)).json();
    const reg = await serviceWorkerReady(10000);
    let sub = await reg.pushManager.getSubscription();
    if (!sub) sub = await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: urlBase64ToUint8Array(publicKey) });
    await post({ action: 'subscribe', subscription: sub.toJSON(), time: els.time.value || '08:00', tz: timeZone(), device: store.get('statsDeviceId') });
    store.set('reminderEnabled', '1');
    store.set('reminderTime', els.time.value || '08:00');
    store.set('reminderDoneSent', '');
    reportDone();
    return true;
  }

  async function disable() {
    const sub = await getSubscription().catch(() => null);
    if (sub) {
      await post({ action: 'unsubscribe', endpoint: sub.endpoint }).catch(() => {});
      await sub.unsubscribe().catch(() => {});
    }
    store.set('reminderEnabled', '0');
  }

  function refreshUI() {
    if (!els.toggle) return;
    const enabled = store.get('reminderEnabled') === '1';
    let message = '';
    let blocked = false;

    if (isIOS && !isStandalone()) {
      message = 'En iPhone/iPad primero instala la app (Safari → Compartir → «Añadir a pantalla de inicio») y ábrela desde su icono.';
      blocked = true;
    } else if (!supported) {
      message = 'Este navegador no permite notificaciones. Prueba con Chrome, Edge, Firefox o Safari actualizado.';
      blocked = true;
    } else if (Notification.permission === 'denied') {
      message = 'Has bloqueado las notificaciones de esta web. Actívalas en los ajustes del navegador para usar el recordatorio.';
      blocked = true;
    } else if (enabled) {
      message = `✅ Te avisaremos cada día a las ${els.time.value}, salvo que ya hayas hecho la lectura.`;
    } else {
      message = 'Recibe cada día un aviso con tu lectura, aunque la app esté cerrada.';
    }

    els.status.textContent = message;
    els.toggle.checked = enabled && !blocked;
    els.toggle.disabled = blocked;
    els.time.disabled = blocked;
    els.test.hidden = !enabled || blocked;
    if (els.promo) els.promo.hidden = enabled || blocked;
    window.lecturaReminderState = { enabled: enabled && !blocked, blocked, message };
    document.dispatchEvent(new CustomEvent('lectura:reminder-state', { detail: window.lecturaReminderState }));
  }

  async function withBusy(fn) {
    els.toggle.disabled = true;
    try { await fn(); }
    finally { els.toggle.disabled = false; refreshUI(); }
  }

  document.addEventListener('lectura:today', (e) => {
    today = e.detail;
    saveStateForServiceWorker(e.detail).catch(() => {});
    reportDone();
  });

  document.addEventListener('DOMContentLoaded', async () => {
    els = {
      toggle: document.getElementById('reminderToggle'),
      time: document.getElementById('reminderTime'),
      test: document.getElementById('reminderTestButton'),
      status: document.getElementById('reminderStatusText'),
      promo: document.getElementById('reminderPromoButton')
    };
    if (!els.toggle) return;
    els.time.value = store.get('reminderTime') || '08:00';
    refreshUI();

    // Sincroniza la preferencia guardada con la suscripción real del navegador.
    if (supported) {
      const sub = await getSubscription().catch(() => null);
      if (!sub && store.get('reminderEnabled') === '1') store.set('reminderEnabled', '0');
      if (sub && Notification.permission === 'granted' && store.get('reminderEnabled') !== '1') store.set('reminderEnabled', '1');
    }
    refreshUI();

    els.toggle.addEventListener('change', () => withBusy(async () => {
      try {
        if (els.toggle.checked) {
          if (await enable()) notify(`🔔 Recordatorio activado a las ${els.time.value}.`, { type: 'success' });
        } else {
          await disable();
          notify('Recordatorio desactivado.');
        }
      } catch (err) {
        console.error('Recordatorio:', err);
        store.set('reminderEnabled', '0');
        notify('No se pudo activar el recordatorio en este navegador. Inténtalo de nuevo más tarde.', { type: 'error', duration: 6000 });
      }
    }));

    els.time.addEventListener('change', async () => {
      store.set('reminderTime', els.time.value);
      if (store.get('reminderEnabled') !== '1') return;
      try {
        const sub = await getSubscription();
        if (sub) await post({ action: 'update', endpoint: sub.endpoint, time: els.time.value, tz: timeZone() });
        notify(`Hora del recordatorio: ${els.time.value}`, { type: 'success' });
      } catch (err) {
        notify('No se pudo guardar la hora. Revisa tu conexión.', { type: 'error' });
      }
      refreshUI();
    });

    els.test.addEventListener('click', async () => {
      try {
        const sub = await getSubscription();
        if (!sub) throw new Error('sin suscripción');
        await post({ action: 'test', endpoint: sub.endpoint });
        notify('Aviso de prueba enviado. Debería llegarte en unos segundos.');
      } catch (err) {
        notify(err.status === 429 ? 'Espera unos segundos antes de probar otra vez.' : 'No se pudo enviar el aviso de prueba.', { type: 'error' });
      }
    });

    if (els.promo) {
      els.promo.addEventListener('click', () => {
        const menu = document.getElementById('sideMenu');
        if (menu && !menu.classList.contains('open')) document.getElementById('menuToggle').click();
        setTimeout(() => document.getElementById('reminder-menu').scrollIntoView({ behavior: 'smooth' }), 300);
      });
    }
  });
})();
