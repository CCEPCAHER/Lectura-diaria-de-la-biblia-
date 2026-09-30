// Sincronización entre dispositivos con un código, sin cuentas.
// El progreso se cifra aquí (AES-GCM) con una clave derivada del código; el servidor solo guarda datos cifrados.
(() => {
  const API = 'api/sync.php';
  const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // sin 0/O ni 1/I para no confundirse al copiarlo
  const CODE_LENGTH = 12;
  const PBKDF2_ITERATIONS = 150000;
  const CHANGE_DEBOUNCE_MS = 4000;

  const store = {
    get(k) { try { return localStorage.getItem(k); } catch { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch { /* sin almacenamiento */ } },
    remove(k) { try { localStorage.removeItem(k); } catch { /* sin almacenamiento */ } }
  };
  const readJSON = (k) => { try { return JSON.parse(store.get(k)) || {}; } catch { return {}; } };

  const supported = !!(window.crypto && crypto.subtle && window.TextEncoder);
  let keysCache = null; // { code, id, key }
  let syncing = null;
  let pendingAgain = false;
  let changeTimer = null;
  let applyingRemote = false;
  let els = {};

  // ---- Código ----
  function generateCode() {
    const bytes = crypto.getRandomValues(new Uint8Array(CODE_LENGTH));
    const chars = Array.from(bytes, b => ALPHABET[b % ALPHABET.length]).join('');
    return formatCode(chars);
  }
  function normalizeCode(input) { return String(input || '').toUpperCase().replace(/[^A-Z0-9]/g, ''); }
  function isValidCode(input) { const c = normalizeCode(input); return c.length === CODE_LENGTH && [...c].every(ch => ALPHABET.includes(ch)); }
  function formatCode(input) { return normalizeCode(input).match(/.{1,4}/g).join('-'); }

  // ---- Cifrado ----
  const b64 = {
    encode(bytes) { let s = ''; bytes.forEach(b => { s += String.fromCharCode(b); }); return btoa(s); },
    decode(str) { return Uint8Array.from(atob(str), c => c.charCodeAt(0)); }
  };

  async function deriveKeys(code) {
    const normalized = normalizeCode(code);
    if (keysCache && keysCache.code === normalized) return keysCache;
    const enc = new TextEncoder();
    const idHash = await crypto.subtle.digest('SHA-256', enc.encode('lectura-diaria:sync-id:' + normalized));
    const id = Array.from(new Uint8Array(idHash), b => b.toString(16).padStart(2, '0')).join('');
    const material = await crypto.subtle.importKey('raw', enc.encode(normalized), 'PBKDF2', false, ['deriveKey']);
    const key = await crypto.subtle.deriveKey(
      { name: 'PBKDF2', salt: enc.encode('lectura-diaria:sync-key:v1'), iterations: PBKDF2_ITERATIONS, hash: 'SHA-256' },
      material, { name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt']);
    keysCache = { code: normalized, id, key };
    return keysCache;
  }

  async function encrypt(key, obj) {
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const data = new Uint8Array(await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, new TextEncoder().encode(JSON.stringify(obj))));
    const out = new Uint8Array(iv.length + data.length);
    out.set(iv); out.set(data, iv.length);
    return b64.encode(out);
  }

  async function decrypt(key, text) {
    const bytes = b64.decode(text);
    const plain = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: bytes.slice(0, 12) }, key, bytes.slice(12));
    return JSON.parse(new TextDecoder().decode(plain));
  }

  // ---- Datos y fusión ----
  function readLocal() {
    return {
      v: 1,
      read: readJSON('bibleReadStatus'),
      dates: readJSON('bibleReadDates'),
      times: readJSON('syncChapterTimes'),
      awards: readJSON('awardedSectionsStatus'),
      plan: {
        value: store.get('planStartDate') || '', t: Number(store.get('planStartDateUpdatedAt')) || 0,
        mode: store.get('planMode') || 'dates', catchUp: store.get('catchUpPlan') || ''
      },
      lastReadingDate: store.get('lastReadingDate') || '',
      friend: (() => { try { return JSON.parse(store.get('friendProfile')) || null; } catch { return null; } })()
    };
  }

  function writeLocal(state) {
    store.set('bibleReadStatus', JSON.stringify(state.read));
    store.set('bibleReadDates', JSON.stringify(state.dates));
    store.set('syncChapterTimes', JSON.stringify(state.times));
    store.set('awardedSectionsStatus', JSON.stringify(state.awards));
    if (state.plan.value) store.set('planStartDate', state.plan.value); else store.remove('planStartDate');
    store.set('planStartDateUpdatedAt', String(state.plan.t || 0));
    // Modo de lectura y reparto de lo atrasado (las versiones anteriores no los envían).
    if (state.plan.mode === 'pace' || state.plan.mode === 'dates') store.set('planMode', state.plan.mode);
    if ('catchUp' in state.plan) { if (state.plan.catchUp) store.set('catchUpPlan', state.plan.catchUp); else store.remove('catchUpPlan'); }
    if (state.lastReadingDate) store.set('lastReadingDate', state.lastReadingDate);
    if (state.friend && state.friend.id && state.friend.secret) store.set('friendProfile', JSON.stringify(state.friend));
  }

  // Cada capítulo: gana el cambio más reciente (marcar o desmarcar). Sin fecha de cambio, se suma lo leído.
  function merge(a, b) {
    const out = { v: 1, read: {}, dates: {}, times: {}, awards: {}, plan: a.plan, lastReadingDate: '' };
    const keys = new Set([...Object.keys(a.read), ...Object.keys(a.times), ...Object.keys(b.read), ...Object.keys(b.times)]);
    keys.forEach(key => {
      const ta = Number(a.times[key]) || 0, tb = Number(b.times[key]) || 0;
      let isRead, date;
      if (ta !== tb) {
        const src = ta > tb ? a : b;
        isRead = !!src.read[key];
        date = src.dates[key];
      } else {
        isRead = !!(a.read[key] || b.read[key]);
        date = [a.dates[key], b.dates[key]].filter(Boolean).sort()[0];
      }
      if (isRead) { out.read[key] = true; if (date) out.dates[key] = date; }
      if (Math.max(ta, tb)) out.times[key] = Math.max(ta, tb);
    });
    new Set([...Object.keys(a.awards), ...Object.keys(b.awards)]).forEach(id => {
      if (a.awards[id] === true || b.awards[id] === true) out.awards[id] = true;
    });
    if (b.plan.t > a.plan.t || (b.plan.t === a.plan.t && !a.plan.value && b.plan.value)) out.plan = b.plan;
    out.lastReadingDate = [a.lastReadingDate, b.lastReadingDate].filter(Boolean).sort().pop() || '';
    out.friend = a.friend || b.friend || null; // el primer perfil de amigos que exista se usa en todos los dispositivos
    return out;
  }

  function canonical(value) {
    if (Array.isArray(value)) return `[${value.map(canonical).join(',')}]`;
    if (value && typeof value === 'object') return `{${Object.keys(value).sort().map(k => `${JSON.stringify(k)}:${canonical(value[k])}`).join(',')}}`;
    return JSON.stringify(value);
  }
  const same = (x, y) => canonical(x) === canonical(y);

  // ---- Servidor ----
  async function api(body) {
    const res = await fetch(API, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body), keepalive: true });
    const data = await res.json().catch(() => ({}));
    return { status: res.status, data };
  }

  async function pull(id) {
    const { status, data } = await api({ action: 'pull', id });
    if (status === 404) return null;
    if (status === 429) throw Object.assign(new Error('Demasiados intentos'), { code: 'rate' });
    if (status !== 200) throw new Error(`HTTP ${status}`);
    return data;
  }

  async function runSync(code) {
    const { id, key } = await deriveKeys(code);
    for (let attempt = 0; attempt < 3; attempt++) {
      const remote = await pull(id);
      const remoteState = remote ? await decrypt(key, remote.data) : null;
      const local = readLocal();
      const merged = remoteState ? merge(local, remoteState) : local;

      if (!same(merged, local)) {
        applyingRemote = true;
        writeLocal(merged);
        if (window.lecturaApp) window.lecturaApp.reload();
        applyingRemote = false;
        document.dispatchEvent(new CustomEvent('lectura:synced'));
      }
      if (remoteState && same(merged, remoteState)) return;

      const { status, data } = await api({ action: 'push', id, baseVersion: remote ? remote.version : 0, data: await encrypt(key, readLocal()) });
      if (status === 200) return;
      if (status !== 409) throw new Error(`HTTP ${status}`);
      // Otro dispositivo guardó a la vez: se vuelve a leer y fusionar.
    }
    throw new Error('Conflicto persistente');
  }

  async function syncNow({ silent = true } = {}) {
    const code = store.get('syncCode');
    if (!supported || !code || !navigator.onLine) return false;
    if (syncing) { pendingAgain = true; return syncing; }
    setStatus('Sincronizando…');
    syncing = runSync(code)
      .then(() => {
        store.set('syncLastAt', String(Date.now()));
        if (!silent) notify('✅ Progreso sincronizado.', { type: 'success' });
        return true;
      })
      .catch(err => {
        console.error('Sincronización:', err);
        if (!silent) notify('No se pudo sincronizar. Revisa tu conexión e inténtalo de nuevo.', { type: 'error' });
        return false;
      })
      .finally(() => {
        syncing = null;
        refreshUI();
        if (pendingAgain) { pendingAgain = false; syncNow(); }
      });
    return syncing;
  }

  // ---- Interfaz ----
  function setStatus(text) { if (els.status) els.status.textContent = text; }

  function timeAgo(ms) {
    const s = Math.round((Date.now() - ms) / 1000);
    if (s < 60) return 'hace un momento';
    if (s < 3600) return `hace ${Math.round(s / 60)} min`;
    if (s < 86400) return `hace ${Math.round(s / 3600)} h`;
    return new Date(ms).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
  }

  function refreshUI() {
    if (!els.section) return;
    const code = store.get('syncCode');
    els.linked.hidden = !code;
    els.unlinked.hidden = !!code;
    if (!supported) {
      els.unlinked.hidden = true;
      setStatus('Este navegador no permite la sincronización cifrada. Actualízalo o usa otro navegador.');
      return;
    }
    if (code) {
      els.code.textContent = formatCode(code);
      const last = Number(store.get('syncLastAt'));
      setStatus(syncing ? 'Sincronizando…' : last ? `Última sincronización: ${timeAgo(last)}.` : 'Aún no se ha sincronizado.');
    } else {
      setStatus('Usa tu progreso en el móvil, la tablet y el ordenador. Sin cuentas: solo un código.');
    }
  }

  async function createCode() {
    const code = generateCode();
    store.set('syncCode', normalizeCode(code));
    store.remove('syncLastAt');
    refreshUI();
    const ok = await syncNow();
    if (ok) notify(`Código creado: ${code}. Escríbelo en tus otros dispositivos.`, { type: 'success', duration: 8000 });
    else { store.remove('syncCode'); refreshUI(); notify('No se pudo crear el código. Revisa tu conexión.', { type: 'error' }); }
  }

  async function linkCode(input) {
    if (!isValidCode(input)) { notify('El código debe tener 12 caracteres, como K7MQ-3XPA-9TRD.', { type: 'error' }); return; }
    const code = normalizeCode(input);
    setStatus('Buscando el código…');
    try {
      const { id } = await deriveKeys(code);
      if (!(await pull(id))) { notify('No existe ningún progreso con ese código. Revísalo.', { type: 'error' }); refreshUI(); return; }
    } catch (err) {
      notify(err.code === 'rate' ? 'Demasiados intentos. Espera un rato.' : 'No se pudo comprobar el código. Revisa tu conexión.', { type: 'error' });
      refreshUI();
      return;
    }
    store.set('syncCode', code);
    store.remove('syncLastAt');
    els.input.value = '';
    const ok = await syncNow();
    notify(ok ? '✅ Dispositivo vinculado. Tu progreso se ha unido.' : 'Vinculado, pero no se pudo sincronizar todavía.', { type: ok ? 'success' : 'error' });
  }

  function unlink() {
    if (!confirm('¿Desvincular este dispositivo? Tu progreso se queda aquí, pero dejará de sincronizarse.')) return;
    store.remove('syncCode');
    store.remove('syncLastAt');
    keysCache = null;
    refreshUI();
    notify('Este dispositivo ya no se sincroniza.');
  }

  // Cambios locales → sincronizar al poco rato.
  document.addEventListener('lectura:changed', () => {
    if (applyingRemote || !store.get('syncCode')) return;
    clearTimeout(changeTimer);
    changeTimer = setTimeout(() => syncNow(), CHANGE_DEBOUNCE_MS);
  });

  document.addEventListener('visibilitychange', () => {
    if (!store.get('syncCode')) return;
    if (document.visibilityState === 'hidden') {
      if (changeTimer) { clearTimeout(changeTimer); changeTimer = null; syncNow(); }
    } else if (Date.now() - (Number(store.get('syncLastAt')) || 0) > 60 * 1000) {
      syncNow();
    }
  });
  window.addEventListener('online', () => syncNow());

  document.addEventListener('DOMContentLoaded', () => {
    els = {
      section: document.getElementById('sync-menu'),
      status: document.getElementById('syncStatusText'),
      linked: document.getElementById('syncLinked'),
      unlinked: document.getElementById('syncUnlinked'),
      code: document.getElementById('syncCodeText'),
      input: document.getElementById('syncCodeInput')
    };
    if (!els.section) return;
    refreshUI();

    document.getElementById('syncCreateButton').addEventListener('click', createCode);
    document.getElementById('syncLinkButton').addEventListener('click', () => linkCode(els.input.value));
    els.input.addEventListener('keydown', e => { if (e.key === 'Enter') linkCode(els.input.value); });
    els.input.addEventListener('input', () => {
      const clean = normalizeCode(els.input.value).slice(0, CODE_LENGTH);
      const formatted = clean ? formatCode(clean) : '';
      if (els.input.value !== formatted) els.input.value = formatted;
    });
    document.getElementById('syncNowButton').addEventListener('click', () => syncNow({ silent: false }));
    document.getElementById('syncCopyButton').addEventListener('click', async () => {
      const code = formatCode(store.get('syncCode') || '');
      try { await navigator.clipboard.writeText(code); notify('Código copiado.'); }
      catch { notify(`Tu código: ${code}`, { duration: 8000 }); }
    });
    document.getElementById('syncUnlinkButton').addEventListener('click', unlink);

    if (store.get('syncCode')) setTimeout(() => syncNow(), 1000);
  });
})();
