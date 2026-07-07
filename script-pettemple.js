// script-pettemple.js
// 2026-07-05 Sprint 1.5 萌寵小夢神殿 MVP 流程 JS
// 16 步流程(內含 SPA 控制),配合 server.js 萌寵神殿 API
// 2026-07-05 08:23 補修:四大主題顯示名稱(對齊 INTERACTION §3)+ Step 13 上鎖區顯示牌面+封印
// 2026-07-05 08:29 收尾:通用 Modal 取代 alert + Hero CTA 綁定

(function () {
  'use strict';

  // ============ 狀態 ============
  const state = {
    step: 0,
    identity: null,
    petName: '',
    questionType: null,
    sessionId: null,
    cards: [],
    lineUserId: null,
    resultId: null,
    currentReadingPosition: null
  };

  const IDENTITY_LABELS = {
    cat_mom: '貓媽媽',
    dog_dad: '狗爸爸',
    pet_parent: '毛孩家長',
    other: '其他'
  };

  // 對齊 INTERACTION_BIBLE §3 顯示名稱(2026-07-05 08:23 補修)
  const QUESTION_LABELS = {
    soul_origin: '毛孩靈魂全書',
    soul_contract: '前世今生緣分',
    subconscious: '毛孩行為真心話',
    lifeflow: '未來健康運勢'
  };

  // ============ 通用 Modal(2026-07-05 08:29 收尾,取代 alert) ============
  function showModal(opts) {
    const overlay = document.getElementById('petModalOverlay');
    if (!overlay) { console.warn('Modal overlay not found'); return; }
    const iconEl = document.getElementById('petModalIcon');
    const titleEl = document.getElementById('petModalTitle');
    const subtitleEl = document.getElementById('petModalSubtitle');
    const bodyEl = document.getElementById('petModalBody');
    const badgeEl = document.getElementById('petModalBadge');
    const ctaEl = document.getElementById('petModalCta');
    if (iconEl) iconEl.textContent = opts.icon || '✨';
    if (titleEl) titleEl.textContent = opts.title || '敬請期待';
    if (subtitleEl) subtitleEl.textContent = opts.subtitle || '';
    if (bodyEl) bodyEl.textContent = opts.body || '';
    if (badgeEl) {
      if (opts.badge) { badgeEl.textContent = opts.badge; badgeEl.hidden = false; }
      else { badgeEl.hidden = true; }
    }
    if (ctaEl) ctaEl.textContent = opts.cta || '我了解了';
    overlay.hidden = false;
    document.body.style.overflow = 'hidden';
    // A11y: focus close button when modal opens (2026-07-05 14:20)
    const closeBtn = document.getElementById('petModalClose');
    if (closeBtn) setTimeout(() => closeBtn.focus(), 50);
    // Remember trigger element so we can restore focus on close
    overlay._triggerEl = document.activeElement;
    // A11y: trap focus inside modal (2026-07-05 14:25)
    try {
      document.querySelectorAll('body > *').forEach(el => {
        if (el !== overlay && !overlay.contains(el) && !el.contains(overlay)) {
          if (!el.hasAttribute('data-inert-prev')) {
            el.setAttribute('data-inert-prev', el.inert ? 'true' : 'false');
          }
          el.inert = true;
        }
      });
    } catch (e) {}
  }

  function hideModal() {
    const overlay = document.getElementById('petModalOverlay');
    if (overlay && !overlay.hidden) {
      // fadeOut animation (2026-07-05 14:30)
      overlay.style.animation = 'petModalFadeOut 200ms ease forwards';
      setTimeout(() => {
        if (overlay) {
          overlay.hidden = true;
          overlay.style.animation = '';
        }
      }, 200);
    } else if (overlay) {
      overlay.hidden = true;
    }
    document.body.style.overflow = '';
    // A11y: restore focus to trigger element (2026-07-05 14:20)
    if (overlay && overlay._triggerEl && typeof overlay._triggerEl.focus === 'function') {
      try { overlay._triggerEl.focus(); } catch (e) {}
      overlay._triggerEl = null;
    }
    // A11y: restore inert state (2026-07-05 14:25)
    try {
      document.querySelectorAll('[data-inert-prev]').forEach(el => {
        const prev = el.getAttribute('data-inert-prev');
        if (prev === 'true') el.inert = true;
        else el.inert = false;
        el.removeAttribute('data-inert-prev');
      });
    } catch (e) {}
  }

  // ============ API 工具 ============

  // D5 v3 音效狀態(老闆 15:01 規格:音效開關 + 音量控制)
  const gateAudioState = { enabled: true, volume: 0.7 };

  // D5 v3 震動 helper(Web Vibration API,不支援裝置自動忽略)
  function vibrate(pattern) {
    try {
      if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
        navigator.vibrate(pattern);
      }
    } catch (e) {}
  }

  // D5 v3 音效 hook(8 時點 × 可替換路徑 × 全 try-catch × 連過開關)
  // 用法:window.TEMPLE_AUDIO_PATHS = { ambient: 'assets/audio/ambient.mp3', ... }
  // 無檔案或失敗不報錯,sprint 1.5A 之後音效 Sprint 可掛上
  function playGateAudio(key) {
    if (!gateAudioState.enabled) return;
    try {
      const paths = (window.TEMPLE_AUDIO_PATHS) || {};
      const path = paths[key];
      if (!path) return;
      const audio = document.getElementById('templeGateAudio');
      if (!audio) return;
      if (audio.dataset.lastKey === key && !audio.paused) return;
      audio.dataset.lastKey = key;
      audio.src = path;
      audio.currentTime = 0;
      audio.volume = gateAudioState.volume;
      audio.play().catch(() => {});
    } catch (e) {}
  }

  async function apiPost(path, body) {
    const res = await fetch(path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body || {})
    });
    return await res.json();
  }

  // ============ LIFF 初始化 ============
  async function initLiff() {
    // 2026-07-06 14:18 Dev override:支援 ?dev_uid=xxx 或 sessionStorage.dev_line_user_id
    // 避免 demo-user firstFree 撞牆(2026-07-06 06:17 demo-user 已用過首次免費)
    try {
      const url = new URL(window.location.href);
      const devUid = url.searchParams.get('dev_uid') || (typeof sessionStorage !== 'undefined' && sessionStorage.getItem('dev_line_user_id'));
      if (devUid) {
        state.lineUserId = devUid;
        const statusEl = document.getElementById('petLiffStatus');
        if (statusEl) statusEl.textContent = 'Dev 模式:' + devUid;
        return;
      }
    } catch (e) {}
    if (typeof liff === 'undefined') {
      const statusEl = document.getElementById('petLiffStatus');
      if (statusEl) statusEl.textContent = '機設獨片，可以在桌中繼續在瞥';
      return;
    }
    try {
      await liff.init({ liffId: '2010549494-KRb0mn7U' });
      // 桌機/外開瀏覽器：不強制跳 LINE 登入，避免頁面「點不開」
      if (typeof liff.isInClient === 'function' && !liff.isInClient()) {
        return;
      }
      if (!liff.isLoggedIn()) {
        liff.login();
        return;
      }
      const profile = await liff.getProfile();
      state.lineUserId = profile.userId;
      try {
        await apiPost('/api/line/bind', {
          userId: profile.userId,
          accessToken: liff.getAccessToken(),
          displayName: profile.displayName,
          pictureUrl: profile.pictureUrl
        });
      } catch (e) {
        console.warn('LINE bind failed:', e);
      }
      const statusEl = document.getElementById('petLiffStatus');
      if (statusEl) statusEl.textContent = '已登入 LINE: ' + (profile.displayName || state.lineUserId);
    } catch (e) {
      console.warn('LIFF init failed:', e);
      const statusEl = document.getElementById('petLiffStatus');
      const ctaBtn = document.querySelector('[data-action="liff-login"]');
      if (statusEl) {
        statusEl.textContent = '⚠䱉䙆服務不可用，請稍後重試';
        statusEl.classList.add('pet-liff-status--error');
      }
      if (ctaBtn) {
        ctaBtn.textContent = '繼續（不透過知亮）';
      }
    }
  }

  // ============ 流程控制 ============
  function showStep(step) {
    state.step = step;
    if (typeof window.hidePetGateActs === 'function') window.hidePetGateActs();
    document.querySelectorAll('#petTempleSection .pet-step').forEach(el => {
      el.hidden = Number(el.dataset.step) !== step;
    });
    if (step === 1) {
      if (typeof window.startPetGateV8 === 'function' && window.startPetGateV8()) {
        // D5 v8 三幕開場由 script-pettemple-v8.js 負責
      } else {
        playTempleGateOpening();
      }
    }
    if (step === 5) initStep5();
    if (step === 9) initStep9();
    if (step === 13) initStep13();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // ============ D5 神殿開門動畫 (2026-07-06) ============
  function playTempleGateOpening() {
    const overlay = document.getElementById('templeGateOverlay');
    const startBtn = document.getElementById('gateStartBtn');
    const skipBtn = document.getElementById('gateSkipBtn');
    if (!overlay) return; // 該頁面沒有 overlay,跳過(其他頁進入)

    // 重置已播放旗標,允許重播(老闆 12:09 要求 6)
    state.gatePlayed = false;

    // 重置 DOM 狀態(為重播而設)
    overlay.classList.remove('is-finishing', 'is-opening', 'is-prompt-ready');
    overlay.classList.add('is-visible');
    overlay.style.opacity = '';
    overlay.style.display = '';
    const curtain = overlay.querySelector('.temple-gate__curtain');
    if (curtain) {
      curtain.style.opacity = '';
      curtain.style.transition = '';
    }
    const svg = overlay.querySelector('.temple-gate__svg');
    if (svg) {
      svg.style.opacity = '';
      svg.style.transform = '';
    }
    const particles = overlay.querySelector('.temple-particles');
    if (particles) particles.innerHTML = '';

    // T+0.3 0.3s 黑畫面淡出(Sprint 1.5A 修正 5: 上限 0.3s)
    setTimeout(() => {
      if (curtain) curtain.style.opacity = '0';
      playGateAudio('emerge');
    }, 300);

    // T+0.8 生成 30 個粒子(起步慢,給門完全出來)
    setTimeout(() => {
      const stage = overlay.querySelector('.temple-gate__stage');
      const particlesEl = overlay.querySelector('.temple-particles');
      if (!stage || !particlesEl) return;
      playGateAudio('particle');
      for (let i = 0; i < 30; i++) {
        const p = document.createElement('div');
        p.className = 'temple-particle';
        const startX = 40 + Math.random() * (stage.clientWidth - 80);
        const startY = 40 + Math.random() * (stage.clientHeight - 80);
        p.style.left = startX + 'px';
        p.style.top = startY + 'px';
        p.style.setProperty('--dx', (Math.random() * 60 - 30) + 'px');
        p.style.setProperty('--dy', (Math.random() * -60 - 30) + 'px');
        p.style.setProperty('--cx', startX + 'px');
        p.style.setProperty('--cy', startY + 'px');
        p.style.animationDelay = (Math.random() * 0.5) + 's';
        p.style.animationDuration = (1.8 + Math.random() * 1.2) + 's';
        particlesEl.appendChild(p);
      }
    }, 800);

    // T+1.3 顯示「手勢指示」+ 開始感應按鈕(老闆 14:42 v2 重參考圖設計)
    setTimeout(() => {
      overlay.classList.add('is-prompt-ready');
      playGateAudio('prompt');
    }, 1300);

    // === 2026-07-07 改寫:Press & Hold 集氣 1.5s(取代 click) ===
    const chargeFill = overlay.querySelector('#gateChargeFill');
    const chargeLabel = overlay.querySelector('#gateStartLabel');
    const HOLD_MS = 1500;
    let holdTimer = null;
    let holdStartedAt = 0;
    let holdRaf = 0;

    function resetCharge() {
      if (holdTimer) { clearTimeout(holdTimer); holdTimer = null; }
      if (holdRaf) { cancelAnimationFrame(holdRaf); holdRaf = 0; }
      startBtn.classList.remove('is-charging', 'is-charged');
      startBtn.dataset.state = 'idle';
      if (chargeFill) chargeFill.style.strokeDashoffset = '113.1'; // 2πr ≈ 113.1 (r=18)
      if (chargeLabel) chargeLabel.textContent = '按住開始感應';
    }

    function startCharge(e) {
      if (state.gatePlayed) return;
      if (e && e.cancelable) e.preventDefault();
      resetCharge();
      startBtn.dataset.state = 'charging';
      startBtn.classList.add('is-charging');
      if (chargeLabel) chargeLabel.textContent = '正在集氣…';
      holdStartedAt = performance.now();
      playGateAudio('charging');

      const tick = () => {
        if (!holdStartedAt) return;
        const elapsed = performance.now() - holdStartedAt;
        const progress = Math.min(elapsed / HOLD_MS, 1);
        if (chargeFill) chargeFill.style.strokeDashoffset = String(113.1 * (1 - progress));
        if (progress < 1) {
          holdRaf = requestAnimationFrame(tick);
        }
      };
      holdRaf = requestAnimationFrame(tick);

      holdTimer = setTimeout(() => {
        holdStartedAt = 0;
        startBtn.dataset.state = 'charged';
        startBtn.classList.remove('is-charging');
        startBtn.classList.add('is-charged');
        if (chargeLabel) chargeLabel.textContent = '感應完成 · 開放中';
        runGateSequence();
      }, HOLD_MS);
    }

    function cancelCharge(e) {
      if (e && e.cancelable) e.preventDefault();
      if (holdStartedAt === 0) return; // 已達 1.5s 或未開始
      holdStartedAt = 0;
      resetCharge();
      if (chargeLabel) chargeLabel.textContent = '再試一次 · 按住 1.5 秒';
    }

    // 滑鼠 + 觸控 + pointer(覆蓋所有裝置)
    startBtn.addEventListener('pointerdown', startCharge);
    startBtn.addEventListener('pointerup', cancelCharge);
    startBtn.addEventListener('pointerleave', cancelCharge);
    startBtn.addEventListener('pointercancel', cancelCharge);
    // iOS Safari 預設會吃掉 click,以防萬一保留舊行為當 fallback
    startBtn.addEventListener('click', (e) => {
      // 如果已經 charged,不重複觸發
      if (startBtn.dataset.state === 'charged') e.preventDefault();
    });

    // 跳過按鈕(立即進 Step 2,不播動畫)
    skipBtn.addEventListener('click', skipGateSequence);
    skipBtn.addEventListener('touchend', (e) => { e.preventDefault(); skipGateSequence(); }, { passive: false });

    function runGateSequence() {
      if (state.gatePlayed) return;
      state.gatePlayed = true;

      // ===== D5 v6(2026-07-07)9 步流程 + 0.8s 停留 =====
      // 5. 能量聚集:掌心發光 → 能量球形成
      // 6. 水晶共鳴:能量射向水晶 → 紫水晶發光
      // 7. 大門開啟:神殿震動 → 石門打開(1.8s)
      // 8. 停留 0.8s(看門後神殿走廊、光柱、霧氣)
      // 9. 淑出 + 進 Step 2

      // 步驟 0s: 掌心開始發光 + 能量射向水晶
      playGateAudio('energy');
      vibrate(40);
      overlay.classList.add('is-energy-activating');

      // 步驟 +0.3s: 能量球形成 + 粒子快速旋轉
      setTimeout(() => {
        playGateAudio('crystal');
        vibrate(60);
        const particlesEl = overlay.querySelector('.temple-particles');
        if (particlesEl) {
          particlesEl.querySelectorAll('.temple-particle').forEach(p => {
            p.classList.add('is-converging');
          });
        }
        const orb = overlay.querySelector('.temple-orb');
        if (orb) orb.classList.add('is-visible');
      }, 300);

      // 步驟 +0.6s: 法陣亮起 + 神殿震動
      setTimeout(() => {
        playGateAudio('array');
        vibrate([40, 30, 40]);
        overlay.classList.add('is-crystal-resonating');
        overlay.classList.add('is-shaking');
      }, 600);

      // 步驟 +0.9s: 大門打開(1.8s 動畫,由 CSS 控制)
      setTimeout(() => {
        playGateAudio('door');
        vibrate(100);
        overlay.classList.add('is-opening');
        overlay.classList.remove('is-shaking');
      }, 900);

      // 步驟 +2.7s(開門 0.9s + 開門動畫 1.8s):門完成開啟 + 神殿內部光柱
      setTimeout(() => {
        playGateAudio('glow');
        overlay.classList.add('is-glowing');
      }, 2700);

      // 步驟 +3.5s(開門完成 + 0.8s 停留):淑出 + 進 Step 2
      // 總時長:1.3 + 1.5(集氣) + 2.7(開門) + 0.8(停留) + 0.6(淑出) = 6.9s
      setTimeout(() => {
        playGateAudio('enter');
        overlay.classList.add('is-finishing');
        setTimeout(() => {
          overlay.style.display = 'none';
        }, 600);
        showStep(2);
      }, 3500);
    }

    function skipGateSequence() {
      if (state.gatePlayed) return;
      state.gatePlayed = true;
      resetCharge();
      overlay.style.display = 'none';
      showStep(2);
    }
  }

  function showPetTemple() {
    const sec = document.getElementById('petTempleSection');
    if (!sec) return;
    sec.hidden = false;
    const hero = document.querySelector('.hero');
    if (hero) hero.style.display = 'none';
    document.querySelectorAll('#petFreeTrialSection, #petIntroSection').forEach(el => {
      if (el) el.style.display = 'none';
    });
    if (typeof window.startPetGateV8 === 'function' && window.startPetGateV8()) {
      return;
    }
    showStep(1);
  }

  function hidePetTemple() {
    const sec = document.getElementById('petTempleSection');
    if (!sec) return;
    sec.hidden = true;
    const hero = document.querySelector('.hero');
    if (hero) hero.style.display = '';
    document.querySelectorAll('#petFreeTrialSection, #petIntroSection').forEach(el => {
      if (el) el.style.display = '';
    });
  }

  // ============ 入口判斷 ============
  function isPetTemplePage() {
    try {
      return /pet-temple\.html$/i.test(new URL(window.location.href).pathname);
    } catch (e) {
      return false;
    }
  }

  function shouldOpenPetTemple() {
    try {
      const url = new URL(window.location.href);
      return url.searchParams.get('system') === 'pet' || isPetTemplePage();
    } catch (e) {
      return false;
    }
  }

  // ============ 各步驟處理 ============
  function handleIdentitySelect(identity) {
    state.identity = identity;
    showStep(3);
  }

  function handlePetNameSubmit() {
    const input = document.getElementById('petNameInput');
    const raw = (input?.value || '').trim();
    if (!raw) {
      showInlineHint(input, '請輸入孩孩的名字');
      return;
    }
    if (raw.length > 12) {
      showInlineHint(input, '名字太長，請在十二字內。');
      return;
    }
    if (!/^[\u4E00-\u9FFFA-Za-z0-9 \u3000\-_]+$/.test(raw)) {
      showInlineHint(input, '只支援中文、英文、數字、空格與連字號、底線。');
      return;
    }
    clearInlineHint(input);
    state.petName = raw;
    showStep(4);
  }
  function showInlineHint(input, msg) {
    if (!input) return;
    input.classList.add('pet-input--error');
    let hint = input.parentElement.querySelector('.pet-input-hint');
    if (!hint) {
      hint = document.createElement('p');
      hint.className = 'pet-input-hint';
      input.parentElement.appendChild(hint);
    }
    hint.textContent = msg;
  }
  function clearInlineHint(input) {
    if (!input) return;
    input.classList.remove('pet-input--error');
    const hint = input.parentElement.querySelector('.pet-input-hint');
    if (hint) hint.remove();
  }

  function skipPetName() {
    state.petName = '毛孩';
    const input = document.getElementById('petNameInput');
    if (input) input.value = '毛孩';
    showStep(4);
  }

  function handleQuestionSelect(questionType) {
    // 2026-07-06 13:55 防雙觸發:同一 click 事件可能被 forEach + 事件委派同時觸發,
    // 造成兩次 /api/pet/temple/start 並行,第二次失敗彈「無法開始」modal 蓋住 Step 5
    if (state._inflightQuestion) return;
    state._inflightQuestion = true;
    state.questionType = questionType;
    checkFirstFreeAndProceed();
  }

  async function checkFirstFreeAndProceed() {
    if (!state.lineUserId) {
      startPetTempleSession('demo-user');
      return;
    }
    try {
      const r = await apiPost('/api/pet/temple/check-first-free', { lineUserId: state.lineUserId });
      if (r.ok && r.firstFreePetUsed) {
        showModal({
          icon: '🔒',
          title: '已使用過首次免費',
          subtitle: '萌寵神殿首次開門資格',
          body: '你已使用過萌寵神殿首次免費開門資格。\n如需再次占卜,請聯繫客服或升級會員。',
          badge: '每個 LINE 帳號限一次',
          cta: '我了解了'
        });
        return;
      }
      startPetTempleSession(state.lineUserId);
    } catch (e) {
      console.error('checkFirstFree failed', e);
      startPetTempleSession(state.lineUserId || 'demo-user');
    }
  }

  async function startPetTempleSession(lineUserId) {
    try {
      const r = await apiPost('/api/pet/temple/start', {
        lineUserId,
        petName: state.petName,
        identity: state.identity,
        questionType: state.questionType
      });
      if (!r.ok) {
        showModal({
          icon: '⚠️',
          title: '無法開始',
          subtitle: '萌寵神殿暫時無法開始',
          body: r.message || '請稍後再試。',
          cta: '我了解了'
        });
        return;
      }
      state.sessionId = r.sessionId;
      state.cards = r.cards;
      state._inflightQuestion = false;
      showStep(5);
    } catch (e) {
      console.error('startPetTemple failed', e);
      state._inflightQuestion = false;
      showModal({
        icon: '⚠️',
        title: '網路錯誤',
        subtitle: '請稍後再試',
        body: '網路連線發生問題,請稍後再試一次。',
        cta: '我了解了'
      });
    }
  }

  function initStep5() {
    const deck = document.getElementById('petDeck');
    const counter = document.getElementById('petDrawCount');
    const totalEl = document.getElementById('petDrawTotal');
    const hint = document.getElementById('petDrawHint');
    if (!deck) return;
    deck.innerHTML = '';
    const drawn = state.cards.filter(c => c.drawn).length || 0;
    counter.textContent = drawn;
    // 第一神殿只需 5 張,註明目標,避免使用者誤以為要抽完 10 張
    if (totalEl) totalEl.textContent = '5';
    hint.hidden = drawn < 5;
    state.cards.forEach((card, idx) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'pet-card-back';
      btn.dataset.position = card.position;
      // 只允許抽取前 5 張(第一神殿),第 6-10 張在 Step 13 才會出現
      btn.disabled = !!card.drawn || card.position > 5;
      btn.setAttribute('aria-label', `第 ${card.position} 張牌`);
      if (card.drawn) {
        btn.classList.add('pet-card-back--drawn');
      }
      btn.innerHTML = `<span class="pet-card-back__num">${card.position}</span>`;
      btn.addEventListener('click', () => drawOneCard(idx));
      deck.appendChild(btn);
    });
  }

  function drawOneCard(idx) {
    if (state.cards[idx].drawn) return;
    state.cards[idx].drawn = true;
    const deck = document.getElementById('petDeck');
    const btn = deck.children[idx];
    if (btn) btn.classList.add('pet-card-back--flipped');
    const drawn = state.cards.filter(c => c.drawn).length;
    document.getElementById('petDrawCount').textContent = drawn;
    if (drawn >= 5) {
      document.getElementById('petDrawHint').hidden = false;
    }
    if (drawn >= 5) {
      setTimeout(() => showStep(7), 600);
    }
  }

  async function handleLiffLogin() {
    if (typeof liff !== 'undefined' && !liff.isLoggedIn()) {
      liff.login();
      return;
    }
    showStep(8);
  }

  function initStep8() {
    const msg = document.getElementById('petGreetingMessage');
    if (msg) {
      const name = state.petName || '毛孩';
      const idLabel = IDENTITY_LABELS[state.identity] || '毛孩家長';
      msg.textContent = `親愛的 ${name} 與 ${idLabel},小夢老師為你們開啟了萌寵神殿的大門。今日是第一神殿 · 今生顯化篇,共 5 張牌。第二神殿 · 靈魂神殿篇需要付費解鎖。願這 5 張牌,為你照亮與毛孩的靈魂之路。`;
    }
  }

  function initStep9() {
    const grid = document.getElementById('petUnlockedGrid');
    if (!grid) return;
    grid.innerHTML = '';
    state.cards.slice(0, 5).forEach(card => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'pet-unlocked-card';
      btn.dataset.action = 'open-card-reading';
      btn.dataset.position = String(card.position);
      btn.innerHTML = `
        <span class="pet-unlocked-card__num">${card.position}</span>
        <span class="pet-unlocked-card__name">${escapeHtml(card.name)}</span>
        <span class="pet-unlocked-card__pet">${escapeHtml(card.pet)}</span>
        <span class="pet-unlocked-card__theme">${getPositionTheme(card.position)}</span>
      `;
      grid.appendChild(btn);
    });
  }

  async function openCardReading(position) {
    state.currentReadingPosition = position;
    showStep(10);
    const panel = document.getElementById('petCardReading');
    if (panel) panel.innerHTML = '<div class="pet-loading-state"><span class="pet-spinner" aria-hidden="true"></span><p class="pet-loading-msg">解讀載入中…</p></div>';
    try {
      const r = await apiPost('/api/pet/temple/get-card-reading', {
        sessionId: state.sessionId,
        position
      });
      if (!r.ok) {
        if (panel) panel.innerHTML = `<div class="pet-error-state"><span class="pet-error-icon" aria-hidden="true">⚠</span><p class="pet-error-msg">${escapeHtml(r.message || r.error || '載入失敗')}</p><button type="button" class="pet-cta pet-cta--secondary pet-error-retry" data-action="retry-card-reading" data-position="${position}">↻ 重新載入</button></div>`;
        return;
      }
      const card = r.card;
      const cardImg = `assets/${card.cardId}.png`;
      if (panel) {
        panel.innerHTML = `
          <div class="pet-card-display">
            <img src="${cardImg}" alt="${escapeHtml(card.name)}" class="pet-card-display__img" onerror="this.style.opacity='0.4'" />
            <div class="pet-card-display__info">
              <h3 class="pet-card-display__title">第 ${position} 張 · ${escapeHtml(card.name)}</h3>
              <p class="pet-card-display__theme">${escapeHtml(getPositionTheme(position))}</p>
              <p class="pet-card-display__pet">${escapeHtml(card.pet)}</p>
            </div>
          </div>
          <div class="pet-reading-text" id="petReadingText"></div>
          <div class="pet-card-actions">
            <button type="button" class="pet-cta pet-cta--secondary" data-action="back-to-step-9">返回 5 張牌</button>
            ${position < 5 ? `<button type="button" class="pet-cta pet-cta--primary" data-action="next-card">看下一張 →</button>` : `<button type="button" class="pet-cta pet-cta--primary" data-action="goto-step-13">繼續看第二神殿</button>`}
          </div>
        `;
      }
      typewriteReading(r.reading);
    } catch (e) {
      console.error('get-card-reading failed', e);
      if (panel) panel.innerHTML = `<div class="pet-error-state"><span class="pet-error-icon" aria-hidden="true">⚠</span><p class="pet-error-msg">網路錯誤,請稍後再試</p><button type="button" class="pet-cta pet-cta--secondary pet-error-retry" data-action="retry-card-reading" data-position="${position}">↻ 重新載入</button></div>`;
    }
  }

  function typewriteReading(text) {
    const el = document.getElementById('petReadingText');
    if (!el) return;
    el.textContent = '';
    let i = 0;
    const speed = 30;
    function tick() {
      if (i < text.length) {
        el.textContent += text.charAt(i);
        i++;
        setTimeout(tick, speed);
      }
    }
    tick();
  }

  // ============ Step 13 上鎖區(2026-07-05 08:23 補修 + 08:29 收尾) ============
  function initStep13() {
    if (state.sessionId) {
      apiPost('/api/pet/temple/complete-first-temple', { sessionId: state.sessionId })
        .then(r => { if (r.ok) state.resultId = r.resultId; })
        .catch(e => console.warn('complete-first-temple failed', e));
    }
    const grid = document.getElementById('petLockedGrid');
    if (!grid) return;
    grid.innerHTML = '';
    const sealTexts = [
      '這張牌屬於第二神殿。',
      '完整訊息已被神殿封印。',
      '開啟第二神殿後,即可看見毛孩更深層的靈魂訊息。'
    ];
    state.cards.slice(5, 10).forEach((card, idx) => {
      const div = document.createElement('div');
      div.className = 'pet-locked-card';
      const sealText = sealTexts[idx % sealTexts.length];
      const cardImg = `assets/${card.cardId}.png`;
      div.innerHTML = `
        <div class="pet-locked-card__wrap">
          <img src="${cardImg}" alt="${escapeHtml(card.name)}" class="pet-locked-card__img" onerror="this.style.opacity='0.3'" />
          <div class="pet-locked-card__overlay"></div>
          <span class="pet-locked-card__lock">🔒</span>
        </div>
        <span class="pet-locked-card__num">第 ${card.position} 張</span>
        <span class="pet-locked-card__name">${escapeHtml(card.name)} · ${escapeHtml(card.pet)}</span>
        <span class="pet-locked-card__seal">${escapeHtml(sealText)}</span>
      `;
      grid.appendChild(div);
    });
  }

  // ============ CTA 處理(2026-07-05 08:29 收尾:用 Modal 取代 alert) ============
  async function handleCTA(ctaType) {
    const ctaConfigs = {
      unlock_second: {
        icon: '🔓',
        title: '第二神殿即將到來',
        subtitle: 'Coming Soon',
        body: '第二神殿 · 靈魂神殿篇將於 Sprint 2 金流功能上線後開放,敬請期待。',
        badge: '價值 NT$1,600'
      },
      another_pet: {
        icon: '🐾',
        title: '為另一隻毛孩占卜',
        subtitle: 'Coming Soon',
        body: '「再為另一隻毛孩占卜」功能正在籌備中,感謝你的耐心。',
        badge: 'NT$3,600'
      },
      membership: {
        icon: '👑',
        title: '會員方案',
        subtitle: 'Coming Soon',
        body: '會員方案正在規劃中,預計 Sprint 2 推出。',
        badge: '尊榮 / 殿堂大師'
      },
      invite: {
        icon: '🎁',
        title: '邀請好友',
        subtitle: 'Coming Soon',
        body: '邀請 5 位好友功能將於 Sprint 3 推出,屆時可享免費解鎖第二神殿。',
        badge: 'Sprint 3'
      },
      favorites: {
        icon: '📜',
        title: '命運紀錄',
        subtitle: '即將為你準備',
        body: '命運紀錄頁面正在規劃中,目前可用既有 Inbox 暫代。',
        badge: 'Sprint 2'
      }
    };
    switch (ctaType) {
      case 'favorites':
        hidePetTemple();
        const inboxBtn = document.getElementById('inboxFab');
        if (inboxBtn) inboxBtn.click();
        break;
      case 'home':
        Object.assign(state, {
          step: 0, identity: null, petName: '', questionType: null,
          sessionId: null, cards: [], lineUserId: null, resultId: null
        });
        showStep(1);
        break;
      case 'another_pet':
        Object.assign(state, {
          step: 0, identity: null, petName: '', questionType: null,
          sessionId: null, cards: []
        });
        showStep(2);
        break;
      // ============ 2026-07-05 Sprint 1.5 result CTA enhancement ============
      case 'share_line': {
        const shareText = '【小夢神殿】邀請你開啟第二神殿，免費解鎖 5 張牌!';
        const shareUrl = 'https://xiaomeng-fortune.onrender.com/?system=pet&ref=' + encodeURIComponent(state.lineUserId || 'demo');
        function fallbackShare() {
          showModal({
            icon: 'LINE',
            title: '分享到 LINE',
            subtitle: 'Web Share API 不可用',
            body: '請在 LINE 內部或 LIFF 環境開啟，或直接複製下方連結分享給好友\\n\\n【小夢神殿】邀請你開啟第二神殿，免費解鎖 5 張牌!\\n\\n' + shareUrl,
            badge: 'Coming Soon',
            cta: '我了解了'
          });
        }
        if (window.liff && typeof window.liff.isInClient === 'function' && window.liff.isInClient() && typeof window.liff.shareTargetPicker === 'function') {
          window.liff.shareTargetPicker([
            { type: 'text', text: shareText },
            { type: 'uri', label: '開啟神殿', uri: shareUrl }
          ]).catch(() => fallbackShare());
        } else if (typeof navigator.share === 'function') {
          navigator.share({ title: '小夢神殿', text: shareText, url: shareUrl }).catch(() => fallbackShare());
        } else {
          fallbackShare();
        }
        break;
      }
      case 'share_facebook': {
        const fbUrl = 'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent('https://xiaomeng-fortune.onrender.com/?system=pet');
        window.open(fbUrl, '_blank', 'noopener,noreferrer,width=580,height=560');
        showModal({
          icon: 'FB',
          title: 'Facebook 分享',
          subtitle: 'Sprint 1.5 原型版',
          body: '分享新窗已開啟。真正的 FB 應用程式與體驗整合將於下次引入。',
          badge: 'Prototype',
            cta: '我了解了'
        });
        break;
      }
      case 'share_instagram':
        showModal({
          icon: 'IG',
          title: 'Instagram 分享',
          subtitle: 'Coming Soon',
          body: 'Instagram Stories / Reels 分享功能正在開發中，敬請期待。',
          badge: 'Sprint 2',
            cta: '我了解了'
        });
        break;
      case 'share_threads':
        showModal({
          icon: 'THREADS',
          title: 'Threads 分享',
          subtitle: 'Coming Soon',
          body: 'Threads 分享功能正在開發中，敬請期待。',
          badge: 'Sprint 2',
            cta: '我了解了'
        });
        break;
      case 'collect_favorite':
        if (state.lineUserId) {
          showModal({
            icon: '\u2713',
            title: '已加入命運紀錄館',
            subtitle: 'Sprint 1.5 原型版',
            body: '這次解讀已錄入命運紀錄館UI狀態。真正的儲存對接將於下次引入。',
            badge: 'UI State',
            cta: '我了解了'
          });
        } else {
          showModal({
            icon: '🔒',
            title: '收藏前需先登入',
            subtitle: '解鎖命運紀錄館',
            body: '登入會員後方可收藏這次解讀。請回到 Step 7 完成 LINE 登入，或直接連結小夢神殿 LINE 官方帳號。',
            badge: 'Login Required',
            cta: '我了解了'
          });
        }
        break;
      default:
        if (ctaConfigs[ctaType]) {
          showModal({ ...ctaConfigs[ctaType], cta: '我了解了' });
        } else {
          showModal({
            icon: '✨',
            title: '即將推出',
            subtitle: 'Coming Soon',
            body: '此功能將於後續 Sprint 開放,感謝你的耐心。',
            cta: '我了解了'
          });
        }
    }
  }


  // ============ 工具 ============
  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function getPositionTheme(position) {
    const themes = {
      1: '毛孩目前能量', 2: '毛孩真正情緒', 3: '與主人的靈魂連結',
      4: '目前需要改善的課題', 5: '最近的重要提醒',
      6: '前世契約', 7: '靈魂使命', 8: '未完成因果',
      9: '未來祝福', 10: '動物神諭最終祝福'
    };
    return themes[position] || '';
  }

  // ============ 全域事件綁定 ============
  function bindEvents() {
    const sec = document.getElementById('petTempleSection');
    if (!sec) return;
    sec.addEventListener('click', (e) => {
      const t = e.target.closest('[data-action]');
      if (!t) return;
      const action = t.dataset.action;
      switch (action) {
        case 'goto-step-2': showStep(2); break;
        case 'submit-pet-name': handlePetNameSubmit(); break;
        case 'skip-pet-name': skipPetName(); break;
        case 'liff-login': handleLiffLogin(); break;
        case 'goto-step-9':
          initStep8();
          showStep(9);
          break;
        case 'open-card-reading': {
          const cardPos = parseInt(e.target.closest('[data-action="open-card-reading"]').dataset.position, 10);
          if (cardPos >= 1 && cardPos <= 5) openCardReading(cardPos);
          break;
        }
        case 'back-to-step-9':
          state.currentReadingPosition = null;
          showStep(9);
          break;
        case 'next-card': {
          const next = (state.currentReadingPosition || 1) + 1;
          if (next <= 5) openCardReading(next);
          else showStep(13);
          break;
        }
        case 'retry-card-reading': {
          const retryPos = parseInt(e.target.closest('[data-action="retry-card-reading"]').dataset.position, 10);
          if (retryPos >= 1 && retryPos <= 5) openCardReading(retryPos);
          break;
        }
        case 'goto-step-13': showStep(13); break;
      }
      const cta = e.target.closest('[data-cta]');
      if (cta) handleCTA(cta.dataset.cta);
    });
    sec.querySelectorAll('.pet-identity-card').forEach(card => {
      card.addEventListener('click', () => handleIdentitySelect(card.dataset.identity));
    });
    // Enter key submit for pet name input (2026-07-05 14:10)
    const petNameInput = document.getElementById('petNameInput');
    if (petNameInput) {
      petNameInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          handlePetNameSubmit();
        }
      });
    }
    sec.querySelectorAll('.pet-question-card').forEach(card => {
      card.addEventListener('click', () => handleQuestionSelect(card.dataset.question));
    });
    // 2026-07-06 13:55 修法:移除 13:40 的事件委派 fallback,因 forEach 已正確綁定 handler,
    // fallback 會造成同一 click 內 handleQuestionSelect 被呼叫兩次,引發 race condition
    // (第二次 /api/pet/temple/start 失敗,彈「無法開始」modal 蓋住 Step 5)
    // handleQuestionSelect 內 _inflightQuestion guard 為雙保險
  }

  // ============ Modal + Hero CTA 全域綁定(2026-07-05 08:29 收尾) ============
  function bindGlobalUI() {
    // Modal 關閉
    const closeBtn = document.getElementById('petModalClose');
    const ctaBtn = document.getElementById('petModalCta');
    const overlay = document.getElementById('petModalOverlay');
    if (closeBtn) closeBtn.addEventListener('click', hideModal);
    if (ctaBtn) ctaBtn.addEventListener('click', hideModal);
    if (overlay) {
      overlay.addEventListener('click', function(e) {
        if (e.target === overlay) hideModal();
      });
    }
    // D5 v3 音效控制(右下角按鈕 + 音量 slider)
    const audioToggle = document.getElementById('templeAudioToggle');
    const audioPanel = document.getElementById('templeAudioPanel');
    const audioIcon = document.getElementById('templeAudioIcon');
    const audioVolume = document.getElementById('templeAudioVolume');
    const audioValue = document.getElementById('templeAudioValue');
    if (audioToggle) {
      audioToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        gateAudioState.enabled = !gateAudioState.enabled;
        audioToggle.setAttribute('aria-pressed', gateAudioState.enabled ? 'true' : 'false');
        if (audioIcon) audioIcon.textContent = gateAudioState.enabled ? '🔊' : '🔇';
        const audio = document.getElementById('templeGateAudio');
        if (audio && !gateAudioState.enabled) { try { audio.pause(); } catch (e) {} }
      });
      // 點 toggle 切換 panel 顯示
      audioToggle.addEventListener('click', function() {
        if (audioPanel) audioPanel.hidden = !audioPanel.hidden;
      });
    }
    if (audioVolume) {
      audioVolume.addEventListener('input', function() {
        const v = parseInt(audioVolume.value, 10);
        gateAudioState.volume = v / 100;
        if (audioValue) audioValue.textContent = v + '%';
        const audio = document.getElementById('templeGateAudio');
        if (audio) audio.volume = gateAudioState.volume;
      });
      audioVolume.addEventListener('click', function(e) { e.stopPropagation(); });
    }
    if (audioPanel) {
      audioPanel.addEventListener('click', function(e) { e.stopPropagation(); });
    }
    // 圖片失敗 fallback (2026-07-05 14:05 Sprint 1.5 polish)
    document.addEventListener('error', function(e) {
      const img = e.target;
      if (!(img instanceof HTMLImageElement)) return;
      const cls = img.className || '';
      if (cls.indexOf('pet-card-display__img') === -1 && cls.indexOf('pet-locked-card__img') === -1 && cls.indexOf('pet-unlocked-card__img') === -1) return;
      if (img.dataset.fallbackAdded === '1') return;
      img.dataset.fallbackAdded = '1';
      const fb = document.createElement('div');
      fb.className = 'pet-img-fallback';
      const icon = document.createElement('span');
      icon.className = 'pet-img-fallback__icon';
      icon.textContent = '\uD83D\uDC3E';
      const name = document.createElement('span');
      name.className = 'pet-img-fallback__name';
      name.textContent = img.alt || '';
      fb.appendChild(icon);
      fb.appendChild(name);
      img.parentNode && img.parentNode.insertBefore(fb, img);
      img.style.display = 'none';
    }, true);
// ESC 關閉 Modal(2026-07-05 12:46 Sprint 1.5 收尾補上)
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' || e.keyCode === 27) {
        const ov = document.getElementById('petModalOverlay');
        if (ov && !ov.hidden) hideModal();
      }
    });
    // Hero 免費體驗區 CTA
    const cta1 = document.getElementById('petFreeTrialCta');
    const cta2 = document.getElementById('petIntroCta');
    function goPetTemple(e) {
      if (e) e.preventDefault();
      try {
        const url = new URL(window.location.href);
        url.searchParams.set('system', 'pet');
        window.location.href = url.toString();
      } catch (err) {
        window.location.href = '?system=pet';
      }
    }
    if (cta1) cta1.addEventListener('click', goPetTemple);
    if (cta2) cta2.addEventListener('click', goPetTemple);
  }

  // ============ 啟動 ============
  function init() {
    bindEvents();
    bindGlobalUI();
    if (shouldOpenPetTemple()) {
      showPetTemple();
      initLiff();
    } else {
      initLiff();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // ============ 暴露到全域供首頁 CTA 使用 (2026-07-05 Sprint 1.5) ============
  window.showModal = showModal;
  window.hideModal = hideModal;
  window.showPetTemple = showPetTemple;
  window.__petShowStep = showStep;
})();
