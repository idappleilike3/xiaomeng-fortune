/**
 * SSE Bridge — 把 SacredStage 引擎的 audio:cue 事件
 * 對接到既有 __playSystemSound 系統
 * 這樣新引擎的音效觸發 = 既有 ambient 音效播放
 */
import { SacredStage } from './sacred-stage-engine.js';

// 11 步音效對映(對齊 BRAND_BIBLE §17 12 音效)
const SSE_TO_SOUND = {
  'f22-opening': 'open',         // 進入 F22
  'f22-shuffle': 'shuffle',      // 洗牌
  'f22-cut': 'cut',              // 切牌
  'f22-fan': 'spread',           // 展牌
  'f22-select': 'select',        // 選牌
  'f22-flip': 'flip',            // 翻牌
  'f22-complete': 'reveal',      // 解讀完成
  'f22-blessing': 'blessing',    // 祝福
  'f22-hover': 'hover',          // 滑鼠懸停
};

let activeStage = null;

function startSacredStage(config) {
  if (activeStage) {
    activeStage.destroy();
    activeStage = null;
  }

  const stage = new SacredStage(config);
  activeStage = stage;

  // 對接 audio:cue → 既有音效
  stage.on('audio:cue', ({ name }) => {
    const soundKey = SSE_TO_SOUND[name];
    if (soundKey && typeof window.__playSystemSound === 'function') {
      try {
        window.__playSystemSound(config.system || 'tarot', soundKey);
      } catch (e) {
        /* silent */
      }
    }
  });

  // 對接 reading:done → 存到 localStorage(對齊既有 record 系統)
  stage.on('reading:done', ({ reading }) => {
    try {
      const raw = localStorage.getItem('xm_fortune_records');
      const list = raw ? JSON.parse(raw) : [];
      const card = reading.card || {};
      list.unshift({
        id: `sse_${Date.now()}`,
        system: config.system,
        spread: config.spread,
        card: { id: card.id, name: card.name, nameEn: card.nameEn, image: card.image, reversed: card.reversed },
        reading: reading,
        createdAt: new Date().toISOString(),
        source: 'sse-engine',
      });
      localStorage.setItem('xm_fortune_records', JSON.stringify(list.slice(0, 200)));
    } catch (e) {
      /* silent */
    }
  });

  // 對接 complete → 加 SP
  stage.on('complete', () => {
    try {
      const raw = localStorage.getItem('xm_fortune_records') || '[]';
      const list = JSON.parse(raw);
      const today = new Date().toISOString().split('T')[0];
      const lastDraw = localStorage.getItem('xm_last_daily_draw');
      if (lastDraw !== today) {
        localStorage.setItem('xm_last_daily_draw', today);
        // 通知既有 wallet 系統 +SP
        if (window.__xiaomengApi?.awardPoints) {
          window.__xiaomengApi.awardPoints({ amount: 5, reason: 'sse_complete', scope: 'daily' });
        }
      }
    } catch (e) {
      /* silent */
    }
  });

  stage.start();
  return stage;
}

// 全域 API(給 HTML 按鈕呼叫)
window.__xiaomengSacredStage = {
  start: startSacredStage,
  tarot: () => startSacredStage({
    system: 'tarot',
    spread: 'three-card',
    cards: [],  // 由 SacredStage 內部用 spread-library
  }),
  destroy: () => {
    if (activeStage) {
      activeStage.destroy();
      activeStage = null;
    }
  },
  get active() { return activeStage; },
};

export default window.__xiaomengSacredStage;
