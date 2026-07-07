// 萌寵神殿新入口觸發腳本(2026-07-05 Sprint 1.5)
// 在 script-pettemple.js init 跑完後,直接呼叫 showPetTemple() 顯示 Step 1
// 設計:不需要 ?system=pet URL,新入口本身就是萌寵神殿
//
// 額外功能:
//   - 監聽步驟切換,更新頂部進度條
//   - 為選中的身份卡 / 主題卡加 .selected class(視覺標記)

(function() {
  // ===== 1. 觸發萌寵神殿 =====
  function tryShow() {
    if (typeof window.showPetTemple === 'function') {
      window.showPetTemple();
      return true;
    }
    return false;
  }

  function boot() {
    if (tryShow()) {
      initProgressObserver();
      initSelectionObserver();
      return;
    }
    // 若 script-pettemple.js 還沒初始化完成,稍等重試
    let attempts = 0;
    const timer = setInterval(function() {
      attempts++;
      if (tryShow()) {
        clearInterval(timer);
        initProgressObserver();
        initSelectionObserver();
      } else if (attempts >= 30) {
        clearInterval(timer);
        console.error('萌寵神殿入口:showPetTemple 未定義(script-pettemple.js 載入失敗?)');
      }
    }, 50);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

  // ===== 2. 進度條觀察器 =====
  function initProgressObserver() {
    const bar = document.getElementById('petProgressBar');
    const section = document.getElementById('petTempleSection');
    if (!bar || !section) return;

    const dots = bar.querySelectorAll('.pet-progress__dot');
    const steps = section.querySelectorAll('.pet-step');

    function update() {
      let current = 0;
      steps.forEach(s => {
        if (!s.hidden) current = parseInt(s.dataset.step, 10);
      });
      dots.forEach(dot => {
        const ds = parseInt(dot.dataset.step, 10);
        dot.classList.remove('pet-progress__dot--active', 'pet-progress__dot--done');
        if (ds === current) dot.classList.add('pet-progress__dot--active');
        else if (ds < current) dot.classList.add('pet-progress__dot--done');
      });
    }

    // 觀察所有 .pet-step 的 hidden 屬性變化
    steps.forEach(s => {
      new MutationObserver(update).observe(s, { attributes: true, attributeFilter: ['hidden'] });
    });
    update();
  }

  // ===== 3. 選中狀態觀察器(身份卡 / 主題卡) =====
  function initSelectionObserver() {
    // 身份卡點擊時即時加 .selected(原本的 script-pettemple.js 沒有視覺標記)
    const section = document.getElementById('petTempleSection');
    if (!section) return;

    function bindSelection(selector, attr) {
      section.querySelectorAll(selector).forEach(card => {
        card.addEventListener('click', () => {
          // 先清除同組其他卡片 .selected,再加自己
          section.querySelectorAll(selector).forEach(c => c.classList.remove('selected'));
          card.classList.add('selected');
        });
      });
    }
    bindSelection('.pet-identity-card', 'data-identity');
    bindSelection('.pet-question-card', 'data-question');
  }
})();