// Tutorial de bienvenida: sale la primera vez y deja el plan (y el recordatorio) configurados.
(() => {
  const DONE_KEY = 'onboardingDone';

  const store = {
    get(k) { try { return localStorage.getItem(k); } catch { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch { /* sin almacenamiento */ } }
  };

  const isStandalone = () => window.matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
  const hasProgress = () => !!(store.get('planStartDate') || store.get('bibleReadStatus'));
  const todayKey = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };

  document.addEventListener('DOMContentLoaded', () => {
    const dialog = document.getElementById('onboarding');
    if (!dialog || typeof dialog.showModal !== 'function') return;

    const steps = [...dialog.querySelectorAll('[data-step]')];
    const dots = dialog.querySelector('.onboarding__dots');
    const backButton = document.getElementById('onboardingBack');
    const nextButton = document.getElementById('onboardingNext');
    const skipButton = document.getElementById('onboardingSkip');
    const startInput = document.getElementById('onboardingStartDate');
    const reminderTime = document.getElementById('onboardingReminderTime');
    const reminderButton = document.getElementById('onboardingReminderButton');
    const reminderNote = document.getElementById('onboardingReminderNote');
    const installText = document.getElementById('onboardingInstallText');

    let active = [];
    let index = 0;

    function render() {
      const current = active[index];
      steps.forEach(step => { step.hidden = step !== current; });
      dots.innerHTML = '';
      active.forEach((_, i) => {
        const dot = document.createElement('span');
        dot.className = 'onboarding__dot' + (i === index ? ' is-active' : '');
        dots.appendChild(dot);
      });
      backButton.hidden = index === 0;
      nextButton.textContent = index === active.length - 1 ? '¡Empezar!' : 'Siguiente';
      if (current.dataset.step === 'install') {
        const status = document.getElementById('installStatusText');
        if (status && installText) installText.textContent = status.textContent;
      }
      const heading = current.querySelector('h2');
      if (heading) heading.focus({ preventScroll: true });
    }

    function open() {
      active = steps.filter(step => !(step.dataset.step === 'install' && isStandalone()));
      index = 0;
      startInput.value = store.get('planStartDate') || todayKey();
      reminderTime.value = store.get('reminderTime') || '08:00';
      applyReminderState(window.lecturaReminderState);
      render();
      dialog.showModal();
    }

    function finish() {
      store.set(DONE_KEY, '1');
      if (dialog.open) dialog.close();
    }

    function applyStartDate() {
      const value = startInput.value;
      if (!/^\d{4}-\d{2}-\d{2}$/.test(value) || value === store.get('planStartDate')) return;
      const planInput = document.getElementById('planStartDateInput');
      const planButton = document.getElementById('setPlanStartDateButton');
      if (planInput && planButton) {
        planInput.value = value;
        planButton.click();
      }
    }

    nextButton.addEventListener('click', () => {
      if (active[index].dataset.step === 'start') applyStartDate();
      if (index === active.length - 1) { finish(); return; }
      index++;
      render();
    });
    backButton.addEventListener('click', () => { if (index > 0) { index--; render(); } });
    skipButton.addEventListener('click', finish);
    dialog.addEventListener('cancel', () => store.set(DONE_KEY, '1')); // tecla Esc

    // El recordatorio reutiliza los controles del menú (reminders.js).
    reminderButton.addEventListener('click', () => {
      const toggle = document.getElementById('reminderToggle');
      const menuTime = document.getElementById('reminderTime');
      if (!toggle || toggle.disabled) return;
      if (menuTime) {
        menuTime.value = reminderTime.value || '08:00';
        store.set('reminderTime', menuTime.value);
      }
      if (!toggle.checked) {
        toggle.checked = true;
        toggle.dispatchEvent(new Event('change'));
      }
    });

    function applyReminderState(state) {
      if (!state) return;
      const { enabled, blocked, message } = state;
      reminderButton.hidden = blocked;
      reminderButton.disabled = enabled;
      reminderButton.textContent = enabled ? '✅ Recordatorio activado' : '🔔 Activar recordatorio';
      reminderTime.disabled = enabled;
      reminderTime.hidden = blocked;
      const timeLabel = dialog.querySelector('label[for="onboardingReminderTime"]');
      if (timeLabel) timeLabel.hidden = blocked;
      reminderNote.textContent = blocked || enabled ? message : 'Si prefieres, puedes activarlo más tarde desde el menú ☰.';
    }
    document.addEventListener('lectura:reminder-state', (e) => applyReminderState(e.detail));

    const replay = document.getElementById('replayTutorialButton');
    if (replay) {
      replay.addEventListener('click', () => {
        const menu = document.getElementById('sideMenu');
        if (menu) menu.classList.remove('open');
        open();
      });
    }

    // Solo la primera vez; quien ya tenía progreso no lo necesita.
    if (store.get(DONE_KEY) !== '1') {
      if (hasProgress()) store.set(DONE_KEY, '1');
      else setTimeout(open, 400);
    }
  });
})();
