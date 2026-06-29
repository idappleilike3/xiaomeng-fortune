import { oracleFortunes } from "./oracle-data.js";

const LIFF_ID = "2010549494-KRb0mn7U";
const LIFF_URL = `https://liff.line.me/${LIFF_ID}`;

const tarotDeck = [
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

const menuTargets = {
  chart: "#profile",
  tarot: "#demo",
  oracle: "#demo",
  number: "#demo",
  market: "#market",
};

const automationTemplates = {
  daily:
    "早安，我是小夢老師。今天想知道感情、工作還是財運？回覆「抽牌」，我替你抽今日一張牌。免費看方向，完整解析可看今日行動建議。",
  weekly:
    "本週運勢已更新。設定生日的人可以看本週流年提醒。回覆「週運」查看免費摘要，想看感情、事業、財運完整解析可再解鎖。",
  profile:
    "你還差一點資料就能完成命盤。補上出生時間與出生地後，小夢老師就能幫你看八字時辰、紫微命宮與合盤方向。若不知道時間，也可以先選「不確定」。",
  premium:
    "你今天的牌面有明顯提醒。免費版先給你方向；如果想知道對方想法、未來 14 天走勢與下一步行動，可以解鎖完整解析。",
};

const oracleProductMap = {
  love: {
    title: "月光關係修復香氛",
    reason: "適合感情卡關、想穩定溝通與提升柔和能量時使用。",
    url: "#market",
  },
  career: {
    title: "晨星專注筆記組",
    reason: "適合工作轉換、考試、創業規劃與整理下一步行動。",
    url: "#market",
  },
  wealth: {
    title: "豐盛水晶小物",
    reason: "適合財務整理、開源規劃與提醒自己穩定累積。",
    url: "#market",
  },
  general: {
    title: "小夢老師開運選品",
    reason: "依照籤意挑選療癒、提醒與日常儀式感商品。",
    url: "#market",
  },
};

const unlockMessages = {
  free:
    "免費版適合先確認方向：看牌名、籤意、簡短提醒與一個注意事項。若問題牽涉感情決定、工作轉換或財務選擇，再引導深度解析。",
  single:
    "單次深度解析適合高意圖使用者：一次解鎖完整脈絡、未來 14 到 30 天走勢、阻礙來源、對方狀態與下一步行動。建議定價 $99 起。",
  points:
    "點數制適合提高回訪率：使用者一次購買點數，之後抽牌、求籤、週運、合盤都可扣點。這會比單次付款更適合長期經營。",
};

function getOracleProduct(question) {
  if (/感情|愛情|復合|曖昧|交往|分手|對方|桃花/.test(question)) return oracleProductMap.love;
  if (/工作|事業|轉職|創業|考試|升遷|合作|客戶/.test(question)) return oracleProductMap.career;
  if (/財|錢|投資|收入|業績|賺|負債/.test(question)) return oracleProductMap.wealth;
  return oracleProductMap.general;
}

const topicGuidance = {
  感情: "感情題請先看互動是否真誠，再看自己是不是把期待放得太前面。",
  工作: "工作題重點在流程、溝通與當下能掌握的任務，不急著用情緒決定去留。",
  事業: "事業題要看長線布局，這張牌提醒你把願景拆成可以執行的下一步。",
  財運: "財運題先看現金流與風險，再看是否值得投入更多資源。",
  健康: "健康題以身心平衡與作息提醒為主；若有明顯不適，仍建議尋求專業醫療協助。",
  個人成長: "個人成長題看的是內在課題，這張牌會指出你目前最需要調整的信念與行動。",
};

let currentTarotDeck = [];
let latestTarotReading = null;
let bonusDraws = Number(localStorage.getItem("bonusDraws") || 0);

function escapeHtml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
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
    return `我正在小夢老師抽今日指引。你也可以進來抽一張，看看感情、工作或財運的提醒：${LIFF_URL}#demo`;
  }

  return `我剛在小夢老師抽到「${reading.name}｜${reading.position}」。${reading.meaning} 你也可以抽一張今日指引：${LIFF_URL}#demo`;
}

function storeBonusDraw() {
  bonusDraws += 1;
  localStorage.setItem("bonusDraws", String(bonusDraws));
}

async function shareFortune() {
  const message = buildShareText();

  try {
    if (window.liff?.isApiAvailable?.("shareTargetPicker")) {
      const result = await window.liff.shareTargetPicker([{ type: "text", text: message }]);
      if (result) {
        storeBonusDraw();
        updateShareStatus("分享完成，已送你一次額外抽牌機會。");
      } else {
        updateShareStatus("你剛剛取消分享，沒有增加次數。");
      }
      return;
    }

    storeBonusDraw();
    updateShareStatus("目前不是 LINE 內頁，先用測試模式增加一次額外抽牌。");
  } catch (error) {
    console.warn("shareTargetPicker failed", error);
    updateShareStatus("分享功能需要在 LINE 內頁開啟，也要在 LINE Developers 打開 shareTargetPicker。");
  }
}

function shuffleCards(cards) {
  return cards
    .map((card, index) => ({ card, index, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ card, index }) => ({ name: card[0], meaning: card[1], index }));
}

function renderTarotDeck() {
  const grid = document.querySelector("#tarotDeckGrid");
  if (!grid) return;

  currentTarotDeck = shuffleCards(tarotDeck);
  grid.innerHTML = currentTarotDeck
    .map(
      (card, order) => `
        <button class="tarot-card" type="button" data-tarot-index="${order}" aria-label="選擇第 ${order + 1} 張塔羅牌">
          <span class="tarot-card-back">
            <i></i>
            <b>小夢</b>
            <em></em>
          </span>
        </button>
      `
    )
    .join("");
}

function drawTarotCard(order) {
  const selected = currentTarotDeck[order];
  if (!selected) return;

  const isReversed = Math.random() > 0.62;
  const topic = document.querySelector("#tarotTopic").value;
  const question = document.querySelector("#tarotQuestion").value.trim();
  const safeQuestion = escapeHtml(question || "今天我需要知道的提醒是什麼？");
  const position = isReversed ? "逆位" : "正位";
  const result = document.querySelector("#tarotResult");
  latestTarotReading = {
    name: selected.name,
    position,
    topic,
    question: question || "今天我需要知道的提醒是什麼？",
    meaning: selected.meaning,
  };

  document.querySelectorAll(".tarot-card").forEach((button) => button.classList.remove("is-selected"));
  document.querySelector(`[data-tarot-index="${order}"]`)?.classList.add("is-selected");

  result.innerHTML = `
    <span class="tarot-kicker">${topic}｜${position}</span>
    <h4>${selected.name}</h4>
    <p><strong>所問：</strong>${safeQuestion}</p>
    <p><strong>免費簡解：</strong>${selected.meaning}</p>
    <p><strong>${topic}提醒：</strong>${topicGuidance[topic]}</p>
    <a class="premium-note premium-link" href="#market">解鎖深度解析：對方想法、阻礙來源、未來 14 到 30 天走勢、注意事項、行動建議與適合你的開運選品。</a>
  `;
}

document.querySelector("#shuffleTarot")?.addEventListener("click", () => {
  renderTarotDeck();
  document.querySelector("#tarotResult").innerHTML =
    "<p>牌已洗好。請看著你的問題，從 78 張牌裡選一張最有感覺的牌。</p>";
});

document.querySelector("#tarotDeckGrid")?.addEventListener("click", (event) => {
  const cardButton = event.target.closest("[data-tarot-index]");
  if (!cardButton) return;
  drawTarotCard(Number(cardButton.dataset.tarotIndex));
});

document.querySelector("#shareFortune")?.addEventListener("click", shareFortune);

document.querySelector("#bonusDraw")?.addEventListener("click", () => {
  if (bonusDraws < 1) {
    updateShareStatus("先分享今日運勢，就能多抽一次。");
    return;
  }

  bonusDraws -= 1;
  localStorage.setItem("bonusDraws", String(bonusDraws));
  if (!currentTarotDeck.length) renderTarotDeck();
  drawTarotCard(Math.floor(Math.random() * currentTarotDeck.length));
  updateShareStatus("已使用一次額外抽牌機會。");
});

renderTarotDeck();
initializeLiffProfile();
updateShareStatus("分享給朋友後，可獲得一次額外抽牌機會。");

document.querySelector("#drawOracle").addEventListener("click", () => {
  const fortune = oracleFortunes[Math.floor(Math.random() * oracleFortunes.length)];
  const question = document.querySelector("#oracleQuestion").value.trim();
  const oracleType = document.querySelector("#oracleType").value;
  const gender = document.querySelector("input[name='oracleGender']:checked")?.value || "不透露";
  const product = getOracleProduct(question);
  const questionText = question || "目前心中尚未寫下問題，系統以今日整體指引解讀。";
  document.querySelector("#oraclePoem").innerHTML =
    `<span class="oracle-meta">${oracleType}｜${gender}</span>
    <br>第 ${fortune.no} 籤｜${fortune.level}
    <br>${fortune.title}
    <small>所問：${questionText}</small>
    <small>籤詩：${fortune.poem}</small>
    <strong>免費簡解：${fortune.summary}</strong>
    <small>注意事項：${fortune.advice}</small>
    <a class="premium-note premium-link" href="#market">解鎖深度解籤：感情、事業、財運、未來 30 天提醒、下一步行動方案。</a>
    <a class="oracle-product" href="${product.url}">推薦選品：${product.title}<small>${product.reason}</small></a>`;
});

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

document.querySelectorAll("[data-template]").forEach((button) => {
  button.addEventListener("click", () => {
    const template = automationTemplates[button.dataset.template];
    document.querySelector("#automationPreview").textContent = template;
  });
});

document.querySelectorAll("[data-unlock]").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelector("#unlockPreview").textContent = unlockMessages[button.dataset.unlock];
  });
});

document.querySelectorAll("[data-menu]").forEach((button) => {
  button.addEventListener("click", () => {
    const target = menuTargets[button.dataset.menu];
    document.querySelector(target).scrollIntoView({ behavior: "smooth" });
  });
});

document.querySelectorAll("[data-action]").forEach((button) => {
  button.addEventListener("click", () => {
    const action = button.dataset.action;
    const target = action === "market" ? "#market" : action === "chart" ? "#profile" : "#demo";
    document.querySelector(target).scrollIntoView({ behavior: "smooth" });
  });
});
