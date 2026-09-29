// Vídeo de bienvenida (animación con subtítulos y narración opcional) y configuración rápida.
// Sale la primera vez; se puede volver a ver desde Menú → Acerca de.
(() => {
  const DONE_KEY = 'onboardingDone';
  const VOICE_KEY = 'introVoice';

  const SCENES = [
    { duration: 5000, text: 'Te damos la bienvenida. Con esta app leerás la Biblia completa en un año, con una lectura corta cada día.' },
    { duration: 6500, text: 'Cada día te decimos qué leer. Pulsa «Ver lectura online» para abrir el texto en jw.org.' },
    { duration: 6500, text: 'Cuando termines, pulsa «Marcar como leído». También puedes marcar capítulos sueltos en cada libro.' },
    { duration: 6500, text: 'Lee cada día para mantener tu racha, ver cuánto llevas y ganar premios por temas.' },
    { duration: 6500, text: 'Activa el recordatorio y te avisaremos a la hora que elijas, aunque la app esté cerrada.' },
    { duration: 6500, text: '¿Usas varios dispositivos? Con un código sincronizas tu progreso, cifrado y sin cuentas.' },
    { duration: 5500, text: 'Es gratis, no necesita registro y funciona sin conexión. ¡Vamos a prepararlo!' }
  ];

  const store = {
    get(k) { try { return localStorage.getItem(k); } catch { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch { /* sin almacenamiento */ } }
  };
  const isStandalone = () => window.matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
  const hasProgress = () => !!(store.get('planStartDate') || store.get('bibleReadStatus'));
  const todayKey = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };
  const canSpeak = 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;

  document.addEventListener('DOMContentLoaded', () => {
    const dialog = document.getElementById('onboarding');
    if (!dialog || typeof dialog.showModal !== 'function') return;

    const player = document.getElementById('introPlayer');
    const stage = document.getElementById('introStage');
    const scenes = [...stage.querySelectorAll('.scene')];
    const caption = document.getElementById('introCaption');
    const timeline = document.getElementById('introTimeline');
    const playButton = document.getElementById('introPlay');
    const voiceButton = document.getElementById('introVoice');
    const skipButton = document.getElementById('onboardingSkip');
    const setup = document.getElementById('introSetup');
    const startInput = document.getElementById('onboardingStartDate');
    const reminderTime = document.getElementById('onboardingReminderTime');
    const reminderButton = document.getElementById('onboardingReminderButton');
    const reminderNote = document.getElementById('onboardingReminderNote');
    const installBlock = document.getElementById('setupInstall');
    const installText = document.getElementById('onboardingInstallText');

    let index = 0;
    let elapsed = 0;
    let playing = false;
    let lastTs = 0;
    let frame = null;
    let voiceOn = canSpeak && store.get(VOICE_KEY) === '1';
    let speechDone = true;

    // ---- Barra de escenas ----
    const segments = SCENES.map((scene, i) => {
      const seg = document.createElement('button');
      seg.type = 'button';
      seg.className = 'intro__seg';
      seg.setAttribute('aria-label', `Ir a la parte ${i + 1} de ${SCENES.length}`);
      seg.innerHTML = '<span class="intro__seg-fill"></span>';
      seg.addEventListener('click', () => { showScene(i); play(); });
      timeline.appendChild(seg);
      return seg.firstChild;
    });

    function updateTimeline() {
      segments.forEach((fill, i) => {
        const p = i < index ? 1 : i > index ? 0 : Math.min(elapsed / SCENES[index].duration, 1);
        fill.style.transform = `scaleX(${p})`;
      });
    }

    // ---- Narración (voz del sistema) ----
    function pickVoice() {
      const voices = speechSynthesis.getVoices();
      return voices.find(v => v.lang === 'es-ES') || voices.find(v => v.lang && v.lang.startsWith('es')) || null;
    }
    function speak(text) {
      speechDone = true;
      if (!voiceOn || !canSpeak) return;
      speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'es-ES';
      const voice = pickVoice();
      if (voice) u.voice = voice;
      u.rate = 1.02;
      speechDone = false;
      u.onend = u.onerror = () => { speechDone = true; };
      speechSynthesis.speak(u);
    }
    function stopSpeech() { if (canSpeak) speechSynthesis.cancel(); speechDone = true; }
    function renderVoiceButton() {
      voiceButton.hidden = !canSpeak;
      voiceButton.textContent = voiceOn ? '🔊' : '🔈';
      voiceButton.setAttribute('aria-pressed', String(voiceOn));
      voiceButton.setAttribute('aria-label', voiceOn ? 'Quitar narración' : 'Activar narración');
    }

    // ---- Reproducción ----
    function showScene(i) {
      index = i;
      elapsed = 0;
      scenes.forEach(el => el.classList.remove('is-active'));
      void stage.offsetWidth; // reinicia las animaciones CSS
      scenes[i].classList.add('is-active');
      caption.textContent = SCENES[i].text;
      speak(SCENES[i].text);
      updateTimeline();
    }

    function tick(ts) {
      if (!playing) return;
      elapsed += Math.min(ts - lastTs, 100);
      lastTs = ts;
      // Con narración, la escena espera a que termine la frase.
      if (elapsed >= SCENES[index].duration && speechDone) {
        if (index < SCENES.length - 1) showScene(index + 1);
        else { showSetup(); return; }
      }
      updateTimeline();
      frame = requestAnimationFrame(tick);
    }

    function play() {
      if (playing) return;
      playing = true;
      stage.classList.remove('is-paused');
      playButton.textContent = '❚❚';
      playButton.setAttribute('aria-label', 'Pausar');
      if (canSpeak && speechSynthesis.paused) speechSynthesis.resume();
      lastTs = performance.now();
      frame = requestAnimationFrame(tick);
    }

    function pause() {
      playing = false;
      cancelAnimationFrame(frame);
      stage.classList.add('is-paused');
      playButton.textContent = '▶';
      playButton.setAttribute('aria-label', 'Reproducir');
      if (canSpeak && speechSynthesis.speaking) speechSynthesis.pause();
    }

    function startVideo() {
      player.hidden = false;
      setup.hidden = true;
      skipButton.hidden = false;
      showScene(0);
      play();
    }

    // ---- Configuración rápida ----
    function showSetup() {
      pause();
      stopSpeech();
      player.hidden = true;
      skipButton.hidden = true;
      setup.hidden = false;
      startInput.value = store.get('planStartDate') || todayKey();
      reminderTime.value = store.get('reminderTime') || '08:00';
      applyReminderState(window.lecturaReminderState);
      const status = document.getElementById('installStatusText');
      installBlock.hidden = isStandalone();
      if (status) installText.textContent = status.textContent;
      document.getElementById('introSetupTitle').focus({ preventScroll: true });
    }

    function applyStartDate() {
      const value = startInput.value;
      if (!/^\d{4}-\d{2}-\d{2}$/.test(value) || value === store.get('planStartDate')) return;
      const planInput = document.getElementById('planStartDateInput');
      const planButton = document.getElementById('setPlanStartDateButton');
      if (planInput && planButton) { planInput.value = value; planButton.click(); }
    }

    function applyReminderState(state) {
      if (!state) return;
      const { enabled, blocked, message } = state;
      reminderButton.hidden = blocked;
      reminderTime.hidden = blocked;
      reminderButton.disabled = enabled;
      reminderButton.textContent = enabled ? '✓ Activado' : 'Activar';
      reminderTime.disabled = enabled;
      reminderNote.textContent = blocked || enabled ? message : 'Opcional. También puedes activarlo después desde el menú ☰.';
    }
    document.addEventListener('lectura:reminder-state', (e) => applyReminderState(e.detail));

    reminderButton.addEventListener('click', () => {
      const toggle = document.getElementById('reminderToggle');
      const menuTime = document.getElementById('reminderTime');
      if (!toggle || toggle.disabled) return;
      if (menuTime) { menuTime.value = reminderTime.value || '08:00'; store.set('reminderTime', menuTime.value); }
      if (!toggle.checked) { toggle.checked = true; toggle.dispatchEvent(new Event('change')); }
    });

    // ---- Abrir y cerrar ----
    function open() {
      renderVoiceButton();
      if (!dialog.open) dialog.showModal();
      startVideo();
    }

    function finish() {
      applyStartDate();
      store.set(DONE_KEY, '1');
      pause();
      stopSpeech();
      if (dialog.open) dialog.close();
      document.dispatchEvent(new CustomEvent('lectura:onboarding-closed'));
    }

    playButton.addEventListener('click', () => (playing ? pause() : play()));
    voiceButton.addEventListener('click', () => {
      voiceOn = !voiceOn;
      store.set(VOICE_KEY, voiceOn ? '1' : '0');
      renderVoiceButton();
      if (voiceOn) { speak(SCENES[index].text); if (!playing) play(); } else stopSpeech();
    });
    stage.addEventListener('click', () => (playing ? pause() : play()));
    skipButton.addEventListener('click', showSetup);
    document.getElementById('introReplay').addEventListener('click', startVideo);
    document.getElementById('onboardingNext').addEventListener('click', finish);
    dialog.addEventListener('cancel', () => {
      store.set(DONE_KEY, '1'); pause(); stopSpeech();
      document.dispatchEvent(new CustomEvent('lectura:onboarding-closed'));
    });
    document.addEventListener('visibilitychange', () => { if (document.hidden && playing) pause(); });

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
