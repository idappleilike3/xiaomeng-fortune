
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

const tarotDeck = rawTarotDeck.map(([name, meaning]) => ({
  name,
  meaning,
  ...getTarotCardMeta(name),
}));
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
  const code = [...card.name].reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const symbol = card.symbol || symbols[code % symbols.length];
  const accent = code % 5;
  const figure = code % 6;
  const english = card.english || card.name;
  const roman = card.roman || "I";
  const suit = card.suit || "major";
  return `
    <span class="tarot-card-face ${position === "逆位" ? "is-reversed" : ""}" data-accent="${accent}" data-suit="${suit}">
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
