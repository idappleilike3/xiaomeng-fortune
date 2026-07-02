/**
 * L2 Topics — 主題選擇 SPA
 * 對齊 3-Layer UX v1.0 §3.3
 *
 * 點 4 入口任一 → 顯示 L2 主題 → 點主題 → 啟動 F22
 */
(function() {
  'use strict';

  // 主題 → 牌陣 對映(對齊 3-Layer UX)
  const TOPIC_SPREADS = {
    tarot: {
      love:   { id: 'tarot-love', label: '感情關係', count: 3, estMin: 5 },
      work:   { id: 'tarot-work', label: '工作事業', count: 3, estMin: 5 },
      wealth: { id: 'tarot-wealth', label: '財富豐盛', count: 3, estMin: 5 },
      self:   { id: 'tarot-self', label: '自我探索', count: 5, estMin: 8 },
      more:   { id: 'tarot-all', label: '完整牌陣', count: 5, estMin: 8 },
    },
  };

  function showL3() {
    const l3 = document.getElementById('l3Temple');
    if (!l3) return;
    l3.hidden = false;
    l3.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function showL2(system) {
    const l2 = document.getElementById('l2Topics');
    if (!l2) return;
    // 更新標題(對齊各系統變體)
    const titles = {
      tarot: { title: '你想探詢哪個主題？', hint: '選擇主題後由小夢陪你抽牌' },
      pet:   { title: '想為哪位毛孩探尋心意？', hint: '選擇主題後由小夢陪你聽見毛孩的心聲' },
      oracle:{ title: '宇宙今晚想對你說什麼？', hint: '選擇主題後接收宇宙的訊息' },
    };
    const t = titles[system] || titles.tarot;
    l2.querySelector('.l2-topics__title').textContent = t.title;
    l2.querySelector('.l2-topics__hint').textContent = t.hint;
    // 重新標記每顆按鈕的 data-system
    l2.querySelectorAll('.l2-topic').forEach((btn) => {
      btn.dataset.system = system;
    });
    l2.hidden = false;
    l2.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function pickTopic(system, topic) {
    const spread = TOPIC_SPREADS[system]?.[topic];
    if (!spread) return;
    try {
      localStorage.setItem('xm_selected_system', system);
      localStorage.setItem('xm_selected_topic', topic);
      localStorage.setItem('xm_selected_spread', JSON.stringify(spread));
    } catch (e) {
      /* silent */
    }
    // 隱藏 L2 + 顯示 demo
    const l2 = document.getElementById('l2Topics');
    if (l2) l2.hidden = true;
    const demo = document.querySelector('#demo, .demo-section');
    if (demo) demo.scrollIntoView({ behavior: 'smooth', block: 'start' });
    // 觸發 SSE(如果有 SacredStage 引擎)
    if (window.__xiaomengSacredStage) {
      try {
        window.__xiaomengSacredStage.destroy();
        window.__xiaomengSacredStage.tarot();
      } catch (e) {
        /* silent */
      }
    }
  }

  // 綁定事件
  document.addEventListener('DOMContentLoaded', () => {
    // 4 入口點擊 → 顯示 L2 / L3
    document.querySelectorAll('.hero-entry[data-system]').forEach((btn) => {
      btn.addEventListener('click', (ev) => {
        const system = btn.dataset.system;
        if (system === 'explore') {
          // 神殿深處 → 顯示 L3
          try { localStorage.setItem('xm_layer', '3'); } catch (e) {}
          ev.preventDefault();
          ev.stopPropagation();
          showL3();
          return;
        }
        ev.preventDefault();
        ev.stopPropagation();
        showL2(system);
      });
    });

    // L2 主題點擊
    document.querySelectorAll('.l2-topic').forEach((btn) => {
      btn.addEventListener('click', (ev) => {
        ev.preventDefault();
        ev.stopPropagation();
        const system = btn.dataset.system || 'tarot';
        const topic = btn.dataset.topic;
        pickTopic(system, topic);
      });
    });

    // URL ?system= 自動觸發
    try {
      const params = new URLSearchParams(window.location.search);
      const sys = params.get('system');
      const layer = params.get('layer');
      if (layer === '3') {
        // 神殿深處
        const demo = document.querySelector('#demo, .demo-section');
        if (demo) demo.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else if (sys && ['tarot', 'pet', 'oracle'].includes(sys)) {
        showL2(sys);
      } else if (layer === '3') {
        showL3();
      }
    } catch (e) {
      /* silent */
    }
  });
})();
