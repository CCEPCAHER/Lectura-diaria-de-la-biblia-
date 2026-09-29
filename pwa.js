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

  // ---- Aviso de instalación abajo en la pantalla (si no está instalada) ----
  const BANNER_KEY = 'installBannerDismissedAt';
  const DISMISS_DAYS = 7;
  const ua = navigator.userAgent;
  const isAndroid = /Android/i.test(ua);
  // Navegadores dentro de otras apps: desde ahí no se puede instalar.
  const isInApp = /FBAN|FBAV|FB_IAB|Instagram|Line\/|WhatsApp|MicroMessenger|Twitter|TikTok|Snapchat|; wv\)/i.test(ua);
  const SHARE_ICON = '<svg class="ios-share" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M12 15V3m0 0L8 7m4-4 4 4M7 11H5v10h14V11h-2"/></svg>';
  let banner = null;
  let bannerTimer = null;

  const dismissedRecently = () => {
    try { const t = Number(localStorage.getItem(BANNER_KEY)); return !!t && Date.now() - t < DISMISS_DAYS * 864e5; } catch { return false; }
  };
  const onboardingPending = () => {
    const dialog = document.getElementById('onboarding');
    let done = false;
    try { done = localStorage.getItem('onboardingDone') === '1'; } catch { /* sin almacenamiento */ }
    return !done || (dialog && dialog.open);
  };

  function bannerContent() {
    const browser = isIOS ? 'Safari' : 'Chrome';
    if (isInApp) {
      return { title: 'Instala la app en tu móvil', html: `<p>Desde aquí no se puede instalar. Toca <b>⋯</b> y elige <b>«Abrir en el navegador»</b> (${browser}).</p>`, action: 'copy' };
    }
    if (deferredPrompt) {
      return { title: 'Instala la app', html: '<p>Ábrela desde tu pantalla de inicio: más rápida y funciona sin conexión.</p>', action: 'prompt' };
    }
    if (isIOS) {
      return { title: 'Añádela a tu pantalla de inicio', html: `<ol class="install-banner__steps"><li>Pulsa ${SHARE_ICON} <b>Compartir</b></li><li>Elige <b>«Añadir a pantalla de inicio»</b></li></ol>` };
    }
    if (isAndroid) {
      return { title: 'Instala la app', html: '<p>Abre el menú <b>⋮</b> del navegador y elige <b>«Instalar aplicación»</b>. Si no aparece, elige antes <b>«Abrir en Chrome»</b>.</p>' };
    }
    return null; // ordenador sin instalador disponible: no molestamos
  }

  function hideBanner() {
    if (banner) { banner.remove(); banner = null; }
    document.body.classList.remove('has-install-banner');
  }

  function renderBanner() {
    const content = (!isStandalone() && !dismissedRecently() && !onboardingPending()) ? bannerContent() : null;
    if (!content) { hideBanner(); return; }
    hideBanner();
    banner = document.createElement('div');
    banner.className = 'install-banner';
    banner.setAttribute('role', 'region');
    banner.setAttribute('aria-label', 'Instalar la app');
    const actionLabel = content.action === 'prompt' ? '📲 Instalar' : content.action === 'copy' ? '🔗 Copiar enlace' : '';
    banner.innerHTML = `
      <img class="install-banner__icon" src="icons/icon-192x192.png" alt="">
      <div class="install-banner__body"><strong>${content.title}</strong>${content.html}</div>
      ${actionLabel ? `<div class="install-banner__actions"><button type="button" class="install-banner__action">${actionLabel}</button></div>` : ''}
      <button type="button" class="install-banner__close" aria-label="Cerrar aviso">×</button>`;
    banner.querySelector('.install-banner__close').addEventListener('click', () => {
      try { localStorage.setItem(BANNER_KEY, String(Date.now())); } catch { /* sin almacenamiento */ }
      hideBanner();
    });
    const action = banner.querySelector('.install-banner__action');
    if (action && content.action === 'prompt') {
      action.addEventListener('click', async () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        const choice = await deferredPrompt.userChoice.catch(() => null);
        deferredPrompt = null;
        refreshInstallUI();
        if (choice && choice.outcome === 'accepted') hideBanner(); else renderBanner();
      });
    }
    if (action && content.action === 'copy') {
      action.addEventListener('click', async () => {
        const url = new URL('./', location.href).href;
        try { await navigator.clipboard.writeText(url); notify(`Enlace copiado. Pégalo en ${isIOS ? 'Safari' : 'Chrome'} para instalarla.`); }
        catch { notify(`Abre en ${isIOS ? 'Safari' : 'Chrome'}: ${url}`, { duration: 8000 }); }
      });
    }
    document.body.appendChild(banner);
    document.body.classList.add('has-install-banner');
  }

  function scheduleBanner(delay = 3000) {
    clearTimeout(bannerTimer);
    bannerTimer = setTimeout(renderBanner, delay);
  }

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    refreshInstallUI();
    scheduleBanner(banner ? 0 : 3000); // Android/Chrome: ahora sí se puede ofrecer el botón «Instalar»
  });

  window.addEventListener('appinstalled', () => {
    deferredPrompt = null;
    refreshInstallUI();
    hideBanner();
    notify('📲 ¡App instalada! Ya puedes abrirla desde tu pantalla de inicio.', { type: 'success', duration: 6000 });
  });

  const initInstall = () => {
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

    // El aviso sale unos segundos después de abrir, nunca encima del vídeo de bienvenida.
    scheduleBanner();
    document.addEventListener('lectura:onboarding-closed', () => scheduleBanner(1500));
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initInstall);
  } else {
    initInstall();
  }
})();

