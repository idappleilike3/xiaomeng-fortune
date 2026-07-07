// D5 v8 — 萌寵神殿三幕開場 + 命運星環（2026-07-07）
// 對齊 PROJECT_BIBLE §03 神殿之門
(function () {
  'use strict';

  const HOLD_MS = 1500;
  const CIRC = 113.1;
  let ringAnim = 0;
  let gateBound = false;

  function section() {
    return document.getElementById('petTempleSection');
  }

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
    if (ringAnim) cancelAnimationFrame(ringAnim);
    ringAnim = 0;
  }

  function vibrate(pattern) {
    try {
      if (navigator.vibrate) navigator.vibrate(pattern);
    } catch (_) {}
  }

  function drawFateRing() {
    const canvas = document.getElementById('fateRingCanvas');
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

    let angle = 0;
    let size = resize();

    function frame() {
      const { w, h } = size;
      const cx = w / 2;
      const cy = h / 2;
      ctx.clearRect(0, 0, w, h);

      const glow = ctx.createRadialGradient(cx, cy, 8, cx, cy, 72);
      glow.addColorStop(0, 'rgba(183, 128, 255, 0.95)');
      glow.addColorStop(0.5, 'rgba(124, 77, 196, 0.35)');
      glow.addColorStop(1, 'rgba(124, 77, 196, 0)');
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(cx, cy, 72, 0, Math.PI * 2);
      ctx.fill();

      const count = 22;
      for (let i = 0; i < count; i++) {
        const a = angle + (i / count) * Math.PI * 2;
        const x = cx + Math.cos(a) * (Math.min(w, h) * 0.34);
        const y = cy + Math.sin(a) * (Math.min(w, h) * 0.34);
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

      angle += 0.004;
      ringAnim = requestAnimationFrame(frame);
    }

    window.addEventListener('resize', () => { size = resize(); });
    frame();
  }

  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  function finishGate() {
    hideActs();
    if (typeof window.__petShowStep === 'function') {
      window.__petShowStep(2);
    } else {
      document.querySelector('[data-action="goto-step-2"]')?.click();
    }
  }

  function bindGateOnce() {
    if (gateBound) return;
    const startBtn = document.getElementById('gateStartBtn');
    const skipBtn = document.getElementById('gateSkipBtn');
    const prompt = document.getElementById('act1Prompt');
    const chargeFill = document.getElementById('gateChargeFill');
    const chargeLabel = document.getElementById('gateStartLabel');
    if (!startBtn) return;
    gateBound = true;

    let holdTimer = null;
    let holdStart = 0;
    let holdRaf = 0;
    let played = false;

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

    function runSequence() {
      if (played) return;
      played = true;
      vibrate(40);

      setTimeout(() => {
        showAct('2');
        vibrate(60);
      }, 400);

      setTimeout(() => {
        showAct('3');
        vibrate([30, 40, 30]);
      }, 1900);

      setTimeout(() => {
        showAct('ring');
        drawFateRing();
      }, 3700);
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

      holdTimer = setTimeout(() => {
        holdStart = 0;
        startBtn.dataset.state = 'charged';
        startBtn.classList.remove('is-charging');
        startBtn.classList.add('is-charged');
        if (chargeLabel) chargeLabel.textContent = '感應完成 · 開放中';
        runSequence();
      }, HOLD_MS);
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

    const ringBtn = document.getElementById('fateRingContinue');
    if (ringBtn) {
      ringBtn.addEventListener('click', () => {
        hideActs();
      });
    }

    setTimeout(() => {
      if (prompt) prompt.hidden = false;
    }, 800);
  }

  window.startPetGateV8 = function startPetGateV8() {
    const sec = section();
    if (!sec || !document.querySelector('.pet-act--1')) return false;
    sec.hidden = false;
    hideSteps();
    showAct('1');
    bindGateOnce();
    return true;
  };

  window.hidePetGateActs = hideActs;
})();
