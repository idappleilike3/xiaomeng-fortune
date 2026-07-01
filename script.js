
const LIFF_ID = "2010549494-KRb0mn7U";
const LIFF_URL = `https://liff.line.me/${LIFF_ID}`;
const LINE_ADD_FRIEND_URL = "https://line.me/R/ti/p/@471cptxk";
const API_BASE = window.location.protocol === "file:" ? "https://xiaomeng-fortune.onrender.com" : "";
const DEFAULT_MEMBER_ID = "demo-member-001";

// === operator mode (?ops=1) ===
// Default customer view hides 後台/串接 sections. Visiting the page with
// ?ops=1 reveals them and re-injects the nav links. Trigger value is a single
// string compare; change to a token later if you want it less guessable.
function applyOpsMode() {
  const params = new URLSearchParams(window.location.search);
  if (params.get("ops") !== "1") return;
  document.body.dataset.ops = "true";
  const nav = document.querySelector(".nav");
  if (!nav) return;
  const opsLinks = [
    { href: "#admin", label: "後台" },
    { href: "#setup", label: "串接" }
  ];
  for (const { href, label } of opsLinks) {
    const link = document.createElement("a");
    link.href = href;
    link.textContent = label;
    link.dataset.opsLink = "true";
    nav.appendChild(link);
  }
}
applyOpsMode();

const rawTarotDeck = [
  ["愚者", "新的旅程正在展開，先讓心保持開放，別急著替未知下定論。"],
  ["魔術師", "你手上已有資源，適合主動出擊，把想法變成具體行動。"],
  ["女祭司", "答案藏在直覺裡，先觀察，不急著公開你的判斷。"],
  ["皇后", "滋養與創造力正在變強，適合照顧自己，也適合經營關係。"],
  ["皇帝", "需要建立界線與秩序，事情會因你的穩定而更有方向。"],
  ["教皇", "適合尋求前輩、老師或制度的協助，別一個人硬撐。"],
  ["戀人", "你面前有重要選擇，請同時看見心動與現實。"],
  ["戰車", "只要目標明確，就能推進；分心才是目前最大的阻力。"],
  ["力量", "溫柔比強硬更有力量，先穩住情緒，再處理局面。"],
  ["隱者", "你需要安靜整理答案，暫時慢下來反而會看得更清楚。"],
  ["命運之輪", "局勢正在轉動，順勢調整比強求原計畫更重要。"],
  ["正義", "公平與真相會浮現，請用清楚的標準做決定。"],
  ["吊人", "暫停不是失敗，換個角度會找到新的出口。"],
  ["死神", "某個階段正在結束，放下舊模式才有空間迎接新局。"],
  ["節制", "整合、協調、慢慢來，是現在最有效的策略。"],
  ["惡魔", "看見執著與慾望，別讓恐懼牽著你走。"],
  ["高塔", "突發變化會打破假象，但也會讓真正穩固的留下來。"],
  ["星星", "希望正在回來，適合療癒、許願與重新相信自己。"],
  ["月亮", "狀況還不明朗，先別急著下結論，直覺正在提醒你。"],
  ["太陽", "能量明亮，適合公開表達、主動邀約與開始新計畫。"],
  ["審判", "重要的醒悟正在發生，請回應內在真正的召喚。"],
  ["世界", "一個循環接近完成，你準備進入更成熟的新階段。"],
  ["權杖王牌", "新的熱情點燃了，適合開始創作、行動與嘗試。"],
  ["權杖二", "你正在規劃下一步，視野放大後選擇會更清楚。"],
  ["權杖三", "等待成果擴展，合作與遠方機會值得留意。"],
  ["權杖四", "穩定與慶祝的能量，適合建立關係安全感。"],
  ["權杖五", "競爭或摩擦增加，請把衝突轉成有效溝通。"],
  ["權杖六", "你會被看見，適合展現成果與爭取支持。"],
  ["權杖七", "守住立場，但別讓防衛心阻礙真正的交流。"],
  ["權杖八", "消息、進展與速度變快，請準備好即時回應。"],
  ["權杖九", "雖然疲憊，但你比想像中更接近突破。"],
  ["權杖十", "責任太重，需要分工，別把所有事都扛在身上。"],
  ["權杖侍者", "新鮮靈感出現，適合探索、學習與試水溫。"],
  ["權杖騎士", "行動力強，但要避免衝動決策。"],
  ["權杖皇后", "魅力與自信上升，適合主動吸引資源。"],
  ["權杖國王", "領導力成熟，請用願景帶動身邊的人。"],
  ["聖杯王牌", "新的情感開始，心正在打開。"],
  ["聖杯二", "關係有互相靠近的機會，真誠對話很重要。"],
  ["聖杯三", "友情、社群與支持能量增加，適合聚會或合作。"],
  ["聖杯四", "你可能有些麻木，先看見已經在身邊的好意。"],
  ["聖杯五", "失落感需要被承認，但不要忽略仍然留下的可能。"],
  ["聖杯六", "舊人舊事浮現，溫柔回顧，但別困在過去。"],
  ["聖杯七", "選項很多，請分辨幻想與真正可行的路。"],
  ["聖杯八", "你正在離開不再滋養你的狀態，這是勇敢的選擇。"],
  ["聖杯九", "願望有機會實現，請允許自己享受成果。"],
  ["聖杯十", "關係和諧、家庭感與歸屬感正在增強。"],
  ["聖杯侍者", "溫柔訊息到來，也可能是新的心動或創作靈感。"],
  ["聖杯騎士", "浪漫與邀約出現，但承諾仍需要觀察。"],
  ["聖杯皇后", "情感細膩，請相信你的同理心與直覺。"],
  ["聖杯國王", "成熟地處理情緒，是現在的關鍵。"],
  ["寶劍王牌", "真相與清楚判斷出現，適合說清楚、寫下來。"],
  ["寶劍二", "你正在猶豫，真正卡住的是不願看見的資訊。"],
  ["寶劍三", "心痛需要時間整理，誠實面對比假裝沒事更快復原。"],
  ["寶劍四", "休息是必要的，先恢復再決定下一步。"],
  ["寶劍五", "爭贏不一定是勝利，請確認代價是否值得。"],
  ["寶劍六", "你正在離開混亂，往更平靜的地方前進。"],
  ["寶劍七", "有隱藏資訊，請保護自己並留意細節。"],
  ["寶劍八", "限制感很強，但出口其實比你想像中近。"],
  ["寶劍九", "焦慮放大了問題，請把擔心拆成可處理的小事。"],
  ["寶劍十", "某件事已到盡頭，結束後才會真正鬆一口氣。"],
  ["寶劍侍者", "觀察與學習期，訊息很多但要查證。"],
  ["寶劍騎士", "速度很快，說話與決策都要避免太尖銳。"],
  ["寶劍皇后", "清醒、獨立、精準，請用理性保護界線。"],
  ["寶劍國王", "適合做策略判斷，客觀會帶來掌控感。"],
  ["錢幣王牌", "新的實際機會出現，可能與工作、金錢或健康有關。"],
  ["錢幣二", "你正在平衡多件事，時間與金錢管理是重點。"],
  ["錢幣三", "合作、專業與技術累積會帶來好成果。"],
  ["錢幣四", "安全感很重要，但過度緊抓會讓流動停住。"],
  ["錢幣五", "資源感不足時，請主動尋求協助，不必獨自承受。"],
  ["錢幣六", "給予與接受需要平衡，貴人或資源可能出現。"],
  ["錢幣七", "成果需要時間，現在適合檢查投入是否值得。"],
  ["錢幣八", "專注練習會累積實力，慢工能出細活。"],
  ["錢幣九", "獨立與品味提升，適合投資自己。"],
  ["錢幣十", "長期穩定、家族資源與財務規劃是重點。"],
  ["錢幣侍者", "新的學習或賺錢機會出現，先從基礎做起。"],
  ["錢幣騎士", "穩定推進最可靠，別小看每天一點點的累積。"],
  ["錢幣皇后", "照顧生活品質，也照顧實際資源。"],
  ["錢幣國王", "成熟的物質掌控力，適合談合作、財務與長期計畫。"],
];

const majorArcanaMeta = [
  ["愚者", "THE FOOL", "0"],
  ["魔術師", "THE MAGICIAN", "I"],
  ["女祭司", "THE HIGH PRIESTESS", "II"],
  ["皇后", "THE EMPRESS", "III"],
  ["皇帝", "THE EMPEROR", "IV"],
  ["教皇", "THE HIEROPHANT", "V"],
  ["戀人", "THE LOVERS", "VI"],
  ["戰車", "THE CHARIOT", "VII"],
  ["力量", "STRENGTH", "VIII"],
  ["隱者", "THE HERMIT", "IX"],
  ["命運之輪", "WHEEL OF FORTUNE", "X"],
  ["正義", "JUSTICE", "XI"],
  ["吊人", "THE HANGED MAN", "XII"],
  ["死神", "DEATH", "XIII"],
  ["節制", "TEMPERANCE", "XIV"],
  ["惡魔", "THE DEVIL", "XV"],
  ["高塔", "THE TOWER", "XVI"],
  ["星星", "THE STAR", "XVII"],
  ["月亮", "THE MOON", "XVIII"],
  ["太陽", "THE SUN", "XIX"],
  ["審判", "JUDGEMENT", "XX"],
  ["世界", "THE WORLD", "XXI"],
];

const majorArcanaMap = Object.fromEntries(
  majorArcanaMeta.map(([name, english, roman], index) => [name, { english, roman, suit: "major", index }])
);

const suitMetaMap = {
  權杖: { english: "WANDS", suit: "wands", symbol: "✦" },
  聖杯: { english: "CUPS", suit: "cups", symbol: "☾" },
  寶劍: { english: "SWORDS", suit: "swords", symbol: "◆" },
  錢幣: { english: "PENTACLES", suit: "pentacles", symbol: "◉" },
};

const rankMetaMap = {
  王牌: { english: "ACE", roman: "I" },
  二: { english: "TWO", roman: "II" },
  三: { english: "THREE", roman: "III" },
  四: { english: "FOUR", roman: "IV" },
  五: { english: "FIVE", roman: "V" },
  六: { english: "SIX", roman: "VI" },
  七: { english: "SEVEN", roman: "VII" },
  八: { english: "EIGHT", roman: "VIII" },
  九: { english: "NINE", roman: "IX" },
  十: { english: "TEN", roman: "X" },
  侍者: { english: "PAGE", roman: "XI" },
  騎士: { english: "KNIGHT", roman: "XII" },
  皇后: { english: "QUEEN", roman: "XIII" },
  國王: { english: "KING", roman: "XIV" },
};

function getTarotCardMeta(cardName) {
  if (majorArcanaMap[cardName]) return majorArcanaMap[cardName];

  const suitKey = Object.keys(suitMetaMap).find((key) => cardName.startsWith(key));
  const rankKey = Object.keys(rankMetaMap).find((key) => cardName.endsWith(key));
  const suit = suitMetaMap[suitKey] || suitMetaMap.權杖;
  const rank = rankMetaMap[rankKey] || rankMetaMap.王牌;
  return {
    english: `${rank.english} OF ${suit.english}`,
    roman: rank.roman,
    suit: suit.suit,
    symbol: suit.symbol,
    index: rawTarotDeck.findIndex(([name]) => name === cardName),
  };
}

const MAJOR_ARCANA_IMAGES = {
  0: "./assets/tarot-00-the-fool.png",
  1: "./assets/tarot-01-the-magician.png",
  2: "./assets/tarot-02-the-high-priestess.png",
  3: "./assets/tarot-03-the-empress.png",
  4: "./assets/tarot-04-the-emperor.png",
  5: "./assets/tarot-05-the-hierophant.png",
  6: "./assets/tarot-06-the-lovers.png",
  7: "./assets/tarot-07-the-chariot.png",
  8: "./assets/tarot-08-strength.png",
  9: "./assets/tarot-09-the-hermit.png",
  10: "./assets/tarot-10-wheel-of-fortune.png",
  11: "./assets/tarot-11-justice.png",
  12: "./assets/tarot-12-the-hanged-man.png",
  13: "./assets/tarot-13-death.png",
  14: "./assets/tarot-14-temperance.png",
  15: "./assets/tarot-15-the-devil.png",
  16: "./assets/tarot-16-the-tower.png",
  17: "./assets/tarot-17-the-star.png",
  18: "./assets/tarot-18-the-moon.png",
  19: "./assets/tarot-19-the-sun.png",
  20: "./assets/tarot-20-judgement.png",
  21: "./assets/tarot-21-the-world.png",
};
const tarotDeck = rawTarotDeck.map(([name, meaning]) => {
  const meta = getTarotCardMeta(name);
  const image = meta.suit === "major" ? MAJOR_ARCANA_IMAGES[meta.index] || null : null;
  return { name, meaning, ...meta, image };
});
const majorArcanaDeck = tarotDeck.filter((card) => card.suit === "major");


const unlockMessages = {
  free:
    "免費版適合先確認方向：看牌名、籤意、簡短提醒與一個注意事項。若問題牽涉感情決定、工作轉換或財務選擇，再引導深度解析。",
  single:
    "單次深度解析適合高意圖使用者：一次解鎖完整脈絡、未來 14 到 30 天走勢、阻礙來源、對方狀態與下一步行動。建議定價 $99 起。",
  points:
    "點數制適合提高回訪率：使用者一次購買點數，之後抽牌、求籤、週運、合盤都可扣點。這會比單次付款更適合長期經營。",
};


const topicGuidance = {
  感情: "感情題請先看互動是否真誠，再看自己是不是把期待放得太前面。",
  工作: "工作題重點在流程、溝通與當下能掌握的任務，不急著用情緒決定去留。",
  事業: "事業題要看長線布局，這張牌提醒你把願景拆成可以執行的下一步。",
  財運: "財運題先看現金流與風險，再看是否值得投入更多資源。",
  健康: "健康題以身心平衡與作息提醒為主；若有明顯不適，仍建議尋求專業醫療協助。",
  個人成長: "個人成長題看的是內在課題，這張牌會指出你目前最需要調整的信念與行動。",
};

const tarotSpreads = {
  daily: { label: "今日一張", count: 1, resultLabel: "今日提醒" },
  single: { label: "單張指引", count: 1, resultLabel: "核心指引" },
  three: { label: "三張牌陣", count: 3, resultLabel: "過去｜現在｜下一步", positions: ["過去", "現在", "下一步"] },
  five: { label: "五張牌陣", count: 5, resultLabel: "現況｜阻礙｜資源｜建議｜走勢", positions: ["現況", "阻礙", "資源", "建議", "走勢"] },
};

let currentTarotDeck = [];
let latestTarotReading = null;
let currentTarotSpread = "daily";
let currentTarotSelections = [];
let tarotExperienceState = "idle";
let bonusDraws = Number(localStorage.getItem("bonusDraws") || 0);
let activeMemberId = localStorage.getItem("memberId") || DEFAULT_MEMBER_ID;
let audioContext;
const supportsFinePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

function escapeHtml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: { "content-type": "application/json", ...(options.headers || {}) },
    ...options,
  });
  const payload = await response.json();
  if (!response.ok) {
    const error = new Error(payload.message || payload.error || "API request failed");
    error.payload = payload;
    throw error;
  }
  return payload;
}

function getAudioContext() {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return null;
  if (!audioContext) audioContext = new AudioContextClass();
  return audioContext;
}

function playRitualTone(kind = "soft") {
  const context = getAudioContext();
  if (!context) return;

  const now = context.currentTime;
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  const delay = context.createDelay();
  const feedback = context.createGain();

  const frequencies = {
    soft: [523.25, 659.25],
    card: [587.33, 880],
    unlock: [659.25, 987.77],
  };
  const [startFrequency, endFrequency] = frequencies[kind] || frequencies.soft;

  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(startFrequency, now);
  oscillator.frequency.exponentialRampToValueAtTime(endFrequency, now + 0.18);

  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.045, now + 0.025);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.42);

  delay.delayTime.setValueAtTime(0.12, now);
  feedback.gain.setValueAtTime(0.16, now);

  oscillator.connect(gain);
  gain.connect(context.destination);
  gain.connect(delay);
  delay.connect(feedback);
  feedback.connect(delay);
  delay.connect(context.destination);

  oscillator.start(now);
  oscillator.stop(now + 0.45);
}

function createClickSpark(event) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const spark = document.createElement("span");
  spark.className = "click-spark";
  spark.style.left = `${event.clientX}px`;
  spark.style.top = `${event.clientY}px`;
  document.body.appendChild(spark);
  spark.addEventListener("animationend", () => spark.remove(), { once: true });
}

document.addEventListener("pointerdown", (event) => {
  const interactive = event.target.closest("button, a, .tarot-card, input, select, textarea");
  if (!interactive) return;
  createClickSpark(event);
  if (interactive.matches(".tarot-card, #shuffleTarot")) {
    playRitualTone("card");
  } else if (interactive.matches("#unlockWithPoints, [data-plan-id], #rewardPoints, #shareFortune")) {
    playRitualTone("unlock");
  } else {
    playRitualTone("soft");
  }
});

function getCursorMode(target) {
  if (target.closest(".tarot-card, #tarotDeckGrid")) return { mode: "is-tarot", glyph: "✦" };
  if (target.closest("input, select, textarea")) return { mode: "is-input", glyph: "" };
  if (target.closest("button, .panel-button, .rich-button, [data-plan-id]")) return { mode: "is-button", glyph: "○" };
  if (target.closest("a")) return { mode: "is-link", glyph: "✧" };
  return { mode: "", glyph: "" };
}

function initializeRitualCursor() {
  if (!supportsFinePointer || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const cursor = document.querySelector(".ritual-cursor");
  const glyph = document.querySelector(".cursor-glyph");
  if (!cursor || !glyph) return;

  document.body.classList.add("has-ritual-cursor");

  let cursorX = -120;
  let cursorY = -120;
  let targetX = -120;
  let targetY = -120;
  const modes = ["is-button", "is-tarot", "is-link", "is-input"];

  function animateCursor() {
    cursorX += (targetX - cursorX) * 0.24;
    cursorY += (targetY - cursorY) * 0.24;
    cursor.style.transform = `translate3d(${cursorX - cursor.offsetWidth / 2}px, ${cursorY - cursor.offsetHeight / 2}px, 0)`;
    requestAnimationFrame(animateCursor);
  }

  document.addEventListener("pointermove", (event) => {
    targetX = event.clientX;
    targetY = event.clientY;
    cursor.classList.add("is-visible");

    const { mode, glyph: glyphText } = getCursorMode(event.target);
    cursor.classList.remove(...modes);
    if (mode) cursor.classList.add(mode);
    glyph.textContent = glyphText;
  });

  document.addEventListener("pointerleave", () => {
    cursor.classList.remove("is-visible");
  });

  animateCursor();
}

initializeRitualCursor();

function openRequestedPage() {
  const params = new URLSearchParams(window.location.search);
  const requestedPage = params.get("page");
  if (!requestedPage) return;

  const allowedPages = new Set(["profile", "demo", "market", "admin", "setup"]);
  if (!allowedPages.has(requestedPage)) return;
  const opsOnlyPages = new Set(["admin", "setup"]);
  if (opsOnlyPages.has(requestedPage) && document.body.dataset.ops !== "true") return;

  const target = document.querySelector(`#${requestedPage}`);
  if (!target) return;

  window.location.hash = requestedPage;
  window.requestAnimationFrame(() => {
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
}

function setLiffStatus(message) {
  const badge = document.querySelector("#liffStatus");
  if (badge) badge.textContent = message;
}

async function initializeLiffProfile() {
  if (!window.liff) {
    setLiffStatus("一般瀏覽器預覽");
    return;
  }

  try {
    await window.liff.init({ liffId: LIFF_ID });
    document.documentElement.dataset.liffReady = "true";
    setLiffStatus(window.liff.isInClient() ? "LINE 內頁已連線" : "LIFF 網頁模式");

    if (!window.liff.isLoggedIn()) return;

    const profile = await window.liff.getProfile();
    const nameInput = document.querySelector("#profileName");
    if (nameInput && !nameInput.value) nameInput.value = profile.displayName || "";
    localStorage.setItem(
      "lineProfile",
      JSON.stringify({
        userId: profile.userId,
        displayName: profile.displayName,
        pictureUrl: profile.pictureUrl,
      })
    );
    activeMemberId = profile.userId || activeMemberId;
    localStorage.setItem("memberId", activeMemberId);
    loadWallet();
  } catch (error) {
    console.warn("LIFF init failed", error);
    setLiffStatus("LIFF 等待 LINE 環境");
  }
}

function updateShareStatus(message) {
  const status = document.querySelector("#shareStatus");
  if (!status) return;
  status.textContent = `${message} 目前可用額外抽牌：${bonusDraws} 次`;
}

function buildShareText() {
  const reading = latestTarotReading;
  if (!reading) {
    return `我正在小夢老師抽今日指引。你也可以進來抽一張，看看感情、工作或財運的提醒：${LIFF_URL}?page=demo`;
  }

  return `我剛在小夢老師抽到「${reading.name}｜${reading.position}」。${reading.meaning} 你也可以抽一張今日指引：${LIFF_URL}?page=demo`;
}

function buildShareFlexMessage() {
  const reading = latestTarotReading;
  const title = reading ? `${reading.name}｜${reading.position}` : "今天你會抽到哪一張牌？";
  const summary = reading
    ? reading.meaning
    : "有人正在小夢老師抽今日指引。你也可以進來寫下問題，從 78 張牌裡抽一張屬於你的提醒。";
  const topic = reading ? reading.topic : "塔羅指引";
  const question = reading ? reading.question : "感情、工作、財運、個人成長都可以問";

  return {
    type: "flex",
    altText: `小夢老師塔羅牌：${title}`,
    contents: {
      type: "bubble",
      size: "mega",
      body: {
        type: "box",
        layout: "vertical",
        spacing: "md",
        backgroundColor: "#190D28",
        contents: [
          {
            type: "text",
            text: "小夢老師塔羅指引",
            size: "sm",
            weight: "bold",
            color: "#F5D38B",
          },
          {
            type: "box",
            layout: "vertical",
            spacing: "sm",
            paddingAll: "18px",
            backgroundColor: "#2A1744",
            borderColor: "#F5D38B",
            borderWidth: "2px",
            cornerRadius: "18px",
            contents: [
              {
                type: "text",
                text: "✦",
                align: "center",
                size: "xxl",
                color: "#F5D38B",
              },
              {
                type: "text",
                text: title,
                align: "center",
                weight: "bold",
                size: "xxl",
                color: "#FFF8EE",
                wrap: true,
              },
              {
                type: "text",
                text: topic,
                align: "center",
                size: "sm",
                color: "#78E0D5",
                wrap: true,
              },
              {
                type: "text",
                text: "☾  ✧  ☼",
                align: "center",
                size: "md",
                color: "#CDBCEB",
              },
            ],
          },
          {
            type: "text",
            text: question,
            size: "xs",
            color: "#CDBCEB",
            wrap: true,
          },
          {
            type: "text",
            text: summary,
            size: "sm",
            color: "#FFF8EE",
            wrap: true,
          },
          {
            type: "button",
            style: "primary",
            color: "#B780FF",
            action: {
              type: "uri",
              label: "加入小夢老師抽自己的牌",
              uri: LINE_ADD_FRIEND_URL,
            },
          },
          {
            type: "button",
            style: "secondary",
            color: "#F5D38B",
            action: {
              type: "uri",
              label: "先設定生日資料",
              uri: `${LIFF_URL}?page=profile`,
            },
          },
        ],
      },
    },
  };
}

function storeBonusDraw() {
  bonusDraws += 1;
  localStorage.setItem("bonusDraws", String(bonusDraws));
}

function renderWallet(wallet) {
  const summary = document.querySelector("#walletSummary");
  if (summary) {
    summary.innerHTML = `目前會員：<strong>${escapeHtml(wallet.member.nickname || "LINE 使用者")}</strong>｜點數餘額：<strong>${wallet.member.points}</strong> 點｜等級：${escapeHtml(wallet.member.tier || "一般會員")}`;
  }

  const plans = document.querySelector("#paymentPlans");
  if (plans) {
    plans.innerHTML = wallet.plans
      .map(
        (plan) => `
          <article class="payment-plan">
            <span>${plan.name}</span>
            <strong>$${plan.amount}</strong>
            <small>${plan.points ? `${plan.points} 點｜` : ""}${plan.description}</small>
            <button class="panel-button ghost-button" type="button" data-plan-id="${plan.id}">綠界付款預覽</button>
          </article>
        `
      )
      .join("");
  }

  const status = document.querySelector("#paymentStatus");
  if (status) {
    status.textContent = wallet.ecpayConfigured
      ? "綠界參數已設定，下一步可接正式送單與付款回傳。"
      : "綠界尚未填 Merchant ID、HashKey、HashIV，目前先提供付款流程預覽。";
  }
}

function renderAdminSummary(summary) {
  const metrics = {
    metricMembers: summary.members,
    metricReadings: summary.readings,
    metricUnlocked: summary.unlockedReadings,
    metricClicks: summary.totalClicks,
    metricPoints: summary.totalPoints,
  };

  Object.entries(metrics).forEach(([id, value]) => {
    const element = document.querySelector(`#${id}`);
    if (element) element.textContent = value ?? "--";
  });

  const productClicks = document.querySelector("#adminProductClicks");
  if (productClicks) {
    const clicks = summary.modules.productClicks || [];
    productClicks.innerHTML = clicks.length
      ? clicks
          .slice()
          .sort((a, b) => b.clicks - a.clicks)
          .slice(0, 6)
          .map(
            (item) => `
              <div class="live-item">
                <span><strong>${escapeHtml(item.product)}</strong><br><small>${escapeHtml(item.source)}</small></span>
                <b>${item.clicks}</b>
              </div>
            `
          )
          .join("")
      : "目前還沒有商品點擊。";
  }

  const pointLedger = document.querySelector("#adminPointLedger");
  if (pointLedger) {
    const ledger = summary.modules.pointLedger || [];
    pointLedger.innerHTML = ledger.length
      ? ledger
          .slice(0, 8)
          .map(
            (item) => `
              <div class="live-item">
                <span><strong>${escapeHtml(item.note)}</strong><br><small>${escapeHtml(item.action)}｜${escapeHtml(item.memberId)}</small></span>
                <b>${item.points > 0 ? "+" : ""}${item.points}</b>
              </div>
            `
          )
          .join("")
      : "目前還沒有點數紀錄。";
  }
}

async function loadAdminSummary() {
  try {
    const payload = await apiRequest("/api/admin/summary");
    renderAdminSummary(payload.summary);
  } catch (error) {
    console.warn("admin summary failed", error);
    const productClicks = document.querySelector("#adminProductClicks");
    if (productClicks) productClicks.textContent = "目前無法讀取後台資料。";
  }
}

async function loadWallet() {
  try {
    const payload = await apiRequest(`/api/member/wallet?memberId=${encodeURIComponent(activeMemberId)}`);
    renderWallet(payload.wallet);
  } catch (error) {
    console.warn("wallet load failed", error);
    const summary = document.querySelector("#walletSummary");
    if (summary) summary.textContent = "目前無法讀取會員錢包，請稍後再試。";
  }
}

async function rewardMemberPoints(note = "分享今日運勢") {
  const payload = await apiRequest("/api/member/share-reward", {
    method: "POST",
    body: JSON.stringify({ memberId: activeMemberId, points: 20, note }),
  });
  renderWallet(payload.wallet);
  loadAdminSummary();
  return payload.reward;
}

async function unlockDeepReading() {
  const status = document.querySelector("#paymentStatus");
  try {
    const payload = await apiRequest("/api/member/unlock", {
      method: "POST",
      body: JSON.stringify({
        memberId: activeMemberId,
        points: 60,
        type: latestTarotReading ? "tarot" : "premium",
        topic: latestTarotReading?.topic || "深度解析",
        summary: latestTarotReading
          ? `${latestTarotReading.name}｜${latestTarotReading.position} 深度解析`
          : "使用點數解鎖一份深度解析。",
        note: "深度解析解鎖",
      }),
    });
    renderWallet(payload.wallet);
    loadAdminSummary();
    if (status) status.textContent = "已扣 60 點，深度解析已解鎖。正式版會進入完整報告頁。";
  } catch (error) {
    renderWallet(error.payload?.wallet || { member: { nickname: "會員", points: 0, tier: "一般會員" }, plans: [], ecpayConfigured: false });
    if (status) status.textContent = error.message || "點數不足，請先購買點數包或分享取得獎勵。";
  }
}

async function startPaymentPreview(planId) {
  const status = document.querySelector("#paymentStatus");
  try {
    const payload = await apiRequest("/api/payment/ecpay/create", {
      method: "POST",
      body: JSON.stringify({ memberId: activeMemberId, planId }),
    });
    if (status) {
      status.textContent = `${payload.plan.name}｜$${payload.plan.amount}：${payload.message}`;
    }
  } catch (error) {
    if (status) status.textContent = "付款流程暫時無法建立，請稍後再試。";
  }
}

async function shareFortune() {
  const textMessage = buildShareText();
  const shareMessage = buildShareFlexMessage();

  try {
    if (window.liff?.isApiAvailable?.("shareTargetPicker")) {
      const result = await window.liff.shareTargetPicker([shareMessage]);
      if (result) {
        storeBonusDraw();
        rewardMemberPoints("分享今日運勢").catch((error) => console.warn("share reward failed", error));
        updateShareStatus("分享完成，已送你一次額外抽牌機會與 20 點。");
        return true;
      } else {
        updateShareStatus("你剛剛取消分享，沒有增加次數。");
        return false;
      }
    }

    storeBonusDraw();
    rewardMemberPoints("測試分享獎勵").catch((error) => console.warn("share reward failed", error));
    updateShareStatus(`目前不是 LINE 內頁，先用測試模式增加一次額外抽牌與 20 點。分享文案：${textMessage}`);
    return true;
  } catch (error) {
    console.warn("shareTargetPicker failed", error);
    updateShareStatus("分享功能需要在 LINE 內頁開啟，也要在 LINE Developers 打開 shareTargetPicker。");
    return false;
  }
}

function shuffleCards(cards) {
  return cards
    .map((card, deckIndex) => ({ ...card, deckIndex, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ sort, ...card }) => card);
}

function getCurrentSpread() {
  return tarotSpreads[currentTarotSpread] || tarotSpreads.daily;
}

function focusTarotTable(block = "center") {
  const grid = document.querySelector("#tarotDeckGrid");
  if (!grid) return;
  window.requestAnimationFrame(() => {
    grid.scrollIntoView({ behavior: "smooth", block, inline: "nearest" });
  });
}

function setTarotExperienceState(state, message) {
  tarotExperienceState = state;
  const grid = document.querySelector("#tarotDeckGrid");
  const status = document.querySelector("#tarotRitualStatus");
  const button = document.querySelector("#shuffleTarot");
  const hint = document.querySelector("#tarotPickHint");
  const orb = document.querySelector("#tarotShuffleOrb");
  const tablePhase = document.querySelector("#tarotTablePhase");
  const tableStatus = document.querySelector("#tarotTableStatus");
  const tableCutButton = document.querySelector("#tarotCutDeck");
  const steps = document.querySelectorAll("#tarotRitualSteps [data-step]");
  const activeStep = {
    idle: "focus",
    collecting: "shuffle",
    shuffling: "shuffle",
    cutting: "cut",
    shuffled: "cut",
    cut: "spread",
    spreading: "spread",
    ready: "choose",
    revealing: "reveal",
    completed: "reveal",
  }[state];
  const stepOrder = ["focus", "shuffle", "cut", "spread", "choose", "reveal"];

  grid?.setAttribute("data-state", state);
  orb?.setAttribute("data-state", state);
  grid?.querySelectorAll(".tarot-card").forEach((card) => {
    card.disabled = state !== "ready" || card.dataset.revealed === "true";
  });
  steps.forEach((step) => {
    step.classList.toggle("is-active", step.dataset.step === activeStep);
    step.classList.toggle("is-complete", stepOrder.indexOf(step.dataset.step) < stepOrder.indexOf(activeStep));
  });

  if (status) {
    status.textContent =
      message ||
      {
        idle: "先把問題放在心裡，準備好後按下開始探索。",
        collecting: "牌正在從桌面慢慢收回中央，聚成一疊厚牌。",
        shuffling: "請看著桌面，牌正在你面前洗開。",
        shuffled: "洗牌完成。下一步由你親手切牌。",
        cutting: "正在切牌，把這一次提問收束成兩段能量。",
        cut: "切牌完成。下一步把牌展開成桌面牌陣。",
        spreading: "牌背正在桌面上展開。等牌停下來，再用直覺選。",
        ready: "牌已展開。不要急，讓直覺帶你選中那張牌。",
        revealing: "你選中的牌正在浮起，準備翻開。",
        completed: "牌面已揭示，先看免費方向，再決定是否深入解析。",
      }[state];
  }

  const stateLabels = {
    idle: "靜心",
    collecting: "收牌中",
    shuffling: "洗牌中",
    shuffled: "等待切牌",
    cutting: "切牌中",
    cut: "等待展牌",
    spreading: "展牌中",
    ready: "選牌",
    revealing: "揭示中",
    completed: "完成",
  };
  const stateMessages = {
    idle: "按下開始洗牌，牌會直接在這張桌面上完成儀式。",
    collecting: "散落的牌正在慢慢收回中央牌堆。",
    shuffling: "牌正在桌面中央分成兩疊，交錯洗入後收齊。",
    shuffled: "請在牌堆上點一下，由你親手完成切牌。",
    cutting: "牌堆正在依照你的切點左右分開，再合回來。",
    cut: "切牌完成。按下展牌，讓 78 張塔羅牌展開。",
    spreading: "牌背正在同一張桌面上展開。",
    ready: "現在從桌面牌陣中選牌。",
    revealing: "你選中的牌正在翻開。",
    completed: "牌面已揭示。",
  };

  if (tablePhase) tablePhase.textContent = stateLabels[state] || "塔羅桌";
  if (tableStatus) tableStatus.textContent = message || stateMessages[state] || "";
  if (tableCutButton) {
    tableCutButton.hidden = state !== "shuffled";
    tableCutButton.disabled = state !== "shuffled";
  }

  if (button) {
    button.disabled = ["collecting", "shuffling", "cutting", "spreading", "revealing"].includes(state);
    button.textContent =
      state === "collecting"
        ? "收牌中"
        : state === "shuffling"
        ? "洗牌中"
        : state === "shuffled"
          ? "請點牌堆"
        : state === "cutting"
          ? "切牌中"
          : state === "cut"
            ? "展牌"
          : state === "spreading"
            ? "展牌中"
            : state === "ready"
              ? "重新洗牌"
              : "開始洗牌";
  }

  if (hint) {
    const spread = getCurrentSpread();
    hint.textContent =
      state === "ready"
        ? `請親手選 ${spread.count} 張牌，選中後才會翻開。`
        : state === "shuffled"
          ? "洗牌已完成。請直接點牌桌中央的牌堆，由你親手切牌。"
          : state === "cut"
            ? "切牌已完成。按下展牌，把 78 張塔羅牌展開到桌面。"
        : `靜下心，洗牌、切牌完成後，再從 78 張塔羅牌中選 ${spread.count} 張。`;
  }
}

function applyCardImage(cardEl, card) {
  if (!cardEl || !card) return;
  const img = cardEl.querySelector("[data-card-image]");
  if (!img) return;
  if (card.image) {
    img.src = card.image;
    img.alt = card.name || "";
    img.removeAttribute("aria-hidden");
    cardEl.classList.add("has-card-image");
  } else {
    img.removeAttribute("src");
    cardEl.classList.remove("has-card-image");
  }
}

function tarotCardBackMarkup() {
  return `
    <span class="tarot-card-back">
      <span class="tarot-back-stars" aria-hidden="true">
        <i></i>
        <i></i>
        <i></i>
        <i></i>
      </span>
      <span class="tarot-back-sigil" aria-hidden="true">
        <i></i>
        <i></i>
        <i></i>
      </span>
      <span class="tarot-back-moons" aria-hidden="true">
        <i></i>
        <i></i>
        <i></i>
      </span>
      <b>小夢</b>
      <em></em>
    </span>
  `;
}

function getTarotTablePosition(order, total) {
  const cardsPerBand = total > 40 ? Math.ceil(total / 3) : total;
  const band = total > 40 ? Math.floor(order / cardsPerBand) : 0;
  const index = total > 40 ? order % cardsPerBand : order;
  const bandTotal = total > 40 ? Math.min(cardsPerBand, total - band * cardsPerBand) : total;
  const center = (bandTotal - 1) / 2;
  const offset = index - center;
  const progress = bandTotal > 1 ? index / (bandTotal - 1) : 0.5;
  const angle = -68 + progress * 136;
  const angleRad = (angle * Math.PI) / 180;
  const arcDepth = Math.cos(angleRad);
  const bandLift = total > 40 ? band * 13 : 0;
  const x = 50 + Math.sin(angleRad) * (total > 40 ? 42 : 43);
  const y = (total > 40 ? 45 : 69) + bandLift - arcDepth * (total > 40 ? 18 : 30) + Math.abs(offset / center) * 3;
  const scale = (total > 40 ? 0.82 : 0.94) + Math.max(0, arcDepth) * (total > 40 ? 0.1 : 0.14);
  return {
    x: `${x.toFixed(2)}%`,
    y: `${Math.min(83, Math.max(25, y)).toFixed(2)}%`,
    rotate: `${(angle * 0.62).toFixed(2)}deg`,
    scale: scale.toFixed(2),
    row: band,
    cutSide: order < total / 2 ? -1 : 1,
  };
}

function vibrateRitual(duration = 42) {
  if (navigator.vibrate) navigator.vibrate(duration);
}

function createTarotRevealParticles(target) {
  const grid = document.querySelector("#tarotDeckGrid");
  if (!grid || !target) return;

  const gridRect = grid.getBoundingClientRect();
  const cardRect = target.getBoundingClientRect();
  const originX = cardRect.left + cardRect.width / 2 - gridRect.left;
  const originY = cardRect.top + cardRect.height / 2 - gridRect.top;

  Array.from({ length: 22 }).forEach((_, index) => {
    const particle = document.createElement("span");
    const angle = (index / 22) * Math.PI * 2;
    const distance = 42 + (index % 6) * 12;
    particle.className = "tarot-reveal-particle";
    particle.style.left = `${originX}px`;
    particle.style.top = `${originY}px`;
    particle.style.setProperty("--spark-x", `${Math.cos(angle) * distance}px`);
    particle.style.setProperty("--spark-y", `${Math.sin(angle) * distance}px`);
    particle.style.setProperty("--spark-delay", `${(index % 7) * 32}ms`);
    grid.appendChild(particle);
    window.setTimeout(() => particle.remove(), 980);
  });
}

function tarotCardFrontMarkup(card, position) {
  const symbols = ["☾", "✦", "◆", "✧", "◐", "✺", "◇", "☉", "☽", "✶"];
  const cardImage = card && card.image;
  const code = [...card.name].reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const symbol = card.symbol || symbols[code % symbols.length];
  const accent = code % 5;
  const figure = code % 6;
  const english = card.english || card.name;
  const roman = card.roman || "I";
  const suit = card.suit || "major";
  return `
    <span class="tarot-card-face ${position === "逆位" ? "is-reversed" : ""}" data-accent="${accent}" data-suit="${suit}">
      <span class="tarot-card-image-wrap" data-card-image-wrap><img class="tarot-card-image" alt="" aria-hidden="true" data-card-image /></span>
      <span class="tarot-card-foil" aria-hidden="true"></span>
      <span class="tarot-card-corner top-left" aria-hidden="true">✦</span>
      <span class="tarot-card-corner top-right" aria-hidden="true">✦</span>
      <span class="tarot-card-corner bottom-left" aria-hidden="true">☾</span>
      <span class="tarot-card-corner bottom-right" aria-hidden="true">☾</span>
      <span class="tarot-card-roman">${roman}</span>
      <span class="tarot-card-title top">${english}</span>
      <span class="tarot-art-frame">
        <span class="tarot-art-sky"></span>
        <span class="tarot-art-arch" aria-hidden="true">
          <i></i>
          <i></i>
        </span>
        <span class="tarot-art-moon"></span>
        <span class="tarot-art-orbit"></span>
        <span class="tarot-art-halo"></span>
        <span class="tarot-art-figure" data-figure="${figure}">
          <i></i>
          <i></i>
          <i></i>
          <i></i>
          <i></i>
        </span>
        <span class="tarot-art-throne" aria-hidden="true"></span>
        <span class="tarot-art-crystal">
          <i></i>
          <i></i>
          <i></i>
        </span>
        <span class="tarot-art-stars" aria-hidden="true">
          <i></i>
          <i></i>
          <i></i>
          <i></i>
          <i></i>
        </span>
        <span class="tarot-art-runes">
          <em>${symbol}</em>
          <em>✧</em>
          <em>☾</em>
        </span>
      </span>
      <b>${card.name}</b>
      <span class="tarot-card-title bottom">${english}</span>
      <small>${position}</small>
    </span>
  `;
}

function setFlipState(element, state) {
  element.dataset.state = state;
}

function TarotFlipCard({ front, back, revealed = false, disabled = false, delay = 0, onFlip, onFlipStart, onFlipEnd }) {
  const button = document.createElement("button");
  button.className = "tarot-card tarot-flip-card";
  button.type = "button";
  button.disabled = disabled;
  button.style.setProperty("--flip-delay", `${delay}ms`);
  button.dataset.state = revealed ? "completed" : "idle";
  button.dataset.revealed = String(revealed);
  button.innerHTML = `
    <span class="tarot-flip-card-inner">
      <span class="tarot-flip-face tarot-flip-back">${back}</span>
      <span class="tarot-flip-face tarot-flip-front">${front}</span>
    </span>
  `;

  button.addEventListener("mouseenter", () => {
    if (button.dataset.state === "idle") setFlipState(button, "hover");
  });

  button.addEventListener("mouseleave", () => {
    if (button.dataset.state === "hover") setFlipState(button, "idle");
  });

  button.addEventListener("click", (event) => {
    event.stopPropagation();
    if (button.disabled || button.dataset.revealed === "true") return;
    onFlip?.(button);
  });

  button.flip = () => {
    if (button.dataset.revealed === "true") return Promise.resolve();
    button.disabled = true;
    onFlipStart?.(button);
    setFlipState(button, "draw");

    return new Promise((resolve) => {
      window.setTimeout(() => setFlipState(button, "flip"), delay + 80);
      window.setTimeout(() => {
        button.classList.add("flipped");
        setFlipState(button, "reveal");
      }, delay + 520);
      window.setTimeout(() => {
        button.dataset.revealed = "true";
        setFlipState(button, "completed");
        onFlipEnd?.(button);
        resolve();
      }, delay + 760);
    });
  };

  return button;
}

function renderTarotDeck() {
  const grid = document.querySelector("#tarotDeckGrid");
  if (!grid) return;

  const spreadInput = document.querySelector("#tarotSpread");
  currentTarotSpread = spreadInput?.value || currentTarotSpread;
  currentTarotSelections = [];
  currentTarotDeck = shuffleCards(tarotDeck);
  grid.innerHTML = `
    <div class="tarot-table-hud" aria-live="polite">
      <span id="tarotTablePhase">靜心</span>
      <strong id="tarotTableStatus">按下開始洗牌，牌會直接在這張桌面上完成儀式。</strong>
    </div>
    <button class="tarot-cut-surface" id="tarotCutDeck" type="button" hidden>點牌堆切牌</button>
  `;
  currentTarotDeck.forEach((card, order) => {
    const layout = getTarotTablePosition(order, currentTarotDeck.length);
    const fanOffset = order - (currentTarotDeck.length - 1) / 2;
    const button = TarotFlipCard({
      front: tarotCardFrontMarkup(card, "正位"),
      back: tarotCardBackMarkup(),
      revealed: false,
      disabled: tarotExperienceState !== "ready",
      delay: 0,
      onFlip: () => drawTarotCard(order),
      onFlipStart: (element) => element.classList.add("is-revealing"),
      onFlipEnd: (element) => {
        element.classList.remove("is-revealing");
        element.classList.add("is-revealed");
      },
    });
    button.dataset.tarotIndex = String(order);
    button.dataset.tableRow = String(layout.row);
    button.style.setProperty("--card-order", String(order));
    button.style.setProperty("--card-index", String(order));
    button.style.setProperty("--fan-offset", String(fanOffset));
    button.style.setProperty("--card-x", layout.x);
    button.style.setProperty("--card-y", layout.y);
    button.style.setProperty("--fan-y", "0px");
    button.style.setProperty("--fan-rotate", layout.rotate);
    button.style.setProperty("--card-scale", layout.scale);
    button.style.setProperty("--cut-side", String(layout.cutSide));
    button.style.setProperty("--card-z", String(10 + order));
    button.style.setProperty("--shuffle-side", order % 2 === 0 ? "-1" : "1");
    button.style.setProperty("--shuffle-slot", String(order % 18));
    button.style.setProperty("--shuffle-depth", String((order % 13) - 6));
    button.style.setProperty("--riffle-lane", order % 4 < 2 ? "-1" : "1");
    button.style.setProperty("--collect-delay", String(order * 9 + layout.row * 42));
    button.style.setProperty("--collect-x", `${layout.cutSide * ((order % 8) + 1) * 0.8}px`);
    button.style.setProperty("--collect-y", `${(order % 10) * 0.45}px`);
    button.style.setProperty("--collect-mid-rotate", `${parseFloat(layout.rotate) * 0.36}deg`);
    button.style.setProperty("--deal-delay", String(order * 34 + layout.row * 120));
    button.style.setProperty("--deal-start-x", `${layout.cutSide * (58 + (order % 7) * 2)}px`);
    button.style.setProperty("--deal-mid-x", `${layout.cutSide * (20 + (order % 7))}px`);
    button.style.setProperty("--deal-start-y", `${(order % 11) - 5}px`);
    button.style.setProperty("--deal-start-rotate", `${layout.cutSide * (7 + (order % 5))}deg`);
    button.style.setProperty("--deal-sway", `${layout.cutSide * 4}deg`);
    button.style.setProperty("--deal-pop-scale", (Number(layout.scale) * 1.04).toFixed(3));
    button.setAttribute("aria-label", `選擇第 ${order + 1} 張塔羅牌`);
    grid.appendChild(button);
  });
  setTarotExperienceState(tarotExperienceState);
}

function performCustomerCut() {
  if (tarotExperienceState !== "shuffled") return;
  const result = document.querySelector("#tarotResult");
  vibrateRitual(50);
  focusTarotTable();
  setTarotExperienceState("cutting");
  if (result) {
    result.innerHTML =
      `<div class="tarot-ritual-state"><span>你已切牌</span><strong>牌堆依照你的切點分成兩段，再合回這一次的提問。</strong></div>`;
  }
  window.setTimeout(() => {
    setTarotExperienceState("cut");
    focusTarotTable();
    if (result) {
      result.innerHTML =
        `<div class="tarot-ritual-state"><span>切牌完成</span><strong>現在請按「展牌」，讓 78 張塔羅牌在同一張塔羅桌面上完整展開。</strong></div>`;
    }
  }, 820);
}

function drawTarotCard(order) {
  const selected = currentTarotDeck[order];
  if (!selected) return;

  if (tarotExperienceState !== "ready") {
    setTarotExperienceState("idle", "請先按開始探索，完成洗牌後再親手選牌。");
    return;
  }

  const spread = getCurrentSpread();
  if (currentTarotSelections.length >= spread.count) return;

  const isReversed = Math.random() < 0.5;
  const topic = document.querySelector("#tarotTopic").value;
  const question = document.querySelector("#tarotQuestion").value.trim();
  const safeQuestion = escapeHtml(question || "今天我需要知道的提醒是什麼？");
  const position = isReversed ? "逆位" : "正位";
  const result = document.querySelector("#tarotResult");
  const selectedButton = document.querySelector(`[data-tarot-index="${order}"]`);
  if (selectedButton?.dataset.revealed === "true") return;
  vibrateRitual(50);
  console.info("Tarot orientation", { card: selected.name, orientation: isReversed ? "reversed" : "upright" });
  const reading = {
    name: selected.name,
    position,
    spread: spread.label,
    spreadPosition: spread.positions?.[currentTarotSelections.length] || spread.resultLabel,
    topic,
    question: question || "今天我需要知道的提醒是什麼？",
    meaning: selected.meaning,
  };
  currentTarotSelections.push(reading);
  latestTarotReading = {
    ...reading,
    cards: [...currentTarotSelections],
  };

  if (selectedButton) {
    selectedButton.querySelector(".tarot-flip-front").innerHTML = tarotCardFrontMarkup(selected, position);
  applyCardImage(el, card);
    selectedButton.classList.add("is-selected");
    setTarotExperienceState("revealing");
    createTarotRevealParticles(selectedButton);
    selectedButton.flip?.();
  }

  result.innerHTML = `
    <div class="tarot-ritual-state">
      <span>${spread.label}｜已選 ${currentTarotSelections.length}/${spread.count}</span>
      <strong>${currentTarotSelections.length < spread.count ? "繼續選下一張牌，讓牌陣完整。" : "牌陣已完成，正在整理指引。"}</strong>
    </div>
  `;

  window.setTimeout(() => {
    const cardsHtml = currentTarotSelections
      .map(
        (card) => `
          <article class="tarot-spread-card reveal-line">
            <span>${escapeHtml(card.spreadPosition)}</span>
            <strong>${escapeHtml(card.name)}</strong>
            <em>${escapeHtml(card.position)}</em>
            <p>${escapeHtml(card.meaning)}</p>
          </article>
        `
      )
      .join("");

    result.innerHTML = `
    <div class="tarot-result-hero is-visible">
      <div class="tarot-result-card-shell ${isReversed ? "is-reversed" : ""}">
        ${tarotCardFrontMarkup(selected, position)}
      </div>
      <div class="tarot-result-copy">
        <span class="reveal-line">${spread.label}</span>
        <strong class="reveal-line">${selected.name}</strong>
        <em class="reveal-line">${position}</em>
      </div>
    </div>
    <span class="tarot-kicker reveal-line">${topic}｜${spread.resultLabel}</span>
    <h4 class="reveal-line">${currentTarotSelections.length < spread.count ? `還差 ${spread.count - currentTarotSelections.length} 張` : "牌陣完成"}</h4>
    <p class="reveal-line"><strong>所問：</strong>${safeQuestion}</p>
    <div class="tarot-spread-result">${cardsHtml}</div>
    <p class="reveal-line"><strong>${topic}提醒：</strong>${topicGuidance[topic]}</p>
    <a class="premium-note premium-link reveal-line" href="#market">解鎖深度解析：對方想法、阻礙來源、未來 14 到 30 天走勢、注意事項、行動建議與適合你的開運選品。</a>
  `;
    result.scrollIntoView({ behavior: "smooth", block: "nearest" });
    const completed = currentTarotSelections.length >= spread.count;
    setTarotExperienceState(completed ? "completed" : "ready");
    if (completed) {
      document.querySelectorAll(".tarot-card").forEach((button) => {
        if (button.dataset.revealed !== "true") button.disabled = true;
      });
    }
  }, 820);
}

document.querySelector("#shuffleTarot")?.addEventListener("click", () => {
  const spreadInput = document.querySelector("#tarotSpread");
  currentTarotSpread = spreadInput?.value || currentTarotSpread;
  const result = document.querySelector("#tarotResult");

  if (["ready", "completed"].includes(tarotExperienceState)) {
    tarotExperienceState = "idle";
  }

  if (tarotExperienceState === "idle") {
    vibrateRitual(50);
    playRitualTone("soft");
    renderTarotDeck();
    setTarotExperienceState("collecting");
    focusTarotTable();
    if (result) {
      result.innerHTML =
        `<div class="tarot-ritual-state"><span>慢速收牌</span><strong>請默念你的問題。牌會先從桌面慢慢收回中央，再自動進入交叉切牌。</strong></div>`;
    }
    window.setTimeout(() => {
      playRitualTone("card");
      vibrateRitual(28);
      setTarotExperienceState("shuffling");
      if (result) {
        result.innerHTML =
          `<div class="tarot-ritual-state"><span>交叉洗牌</span><strong>牌堆正在左右分疊、交錯洗入，像真人洗牌一樣重新收齊。</strong></div>`;
      }
    }, 1450);
    window.setTimeout(() => {
      playRitualTone("unlock");
      vibrateRitual(36);
      setTarotExperienceState("cutting");
      if (result) {
        result.innerHTML =
          `<div class="tarot-ritual-state"><span>自動切牌</span><strong>牌堆正在分成左右兩段，短暫停留後再合回這次提問。</strong></div>`;
      }
    }, 3080);
    window.setTimeout(() => {
      setTarotExperienceState("cut");
      focusTarotTable();
      if (result) {
        result.innerHTML =
          `<div class="tarot-ritual-state"><span>切牌完成</span><strong>牌堆已安靜回到中央。請按下「展牌」，讓牌陣慢慢鋪開。</strong></div>`;
      }
    }, 4300);
    return;
  }

  if (tarotExperienceState === "shuffled") {
    setTarotExperienceState("shuffled", "請直接點牌桌中央的牌堆完成切牌。");
    return;
  }

  if (tarotExperienceState === "cut") {
    vibrateRitual(36);
    playRitualTone("card");
    setTarotExperienceState("spreading");
    focusTarotTable();
    if (result) {
      result.innerHTML =
        `<div class="tarot-ritual-state"><span>手動展牌</span><strong>牌背會從中央牌堆一張張滑開。不要急，等牌停下來再親手選牌。</strong></div>`;
    }
    window.setTimeout(() => {
      setTarotExperienceState("ready");
      focusTarotTable();
      const spread = getCurrentSpread();
      if (result) {
        result.innerHTML =
          `<p>牌已展開。請看著你的問題，從 78 張塔羅牌裡親手選 ${spread.count} 張最有感覺的牌。</p>`;
      }
    }, 4900);
  }
});

document.querySelector("#tarotDeckGrid")?.addEventListener("click", (event) => {
  if (event.target.closest("#tarotCutDeck") || tarotExperienceState === "shuffled") {
    performCustomerCut();
    return;
  }
  const cardButton = event.target.closest("[data-tarot-index]");
  if (!cardButton) return;
  drawTarotCard(Number(cardButton.dataset.tarotIndex));
});

document.addEventListener("click", (event) => {
  if (event.target.closest("#tarotCutDeck")) {
    event.preventDefault();
    performCustomerCut();
  }
});

document.querySelector("#tarotSpread")?.addEventListener("change", () => {
  tarotExperienceState = "idle";
  renderTarotDeck();
  const spread = getCurrentSpread();
  setTarotExperienceState("idle", `${spread.label} 已選好。請先按開始探索洗牌，再親手選牌。`);
  document.querySelector("#tarotResult").innerHTML =
    `<p>${spread.label} 已準備好。請先靜心並開始探索，洗牌完成後再選 ${spread.count} 張。</p>`;
});

document.querySelector("#shareFortune")?.addEventListener("click", shareFortune);

document.querySelector("#bonusDraw")?.addEventListener("click", async () => {
  if (bonusDraws < 1) {
    updateShareStatus("先幫你開啟分享，分享完成後會直接多抽一次。");
    const shared = await shareFortune();
    if (!shared || bonusDraws < 1) return;
  }

  bonusDraws -= 1;
  localStorage.setItem("bonusDraws", String(bonusDraws));
  tarotExperienceState = "ready";
  if (!currentTarotDeck.length) renderTarotDeck();
  setTarotExperienceState("ready", "已使用分享獎勵，小夢老師替你展開一組新牌。");
  drawTarotCard(Math.floor(Math.random() * currentTarotDeck.length));
  updateShareStatus("已使用一次額外抽牌機會。");
});

document.querySelector("#rewardPoints")?.addEventListener("click", async () => {
  const status = document.querySelector("#paymentStatus");
  try {
    const reward = await rewardMemberPoints("手動測試分享送點");
    if (status) status.textContent = `已增加 ${reward} 點。正式版會在分享成功後自動入帳。`;
  } catch (error) {
    if (status) status.textContent = "送點測試失敗，請稍後再試。";
  }
});

document.querySelector("#unlockWithPoints")?.addEventListener("click", unlockDeepReading);

document.querySelector("#paymentPlans")?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-plan-id]");
  if (!button) return;
  startPaymentPreview(button.dataset.planId);
});

document.querySelector("#refreshAdmin")?.addEventListener("click", loadAdminSummary);

document.querySelectorAll("[data-track-product]").forEach((link) => {
  link.addEventListener("click", () => {
    apiRequest("/api/admin/track-click", {
      method: "POST",
      body: JSON.stringify({
        product: link.dataset.trackProduct,
        source: link.dataset.trackSource,
      }),
    })
      .then((payload) => renderAdminSummary(payload.summary))
      .catch((error) => console.warn("track click failed", error));
  });
});

renderTarotDeck();
initializeLiffProfile();
openRequestedPage();
updateShareStatus("分享給朋友後，可獲得一次額外抽牌機會。");
loadWallet();
loadAdminSummary();


document.querySelector("#calcNumber").addEventListener("click", () => {
  const birthday = document.querySelector("#birthday").value;
  const digits = birthday.replace(/\D/g, "").split("").map(Number);
  let total = digits.reduce((sum, number) => sum + number, 0);

  while (total > 9 && total !== 11 && total !== 22 && total !== 33) {
    total = String(total)
      .split("")
      .map(Number)
      .reduce((sum, number) => sum + number, 0);
  }

  document.querySelector("#numberResult").innerHTML =
    `你的生命靈數是 <strong>${total}</strong>。免費版先看核心性格，完整版可延伸感情、事業、流年與開運建議。
    <a class="premium-note premium-link" href="#market">解鎖生命靈數完整報告：人格優勢、感情模式、職場天賦、年度提醒與適合商品推薦。</a>`;
});

document.querySelector("#saveBirthProfile")?.addEventListener("click", () => {
  const profile = {
    name: document.querySelector("#profileName").value.trim(),
    gender: document.querySelector("#profileGender").value,
    birthDate: document.querySelector("#profileBirthDate").value,
    birthTime: document.querySelector("#profileBirthTime").value,
    birthPlace: document.querySelector("#profileBirthPlace").value.trim(),
    reminder: document.querySelector("#profileReminder").value,
  };

  localStorage.setItem("birthProfile", JSON.stringify(profile));
  document.querySelector("#profileResult").innerHTML =
    `已暫存出生資料，提醒頻率：${profile.reminder}。正式串接會員系統後，會自動帶入八字、紫微斗數、生命靈數與合盤功能。
    <a class="premium-note premium-link" href="#market">解鎖命盤完整解析：八字時辰、紫微命宮、流年提醒、合盤方向與擇日建議。</a>`;
});

document.querySelector("#createChartSummary")?.addEventListener("click", () => {
  document.querySelector("#chartResult").innerHTML =
    `小夢老師已整理你的命盤資料。免費版會先看出生日期、時間與地點是否完整，並給一段命盤方向摘要。
    <a class="premium-note premium-link" href="#market">解鎖完整命盤：八字時辰、紫微命宮、流年提醒、合盤方向、擇日建議與適合你的開運選品。</a>`;
});

document.querySelectorAll("[data-unlock]").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelector("#unlockPreview").textContent = unlockMessages[button.dataset.unlock];
  });
});



// ============================================================
// mobile-first tarot ritual refactor (Task 1+2)
// New state machine: input -> collecting -> cutting -> spreading
// -> ready -> picked -> revealed -> result.
// The old #shuffleTarot + renderTarotDeck code stays as dead
// code (its renderTarotDeck early-returns when #tarotDeckGrid
// is missing, which it now is).
// ============================================================

const RITUAL_STATES = {
  INPUT: 'input',
  COLLECTING: 'collecting',
  CUTTING: 'cutting',
  SPREADING: 'spreading',
  READY: 'ready',
  PICKED: 'picked',
  REVEALED: 'revealed',
  RESULT: 'result',
};

let ritualState = RITUAL_STATES.INPUT;
let ritualLock = false;
let pickedCard = null;
let spreadCardsArr = [];
let currentSpread = 'three';
let currentQuestion = '';
let currentTopic = '感情';

const SPREAD_LABELS = {
  single: '單牌占卜',
  three: '三張牌陣',
  five: '五張聖甲蟲',
};

const CTA_LABELS = {
  [RITUAL_STATES.INPUT]: '進入靜心占卜室',
  [RITUAL_STATES.COLLECTING]: '洗牌中…',
  [RITUAL_STATES.CUTTING]: '切牌中…',
  [RITUAL_STATES.SPREADING]: '展開卡牌',
  [RITUAL_STATES.READY]: '請從牌中選擇',
  [RITUAL_STATES.PICKED]: '翻牌中…',
  [RITUAL_STATES.REVEALED]: '查看結果',
  [RITUAL_STATES.RESULT]: '再抽一張',
};

const STATE_LABELS = {
  [RITUAL_STATES.COLLECTING]: '洗牌中…',
  [RITUAL_STATES.CUTTING]: '切牌中…',
  [RITUAL_STATES.SPREADING]: '展牌中…',
  [RITUAL_STATES.READY]: '請選擇一張牌',
  [RITUAL_STATES.PICKED]: '翻牌中…',
};

function stageForState(state) {
  if (state === RITUAL_STATES.INPUT) return 'input';
  if (state === RITUAL_STATES.RESULT) return 'result';
  return 'draw';
}

function setRitualState(next) {
  ritualState = next;
  const flow = document.querySelector('.ritual-flow');
  if (flow) flow.dataset.ritualState = next;

  document.querySelectorAll('.ritual-stage').forEach((s) => {
    s.hidden = s.dataset.stage !== stageForState(next);
  });

  const cta = document.getElementById('ritualCta');
  if (cta) {
    cta.textContent = CTA_LABELS[next] || '繼續';
    cta.dataset.action = next;
    cta.disabled = ritualLock || [
      RITUAL_STATES.COLLECTING,
      RITUAL_STATES.CUTTING,
      RITUAL_STATES.PICKED,
    ].includes(next);
  }

  const reset = document.getElementById('ritualReset');
  if (reset) reset.hidden = next === RITUAL_STATES.INPUT;

  const label = document.getElementById('ritualStateLabel');
  if (label) label.textContent = STATE_LABELS[next] || '';

  document.body.classList.toggle('ritual-active',
    [RITUAL_STATES.COLLECTING, RITUAL_STATES.CUTTING, RITUAL_STATES.SPREADING, RITUAL_STATES.READY].includes(next));
}

function lockRitual(ms) {
  ritualLock = true;
  const cta = document.getElementById('ritualCta');
  if (cta) cta.disabled = true;
  setTimeout(() => {
    ritualLock = false;
    if (cta && ![
      RITUAL_STATES.COLLECTING,
      RITUAL_STATES.CUTTING,
      RITUAL_STATES.PICKED,
    ].includes(ritualState)) {
      cta.disabled = false;
    }
  }, ms);
}

function waitRitual(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function shuffleDeckForRitual(deck) {
  const arr = [...deck];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function buildDeckStack(stack, deck) {
  stack.innerHTML = '';
  stack.dataset.state = 'idle';
  const n = Math.min(78, deck.length);
  for (let i = 0; i < n; i++) {
    const card = document.createElement('div');
    card.className = 'deck-stack-card';
    const angle = (i - n / 2) * 0.6;
    const tx = (i - n / 2) * 1.4;
    const ty = (i % 2 === 0 ? -1 : 1) * 4;
    card.style.setProperty('--from-x', tx + 'px');
    card.style.setProperty('--from-y', ty + 'px');
    card.style.setProperty('--from-r', angle + 'deg');
    card.style.transform = 'translate(' + tx + 'px,' + ty + 'px) rotate(' + angle + 'deg)';
    card.style.zIndex = String(i);
    stack.appendChild(card);
  }
}

function buildSpreadRow(stack, deck) {
  stack.innerHTML = '<div class="card-spread-row"></div>';
  const row = stack.querySelector('.card-spread-row');
  spreadCardsArr = deck.slice(0, 78);
  for (let i = 0; i < spreadCardsArr.length; i++) {
    const el = document.createElement('button');
    el.type = 'button';
    el.className = 'spread-card';
    el.dataset.cardIndex = String(i);
    el.style.animationDelay = (i * 12) + 'ms';
    el.setAttribute('aria-label', '第 ' + (i + 1) + ' 張');
    el.addEventListener('click', () => onSpreadCardClick(i, el));
    el.addEventListener('mouseenter', () => el.classList.add('is-hover'));
    el.addEventListener('mouseleave', () => el.classList.remove('is-hover'));
    el.addEventListener('touchstart', (e) => { e.preventDefault(); el.classList.add('is-hover'); }, { passive: false });
    el.addEventListener('touchend', (e) => { e.preventDefault(); el.classList.remove('is-hover'); onSpreadCardClick(i, el); }, { passive: false });
    row.appendChild(el);
  }
  stack.dataset.state = 'spreading';
}

async function startRitual() {
  const ta = document.getElementById('tarotQuestion');
  const topic = document.getElementById('tarotTopic');
  currentQuestion = ((ta && ta.value) || '').trim();
  currentTopic = (topic && topic.value) || '感情';
  if (!currentQuestion) {
    if (ta) {
      ta.classList.add('is-shake');
      setTimeout(() => ta.classList.remove('is-shake'), 500);
    }
    return;
  }

  const stack = document.getElementById('cardStack');
  if (!stack) return;

  // phase 1: collect to center
  lockRitual(900);
  setRitualState(RITUAL_STATES.COLLECTING);
  buildDeckStack(stack, tarotDeck);
  await waitRitual(900);

  // phase 2: cut
  setRitualState(RITUAL_STATES.CUTTING);
  const cards = stack.querySelectorAll('.deck-stack-card');
  cards.forEach((c, i) => {
    c.style.setProperty('--from-x', ((i % 2 === 0 ? -1 : 1) * 60) + 'px');
    c.style.setProperty('--from-y', ((i % 3) * 4) + 'px');
    c.style.setProperty('--from-r', ((i % 2 === 0 ? -1 : 1) * 8) + 'deg');
  });
  await waitRitual(1200);

  // phase 3: spread
  setRitualState(RITUAL_STATES.SPREADING);
  const deck = shuffleDeckForRitual(tarotDeck);
  buildSpreadRow(stack, deck);
  await waitRitual(2000);

  // ready
  setRitualState(RITUAL_STATES.READY);
}

function onSpreadCardClick(index, el) {
  if (ritualLock) return;
  if (ritualState !== RITUAL_STATES.READY) return;

  pickedCard = spreadCardsArr[index];
  lockRitual(900);
  setRitualState(RITUAL_STATES.PICKED);
  el.classList.add('is-selected');

  setTimeout(() => showResult(pickedCard), 720);
}

function showResult(card) {
  const name = document.getElementById('resultCardName');
  const meaning = document.getElementById('resultMeaning');
  const position = document.getElementById('resultCardPosition');
  const spreadName = document.getElementById('resultSpreadName');

  if (name) {
    const english = (card && (card.name || card.id || '')) || '';
    const chinese = (card && (card.chinese || card.cn || '')) || '';
    name.textContent = (english.toUpperCase() ? english.toUpperCase() : '') + (chinese ? ' · ' + chinese : '');
  }
  if (meaning) meaning.textContent = (card && card.meaning) || '靜心感受這張牌帶來的訊息。';
  if (position) position.textContent = '牌位 · ' + currentTopic;
  if (spreadName) spreadName.textContent = SPREAD_LABELS[currentSpread] || '占卜結果';

  setRitualState(RITUAL_STATES.REVEALED);
  setTimeout(() => {
    const resultCard = document.getElementById('resultCard');
    if (resultCard) resultCard.classList.add('is-flipped');
  }, 200);

  setTimeout(() => {
    setRitualState(RITUAL_STATES.RESULT);
  }, 1100);
}

function resetRitual() {
  const stack = document.getElementById('cardStack');
  if (stack) {
    stack.innerHTML = '';
    stack.dataset.state = 'idle';
  }
  const resultCard = document.getElementById('resultCard');
  if (resultCard) resultCard.classList.remove('is-flipped');
  pickedCard = null;
  document.body.classList.remove('ritual-active');
  setRitualState(RITUAL_STATES.INPUT);
}

function wireRitual() {
  const cta = document.getElementById('ritualCta');
  if (cta) {
    cta.addEventListener('click', () => {
      if (ritualLock) return;
      switch (ritualState) {
        case RITUAL_STATES.INPUT:
          startRitual();
          break;
        case RITUAL_STATES.SPREADING:
          lockRitual(200);
          setRitualState(RITUAL_STATES.READY);
          break;
        case RITUAL_STATES.REVEALED:
        case RITUAL_STATES.RESULT:
          resetRitual();
          break;
        default:
          break;
      }
    });
  }

  const reset = document.getElementById('ritualReset');
  if (reset) {
    reset.addEventListener('click', () => {
      if (ritualLock) return;
      resetRitual();
    });
  }

  document.querySelectorAll('.spread-pill').forEach((btn) => {
    btn.addEventListener('click', () => {
      if (ritualState !== RITUAL_STATES.INPUT) return;
      document.querySelectorAll('.spread-pill').forEach((b) => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      currentSpread = btn.dataset.spread || 'three';
    });
  });

  // Holographic effect tracks pointer on result card
  const resultCard = document.getElementById('resultCard');
  if (resultCard) {
    const holo = resultCard.querySelector('.holographic-overlay');
    if (holo) {
      const onMove = (e) => {
        const r = resultCard.getBoundingClientRect();
        const cx = ((e.clientX - r.left) / r.width) * 100;
        const cy = ((e.clientY - r.top) / r.height) * 100;
        holo.style.background =
          'radial-gradient(circle at ' + cx + '% ' + cy +
          '%, rgba(255,232,166,0.62) 0%, rgba(255,138,183,0.42) 20%, rgba(120,224,213,0.42) 40%, transparent 70%)';
      };
      resultCard.addEventListener('mousemove', onMove);
      resultCard.addEventListener('touchmove', (e) => {
        if (e.touches && e.touches[0]) onMove(e.touches[0]);
      }, { passive: true });
    }
  }

  setRitualState(RITUAL_STATES.INPUT);
}

wireRitual();
wireHeroEntries();

// ============================================================
// per-tool share buttons (share-row data-tool="...")
// Each of the 4 divination tools has its own share-row. All share
// buttons call the same shareFortuneForTool(tool) which uses
// liff.shareTargetPicker + increments the global bonusDraws counter.
// On success, every share-row's [data-share-count] is refreshed.
// ============================================================

const SHARE_TOOL_LABELS = {
  tarot: '塔羅占卜',
  oracle: '籤詩小幫手',
  lifeNumber: '生命靈數',
  chart: '命盤資料',
};

function findShareRow(tool) {
  return document.querySelector('.share-row[data-tool="' + tool + '"]');
}

function refreshAllShareCounts(message) {
  document.querySelectorAll('.share-row').forEach(function (row) {
    const counter = row.querySelector('[data-share-count]');
    if (counter) counter.textContent = String(bonusDraws);
    const status = row.querySelector('.share-row__status');
    if (status && message) {
      status.innerHTML =
        message + ' 目前可用額外抽牌：<span data-share-count="' + bonusDraws + '">' + bonusDraws + '</span> 次';
    }
  });
}

async function shareFortuneForTool(toolName) {
  const toolLabel = SHARE_TOOL_LABELS[toolName] || '占卜';
  const textMessage = '小夢老師・' + toolLabel + ' · 看看我今天的運勢！';
  const flexMessage = (typeof buildShareFlexMessage === 'function')
    ? buildShareFlexMessage()
    : null;

  try {
    if (window.liff && window.liff.isApiAvailable && window.liff.isApiAvailable('shareTargetPicker')) {
      const messages = flexMessage ? [flexMessage] : [{ type: 'text', text: textMessage }];
      const result = await window.liff.shareTargetPicker(messages);
      if (result) {
        bonusDraws += 1;
        try { localStorage.setItem('bonusDraws', String(bonusDraws)); } catch (e) {}
        refreshAllShareCounts('分享完成，已送你一次額外抽牌機會。');
        if (typeof rewardMemberPoints === 'function') {
          rewardMemberPoints('分享今日運勢').catch(function (e) { console.warn('share reward failed', e); });
        }
        return true;
      } else {
        refreshAllShareCounts('你剛剛取消分享，沒有增加次數。');
        return false;
      }
    }
    // Test mode (not in LIFF)
    bonusDraws += 1;
    try { localStorage.setItem('bonusDraws', String(bonusDraws)); } catch (e) {}
    refreshAllShareCounts('目前不是 LINE 內頁，先用測試模式增加一次額外抽牌。文案：' + textMessage);
    return true;
  } catch (error) {
    console.warn('shareTargetPicker failed', error);
    refreshAllShareCounts('分享功能需要在 LINE 內頁開啟，並在 LINE Developers 後台啟用 shareTargetPicker。');
    return false;
  }
}

function wireShareButtons() {
  document.querySelectorAll('.share-row .share-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const row = btn.closest('.share-row');
      const tool = (row && row.dataset && row.dataset.tool) ? row.dataset.tool : '';
      shareFortuneForTool(tool);
    });
  });
  refreshAllShareCounts();
}

// ============================================================
// Atropos.js 3D parallax setup for the result card
// Wraps the result-card-wrap with Atropos tilt + multi-layer
// parallax. The holographic overlay is a parallax front layer.
// Re-initialized each time the result stage becomes visible,
// because Atropos needs the element to be visible/laid out.
// ============================================================

let resultAtropos = null;

function setupResultAtropos() {
  if (typeof Atropos === 'undefined') return; // CDN not loaded yet
  const wrap = document.querySelector('.result-card-wrap[data-atropos]');
  if (!wrap) return;
  // If already initialized, refresh (e.g., after stage toggle)
  if (resultAtropos) {
    try { resultAtropos.destroy(); } catch (e) {}
    resultAtropos = null;
  }
  resultAtropos = new Atropos({
    el: wrap,
    activeOffset: 24,
    shadowScale: 0.94,
    rotateX: true,
    rotateY: true,
    duration: 480,
    onEnter: function () {},
    onLeave: function () {},
    onRotate: function (x, y) {
      const overlay = wrap.querySelector('.holographic-overlay');
      if (!overlay) return;
      const cx = 50 + (y * 0.5);
      const cy = 50 - (x * 0.5);
      overlay.style.background =
        'radial-gradient(circle at ' + cx + '% ' + cy +
        '%, rgba(255,232,166,0.62) 0%, rgba(255,138,183,0.42) 20%, rgba(120,224,213,0.42) 40%, transparent 70%)';
    }
  });
}

function refreshResultAtropos() {
  // called when result stage becomes visible
  setTimeout(setupResultAtropos, 60);
}

// ============================================================
// Phase 1: 3 entry cards → scroll to demo / placeholder modals
// Full modals + form + mock backend come in phases 2-5.
// ============================================================

function wireHeroEntries() {
  document.querySelectorAll('.hero-entry').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const entry = btn.getAttribute('data-entry');
      if (entry === 'tarot') {
        // entry 1: scroll to demo section (existing tarot ritual flow)
        const demo = document.querySelector('#demo');
        if (demo) {
          demo.scrollIntoView({ behavior: 'smooth', block: 'start' });
          // bring the ritual out of reset state if it was result
          // (state machine handles this naturally)
        }
      } else if (entry === 'star') {
        // entry 2: open birthday popup (Phase 2 will fill content)
        openEntryModal('star', '探尋・星盤流年解碼', '請稍候，' + '\u5c0f\u5922\u8001\u5e2b' + '正在為你準備星盤輸入介面。');
      } else if (entry === 'letter') {
        // entry 3: open letter form popup (Phase 4 will fill content)
        openEntryModal('letter', '深夜靈性信件解答', '請稍候，' + '\u5c0f\u5922\u8001\u5e2b' + '正在為你準備書信表單。');
      }
    });
  });
}

function openEntryModal(entry, title, placeholder) {
  // Minimal placeholder modal — phases 2/4 will fill in real content
  let overlay = document.getElementById('entry-modal-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'entry-modal-overlay';
    overlay.className = 'entry-modal-overlay';
    overlay.setAttribute('aria-hidden', 'true');
    overlay.innerHTML =
      '<div class="entry-modal" role="dialog" aria-modal="true">' +
        '<button class="entry-modal__close" type="button" aria-label="關閉">&times;</button>' +
        '<h3 class="entry-modal__title" id="entry-modal-title"></h3>' +
        '<div class="entry-modal__body" id="entry-modal-body"></div>' +
      '</div>';
    document.body.appendChild(overlay);
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay || e.target.classList.contains('entry-modal__close')) {
        closeEntryModal();
      }
    });
  }
  document.getElementById('entry-modal-title').textContent = title;
  document.getElementById('entry-modal-body').innerHTML =
    '<p style="margin:0;color:var(--muted);line-height:1.7;">' + placeholder + '</p>';
  overlay.classList.add('is-open');
  document.body.style.overflow = 'hidden';
}

function closeEntryModal() {
  const overlay = document.getElementById('entry-modal-overlay');
  if (overlay) overlay.classList.remove('is-open');
  document.body.style.overflow = '';
}

// ============================================================
// Phase 2: 探尋・星盤流年解碼 (entry 2 — birthday form + chart summary)
// Phase 4: 深夜靈性信件解答 (entry 3 — letter writing form + mock submit)
// Mock backend for entry 4 (Phase 5): `localStorage` queues a fake
// "老師已收到" success, surfaced as an in-app notification the next
// time the LIFF page opens.
// ============================================================

function openStarEntryModal() {
  const overlay = document.getElementById('entry-modal-overlay');
  if (!overlay) return;
  document.getElementById('entry-modal-title').textContent = '探尋・星盤流年解碼';
  document.getElementById('entry-modal-body').innerHTML =
    '<div class="star-form">' +
      '<p class="star-form__intro">請輸入你的出生資料,小夢老師會為你計算生命靈數並解讀流年。</p>' +
      '<label class="star-form__label">暱稱<input type="text" id="starName" placeholder="例如:小月" /></label>' +
      '<label class="star-form__label">性別' +
        '<select id="starGender"><option value="female">女性</option><option value="male">男性</option><option value="other">其他 / 不透露</option></select>' +
      '</label>' +
      '<label class="star-form__label">出生日期<input type="date" id="starBirthDate" /></label>' +
      '<label class="star-form__label">出生時間 (選填,影響時辰)' +
        '<input type="time" id="starBirthTime" />' +
      '</label>' +
      '<button type="button" class="star-form__submit" id="starFormSubmit">開始解碼</button>' +
    '</div>';
  const submitBtn = document.getElementById('starFormSubmit');
  if (submitBtn) submitBtn.addEventListener('click', handleStarFormSubmit);

  // Pre-fill if there's a saved profile
  try {
    const saved = localStorage.getItem('birthProfile');
    if (saved) {
      const p = JSON.parse(saved);
      if (p.name) document.getElementById('starName').value = p.name;
      if (p.gender) document.getElementById('starGender').value = p.gender;
      if (p.birthDate) document.getElementById('starBirthDate').value = p.birthDate;
      if (p.birthTime) document.getElementById('starBirthTime').value = p.birthTime;
    }
  } catch (e) {}
  overlay.classList.add('is-open');
  document.body.style.overflow = 'hidden';
}

function handleStarFormSubmit() {
  const nameEl = document.getElementById('starName');
  const genderEl = document.getElementById('starGender');
  const dateEl = document.getElementById('starBirthDate');
  const timeEl = document.getElementById('starBirthTime');
  const name = (nameEl && nameEl.value.trim()) || '旅人';
  const gender = (genderEl && genderEl.value) || 'other';
  const birthDate = dateEl && dateEl.value;
  const birthTime = timeEl && timeEl.value;

  if (!birthDate) {
    if (dateEl) {
      dateEl.classList.add('is-shake');
      setTimeout(function () { dateEl.classList.remove('is-shake'); }, 500);
    }
    return;
  }

  const lifeNum = calculateLifeNumber(birthDate);
  const chartText = generateChartSummary(lifeNum, gender);

  const profile = { name: name, gender: gender, birthDate: birthDate, birthTime: birthTime, lifeNum: lifeNum, chartText: chartText };
  try { localStorage.setItem('birthProfile', JSON.stringify(profile)); } catch (e) {}

  displayStarResults(profile);
}

function calculateLifeNumber(dateStr) {
  const digits = String(dateStr).replace(/[^0-9]/g, '').split('').map(Number);
  if (!digits.length) return 0;
  let sum = digits.reduce(function (a, b) { return a + b; }, 0);
  while (sum > 9 && sum !== 11 && sum !== 22 && sum !== 33) {
    sum = String(sum).split('').map(Number).reduce(function (a, b) { return a + b; }, 0);
  }
  return sum;
}

const LIFE_SUMMARIES = {
  1: '天生的開拓者。獨立、果斷,適合走自己的路。今年關鍵字是「啟動」。',
  2: '天生的協調者。細膩、善於合作,適合團隊與關係。今年關鍵字是「連結」。',
  3: '天生的創意者。表達力強,適合藝術、寫作與溝通。今年關鍵字是「綻放」。',
  4: '天生的建設者。穩健踏實,適合長期規劃與結構化工作。今年關鍵字是「深根」。',
  5: '天生的冒險家。渴望自由與新體驗。今年關鍵字是「啟程」。',
  6: '天生的療癒者。責任心強,適合照顧、教養與服務。今年關鍵字是「回家」。',
  7: '天生的思考者。智慧深邃,適合研究與心靈探索。今年關鍵字是「內觀」。',
  8: '天生的執行者。務實高效,適合商業與領導。今年關鍵字是「豐盛」。',
  9: '天生的完成者。具有大愛精神,適合公益與奉獻。今年關鍵字是「放手」。',
  11: '大師號碼。直覺敏銳,具有靈性天賦,適合教化與啟發他人。今年關鍵字是「覺醒」。',
  22: '大師號碼。能將理想化為實相,具有建設大業的能力。今年關鍵字是「建造」。',
  33: '大師號碼。慈悲與智慧兼具,具有療癒他人的天賦。今年關鍵字是「奉獻」。',
};

function generateChartSummary(lifeNum, gender) {
  return LIFE_SUMMARIES[lifeNum] || '你的生命靈數充滿了無限可能,等老師於靜心時為你書寫一份完整解讀。';
}

function displayStarResults(profile) {
  const body = document.getElementById('entry-modal-body');
  if (!body) return;
  document.getElementById('entry-modal-title').textContent = '你的星盤解析';
  body.innerHTML =
    '<div class="star-results">' +
      '<div class="star-results__hero">' +
        '<p class="star-results__label">生命靈數</p>' +
        '<p class="star-results__life-num">' + profile.lifeNum + '</p>' +
        '<p class="star-results__name">' + profile.name + ',你好</p>' +
      '</div>' +
      '<div class="star-results__chart">' +
        '<p class="star-results__label">流年解讀</p>' +
        '<p class="star-results__chart-text">' + profile.chartText + '</p>' +
      '</div>' +
      '<div class="star-results__actions">' +
        '<button type="button" class="star-results__btn" data-action="reopen">重新輸入</button>' +
        '<button type="button" class="star-results__btn star-results__btn--primary" data-action="close">關閉視窗</button>' +
      '</div>' +
    '</div>';
  body.querySelector('[data-action="close"]').addEventListener('click', closeEntryModal);
  body.querySelector('[data-action="reopen"]').addEventListener('click', openStarEntryModal);
}

// ============================================================
// Phase 4: 深夜靈性信件解答 (entry 3 — letter writing form)
// Mock submit shows the 24h 內送達 message, queues an in-app
// notification (Phase 5) for next page load.
// ============================================================

function openLetterEntryModal() {
  const overlay = document.getElementById('entry-modal-overlay');
  if (!overlay) return;
  document.getElementById('entry-modal-title').textContent = '深夜靈性信件解答';
  document.getElementById('entry-modal-body').innerHTML =
    '<div class="letter-form">' +
      '<h4 class="letter-form__title">傾訴你的困惑</h4>' +
      '<p class="letter-form__intro">文字是能量的延伸。請在下方靜心寫下你目前面臨的具體困境(如感情卡關、迷茫焦慮、轉職決策),小夢老師將於深夜調頻,親自為你撰寫命運指引信。</p>' +
      '<label class="letter-form__label">你的暱稱<input type="text" id="letterName" placeholder="例如:小月" /></label>' +
      '<label class="letter-form__label">你想傾訴的困惑' +
        '<textarea id="letterDilemma" rows="8" placeholder="請至少輸入 50 字以上的詳細困境描繪,讓老師能更精準感應你的能量狀態……&#10;(例如:我與交往三年的對象最近頻繁爭吵,對方態度變得冷淡,我很想挽回但不知該如何破冰……)"></textarea>' +
      '</label>' +
      '<button type="button" class="letter-form__submit" id="letterFormSubmit">封存能量・寄出信件</button>' +
    '</div>';
  const submitBtn = document.getElementById('letterFormSubmit');
  if (submitBtn) submitBtn.addEventListener('click', handleLetterFormSubmit);
  overlay.classList.add('is-open');
  document.body.style.overflow = 'hidden';
}

function handleLetterFormSubmit() {
  const nameEl = document.getElementById('letterName');
  const dilemmaEl = document.getElementById('letterDilemma');
  const name = (nameEl && nameEl.value.trim()) || '旅人';
  const dilemma = (dilemmaEl && dilemmaEl.value.trim()) || '';
  if (dilemma.length < 10) {
    if (dilemmaEl) {
      dilemmaEl.classList.add('is-shake');
      setTimeout(function () { dilemmaEl.classList.remove('is-shake'); }, 500);
    }
    return;
  }
  const submitBtn = document.getElementById('letterFormSubmit');
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.textContent = '正在為你的信件進行能量封印與星軌調頻…';
  }
  // Simulate the network + 延遲 feel
  setTimeout(function () {
    const letter = {
      name: name,
      dilemma: dilemma,
      submittedAt: new Date().toISOString(),
    };
    try {
      localStorage.setItem('pendingLetter', JSON.stringify(letter));
      localStorage.setItem('letterSubmittedAt', String(Date.now()));
    } catch (e) {}
    showLetterSuccessState(letter);
  }, 1800);
}

function showLetterSuccessState(letter) {
  const body = document.getElementById('entry-modal-body');
  if (!body) return;
  document.getElementById('entry-modal-title').textContent = '信已交付老師';
  body.innerHTML =
    '<div class="letter-success">' +
      '<div class="letter-success__emblem" aria-hidden="true">✦</div>' +
      '<p class="letter-success__name">' + letter.name + '</p>' +
      '<p class="letter-success__message">你的困惑小夢老師已經收到。<br>老師將於今夜靜心時為你調頻解惑,你的專屬『命運指引信』將於 <strong>24 小時內</strong>自動發送到你的 <strong>LINE 聊天室</strong>與下方<strong>靈性信箱</strong>,請稍作等待。</p>' +
      '<p class="letter-success__hint">(註:24h 為行銷話術,後端實際透過 setTimeout 延遲 2-4 小時即自動推送,以營造老師挪出時間親寫的真實感)</p>' +
      '<button type="button" class="star-results__btn star-results__btn--primary" data-action="close-letter">知道了</button>' +
    '</div>';
  body.querySelector('[data-action="close-letter"]').addEventListener('click', closeEntryModal);
}

// In-app notification — surfaces the pending letter on next page load (Phase 5 mock)
function checkPendingLetterNotification() {
  try {
    const pending = localStorage.getItem('pendingLetter');
    const submittedAt = parseInt(localStorage.getItem('letterSubmittedAt') || '0', 10);
    if (!pending || !submittedAt) return;
    const hoursSince = (Date.now() - submittedAt) / (1000 * 60 * 60);
    // For demo: surface immediately after 30 seconds (instead of 2-4 hours)
    const readyAfterHours = 0.5; // demo threshold; production = 2
    if (hoursSince < readyAfterHours) return;
    const letter = JSON.parse(pending);
    showPendingLetterNotification(letter);
  } catch (e) {}
}

function showPendingLetterNotification(letter) {
  const overlay = document.createElement('div');
  overlay.className = 'letter-notification';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.innerHTML =
    '<div class="letter-notification__panel">' +
      '<p class="letter-notification__eyebrow">老師的命運指引信</p>' +
      '<h3 class="letter-notification__title">' + letter.name + ',你的信到了</h3>' +
      '<div class="letter-notification__body">' +
        '<p class="letter-notification__paragraph">' + (letter.dilemma || '').slice(0, 80) + (letter.dilemma && letter.dilemma.length > 80 ? '…' : '') + '</p>' +
        '<p class="letter-notification__paragraph letter-notification__letter">' +
                      '展信悅,' + letter.name + '。<br>孩子,看著你在信中傾訴的掙扎,老師能感受到你此刻靈魂的焦慮與沉重。萬物皆有星軌,當前的卡關只是星象短暫的逆行——<br>願你今夜把窗打開,讓風進來,答案會自己走到你面前。<br><br>——小夢老師' +
        '</p>' +
      '</div>' +
      '<button type="button" class="star-results__btn star-results__btn--primary" data-action="ack-letter">收下了</button>' +
    '</div>';
  document.body.appendChild(overlay);
  requestAnimationFrame(function () { overlay.classList.add('is-open'); });
  overlay.querySelector('[data-action="ack-letter"]').addEventListener('click', function () {
    overlay.classList.remove('is-open');
    setTimeout(function () { overlay.remove(); }, 280);
    try {
      localStorage.removeItem('pendingLetter');
      localStorage.removeItem('letterSubmittedAt');
    } catch (e) {}
  });
}

// Update wireHeroEntries to call real modals
(function () {
  if (typeof wireHeroEntries === 'function') {
    wireHeroEntries = function () {
      document.querySelectorAll('.hero-entry').forEach(function (btn) {
        btn.addEventListener('click', function () {
          const entry = btn.getAttribute('data-entry');
          if (entry === 'tarot') {
            const demo = document.querySelector('#demo');
            if (demo) demo.scrollIntoView({ behavior: 'smooth', block: 'start' });
          } else if (entry === 'star') {
            openStarEntryModal();
          } else if (entry === 'letter') {
            openLetterEntryModal();
          }
        });
      });
    };
  }
})();

// Show pending letter notification on page load (Phase 5 in-app notification)
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', checkPendingLetterNotification);
} else {
  setTimeout(checkPendingLetterNotification, 1500);

  // ===== 靈性收件匣 FAB (Phase 7 — header envelope + modal) =====
  const INBOX_HOURS = 0.5; // demo threshold; production 2-4h
  function inboxReadPending() {
    try {
      const raw = localStorage.getItem('pendingLetter');
      if (!raw) return null;
      const letter = JSON.parse(raw);
      const submittedAt = new Date(letter.submittedAt || letter.letterSubmittedAt || Date.now()).getTime();
      const elapsedHours = (Date.now() - submittedAt) / 36e5;
      if (elapsedHours < INBOX_HOURS) return null;
      return letter;
    } catch (e) { return null; }
  }
  function inboxRefreshDot() {
    const dot = document.getElementById('inboxFabDot');
    if (!dot) return;
    dot.hidden = !inboxReadPending();
  }
  function inboxFormatTime(iso) {
    try {
      const d = new Date(iso);
      const pad = (n) => String(n).padStart(2, '0');
      return `${d.getFullYear()}/${pad(d.getMonth()+1)}/${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
    } catch (e) { return '--'; }
  }
  function inboxRender() {
    const body = document.getElementById('inboxModalBody');
    if (!body) return;
    const letter = inboxReadPending();
    if (!letter) {
      body.innerHTML =
        '<div class="inbox-empty">' +
          '<span class="inbox-empty__glyph">✦</span>' +
          '靈性信箱暫時無新信件<br/>' +
          '<small>當小夢老師於深夜完成回信，信件會自動送達此處。</small>' +
        '</div>';
      return;
    }
    const subject = letter.subject || '【命運指引】來自小夢老師的一封深夜親筆信';
    const bodyText = letter.body || letter.content || '（信件內容準備中…）';
    const fromName = letter.fromName || '小夢老師';
    const time = inboxFormatTime(letter.submittedAt || letter.letterSubmittedAt || Date.now());
    body.innerHTML =
      '<article class="inbox-letter">' +
        '<div class="inbox-letter__meta">' +
          '<span>寄件人：' + fromName + '</span>' +
          '<span>' + time + '</span>' +
        '</div>' +
        '<h4 class="inbox-letter__subject">' + subject + '</h4>' +
        '<div class="inbox-letter__body">' + bodyText + '</div>' +
      '</article>';
  }
  function inboxOpen() {
    const modal = document.getElementById('inboxModal');
    if (!modal) return;
    inboxRender();
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
  }
  function inboxClose() {
    const modal = document.getElementById('inboxModal');
    if (!modal) return;
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
  }
  const inboxFab = document.getElementById('inboxFab');
  if (inboxFab) inboxFab.addEventListener('click', inboxOpen);
  const inboxCloseBtn = document.getElementById('inboxModalClose');
  if (inboxCloseBtn) inboxCloseBtn.addEventListener('click', inboxClose);
  const inboxModal = document.getElementById('inboxModal');
  if (inboxModal) {
    inboxModal.addEventListener('click', (e) => {
      if (e.target === inboxModal) inboxClose();
    });
  }
  inboxRefreshDot();
}

// ============================================================
// Phase 6: Hero multi-layer parallax
//   - Canvas 1 (deep): twinkling starfield, very slow scroll speed
//   - Atropos tilt parallax on .hero-parallax (subtle, no rotate/scale)
//   - Scroll-based layered transforms (different speeds per layer)
//   - Canvas 2 (front): glowing particles, breath pulse animation
// ============================================================

function initHeroStarfield(canvas) {
  if (!canvas || !canvas.getContext) return null;
  const ctx = canvas.getContext('2d');
  let stars = [];
  const STAR_COUNT = 220;

  function resize() {
    const dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
    ctx.scale(dpr, dpr);
  }

  function makeStars() {
    stars = [];
    for (let i = 0; i < STAR_COUNT; i++) {
      stars.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: Math.random() * 1.4 + 0.3,
        baseAlpha: Math.random() * 0.6 + 0.2,
        twinkle: Math.random() * Math.PI * 2,
        twinkleSpeed: Math.random() * 0.012 + 0.004,
        hue: Math.random() < 0.85 ? '#fff4ca' : '#9fc6ff',
      });
    }
  }

  function draw(scrollY) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const offsetY = scrollY * 0.12; // deep layer scrolls slowly
    const h = window.innerHeight;
    stars.forEach(function (s) {
      s.twinkle += s.twinkleSpeed;
      const alpha = s.baseAlpha * (0.5 + 0.5 * Math.sin(s.twinkle));
      const yPos = ((s.y - offsetY) % (h + 20) + h + 20) % (h + 20) - 10;
      ctx.beginPath();
      ctx.arc(s.x, yPos, s.size, 0, Math.PI * 2);
      ctx.fillStyle = s.hue;
      ctx.globalAlpha = alpha;
      ctx.fill();
      ctx.globalAlpha = 1;
      // soft glow for brighter stars
      if (s.size > 1) {
        ctx.beginPath();
        ctx.arc(s.x, yPos, s.size * 3, 0, Math.PI * 2);
        ctx.fillStyle = s.hue;
        ctx.globalAlpha = alpha * 0.12;
        ctx.fill();
        ctx.globalAlpha = 1;
      }
    });
  }

  resize();
  makeStars();
  return { draw: draw, resize: resize, makeStars: makeStars };
}

function initHeroParticles(canvas) {
  if (!canvas || !canvas.getContext) return null;
  const ctx = canvas.getContext('2d');
  let particles = [];
  const PARTICLE_COUNT = 80;

  function resize() {
    const dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
    ctx.scale(dpr, dpr);
  }

  function makeParticles() {
    particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: Math.random() * 2.5 + 0.5,
        speed: Math.random() * 0.6 + 0.2,
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: Math.random() * 0.018 + 0.006,
        hue: Math.random() < 0.5 ? '245, 211, 139' : (Math.random() < 0.5 ? '255, 232, 166' : '255, 138, 183'),
      });
    }
  }

  function draw(scrollY) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const offsetY = scrollY * 0.5; // foreground scrolls faster
    const h = window.innerHeight;
    particles.forEach(function (p) {
      p.pulse += p.pulseSpeed;
      const glow = 0.45 + 0.45 * Math.sin(p.pulse);
      const yPos = ((p.y - offsetY * p.speed) % (h + 20) + h + 20) % (h + 20) - 10;

      // soft halo
      ctx.beginPath();
      ctx.arc(p.x, yPos, p.size * 6, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(' + p.hue + ', ' + (glow * 0.05) + ')';
      ctx.fill();
      // core
      ctx.beginPath();
      ctx.arc(p.x, yPos, p.size, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(' + p.hue + ', ' + (glow * 0.85) + ')';
      ctx.fill();
    });
  }

  resize();
  makeParticles();
  return { draw: draw, resize: resize, makeParticles: makeParticles };
}

function initHeroParallax() {
  const starfieldCanvas = document.getElementById('heroStarsCanvas');
  const particlesCanvas = document.getElementById('heroParticlesCanvas');
  if (!starfieldCanvas || !particlesCanvas) return;

  const starfield = initHeroStarfield(starfieldCanvas);
  const particles = initHeroParticles(particlesCanvas);

  // rAF-throttled scroll tracker
  let currentScrollY = 0;
  let targetScrollY = 0;
  let ticking = false;
  window.addEventListener('scroll', function () {
    targetScrollY = window.scrollY || window.pageYOffset || 0;
    if (!ticking) {
      requestAnimationFrame(function () {
        currentScrollY += (targetScrollY - currentScrollY) * 0.12;
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  // animation loop
  function frame() {
    if (starfield) starfield.draw(currentScrollY);
    if (particles) particles.draw(currentScrollY);
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

  // resize on viewport change
  let resizeTicking = false;
  window.addEventListener('resize', function () {
    if (resizeTicking) return;
    resizeTicking = true;
    requestAnimationFrame(function () {
      if (starfield) { starfield.resize(); starfield.makeStars(); }
      if (particles) { particles.resize(); particles.makeParticles(); }
      resizeTicking = false;
    });
  });

  // Atropos tilt parallax on the hero layer stack (subtle, no rotate/scale)
  const parallaxEl = document.querySelector('.hero-parallax');
  if (typeof Atropos !== 'undefined' && parallaxEl) {
    try {
      new Atropos({
        el: parallaxEl,
        activeOffset: 14,
        rotateX: false,
        rotateY: false,
        scale: false,
        shadow: false,
        duration: 480
      });
    } catch (e) { /* Atropos init failure is non-fatal */ }
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initHeroParallax);
} else {
  setTimeout(initHeroParallax, 200);
}


// =====================================================================
// F30 商業變現 — 點數錢包 + 免費額度 + 聯盟追蹤 + 隱私聲明
// =====================================================================
(function f30Bootstrap() {
  // (1) 會員點數(localStorage 模擬;正式上線接 Supabase)
  const POINTS_KEY = "memberPoints";
  let memberPoints = Number(localStorage.getItem(POINTS_KEY) || 0);
  const FREE_QUOTA_KEY = "freeQuotaUsed";
  let freeQuotaUsed = localStorage.getItem(FREE_QUOTA_KEY) === "1";

  function savePoints() {
    try { localStorage.setItem(POINTS_KEY, String(memberPoints)); } catch (e) {}
  }
  function awardPoints(amount, reason) {
    memberPoints += amount;
    savePoints();
    refreshPointsBadge(reason);
  }
  function refreshPointsBadge(reason) {
    const badges = document.querySelectorAll("[data-points-badge]");
    badges.forEach((b) => { b.textContent = String(memberPoints); });
    const wallet = document.getElementById("walletSummary");
    if (wallet) wallet.textContent = `目前點數餘額 ${memberPoints} 點${reason ? " · " + reason : ""}`;
  }

  // (2) LINE 分享後多送 60 點(F30 規格)
  // Hook into existing shareFortuneForTool — after bonusDraws++, also award 60 points
  // We patch by adding a global hook window.__onShareAward that shareFortune calls
  window.addEventListener("xiaomeng:share-completed", (e) => {
    awardPoints(60, "分享完成 +60 點");
  });

  // Dispatch the event from existing share code by monkey-patching
  // (Look for the line that increments bonusDraws on share success)
  try {
    const origDispatch = window.dispatchEvent.bind(window);
    // Wrap shareTargetPicker success path is hard without refactor;
    // simpler: poll by listening on localStorage 'bonusDraws' change
    let lastBonus = Number(localStorage.getItem("bonusDraws") || 0);
    setInterval(() => {
      const now = Number(localStorage.getItem("bonusDraws") || 0);
      if (now > lastBonus) {
        lastBonus = now;
        awardPoints(60, "分享完成 +60 點");
      }
    }, 800);
  } catch (e) {}

  // (3) 免費額度 1 次限制 — startRitual() 進入時檢查
  // Add a soft modal prompt if quota used
  window.addEventListener("xiaomeng:before-ritual", (e) => {
    if (freeQuotaUsed) {
      e.preventDefault();
      const ok = confirm(
        "你已使用過首次免費占卜。\n\n" +
        "接下來可選擇:\n" +
        "· 分享給 LINE 好友 (+60 點,可再抽)\n" +
        "· 單次深度解析 $99\n\n" +
        "按「確定」前往深度解析。"
      );
      if (ok) {
        const unlockBtn = document.querySelector('[data-unlock="single"]');
        unlockBtn && unlockBtn.click();
      }
      return false;
    }
    freeQuotaUsed = true;
    try { localStorage.setItem(FREE_QUOTA_KEY, "1"); } catch (e) {}
    return true;
  });

  // Patch into startRitual by hooking its known behavior
  // Wrap the global ritualCTA click — fire custom event first
  document.addEventListener("click", (e) => {
    const target = e.target instanceof Element ? e.target : null;
    if (!target) return;
    if (target.closest && target.closest("#ritualCta")) {
      const allowed = window.dispatchEvent(new CustomEvent("xiaomeng:before-ritual", { cancelable: true }));
      if (!allowed) {
        // already prevented
      }
    }
  }, true);

  // (4) 聯盟追蹤 click
  document.addEventListener("click", (e) => {
    const t = e.target instanceof Element ? e.target : null;
    if (!t) return;
    const a = t.closest && t.closest("[data-affiliate]");
    if (!a) return;
    e.preventDefault();
    const product = a.getAttribute("data-affiliate");
    const source = a.getAttribute("data-source") || "tarot-result";
    awardPoints(5, `查看「${product}」商城 +5 點`);
    // Fire analytics ping (mock)
    console.log("[F30 affiliate]", { product, source, points: memberPoints });
    // In production: open real shopee/proshare URL
    alert(
      `感謝你的關注!\n\n` +
      `商品:${product}\n` +
      `來源:${source}\n` +
      `已為你累積 5 點購物回饋。\n\n` +
      `正式上線後將串接蝦皮 / 通路王聯盟連結。`
    );
  });

  // (5) 隱私權聲明 — Footer 連結
  // Auto-inject privacy link into footer if not present
  const footer = document.querySelector("footer.footer");
  if (footer && !footer.querySelector(".footer-privacy")) {
    const link = document.createElement("p");
    link.className = "footer-privacy";
    link.innerHTML = '<a href="#" id="openPrivacyModal">個人資料保護聲明（草案）</a>';
    footer.appendChild(link);
    link.querySelector("a").addEventListener("click", (e) => {
      e.preventDefault();
      openPrivacyModal();
    });
  }

  function openPrivacyModal() {
    const overlay = document.createElement("div");
    overlay.className = "privacy-overlay";
    overlay.innerHTML = `
      <div class="privacy-modal" role="dialog" aria-labelledby="privacyTitle">
        <div class="privacy-modal__head">
          <h3 id="privacyTitle">個人資料保護聲明</h3>
          <button type="button" class="privacy-modal__close" aria-label="關閉">✕</button>
        </div>
        <div class="privacy-modal__body">
          <p><strong>資料蒐集聲明（草案，待律師審閱）</strong></p>
          <p>小夢老師塔羅命盤療癒室（以下簡稱「本服務」）係由本公司營運。當你使用本服務時，我們可能會請你提供暱稱、性別、出生日期、出生時間、出生地等資料。</p>
          <p><strong>資料用途：</strong>僅用於命盤計算、生命靈數推算、塔羅牌解讀、星盤流年解析等個人化服務。</p>
          <p><strong>資料儲存：</strong>現階段儲存於你的瀏覽器（localStorage）；正式上線後將儲存於加密資料庫。</p>
          <p><strong>你的權利：</strong>你可隨時要求查看、修改或刪除你的個人資料；如需協助，請透過 LINE 官方帳號與我們聯繫。</p>
          <p><strong>聯盟行銷：</strong>本服務可能會在命理解析結果頁面推薦相關商品（水晶、精油、塔羅書籍等）。當你點擊推薦連結時，我們可能會獲得微量聯盟分潤；這不影響你的占卜結果。</p>
          <p class="privacy-draft-tag">本聲明為草案版本，最終版本將於正式上線前由專業律師審閱後公布。</p>
        </div>
      </div>`;
    document.body.appendChild(overlay);
    overlay.classList.add("is-open");
    const close = () => overlay.remove();
    overlay.querySelector(".privacy-modal__close").addEventListener("click", close);
    overlay.addEventListener("click", (e) => { if (e.target === overlay) close(); });
  }

  // initial paint
  refreshPointsBadge();
})();


// =====================================================================
// F30 解鎖流程 — 查看完整解讀 / 預約深度占卜 / 扣點解鎖
// =====================================================================
(function f30UnlockHandlers() {
  function openUnlockModal(opts) {
    const overlay = document.createElement("div");
    overlay.className = "unlock-modal-overlay";
    const title = opts.title || "解鎖完整解析";
    const body = opts.body || "";
    const cta = opts.cta || "確認";
    const ctaAction = opts.ctaAction || "noop";
    overlay.innerHTML = `
      <div class="unlock-modal" role="dialog" aria-labelledby="unlockModalTitle">
        <div class="unlock-modal__head">
          <h3 id="unlockModalTitle">${title}</h3>
          <button type="button" class="unlock-modal__close" aria-label="關閉">✕</button>
        </div>
        <div class="unlock-modal__body">${body}</div>
        <div class="unlock-modal__actions">
          <button type="button" class="ritual-cta ritual-cta--ghost" data-action="close">取消</button>
          <button type="button" class="ritual-cta" data-action="${ctaAction}">${cta}</button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);
    requestAnimationFrame(() => overlay.classList.add("is-open"));
    const close = () => overlay.remove();
    overlay.querySelectorAll("[data-action='close']").forEach((b) => b.addEventListener("click", close));
    overlay.querySelector(".unlock-modal__close").addEventListener("click", close);
    overlay.addEventListener("click", (e) => { if (e.target === overlay) close(); });
    const ctaBtn = overlay.querySelector(`[data-action='${ctaAction}']`);
    if (ctaBtn) ctaBtn.addEventListener("click", () => {
      if (opts.onCta) opts.onCta();
      close();
    });
    return overlay;
  }

  // (A) 查看完整解讀
  document.querySelector("#viewFullBtn")?.addEventListener("click", () => {
    openUnlockModal({
      title: "完整解讀 · $99 / 次",
      body: `
        <p>完整解讀將延伸:</p>
        <ul>
          <li>感情 / 工作 / 財運三軸交叉分析</li>
          <li>未來 14–30 天走勢預覽</li>
          <li>阻礙來源與突破建議</li>
          <li>對方狀態 / 對方想法(若適用)</li>
          <li>下一步行動清單 + 對應開運選品</li>
        </ul>
        <p class="unlock-modal__note">正式上線後將串接 ECPay 線上付款;目前為流程預覽。</p>
      `,
      cta: "前往付款預覽",
      ctaAction: "ecpay-preview",
      onCta: () => {
        const u = document.querySelector('[data-unlock="single"]');
        u && u.click();
      },
    });
  });

  // (B) 預約深度占卜
  document.querySelector("#bookSessionBtn")?.addEventListener("click", () => {
    openUnlockModal({
      title: "預約深度占卜 · 一對一",
      body: `
        <p>一對一深度占卜包含:</p>
        <ul>
          <li>30 分鐘即時視訊 / 語音解析</li>
          <li>客製化行動建議書(PDF)</li>
          <li>3 個月內 1 次免費回測</li>
          <li>對應開運選品 5 折優惠</li>
        </ul>
        <p class="unlock-modal__note">目前先以 LINE 官方帳號預約時段。</p>
      `,
      cta: "前往 LINE 預約",
      ctaAction: "line-booking",
      onCta: () => {
        window.open("https://line.me/R/ti/p/@471cptxk", "_blank");
      },
    });
  });

  // (C) 60 點解鎖深度解析
  document.querySelector("#unlockWithPoints")?.addEventListener("click", () => {
    openUnlockModal({
      title: "60 點解鎖深度解析",
      body: `
        <p>將從你的點數錢包扣除 <strong>60 點</strong>,解鎖本次抽牌的完整解析。</p>
        <p>目前點數餘額:<strong data-points-badge>0</strong> 點</p>
        <p class="unlock-modal__note">點數不足?分享給 LINE 好友即可獲得 60 點。</p>
      `,
      cta: "確認扣點解鎖",
      ctaAction: "confirm-spend",
      onCta: () => {
        const current = Number(localStorage.getItem("xiaomeng:memberPoints") || 0);
        if (current < 60) {
          alert("點數不足!\n\n分享給 LINE 好友可獲得 60 點,或選擇單次 $99 解鎖。");
          return;
        }
        const next = current - 60;
        localStorage.setItem("xiaomeng:memberPoints", String(next));
        const evt = new CustomEvent("xiaomeng:points-spent", { detail: { amount: 60, reason: "解鎖深度解析" } });
        window.dispatchEvent(evt);
        alert(`已扣 60 點。\n剩餘點數:${next} 點\n\n完整解析已解鎖(本機預覽模式)。`);
      },
    });
  });

  // (D) 分享送 20 點(舊按鈕 ID 留著)
  document.querySelector("#rewardPoints")?.addEventListener("click", () => {
    const evt = new CustomEvent("xiaomeng:share-completed");
    window.dispatchEvent(evt);
    const current = Number(localStorage.getItem("xiaomeng:memberPoints") || 0);
    alert(`分享完成!\n已送你 20 點。\n目前點數:${current + 20} 點`);
  });

  // 監聽 points-spent → refresh badge
  window.addEventListener("xiaomeng:points-spent", () => {
    document.querySelectorAll("[data-points-badge]").forEach((b) => {
      b.textContent = String(localStorage.getItem("xiaomeng:memberPoints") || 0);
    });
  });
})();


// =====================================================================
// F22 The Great Stage — 單一沉浸式大舞台 + 弧形扇形展牌 + 打字機
// 套用條件:使用者按下「進入靜心占卜室」後,三個 stage 疊成同一畫面
// =====================================================================
(function greatStageBootstrap() {
  const GREAT_FAN_SIZE = 21;
  const GREAT_FAN_RADIUS = 240;
  const GREAT_FAN_ANGLE = 110;
  // All 22 major arcana. Cards 8-21 not yet generated by 1.5 (OpenAI overload);
  // resolveCardImage() returns Magician as visual fallback so the result card
  // never shows an empty slot.
  const MAJOR_IMAGES = {
    0: "./assets/tarot-00-the-fool.png",
    1: "./assets/tarot-01-the-magician.png",
    2: "./assets/tarot-02-the-high-priestess.png",
    3: "./assets/tarot-03-the-empress.png",
    4: "./assets/tarot-04-the-emperor.png",
    5: "./assets/tarot-05-the-hierophant.png",
    6: "./assets/tarot-06-the-lovers.png",
    7: "./assets/tarot-07-the-chariot.png",
    8: "./assets/tarot-08-strength.png",
    9: "./assets/tarot-09-the-hermit.png",
    10: "./assets/tarot-10-wheel-of-fortune.png",
    11: "./assets/tarot-11-justice.png",
    12: "./assets/tarot-12-the-hanged-man.png",
    13: "./assets/tarot-13-death.png",
    14: "./assets/tarot-14-temperance.png",
    15: "./assets/tarot-15-the-devil.png",
    16: "./assets/tarot-16-the-tower.png",
    17: "./assets/tarot-17-the-star.png",
    18: "./assets/tarot-18-the-moon.png",
    19: "./assets/tarot-19-the-sun.png",
    20: "./assets/tarot-20-judgement.png",
    21: "./assets/tarot-21-the-world.png",
  };
  const FALLBACK_IMAGE = "./assets/tarot-01-the-magician.png";
  function resolveCardImage(idx) {
    const path = (idx != null && MAJOR_IMAGES[idx]) || null;
    // If file does not exist in the page's preloaded list, fallback to Magician
    if (!path) return FALLBACK_IMAGE;
    return FALLBACK_IMAGE; // for now always return Magician if 8-21 not yet on disk
    // (When all 22 are uploaded, replace with: return path;)
  }
  // Track which major images are confirmed available
  window.__xiaomengImageProbe = function probe() {
    if (!window.__imageProbed) {
      window.__imageProbed = {};
      // Synchronously we assume all 22 eventually available; use Magician for any unknown
    }
  };
  const greatPicked = [];
  let greatDeck = [];
  let currentSystem = "tarot";

  function enterGreatStage(system = "tarot") {
    currentSystem = system;
    const flow = document.querySelector('.ritual-flow');
    if (!flow) return;
    flow.classList.add('great-stage-mode');
    flow.classList.remove('has-drawn');
    flow.querySelectorAll('.ritual-stage').forEach(s => {
      s.removeAttribute('hidden');
      s.classList.remove('is-active');
    });
    const inputStage = flow.querySelector('.ritual-stage--input');
    if (inputStage) inputStage.classList.add('is-active');
    ensureProgressBar(flow);
    // Reset result placeholders
    const name = document.getElementById('resultCardName');
    const meaning = document.getElementById('resultMeaning');
    if (name) { name.textContent = '— 靜待你的抉擇 —'; name.setAttribute('data-placeholder', 'true'); }
    if (meaning) { meaning.textContent = '請從下方牌桌中選擇屬於你的那一張牌。'; meaning.setAttribute('data-placeholder', 'true'); }
    // Clear result image
    const ri = document.querySelector('[data-result-image]');
    if (ri) { ri.removeAttribute('src'); ri.style.display = 'none'; }
    // Setup Atropos for result card
    setupResultAtropos();
  }

  function ensureProgressBar(flow) {
    if (flow.querySelector('.great-progress')) return;
    const bar = document.createElement('div');
    bar.className = 'great-progress';
    bar.innerHTML = '<span class="great-progress__dot is-active" data-step="input"></span>' +
                    '<span class="great-progress__dot" data-step="draw"></span>' +
                    '<span class="great-progress__dot" data-step="result"></span>';
    flow.insertBefore(bar, flow.firstChild);
  }

  function setProgress(activeStep) {
    const dots = document.querySelectorAll('.great-progress__dot');
    const order = ['input', 'draw', 'result'];
    dots.forEach((d) => {
      d.classList.toggle('is-active', d.dataset.step === activeStep);
      d.classList.toggle('is-done', order.indexOf(d.dataset.step) < order.indexOf(activeStep));
    });
  }

  function activateStage(stageName) {
    const flow = document.querySelector('.ritual-flow');
    if (!flow) return;
    const map = {
      input: '.ritual-stage--input',
      draw: '.ritual-stage--draw',
      result: '.ritual-stage--result',
    };
    flow.querySelectorAll('.ritual-stage').forEach(s => s.classList.remove('is-active'));
    const target = flow.querySelector(map[stageName]);
    if (target) target.classList.add('is-active');
    setProgress(stageName);
    setTimeout(() => {
      target && target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 80);
  }

  // Phase 1: shuffle (cards back-up, then re-deal)
  function shuffleDeck() {
    return new Promise((resolve) => {
      const stack = document.getElementById('cardStack');
      if (!stack) return resolve();
      stack.classList.add('is-shuffling');
      const fan = stack.querySelectorAll('.great-card');
      fan.forEach((el, i) => {
        el.style.transition = `transform ${300 + (i%3)*40}ms ease, opacity 200ms ease`;
        el.style.transform = `rotate(${(Math.random() - 0.5) * 20}deg) translateY(${Math.random() * 30 - 15}px)`;
      });
      setTimeout(() => {
        stack.classList.remove('is-shuffling');
        resolve();
      }, 900);
    });
  }
  // Phase 2: cut (single big card momentarily appears at center)
  function cutDeck() {
    return new Promise((resolve) => {
      const stack = document.getElementById('cardStack');
      if (!stack) return resolve();
      const fan = stack.querySelectorAll('.great-card');
      if (!fan.length) return resolve();
      fan.forEach((el) => { el.style.opacity = '0'; });
      const cutCard = document.createElement('div');
      cutCard.className = 'cut-card';
      stack.appendChild(cutCard);
      setTimeout(() => {
        cutCard.classList.add('is-cutting');
        setTimeout(() => {
          cutCard.remove();
          // Phase 13: trigger fan-ready stagger fade-in
          stack.classList.add('fan-ready');
          // Remove the inline opacity 0 so CSS animation can take over
          fan.forEach((el) => { el.style.opacity = ''; });
          resolve();
        }, 700);
      }, 60);
    });
  }

  // Build the great fan table
  function buildGreatTable() {
    const stack = document.getElementById('cardStack');
    if (!stack) return;
    stack.classList.add('great-table');
    stack.innerHTML = '';
    // Get deck: prefer major arcana (22), fallback to all
    const all = (window.tarotDeck || []);
    const majors = all.filter(c => c.suit === 'major');
    greatDeck = (majors.length >= GREAT_FAN_SIZE ? majors : all).slice(0, GREAT_FAN_SIZE);
    const total = greatDeck.length;
    const startAngle = -GREAT_FAN_ANGLE / 2;
    const angleStep = GREAT_FAN_ANGLE / Math.max(1, total - 1);

    greatDeck.forEach((card, i) => {
      const el = document.createElement('button');
      el.type = 'button';
      el.className = 'great-card';
      el.dataset.cardIndex = String((card.index != null) ? card.index : i);
      const angle = startAngle + angleStep * i;
      el.style.setProperty('--fan-angle', angle + 'deg');
      el.style.transform = `rotate(${angle}deg) translateY(-${GREAT_FAN_RADIUS}px) rotate(${-angle}deg)`;
      el.innerHTML = `<span class="great-card__art"></span>`;
      el.addEventListener('click', () => onGreatCardClick(card, el, i));
      stack.appendChild(el);
    });
  }

  async function runDrawSequence() {
    activateStage('draw');
    buildGreatTable();
    await new Promise(r => setTimeout(r, 200));
    await shuffleDeck();
    await new Promise(r => setTimeout(r, 200));
    await cutDeck();
  }

  function onGreatCardClick(card, el, index) {
    if (el.classList.contains('is-zoomed')) return;
    if (greatPicked.includes(index)) return;
    greatPicked.push(index);
    el.classList.add('is-selected');
    document.querySelectorAll('.great-card').forEach((c) => {
      if (c !== el) c.classList.add('is-dimmed');
    });
    setTimeout(() => {
      el.classList.add('is-zoomed');
    }, 220);
    setTimeout(() => {
      showGreatResult(card);
    }, 720);
  }

  function showGreatResult(card) {
    activateStage('result');
    const flow = document.querySelector('.ritual-flow');
    if (flow) flow.classList.add('has-drawn');
    const name = document.getElementById('resultCardName');
    const meaning = document.getElementById('resultMeaning');
    // Name
    if (name) {
      name.textContent = (card.english || card.name || '') + ' · ' + (card.name || '');
      name.removeAttribute('data-placeholder');
    }
    // Image
    const ri = document.querySelector('[data-result-image]');
    if (ri) {
      const idx = card.index != null ? card.index : null;
      const src = (idx != null && MAJOR_IMAGES[idx]) || card.image;
      if (src) {
        ri.src = src;
        ri.alt = card.name || '';
        ri.style.display = 'block';
        ri.classList.add('is-loaded');
      } else {
        ri.removeAttribute('src');
        ri.style.display = 'none';
      }
    }
    // Flip animation
    const inner = document.getElementById('resultCardInner');
    if (inner) {
      inner.classList.remove('is-flipped');
      // Force reflow then re-add for re-trigger
      void inner.offsetWidth;
      setTimeout(() => inner.classList.add('is-flipped'), 60);
    }
    // Typewriter
    if (meaning) {
      const text = card.meaning || '願這張牌為你帶來今晚最溫柔的提醒。';
      typewriteText(meaning, text, 32);
    }
  }

  function typewriteText(el, text, speedMs) {
    el.classList.add('great-reading');
    el.innerHTML = '';
    el.removeAttribute('data-placeholder');
    let i = 0;
    const caret = document.createElement('span');
    caret.className = 'caret';
    el.appendChild(caret);
    let lastScrollAt = 0;
    const tick = () => {
      if (i >= text.length) {
        caret.remove();
        return;
      }
      const ch = text.charAt(i++);
      caret.insertAdjacentText('beforebegin', ch);
      // Phase 14: auto-scroll to keep the just-typed line in view (every 6 chars)
      if (i % 6 === 0) {
        try {
          const rect = el.getBoundingClientRect();
          const vh = window.innerHeight;
          // If the element extends below viewport, scroll just enough
          if (rect.bottom > vh - 80) {
            const overshoot = rect.bottom - (vh - 80);
            window.scrollBy({ top: overshoot, behavior: 'smooth' });
          }
        } catch (e) {}
      }
      setTimeout(tick, speedMs);
    };
    tick();
  }

  // Atropos 3D tilt on the result card
  function setupResultAtropos() {
    const wrap = document.querySelector('.result-card-wrap');
    if (!wrap || wrap.__atroposReady) return;
    if (window.Atropos) {
      try {
        const a = Atropos({
          el: wrap,
          activeOffset: 18,
          shadowScale: 0.92,
          rotate: true,
          rotateTouch: true,
        });
        wrap.__atroposInstance = a;
        wrap.__atroposReady = true;
      } catch (e) { /* silent */ }
    } else {
      // Fallback: re-init when atropos CDN finishes loading
      const retry = setInterval(() => {
        if (window.Atropos) {
          clearInterval(retry);
          setupResultAtropos();
        }
      }, 200);
      setTimeout(() => clearInterval(retry), 5000);
    }
  }

  // Hook the CTA: enter great stage, then draw sequence
  document.addEventListener("click", (e) => {
    const t = e.target instanceof Element ? e.target : null;
    if (!t) return;
    const cta = t.closest && t.closest("#ritualCta");
    if (!cta) return;
    setTimeout(async () => {
      enterGreatStage("tarot");
      setTimeout(() => {
        activateStage("draw");
        runDrawSequence();
      }, 200);
    }, 50);
  });

  // Hook F30 system CTAs
  document.addEventListener("click", (e) => {
    const t = e.target instanceof Element ? e.target : null;
    if (!t) return;
    const cta = t.closest && t.closest("[data-system-cta="tarot"]");
    if (!cta) return;
    e.preventDefault();
    setTimeout(async () => {
      enterGreatStage("tarot");
      setTimeout(() => {
        activateStage("draw");
        runDrawSequence();
      }, 200);
    }, 50);
  });
})();
)();


// =====================================================================
// F30 商業變現 v5.0 — 599 元折抵 + 50 點 7 天效期 + 靈性收益錢包 + 三套音效
// =====================================================================
(function walletAndF30V5() {
  const POINTS_KEY = "xiaomeng_points";
  const POINTS_EXP_KEY = "xiaomeng_points_exp";
  const POINTS_GRANT_DAY_KEY = "xiaomeng_points_grant_day";
  const FREE_QUOTA_KEY_PREFIX = "xiaomeng_free_quota_";
  const SPREAD_DISCOUNT_THRESHOLD = 599;
  const POINTS_DISCOUNT_VALUE = 50;

  function todayStr() {
    const d = new Date();
    return d.getFullYear() + "-" + String(d.getMonth()+1).padStart(2,"0") + "-" + String(d.getDate()).padStart(2,"0");
  }
  function addDays(iso, days) {
    const d = new Date(iso);
    d.setDate(d.getDate() + days);
    return d.getTime();
  }
  function readPoints() {
    let pts = Number(localStorage.getItem(POINTS_KEY) || 0);
    const exp = Number(localStorage.getItem(POINTS_EXP_KEY) || 0);
    if (exp && Date.now() > exp) {
      // expired
      pts = 0;
      try {
        localStorage.setItem(POINTS_KEY, "0");
        localStorage.removeItem(POINTS_EXP_KEY);
      } catch (e) {}
    }
    return pts;
  }
  function grantSharePoints() {
    const lastDay = localStorage.getItem(POINTS_GRANT_DAY_KEY);
    const today = todayStr();
    if (lastDay === today) {
      return { ok: false, reason: "今日已領過,明日再來" };
    }
    const cur = readPoints();
    const next = cur + POINTS_DISCOUNT_VALUE;
    const expTs = addDays(today, 7);
    try {
      localStorage.setItem(POINTS_KEY, String(next));
      localStorage.setItem(POINTS_EXP_KEY, String(expTs));
      localStorage.setItem(POINTS_GRANT_DAY_KEY, today);
    } catch (e) {}
    return { ok: true, value: next, exp: expTs };
  }
  function tryRedeemPoints(orderAmount) {
    if (orderAmount < SPREAD_DISCOUNT_THRESHOLD) {
      return { ok: false, reason: "單筆未滿 $599,無法折抵" };
    }
    const cur = readPoints();
    if (cur < POINTS_DISCOUNT_VALUE) {
      return { ok: false, reason: "目前無可用 50 積分" };
    }
    const next = cur - POINTS_DISCOUNT_VALUE;
    try { localStorage.setItem(POINTS_KEY, String(next)); } catch (e) {}
    return { ok: true, redeemed: POINTS_DISCOUNT_VALUE, remaining: next, finalPay: orderAmount - POINTS_DISCOUNT_VALUE };
  }
  function isFreeQuotaUsed(system) {
    return localStorage.getItem(FREE_QUOTA_KEY_PREFIX + system) === "1";
  }
  function markFreeQuotaUsed(system) {
    try { localStorage.setItem(FREE_QUOTA_KEY_PREFIX + system, "1"); } catch (e) {}
  }
  function refreshWalletUI() {
    const val = readPoints();
    const exp = Number(localStorage.getItem(POINTS_EXP_KEY) || 0);
    const chip = document.getElementById("walletChipValue");
    if (chip) chip.textContent = String(val);
    const summary = document.getElementById("walletSummary");
    if (summary) {
      const expStr = exp ? new Date(exp).toLocaleDateString("zh-TW") : "—";
      summary.textContent = `目前 ${val} 靈性積分 · 效期至 ${expStr} · 單筆滿 $599 可折抵 $${POINTS_DISCOUNT_VALUE}`;
    }
  }

  // Wallet chip click — show discount hint
  document.addEventListener("click", (e) => {
    const t = e.target instanceof Element ? e.target : null;
    if (!t) return;
    if (t.closest && t.closest("#walletChip")) {
      const v = readPoints();
      alert(
        "你當前擁有 " + v + " 靈性積分\n\n" +
        "單筆現金消費滿 $599 即可一鍵折抵 $50 元現金減免。\n\n" +
        "（積分僅供折抵,不可用於免費解鎖占卜。）"
      );
    }
  });

  // System CTA buttons
  document.addEventListener("click", (e) => {
    const t = e.target instanceof Element ? e.target : null;
    if (!t) return;
    const cta = t.closest && t.closest("[data-system-cta]");
    if (!cta) return;
    const sys = cta.getAttribute("data-system-cta");
    e.preventDefault();
    if (sys === "pet") {
      alert("【毛孩心語】為尊榮會員限定模組。\n\n請透過右上角「與大師一對一」真人守護通道,或聯絡 LINE 官方帳號升級。");
      return;
    }
    if (sys === "oracle") {
      alert("【今日神諭】原型版 — 正式 3 種模式（今日訊息 / 宇宙提醒 / 心靈祝福）將於下次更新上線。");
      return;
    }
    if (sys === "tarot") {
      // Trigger the great stage
      const startBtn = document.getElementById("ritualCta");
      startBtn && startBtn.click();
    }
  });

  // === 三套專屬音效 (Web Audio API stub) ===
  function playSystemSound(kind) {
    try {
      const C = window.AudioContext || window.webkitAudioContext;
      if (!C) return;
      const ctx = window.__audioCtx || (window.__audioCtx = new C());
      const now = ctx.currentTime;
      if (kind === "tarot") {
        // 厚重羊皮紙摩擦 + 水晶音:低頻嗡嗡 + 高頻短音
        const osc1 = ctx.createOscillator();
        const gain1 = ctx.createGain();
        osc1.type = "sawtooth";
        osc1.frequency.setValueAtTime(60, now);
        osc1.frequency.linearRampToValueAtTime(120, now + 0.8);
        gain1.gain.setValueAtTime(0.0001, now);
        gain1.gain.linearRampToValueAtTime(0.08, now + 0.1);
        gain1.gain.linearRampToValueAtTime(0.0001, now + 1.0);
        osc1.connect(gain1).connect(ctx.destination);
        osc1.start(now); osc1.stop(now + 1.1);
      } else if (kind === "pet") {
        // 八音盒 + 貓咪呼嚕:高頻柔和正弦波
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.type = "sine";
        osc2.frequency.setValueAtTime(523, now);
        osc2.frequency.linearRampToValueAtTime(659, now + 0.5);
        gain2.gain.setValueAtTime(0.0001, now);
        gain2.gain.linearRampToValueAtTime(0.06, now + 0.1);
        gain2.gain.linearRampToValueAtTime(0.0001, now + 0.9);
        osc2.connect(gain2).connect(ctx.destination);
        osc2.start(now); osc2.stop(now + 1.0);
      } else if (kind === "oracle") {
        // 宇宙頌缽 + 環境風聲:深層低頻 + 噪音
        const osc3 = ctx.createOscillator();
        const gain3 = ctx.createGain();
        osc3.type = "sine";
        osc3.frequency.setValueAtTime(110, now);
        gain3.gain.setValueAtTime(0.0001, now);
        gain3.gain.linearRampToValueAtTime(0.1, now + 0.2);
        gain3.gain.linearRampToValueAtTime(0.0001, now + 1.4);
        osc3.connect(gain3).connect(ctx.destination);
        osc3.start(now); osc3.stop(now + 1.5);
      }
    } catch (e) { /* silent fail */ }
  }
  // Expose to global so the Great Stage can call it
  window.__playSystemSound = playSystemSound;

  // === Footer legal modals ===
  function openLegalModal(id) {
    const m = document.getElementById(id);
    if (!m) return;
    m.classList.add("is-open");
    m.setAttribute("aria-hidden", "false");
  }
  function closeLegalModal(el) {
    el.classList.remove("is-open");
    el.setAttribute("aria-hidden", "true");
  }
  document.addEventListener("click", (e) => {
    const t = e.target instanceof Element ? e.target : null;
    if (!t) return;
    if (t.closest && t.closest("#openPrivacyModal")) {
      e.preventDefault();
      openLegalModal("privacyModal");
    } else if (t.closest && t.closest("#openTermsModal")) {
      e.preventDefault();
      openLegalModal("termsModal");
    } else if (t.closest && t.closest(".legal-modal__close")) {
      const modal = t.closest(".legal-modal-overlay");
      modal && closeLegalModal(modal);
    } else if (t.classList && t.classList.contains("legal-modal-overlay")) {
      closeLegalModal(t);
    }
  });

  // === LINE FAB — 跳轉到 LINE 官方帳號 ===
  const LINE_OA_URL = "https://line.me/R/ti/p/@471cptxk";
  document.addEventListener("click", (e) => {
    const t = e.target instanceof Element ? e.target : null;
    if (!t) return;
    if (t.closest && t.closest("#lineFab")) {
      e.preventDefault();
      window.open(LINE_OA_URL, "_blank", "noopener,noreferrer");
    }
  });
  document.addEventListener("keydown", (e) => {
    if (e.key !== "Enter" && e.key !== " ") return;
    const t = e.target instanceof Element ? e.target : null;
    if (t && t.id === "lineFab") {
      e.preventDefault();
      window.open(LINE_OA_URL, "_blank", "noopener,noreferrer");
    }
  });

  // === Free quota: intercept entry to first 3 systems (3 systems each 1 free) ===
  // Already handled via freeQuotaUsed flag; this just exposes helper
  window.__xiaomengF30 = {
    grantSharePoints,
    tryRedeemPoints,
    isFreeQuotaUsed,
    markFreeQuotaUsed,
    readPoints,
    refreshWalletUI,
  };

  refreshWalletUI();
})();
