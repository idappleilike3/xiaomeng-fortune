/**
 * SSE Bridge v2.0 — Full Integration
 * 對齊 老闆 11:40 E. Full SSE 整合
 *
 * 改進:
 * - 接受 mount 參數(對齊 demo section)
 * - 啟動時自動隱藏 demo section
 * - 完成時恢復 demo + 顯示結果
 * - 完整 11 步音效 + 11 步動畫 + Hero BGM
 */
import { SacredStage } from './sacred-stage-engine.js';

// 11 步音效對映(對齊 BRAND_BIBLE §17 12 音效)
const SSE_TO_SOUND = {
  'f22-opening': 'open',
  'f22-shuffle': 'shuffle',
  'f22-cut': 'cut',
  'f22-fan': 'spread',
  'f22-select': 'select',
  'f22-flip': 'flip',
  'f22-complete': 'reveal',
  'f22-blessing': 'blessing',
  'f22-hover': 'hover',
};

let activeStage = null;
let savedDemoDisplay = null;

function hideDemo() {
  const demo = document.getElementById('demo');
  if (demo) {
    savedDemoDisplay = demo.style.display;
    demo.style.display = 'none';
  }
}

function showDemo() {
  const demo = document.getElementById('demo');
  if (demo) {
    demo.style.display = savedDemoDisplay || '';
  }
}

function showCompletion(reading) {
  const card = reading?.card || {};
  const sections = reading?.sections || [];
  const summary = sections.map((s) => s.text).join('\n\n');

  // 寫入 localStorage(既有 record 系統)
  try {
    const raw = localStorage.getItem('xm_fortune_records');
    const list = raw ? JSON.parse(raw) : [];
    const record = {
      id: `sse_${Date.now()}`,
      system: activeStage?.config?.system || 'tarot',
      spread: activeStage?.config?.spread || 'three-card',
      card: { id: card.id, name: card.name, nameEn: card.nameEn, image: card.image, reversed: card.reversed },
      reading: reading,
      summary: summary,
      createdAt: new Date().toISOString(),
      source: 'sse-engine',
    };
    list.unshift(record);
    localStorage.setItem('xm_fortune_records', JSON.stringify(list.slice(0, 200)));
  } catch (e) {
    /* silent */
  }

  // +5 SP(透過既有 awardPoints)
  try {
    if (window.__xiaomengApi?.awardPoints) {
      window.__xiaomengApi.awardPoints({ amount: 5, reason: 'sse_complete', scope: 'daily' });
    }
  } catch (e) {
    /* silent */
  }
}

function startSacredStage(config = {}) {
  if (activeStage) {
    activeStage.destroy();
    activeStage = null;
  }

  // 隱藏 demo section(SSE 取代)
  hideDemo();

  // 設定 mount(優先用 config.mount,否則找 demo)
  const mount = config.mount || document.getElementById('demo') || document.body;

  const stage = new SacredStage({
    ...config,
    mount,
  });
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

  // 對接 complete → 顯示結果 + 恢復 demo
  stage.on('complete', () => {
    showCompletion(stage.state?.reading);
    // 1.5 秒後恢復 demo(讓 user 看 SSE 祝福動畫 1.5 秒)
    setTimeout(() => {
      try {
        stage.destroy();
      } catch (e) {
        /* silent */
      }
      activeStage = null;
      showDemo();
    }, 1500);
  });

  stage.start();
  return stage;
}

// 全域 API
window.__xiaomengSacredStage = {
  start: startSacredStage,
  tarot: () => {
    const demo = document.getElementById('demo');
    return startSacredStage({
      system: 'tarot',
      spread: 'three-card',
      cards: [],
      mount: demo,
    });
  },
  pet: () => {
    const demo = document.getElementById('demo');
    return startSacredStage({
      system: 'pet',
      spread: 'three-card',
      cards: [],
      mount: demo,
    });
  },
  oracle: () => {
    const demo = document.getElementById('demo');
    return startSacredStage({
      system: 'oracle',
      spread: 'three-card',
      cards: [],
      mount: demo,
    });
  },
  destroy: () => {
    if (activeStage) {
      activeStage.destroy();
      activeStage = null;
      showDemo();
    }
  },
  get active() { return activeStage; },
};

export default window.__xiaomengSacredStage;
