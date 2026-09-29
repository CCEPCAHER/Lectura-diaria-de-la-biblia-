// Avisos, registro del Service Worker e instalación de la app (PWA).

// Aviso no bloqueante que sustituye a alert(). Disponible globalmente para script.js.
function notify(message, { type = 'info', duration = 4000 } = {}) {
  let container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    container.setAttribute('role', 'status');
    container.setAttribute('aria-live', 'polite');
    document.body.appendChild(container);
  }
  const toast = document.createElement('div');
  toast.className = `toast toast--${type}`;
  toast.textContent = message;
  toast.addEventListener('click', () => toast.remove());
  container.appendChild(toast);
  setTimeout(() => {
    toast.classList.add('toast--leaving');
    setTimeout(() => toast.remove(), 300);
  }, duration);
}
window.notify = notify;

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
      .catch(err => console.error('Service Worker: Error de Registro:', err));
  });
}

(() => {
  const isStandalone = () => window.matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
  const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  let deferredPrompt = null;

  function refreshInstallUI() {
    const installed = isStandalone();
    const canPrompt = !!deferredPrompt;
    document.querySelectorAll('[data-install-button]').forEach(btn => { btn.hidden = installed || !canPrompt; });
    const status = document.getElementById('installStatusText');
    if (status) {
      if (installed) status.textContent = '✅ Ya estás usando la app instalada.';
      else if (canPrompt) status.textContent = 'Instálala para abrirla desde tu pantalla de inicio, incluso sin conexión.';
      else if (isIOS) status.textContent = 'En iPhone/iPad: abre esta página en Safari, pulsa el botón Compartir y elige «Añadir a pantalla de inicio».';
      else status.textContent = 'Desde el menú del navegador elige «Instalar aplicación» o «Añadir a pantalla de inicio».';
    }
  }

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    refreshInstallUI();
  });

  window.addEventListener('appinstalled', () => {
    deferredPrompt = null;
    refreshInstallUI();
    notify('📲 ¡App instalada! Ya puedes abrirla desde tu pantalla de inicio.', { type: 'success', duration: 6000 });
  });

  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-install-button]').forEach(btn => {
      btn.addEventListener('click', async () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        await deferredPrompt.userChoice.catch(() => null);
        deferredPrompt = null;
        refreshInstallUI();
      });
    });
    refreshInstallUI();
  });
})();

// Tema: 'auto' (según el sistema), 'light' o 'dark'. Se guarda en este dispositivo.
(() => {
  const KEY = 'theme-mode';
  const root = document.documentElement;
  const media = window.matchMedia('(prefers-color-scheme: dark)');
  const getMode = () => { try { return localStorage.getItem(KEY) || 'auto'; } catch { return 'auto'; } };
  const effective = mode => (mode === 'auto' ? (media.matches ? 'dark' : 'light') : mode);

  function apply(mode) {
    // Cambio instantáneo: sin transiciones mientras se cambian los colores.
    root.classList.add('theme-switching');
    if (mode === 'light' || mode === 'dark') root.dataset.theme = mode; else delete root.dataset.theme;
    void root.offsetWidth;
    setTimeout(() => root.classList.remove('theme-switching'), 50);
    const isDark = effective(mode) === 'dark';
    const toggle = document.getElementById('themeToggle');
    if (toggle) {
      toggle.textContent = isDark ? '☀️' : '🌙';
      toggle.setAttribute('aria-label', isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro');
    }
    document.querySelectorAll('input[name="themeMode"]').forEach(r => { r.checked = r.value === mode; });
  }

  function setMode(mode) {
    try { localStorage.setItem(KEY, mode); } catch { /* sin almacenamiento */ }
    apply(mode);
  }

  media.addEventListener('change', () => apply(getMode()));

  document.addEventListener('DOMContentLoaded', () => {
    apply(getMode());
    const toggle = document.getElementById('themeToggle');
    if (toggle) toggle.addEventListener('click', () => setMode(effective(getMode()) === 'dark' ? 'light' : 'dark'));
    document.querySelectorAll('input[name="themeMode"]').forEach(r => r.addEventListener('change', () => setMode(r.value)));

    // Barra superior compacta al bajar.
    const onScroll = () => document.body.classList.toggle('is-scrolled', window.scrollY > 110);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  });
})();
