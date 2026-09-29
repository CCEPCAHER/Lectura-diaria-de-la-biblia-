// Amigos: perfil con apodo (sin cuentas), invitación por enlace, rachas de amigos y botón «Animar».
(() => {
  const API = 'api/friends.php';
  const PROFILE_KEY = 'friendProfile';      // { id, secret, nickname }
  const CACHE_KEY = 'friendsCache';         // última lista, para verla sin conexión
  const PUSH_KEY = 'friendPushEndpoint';
  const INVITE_PARAM = 'amigo';

  const store = {
    get(k) { try { return localStorage.getItem(k); } catch { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch { /* sin almacenamiento */ } },
    remove(k) { try { localStorage.removeItem(k); } catch { /* sin almacenamiento */ } }
  };
  const readJSON = k => { try { return JSON.parse(store.get(k)); } catch { return null; } };
  const today = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };
  const profile = () => { const p = readJSON(PROFILE_KEY); return p && p.id && p.secret ? p : null; };
  const formatCode = c => `${c.slice(0, 4)}-${c.slice(4)}`;
  const inviteUrl = code => new URL(`./?${INVITE_PARAM}=${code}`, location.href).href;

  let stats = null;          // lo que publica script.js
  let lastSentStats = '';
  let updateTimer = null;
  let lastRefresh = 0;
  let pendingInvite = null;  // código recibido por enlace
  let dialogMode = null;     // 'create' | 'rename' | 'invite'
  let els = {};

  async function api(action, extra = {}) {
    const p = profile();
    const body = { action, today: today(), ...(p ? { id: p.id, secret: p.secret } : {}), ...extra };
    const res = await fetch(API, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    const data = await res.json().catch(() => ({}));
    if (res.status === 401 && p) { store.remove(PROFILE_KEY); render(); }
    if (!res.ok) throw Object.assign(new Error(data.error || `HTTP ${res.status}`), { status: res.status, code: data.error });
    return data;
  }

  // ---- Publicar mis datos (apodo, racha, % y si leí hoy) ----
  document.addEventListener('lectura:summary', (e) => {
    const s = e.detail;
    // Solo se comparte la racha (y si hoy se leyó, para saber si sigue viva); nada más.
    stats = { streak: s.streak || 0, best: s.bestStreak || 0, readToday: !!s.readToday };
    renderMe(); // tu fila cambia al momento; a tus amigos les llega en unos segundos
    scheduleUpdate();
  });

  function scheduleUpdate(delay = 3000) {
    if (!profile() || !stats) return;
    clearTimeout(updateTimer);
    updateTimer = setTimeout(sendUpdate, delay);
  }

  async function currentPushEndpoint() {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) return null;
    try {
      const reg = await Promise.race([navigator.serviceWorker.ready, new Promise((_, r) => setTimeout(() => r(new Error('sw')), 3000))]);
      const sub = await reg.pushManager.getSubscription();
      return sub ? sub.endpoint : null;
    } catch { return null; }
  }

  async function sendUpdate() {
    if (!profile() || !stats || !navigator.onLine) return;
    const payload = { stats };
    const endpoint = await currentPushEndpoint();
    if ((endpoint || '') !== (store.get(PUSH_KEY) || '')) payload.pushEndpoint = endpoint || '';
    const key = JSON.stringify(payload) + today();
    if (key === lastSentStats) return;
    try {
      await api('update', payload);
      lastSentStats = key;
      if ('pushEndpoint' in payload) store.set(PUSH_KEY, payload.pushEndpoint);
      renderMe();
    } catch (err) { console.warn('Amigos: no se pudo actualizar', err); }
  }
  // Al activar o quitar el recordatorio cambia la forma de avisarte de los ánimos.
  document.addEventListener('lectura:reminder-state', () => { lastSentStats = ''; scheduleUpdate(1500); });

  // ---- Lista de amigos ----
  async function refresh() {
    if (!profile()) { render(); return; }
    lastRefresh = Date.now();
    try {
      const data = await api('list');
      store.set(CACHE_KEY, JSON.stringify({ friends: data.friends, cheeredToday: data.cheeredToday, day: today() }));
      if (data.me && data.me.canAdjustStreak) store.set('streakAdjustAllowed', '1'); else store.remove('streakAdjustAllowed');
      document.dispatchEvent(new CustomEvent('lectura:streak-permission'));
      render();
      (data.cheers || []).forEach((c, i) => setTimeout(() => notify(`👏 ${c.nickname} te anima a seguir con tu lectura 🔥`, { type: 'success', duration: 6000 }), 600 * i));
    } catch (err) {
      console.warn('Amigos: sin conexión, se muestra la última lista', err);
      render();
    }
  }

  function hue(code) { let h = 0; for (const ch of code) h = (h * 31 + ch.charCodeAt(0)) % 360; return h; }

  function friendRow({ code, nickname, streak }, { isMe = false, cheered = false } = {}) {
    const li = document.createElement('li');
    li.className = 'friend' + (isMe ? ' friend--me' : '');
    const avatar = document.createElement('span');
    avatar.className = 'friend__avatar';
    avatar.style.setProperty('--hue', hue(code));
    avatar.textContent = (nickname || '?').trim().charAt(0).toUpperCase();
    const info = document.createElement('div');
    info.className = 'friend__info';
    const name = document.createElement('strong');
    name.textContent = isMe ? `${nickname} (tú)` : nickname;
    const meta = document.createElement('span');
    meta.className = 'friend__meta';
    meta.textContent = `🔥 ${streak} ${streak === 1 ? 'día' : 'días'} de racha`;
    info.append(name, meta);
    li.append(avatar, info);
    if (!isMe) {
      const cheer = document.createElement('button');
      cheer.type = 'button';
      cheer.className = 'friend__cheer';
      cheer.textContent = cheered ? '👏✓' : '👏';
      cheer.disabled = cheered;
      cheer.title = cheered ? 'Ya le animaste hoy' : `Animar a ${nickname}`;
      cheer.setAttribute('aria-label', cheer.title);
      cheer.addEventListener('click', () => sendCheer(code, nickname, cheer));
      const more = document.createElement('button');
      more.type = 'button';
      more.className = 'friend__more';
      more.textContent = '⋯';
      more.setAttribute('aria-label', `Opciones de ${nickname}`);
      more.addEventListener('click', () => removeFriend(code, nickname));
      li.append(cheer, more);
    }
    return li;
  }

  function renderMe() {
    const p = profile();
    const meRow = els.list && els.list.querySelector('.friend--me');
    if (!p || !stats || !meRow) return;
    meRow.replaceWith(friendRow({ code: p.id, nickname: p.nickname, ...stats }, { isMe: true }));
  }

  function render() {
    if (!els.card) return;
    const p = profile();
    els.intro.hidden = !!p;
    els.invite.hidden = !p;
    els.list.innerHTML = '';
    els.menuProfile.hidden = !p;
    els.menuStart.hidden = !!p;
    els.menuStatus.textContent = p
      ? `Tu apodo: ${p.nickname}. Invita a quien quieras con tu enlace.`
      : 'Lee junto a tus amigos: veréis vuestras rachas y podréis animaros cada día.';
    if (!p) { els.empty.hidden = true; return; }
    els.myCode.textContent = formatCode(p.id);

    const cache = readJSON(CACHE_KEY) || { friends: [], cheeredToday: [] };
    const cheeredToday = cache.day === today() ? (cache.cheeredToday || []) : [];
    if (stats) els.list.appendChild(friendRow({ code: p.id, nickname: p.nickname, ...stats }, { isMe: true }));
    (cache.friends || []).forEach(f => els.list.appendChild(friendRow(f, { cheered: cheeredToday.includes(f.code) })));
    els.empty.hidden = (cache.friends || []).length > 0;
  }

  async function sendCheer(code, nickname, button) {
    button.disabled = true;
    try {
      const res = await api('cheer', { code });
      const cache = readJSON(CACHE_KEY) || {};
      cache.cheeredToday = [...(cache.day === today() ? cache.cheeredToday || [] : []), code];
      cache.day = today();
      store.set(CACHE_KEY, JSON.stringify(cache));
      button.textContent = '👏✓';
      notify(res.pushed ? `👏 Has animado a ${nickname}. Le llegará un aviso al móvil.` : `👏 Has animado a ${nickname}. Lo verá al abrir la app.`, { type: 'success' });
    } catch (err) {
      button.disabled = err.code === 'already';
      if (err.code === 'already') { button.textContent = '👏✓'; notify(`Ya animaste hoy a ${nickname}.`); }
      else notify('No se pudo enviar el ánimo. Revisa tu conexión.', { type: 'error' });
    }
  }

  async function removeFriend(code, nickname) {
    if (!confirm(`¿Quitar a ${nickname} de tus amigos? Dejaréis de ver vuestras rachas.`)) return;
    try {
      await api('unlink', { code });
      const cache = readJSON(CACHE_KEY) || {};
      cache.friends = (cache.friends || []).filter(f => f.code !== code);
      store.set(CACHE_KEY, JSON.stringify(cache));
      render();
      notify(`${nickname} ya no está en tu lista de amigos.`);
    } catch { notify('No se pudo quitar. Revisa tu conexión.', { type: 'error' }); }
  }

  // ---- Invitar ----
  async function shareInvite() {
    const p = profile();
    if (!p) return;
    const url = inviteUrl(p.id);
    const text = '📖 Estoy leyendo la Biblia cada día con «Lectura diaria». ¡Añádeme como amigo y animémonos a mantener la racha! 🔥';
    if (navigator.share) {
      try { await navigator.share({ title: 'Lectura diaria de la Biblia', text, url }); return; }
      catch (err) { if (err && err.name === 'AbortError') return; }
    }
    try { await navigator.clipboard.writeText(`${text}\n${url}`); notify('Enlace copiado. Pégalo en WhatsApp para invitar a tus amigos.', { type: 'success' }); }
    catch { notify(`Tu enlace de invitación: ${url}`, { duration: 10000 }); }
  }

  // ---- Diálogo (crear perfil, cambiar apodo, aceptar invitación) ----
  function openDialog(mode, inviterName = '') {
    dialogMode = mode;
    const p = profile();
    els.dialogTitle.textContent = mode === 'invite' ? `${inviterName} te invita a leer juntos` : mode === 'rename' ? 'Cambiar apodo' : 'Lee con tus amigos';
    els.dialogText.textContent = mode === 'invite'
      ? (p ? `Al aceptar, ${inviterName} y tú veréis vuestras rachas y podréis animaros.` : `Elige cómo te verán tus amigos y ${inviterName} y tú quedaréis conectados.`)
      : 'Elige cómo te verán tus amigos: tu nombre o un apodo.';
    els.nicknameWrap.hidden = mode === 'invite' && !!p;
    els.nickname.value = p ? p.nickname : '';
    els.confirm.textContent = mode === 'invite' ? '👥 Aceptar' : mode === 'rename' ? 'Guardar' : 'Empezar';
    if (!els.dialog.open) els.dialog.showModal();
    if (!els.nicknameWrap.hidden) setTimeout(() => els.nickname.focus(), 50);
  }

  async function confirmDialog() {
    const nickname = els.nickname.value.trim();
    const needsName = !els.nicknameWrap.hidden;
    if (needsName && nickname.length < 2) { notify('Escribe un apodo de al menos 2 letras.', { type: 'error' }); return; }
    els.confirm.disabled = true;
    try {
      if (!profile()) {
        const created = await api('create', { nickname });
        store.set(PROFILE_KEY, JSON.stringify({ id: created.id, secret: created.secret, nickname: created.nickname }));
        document.dispatchEvent(new CustomEvent('lectura:changed')); // la sincronización lo lleva a tus otros dispositivos
        lastSentStats = '';
        scheduleUpdate(0);
      } else if (dialogMode === 'rename') {
        await api('update', { nickname });
        store.set(PROFILE_KEY, JSON.stringify({ ...profile(), nickname }));
        document.dispatchEvent(new CustomEvent('lectura:changed'));
      }
      if (dialogMode === 'invite' && pendingInvite) {
        const res = await api('link', { code: pendingInvite.code });
        notify(`🎉 Ahora ${res.friend.nickname} y tú sois amigos.`, { type: 'success' });
        pendingInvite = null;
      } else if (dialogMode === 'create') {
        notify('👥 ¡Listo! Ahora invita a tus amigos con tu enlace.', { type: 'success' });
      }
      els.dialog.close();
      await refresh();
      if (dialogMode === 'create') shareInvite();
    } catch (err) {
      const msg = err.code === 'nickname' ? 'Ese apodo no es válido.' : err.code === 'too_many' ? 'Se ha alcanzado el máximo de 100 amigos.' : 'No se pudo completar. Revisa tu conexión.';
      notify(msg, { type: 'error' });
    } finally {
      els.confirm.disabled = false;
    }
  }

  async function handleInviteLink() {
    const params = new URLSearchParams(location.search);
    const raw = params.get(INVITE_PARAM);
    if (!raw) return;
    params.delete(INVITE_PARAM);
    history.replaceState(null, '', location.pathname + (params.toString() ? `?${params}` : '') + location.hash);
    const code = raw.toUpperCase().replace(/[^A-Z0-9]/g, '');
    const p = profile();
    if (p && p.id === code) { notify('Este es tu propio enlace de invitación. Compártelo con tus amigos.'); return; }
    try {
      const res = await fetch(`${API}?action=preview&code=${encodeURIComponent(code)}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      pendingInvite = await res.json();
    } catch {
      notify('Esta invitación ya no es válida.', { type: 'error' });
      return;
    }
    const cache = readJSON(CACHE_KEY) || {};
    if ((cache.friends || []).some(f => f.code === pendingInvite.code)) { notify(`${pendingInvite.nickname} ya está en tus amigos.`); pendingInvite = null; return; }
    // Si es la primera vez, primero el vídeo de bienvenida y después la invitación.
    const onboarding = document.getElementById('onboarding');
    if (onboarding && onboarding.open) {
      document.addEventListener('lectura:onboarding-closed', () => openDialog('invite', pendingInvite.nickname), { once: true });
    } else {
      openDialog('invite', pendingInvite.nickname);
    }
  }

  async function deleteProfile() {
    if (!confirm('¿Borrar tu perfil de amigos? Desaparecerás de las listas de tus amigos. Tu progreso de lectura no se toca.')) return;
    try {
      await api('delete');
      store.remove(PROFILE_KEY); store.remove(CACHE_KEY); store.remove(PUSH_KEY);
      document.dispatchEvent(new CustomEvent('lectura:changed'));
      render();
      notify('Perfil de amigos borrado.');
    } catch { notify('No se pudo borrar. Revisa tu conexión.', { type: 'error' }); }
  }

  const openMenuSection = () => {
    const menu = document.getElementById('sideMenu');
    if (menu) { menu.classList.remove('open'); document.body.classList.remove('menu-open'); }
  };

  document.addEventListener('DOMContentLoaded', () => {
    els = {
      card: document.getElementById('friendsCard'),
      intro: document.getElementById('friendsIntro'),
      list: document.getElementById('friendsList'),
      empty: document.getElementById('friendsEmpty'),
      invite: document.getElementById('friendsInviteButton'),
      dialog: document.getElementById('friendsDialog'),
      dialogTitle: document.getElementById('friendsDialogTitle'),
      dialogText: document.getElementById('friendsDialogText'),
      nicknameWrap: document.getElementById('friendsNicknameWrap'),
      nickname: document.getElementById('friendsNickname'),
      confirm: document.getElementById('friendsConfirm'),
      menuStatus: document.getElementById('friendsMenuStatus'),
      menuProfile: document.getElementById('friendsMenuProfile'),
      menuStart: document.getElementById('friendsMenuStart'),
      myCode: document.getElementById('friendsMyCode')
    };
    if (!els.card) return;

    document.getElementById('friendsStartButton').addEventListener('click', () => openDialog('create'));
    els.menuStart.addEventListener('click', () => { openMenuSection(); openDialog('create'); });
    els.invite.addEventListener('click', shareInvite);
    document.getElementById('friendsMenuInvite').addEventListener('click', shareInvite);
    document.getElementById('friendsMenuRename').addEventListener('click', () => { openMenuSection(); openDialog('rename'); });
    document.getElementById('friendsMenuDelete').addEventListener('click', deleteProfile);
    document.getElementById('friendsCancel').addEventListener('click', () => { pendingInvite = null; els.dialog.close(); });
    document.getElementById('friendsForm').addEventListener('submit', (e) => { e.preventDefault(); confirmDialog(); });

    render();
    refresh();
    handleInviteLink();
  });

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && Date.now() - lastRefresh > 60 * 1000) refresh();
  });
  document.addEventListener('lectura:synced', refresh); // el perfil pudo llegar desde otro dispositivo
})();
