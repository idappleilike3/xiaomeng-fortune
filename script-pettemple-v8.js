// D5 v8 — 萌寵神殿三幕開場 + 命運星環（Sprint C 2026-07-07）
// Option A: temple-front → temple-door → temple-interior → Fate Ring
(function () {
  'use strict';

  const HOLD_MS = 1500;
  const CIRC = 113.1;
  const CARD_COUNT = 22;

  let ringAnim = 0;
  let gateBound = false;
  let played = false;
  let ringAngle = 0;
  let ringDrag = { active: false, lastX: 0 };

  function $(id) { return document.getElementById(id); }

  function section() { return $('petTempleSection'); }

  function hideSteps() {
    document.querySelectorAll('#petTempleSection .pet-step').forEach((el) => {
      el.hidden = true;
    });
  }

  function showAct(act) {
    document.querySelectorAll('#petTempleSection .pet-act').forEach((el) => {
      el.hidden = el.dataset.act !== act;
    });
  }

  function hideActs() {
    document.querySelectorAll('#petTempleSection .pet-act').forEach((el) => {
      el.hidden = true;
    });
    stopParticles();
    if (ringAnim) cancelAnimationFrame(ringAnim);
    ringAnim = 0;
  }

  function vibrate(pattern) {
    try {
      if (navigator.vibrate) navigator.vibrate(pattern);
    } catch (_) {}
  }

  function playAudio(key) {
    try {
      const paths = window.TEMPLE_AUDIO_PATHS || {};
      const path = paths[key];
      if (!path) return;
      const audio = $('templeGateAudio');
      if (!audio) return;
      audio.src = path;
      audio.volume = 0.7;
      audio.currentTime = 0;
      audio.play().catch(() => {});
    } catch (_) {}
  }

  /* ===== Particle system ===== */
  const particleLoops = new Map();

  function startParticles(canvasId, opts) {
    const canvas = $(canvasId);
    if (!canvas) return;
    stopParticles(canvasId);

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const particles = [];
    const count = (opts && opts.count) || 36;
    const color = (opts && opts.color) || 'rgba(183, 128, 255,';

    function resize() {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.floor(rect.width * dpr);
      canvas.height = Math.floor(rect.height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      return { w: rect.width, h: rect.height };
    }

    let size = resize();
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * size.w,
        y: Math.random() * size.h,
        r: 1 + Math.random() * 2.5,
        vy: -0.3 - Math.random() * 0.8,
        vx: (Math.random() - 0.5) * 0.4,
        a: 0.2 + Math.random() * 0.6,
        phase: Math.random() * Math.PI * 2
      });
    }

    let raf = 0;
    function frame(t) {
      const { w, h } = size;
      ctx.clearRect(0, 0, w, h);
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.a = 0.25 + 0.45 * (0.5 + 0.5 * Math.sin(t * 0.002 + p.phase));
        if (p.y < -10) { p.y = h + 10; p.x = Math.random() * w; }
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = color + p.a + ')';
        ctx.fill();
      }
      raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);
    particleLoops.set(canvasId, { raf, resize });
    window.addEventListener('resize', onResize);

    function onResize() {
      size = resize();
    }
  }

  function stopParticles(canvasId) {
    if (canvasId) {
      const loop = particleLoops.get(canvasId);
      if (loop) {
        cancelAnimationFrame(loop.raf);
        particleLoops.delete(canvasId);
      }
      return;
    }
    particleLoops.forEach((loop) => cancelAnimationFrame(loop.raf));
    particleLoops.clear();
  }

  /* ===== Fate Ring canvas ===== */
  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  function drawFateRing() {
    const canvas = $('fateRingCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const w = Math.max(rect.width || 300, 280);
      const h = Math.max(rect.height || 300, 280);
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      return { w, h };
    };

    let size = resize();
    let autoRotate = true;

    function frame() {
      const { w, h } = size;
      const cx = w / 2;
      const cy = h / 2;
      ctx.clearRect(0, 0, w, h);

      const glow = ctx.createRadialGradient(cx, cy, 6, cx, cy, 80);
      glow.addColorStop(0, 'rgba(183, 128, 255, 0.95)');
      glow.addColorStop(0.45, 'rgba(124, 77, 196, 0.4)');
      glow.addColorStop(1, 'rgba(124, 77, 196, 0)');
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(cx, cy, 80, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = 'rgba(245, 211, 139, 0.9)';
      ctx.font = 'bold 14px serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('✦', cx, cy);

      const radius = Math.min(w, h) * 0.34;
      for (let i = 0; i < CARD_COUNT; i++) {
        const a = ringAngle + (i / CARD_COUNT) * Math.PI * 2;
        const x = cx + Math.cos(a) * radius;
        const y = cy + Math.sin(a) * radius;
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(a + Math.PI / 2);
        ctx.fillStyle = 'rgba(22, 12, 40, 0.92)';
        ctx.strokeStyle = 'rgba(245, 211, 139, 0.65)';
        ctx.lineWidth = 1.5;
        roundRect(ctx, -14, -22, 28, 44, 4);
        ctx.fill();
        ctx.stroke();
        ctx.restore();
      }

      if (autoRotate && !ringDrag.active) ringAngle += 0.003;
      ringAnim = requestAnimationFrame(frame);
    }

    canvas.addEventListener('pointerdown', (e) => {
      ringDrag.active = true;
      ringDrag.lastX = e.clientX;
      autoRotate = false;
      canvas.classList.add('is-dragging');
      canvas.setPointerCapture(e.pointerId);
    });
    canvas.addEventListener('pointermove', (e) => {
      if (!ringDrag.active) return;
      const dx = e.clientX - ringDrag.lastX;
      ringDrag.lastX = e.clientX;
      ringAngle += dx * 0.008;
    });
    function endDrag(e) {
      if (!ringDrag.active) return;
      ringDrag.active = false;
      canvas.classList.remove('is-dragging');
      try { canvas.releasePointerCapture(e.pointerId); } catch (_) {}
      setTimeout(() => { autoRotate = true; }, 2000);
    }
    canvas.addEventListener('pointerup', endDrag);
    canvas.addEventListener('pointercancel', endDrag);

    window.addEventListener('resize', () => { size = resize(); });
    frame();
    playAudio('fate');
  }

  function finishGate() {
    hideActs();
    if (typeof window.__petShowStep === 'function') {
      window.__petShowStep(2);
    }
  }

  /* ===== 9-step opening sequence (post intro) ===== */
  function runPostHoldSequence() {
    const act1 = document.querySelector('.pet-act--1');
    const act2 = document.querySelector('.pet-act--2');
    const act3 = document.querySelector('.pet-act--3');
    const beam = $('energyBeam');
    const crystal = $('act2CrystalGlow');
    const cap2 = $('act2Caption');
    const cap3 = $('act3Caption');

    if (beam) {
      beam.hidden = false;
      beam.classList.add('is-active');
    }
    playAudio('energy');
    vibrate(40);

    setTimeout(() => {
      playAudio('crystal');
      vibrate(60);
    }, 300);

    setTimeout(() => {
      showAct('2');
      if (act2) act2.classList.add('is-shaking');
      if (crystal) crystal.classList.add('is-resonating');
      if (cap2) cap2.textContent = '神殿接收能量，開始共鳴…';
      startParticles('particlesCanvasAct2', { count: 28 });
      playAudio('array');
      vibrate([40, 30, 40]);
    }, 700);

    setTimeout(() => {
      if (act2) {
        act2.classList.remove('is-shaking');
        act2.classList.add('is-opening');
      }
      if (cap2) cap2.textContent = '神殿石門緩緩開啟…';
      playAudio('door');
      vibrate(100);
    }, 1100);

    setTimeout(() => {
      showAct('3');
      if (cap3) cap3.textContent = '光之路已開啟，命運之旅即將展開…';
      startParticles('particlesCanvasAct3', { count: 40, color: 'rgba(245, 211, 139,' });
      playAudio('enter');
      vibrate([30, 40, 30]);
    }, 2900);

    setTimeout(() => {
      showAct('ring');
      drawFateRing();
      playAudio('glow');
    }, 4200);
  }

  /* ===== Intro: black fade → emerge → particles → prompt ===== */
  function runIntro() {
    const act1 = document.querySelector('.pet-act--1');
    const curtain = $('act1Curtain');
    const array = $('act1Array');
    const prompt = $('act1Prompt');

    setTimeout(() => {
      if (curtain) curtain.classList.add('is-faded');
      playAudio('emerge');
      vibrate(20);
    }, 300);

    setTimeout(() => {
      if (act1) act1.classList.add('is-emerged');
    }, 350);

    setTimeout(() => {
      startParticles('particlesCanvasAct1', { count: 32 });
      if (array) array.classList.add('is-lit');
      playAudio('particle');
    }, 800);

    setTimeout(() => {
      if (prompt) {
        prompt.hidden = false;
        prompt.classList.add('is-visible');
      }
      playAudio('prompt');
    }, 1300);
  }

  function bindGateOnce() {
    if (gateBound) return;
    const startBtn = $('gateStartBtn');
    const skipBtn = $('gateSkipBtn');
    const chargeFill = $('gateChargeFill');
    const chargeLabel = $('gateStartLabel');
    if (!startBtn) return;
    gateBound = true;

    let holdTimer = null;
    let holdStart = 0;
    let holdRaf = 0;

    function resetCharge() {
      if (holdTimer) clearTimeout(holdTimer);
      holdTimer = null;
      if (holdRaf) cancelAnimationFrame(holdRaf);
      holdRaf = 0;
      holdStart = 0;
      startBtn.classList.remove('is-charging', 'is-charged');
      startBtn.dataset.state = 'idle';
      if (chargeFill) chargeFill.style.strokeDashoffset = String(CIRC);
      if (chargeLabel) chargeLabel.textContent = '按住開始感應';
    }

    function onHoldComplete() {
      if (played) return;
      played = true;
      holdStart = 0;
      startBtn.dataset.state = 'charged';
      startBtn.classList.remove('is-charging');
      startBtn.classList.add('is-charged');
      if (chargeLabel) chargeLabel.textContent = '感應完成 · 開放中';
      playAudio('charging');
      vibrate(50);
      runPostHoldSequence();
    }

    function startCharge(e) {
      if (played) return;
      if (e && e.cancelable) e.preventDefault();
      resetCharge();
      startBtn.dataset.state = 'charging';
      startBtn.classList.add('is-charging');
      if (chargeLabel) chargeLabel.textContent = '正在集氣…';
      holdStart = performance.now();

      const tick = () => {
        if (!holdStart) return;
        const p = Math.min((performance.now() - holdStart) / HOLD_MS, 1);
        if (chargeFill) chargeFill.style.strokeDashoffset = String(CIRC * (1 - p));
        if (p < 1) holdRaf = requestAnimationFrame(tick);
      };
      holdRaf = requestAnimationFrame(tick);

      holdTimer = setTimeout(onHoldComplete, HOLD_MS);
    }

    function cancelCharge(e) {
      if (e && e.cancelable) e.preventDefault();
      if (!holdStart || played) return;
      resetCharge();
      if (chargeLabel) chargeLabel.textContent = '再試一次 · 按住 1.5 秒';
    }

    startBtn.addEventListener('pointerdown', startCharge);
    startBtn.addEventListener('pointerup', cancelCharge);
    startBtn.addEventListener('pointerleave', cancelCharge);
    startBtn.addEventListener('pointercancel', cancelCharge);

    if (skipBtn) {
      skipBtn.addEventListener('click', () => {
        if (played) return;
        played = true;
        finishGate();
      });
    }
  }

  window.startPetGateV8 = function startPetGateV8() {
    const sec = section();
    if (!sec || !document.querySelector('.pet-act--1')) return false;
    played = false;
    ringAngle = 0;
    sec.hidden = false;
    hideSteps();
    showAct('1');

    const act1 = document.querySelector('.pet-act--1');
    const act2 = document.querySelector('.pet-act--2');
    const curtain = $('act1Curtain');
    const array = $('act1Array');
    const prompt = $('act1Prompt');
    const beam = $('energyBeam');

    if (act1) act1.classList.remove('is-emerged');
    if (act2) act2.classList.remove('is-shaking', 'is-opening');
    if (curtain) curtain.classList.remove('is-faded');
    if (array) array.classList.remove('is-lit');
    if (prompt) { prompt.hidden = true; prompt.classList.remove('is-visible'); }
    if (beam) { beam.hidden = true; beam.classList.remove('is-active'); }
    const crystal = $('act2CrystalGlow');
    if (crystal) crystal.classList.remove('is-resonating');

    bindGateOnce();
    runIntro();
    return true;
  };

  window.hidePetGateActs = hideActs;
})();
