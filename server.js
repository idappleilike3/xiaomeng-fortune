import { createHmac, timingSafeEqual } from "node:crypto";
import { createReadStream, existsSync, readFileSync } from "node:fs";
import { extname, join, normalize, resolve } from "node:path";
import { createServer } from "node:http";
import { oracleFortunes } from "./oracle-data.js";

const rootDir = process.cwd();

const tarotDeck = [
  ["愚者", "新的旅程正在展開，先讓心保持開放。"],
  ["魔術師", "你手上已有資源，適合主動出擊。"],
  ["女祭司", "答案藏在直覺裡，先觀察再決定。"],
  ["皇后", "滋養與創造力變強，關係需要溫柔經營。"],
  ["皇帝", "建立界線與秩序，事情會更有方向。"],
  ["教皇", "適合尋求老師、前輩或制度的協助。"],
  ["戀人", "你面前有重要選擇，請同時看心動與現實。"],
  ["戰車", "目標明確就能推進，別讓分心拖慢你。"],
  ["力量", "溫柔比強硬更有力量，先穩住情緒。"],
  ["隱者", "暫時安靜整理答案，會看得更清楚。"],
  ["命運之輪", "局勢正在轉動，順勢調整會更好。"],
  ["正義", "公平與真相會浮現，請用清楚標準判斷。"],
  ["吊人", "暫停不是失敗，換角度會找到出口。"],
  ["死神", "舊階段正在結束，放下才有新空間。"],
  ["節制", "整合與協調是現在最有效的策略。"],
  ["惡魔", "看見執著與慾望，別讓恐懼牽著你走。"],
  ["高塔", "變化打破假象，也讓真正穩固的留下。"],
  ["星星", "希望正在回來，適合療癒與重新相信自己。"],
  ["月亮", "狀況未明，先別急著下結論。"],
  ["太陽", "能量明亮，適合主動表達與開始新計畫。"],
  ["審判", "重要醒悟正在發生，請回應內在召喚。"],
  ["世界", "一個循環接近完成，你準備進入新階段。"],
  ["權杖王牌", "新的熱情點燃，適合開始行動。"],
  ["權杖二", "你正在規劃下一步，視野放大會更清楚。"],
  ["權杖三", "成果正在擴展，留意合作與遠方機會。"],
  ["權杖四", "穩定與慶祝的能量，適合建立安全感。"],
  ["權杖五", "摩擦增加，請把衝突轉成有效溝通。"],
  ["權杖六", "你會被看見，適合展現成果。"],
  ["權杖七", "守住立場，但別讓防衛心阻礙交流。"],
  ["權杖八", "消息與進展變快，請準備即時回應。"],
  ["權杖九", "雖然疲憊，但你已接近突破。"],
  ["權杖十", "責任太重，需要分工與減壓。"],
  ["權杖侍者", "新鮮靈感出現，適合探索與學習。"],
  ["權杖騎士", "行動力強，但要避免衝動。"],
  ["權杖皇后", "魅力與自信上升，適合主動吸引資源。"],
  ["權杖國王", "領導力成熟，請用願景帶動局面。"],
  ["聖杯王牌", "新的情感開始，心正在打開。"],
  ["聖杯二", "關係有靠近機會，真誠對話很重要。"],
  ["聖杯三", "友情與支持增加，適合聚會合作。"],
  ["聖杯四", "你可能有些麻木，請看見身邊好意。"],
  ["聖杯五", "失落需要被承認，但別忽略仍留下的可能。"],
  ["聖杯六", "舊人舊事浮現，溫柔回顧但別困住。"],
  ["聖杯七", "選項很多，請分辨幻想與可行路線。"],
  ["聖杯八", "你正在離開不再滋養你的狀態。"],
  ["聖杯九", "願望有機會實現，允許自己享受成果。"],
  ["聖杯十", "和諧與歸屬感增強，關係能量穩定。"],
  ["聖杯侍者", "溫柔訊息到來，也可能是新的心動。"],
  ["聖杯騎士", "浪漫與邀約出現，但承諾仍需觀察。"],
  ["聖杯皇后", "情感細膩，請相信同理心與直覺。"],
  ["聖杯國王", "成熟處理情緒，是現在的關鍵。"],
  ["寶劍王牌", "真相與清楚判斷出現，適合說清楚。"],
  ["寶劍二", "你正在猶豫，請看見被忽略的資訊。"],
  ["寶劍三", "心痛需要整理，誠實面對更快復原。"],
  ["寶劍四", "休息是必要的，先恢復再決定。"],
  ["寶劍五", "爭贏不一定是勝利，請確認代價。"],
  ["寶劍六", "你正在離開混亂，往平靜處前進。"],
  ["寶劍七", "有隱藏資訊，請保護自己並留意細節。"],
  ["寶劍八", "限制感很強，但出口比想像中近。"],
  ["寶劍九", "焦慮放大問題，請拆成可處理的小事。"],
  ["寶劍十", "某件事已到盡頭，結束後才會鬆一口氣。"],
  ["寶劍侍者", "觀察與學習期，訊息很多但要查證。"],
  ["寶劍騎士", "速度很快，說話與決策避免太尖銳。"],
  ["寶劍皇后", "清醒獨立，請用理性保護界線。"],
  ["寶劍國王", "適合策略判斷，客觀會帶來掌控感。"],
  ["錢幣王牌", "新的實際機會出現，與工作金錢有關。"],
  ["錢幣二", "你正在平衡多件事，時間管理是重點。"],
  ["錢幣三", "合作與專業累積會帶來好成果。"],
  ["錢幣四", "安全感重要，但過度緊抓會讓流動停住。"],
  ["錢幣五", "資源感不足時，請主動尋求協助。"],
  ["錢幣六", "給予與接受需要平衡，資源可能出現。"],
  ["錢幣七", "成果需要時間，適合檢查投入方向。"],
  ["錢幣八", "專注練習會累積實力，慢工能出細活。"],
  ["錢幣九", "獨立與品味提升，適合投資自己。"],
  ["錢幣十", "長期穩定、家族資源與財務規劃是重點。"],
  ["錢幣侍者", "新的學習或賺錢機會出現，先從基礎做起。"],
  ["錢幣騎士", "穩定推進最可靠，別小看每天一點點。"],
  ["錢幣皇后", "照顧生活品質，也照顧實際資源。"],
  ["錢幣國王", "成熟掌控資源，適合談合作與長期計畫。"],
];

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
};

const oracleProductMap = {
  love: {
    title: "月光關係修復香氛",
    reason: "適合感情卡關、想穩定溝通與提升柔和能量時使用。",
  },
  career: {
    title: "晨星專注筆記組",
    reason: "適合工作轉換、考試、創業規劃與整理下一步行動。",
  },
  wealth: {
    title: "豐盛水晶小物",
    reason: "適合財務整理、開源規劃與提醒自己穩定累積。",
  },
  general: {
    title: "小夢老師開運選品",
    reason: "依照籤意挑選療癒、提醒與日常儀式感商品。",
  },
};

function loadEnvFile() {
  const envPath = join(rootDir, ".env");
  if (!existsSync(envPath)) return;

  const envText = Buffer.from(readFileSync(envPath)).toString("utf8");
  envText.split(/\r?\n/).forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) return;
    const index = trimmed.indexOf("=");
    if (index === -1) return;
    const key = trimmed.slice(0, index).trim();
    const value = trimmed.slice(index + 1).trim().replace(/^["']|["']$/g, "");
    if (!process.env[key]) process.env[key] = value;
  });
}

loadEnvFile();

const port = Number(process.env.PORT || 3000);
const channelSecret = process.env.LINE_CHANNEL_SECRET || "";
const channelAccessToken = process.env.LINE_CHANNEL_ACCESS_TOKEN || "";
const publicBaseUrl = (process.env.PUBLIC_BASE_URL || `http://localhost:${port}`).replace(/\/$/, "");
const liffBaseUrl = (process.env.LIFF_URL || "https://liff.line.me/2010549494-KRb0mn7U").replace(/\/$/, "");
const ecpayConfig = {
  merchantId: process.env.ECPAY_MERCHANT_ID || "",
  hashKey: process.env.ECPAY_HASH_KEY || "",
  hashIv: process.env.ECPAY_HASH_IV || "",
  mode: process.env.ECPAY_MODE || "test",
};

const appData = {
  members: [
    {
      id: "demo-member-001",
      nickname: "小月",
      birthday: "1996-08-18",
      birthTime: "08:30",
      birthPlace: "台北市",
      points: 300,
      tier: "體驗會員",
    },
  ],
  readings: [
    {
      id: "reading-001",
      memberId: "demo-member-001",
      type: "tarot",
      topic: "感情",
      summary: "抽到星星，免費版顯示希望與修復方向。",
      unlocked: false,
    },
    {
      id: "reading-002",
      memberId: "demo-member-001",
      type: "oracle",
      topic: "工作",
      summary: "求到上吉籤，提醒先整理方法再出手。",
      unlocked: true,
    },
  ],
  productClicks: [
    {
      id: "click-001",
      product: "月光香氛蠟燭",
      source: "oracle-love",
      clicks: 18,
      revenueHint: "可替換正式聯盟報表",
    },
  ],
  pointLedger: [
    {
      id: "point-001",
      memberId: "demo-member-001",
      action: "purchase",
      points: 300,
      note: "靈感點數包",
    },
    {
      id: "point-002",
      memberId: "demo-member-001",
      action: "unlock",
      points: -60,
      note: "深度解籤",
    },
  ],
};

function getAutomationTemplates() {
  return {
    daily:
      "早安，我是小夢老師。\n\n今天想知道感情、工作還是財運？回覆「塔羅」，我替你抽今日一張牌。\n\n免費看方向，完整解析可看今日行動建議。",
    weekly:
      "本週運勢已更新。\n\n設定生日的人可以看本週流年提醒。回覆「週運」查看免費摘要，想看感情、事業、財運完整解析可再解鎖。",
    profile:
      `你還差一點資料就能完成命盤。\n\n補上出生時間與出生地後，小夢老師就能幫你看八字時辰、紫微命宮與合盤方向。\n\n設定生日：${publicBaseUrl}/#profile`,
    premium:
      "你今天的牌面有明顯提醒。\n\n免費版先給你方向；如果想知道對方想法、未來 14 天走勢與下一步行動，可以解鎖完整解析。",
  };
}

async function readRawBody(request) {
  const chunks = [];
  for await (const chunk of request) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}

async function readJsonBody(request) {
  const rawBody = await readRawBody(request);
  if (!rawBody.length) return {};

  try {
    return JSON.parse(rawBody.toString("utf8"));
  } catch {
    const error = new Error("INVALID_JSON");
    error.statusCode = 400;
    throw error;
  }
}

function verifyLineSignature(rawBody, signature) {
  if (!channelSecret || !signature) return false;

  const digest = createHmac("sha256", channelSecret).update(rawBody).digest("base64");
  const expected = Buffer.from(digest);
  const received = Buffer.from(signature);

  if (expected.length !== received.length) return false;
  return timingSafeEqual(expected, received);
}

function jsonResponse(response, statusCode, payload) {
  response.writeHead(statusCode, {
    "content-type": "application/json; charset=utf-8",
    "access-control-allow-origin": "*",
    "access-control-allow-methods": "GET,POST,OPTIONS",
    "access-control-allow-headers": "content-type,x-line-signature",
  });
  response.end(JSON.stringify(payload));
}

function textMessage(text) {
  return { type: "text", text };
}

function uriAction(label, uri) {
  return { type: "uri", label, uri };
}

function liffPageUrl(page) {
  return `${liffBaseUrl}?page=${encodeURIComponent(page)}`;
}

function flexMessage(altText, contents) {
  return { type: "flex", altText, contents };
}

function menuFlexMessage() {
  const menuItems = [
    ["先設定生日", "之後會帶入命盤與提醒", liffPageUrl("profile"), "#F5D38B"],
    ["塔羅抽牌", "感情、工作、財運都可以問", liffPageUrl("demo"), "#B780FF"],
    ["求籤問事", "像到廟裡一樣先寫問題", liffPageUrl("demo"), "#78E0D5"],
    ["命運市集", "看適合你的療癒選品", liffPageUrl("market"), "#F8A6C7"],
  ];

  return flexMessage("歡迎來找小夢老師", {
    type: "bubble",
    size: "mega",
    body: {
      type: "box",
      layout: "vertical",
      spacing: "md",
      backgroundColor: "#1A0F2D",
      contents: [
        {
          type: "text",
          text: "歡迎你來找小夢老師",
          weight: "bold",
          size: "xl",
          color: "#F5D38B",
          wrap: true,
        },
        {
          type: "text",
          text: "如果你心裡剛好有一件事，可以先選塔羅或求籤。想讓之後的解析更貼近你，建議先設定生日資料。",
          size: "sm",
          color: "#F8EEDB",
          wrap: true,
        },
        {
          type: "box",
          layout: "vertical",
          spacing: "sm",
          paddingAll: "14px",
          margin: "md",
          backgroundColor: "#2A1744",
          borderColor: "#F5D38B",
          borderWidth: "1px",
          cornerRadius: "16px",
          contents: [
            {
              type: "text",
              text: "你可以這樣開始",
              size: "sm",
              weight: "bold",
              color: "#F5D38B",
            },
            {
              type: "text",
              text: "感情卡住、工作選擇、財運方向、最近心情，都可以先從一個問題開始。",
              size: "xs",
              color: "#FFF8EE",
              wrap: true,
            },
          ],
        },
        {
          type: "box",
          layout: "vertical",
          spacing: "sm",
          margin: "md",
          contents: menuItems.map(([label, hint, uri, color]) => ({
            type: "button",
            style: "secondary",
            height: "sm",
            color,
            action: uriAction(`${label}｜${hint}`, uri),
          })),
        },
        {
          type: "text",
          text: "也可以直接打：塔羅、求籤、靈數 1996-08-18、命盤、MBTI、市集。",
          size: "xs",
          color: "#CDBCEB",
          wrap: true,
        },
      ],
    },
  });
}

function tarotEntryFlexMessage() {
  const examples = ["感情：他現在怎麼看我？", "工作：我適合換工作嗎？", "財運：最近投資要注意什麼？"];

  return flexMessage("塔羅抽牌入口", {
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
          text: "先把問題放清楚，再抽牌",
          weight: "bold",
          size: "xl",
          color: "#F5D38B",
          wrap: true,
        },
        {
          type: "text",
          text: "塔羅不是隨便給一張牌就結束。你先想一件正在困擾你的事，選感情、工作、財運或個人成長，再從 78 張牌裡親手抽一張。",
          size: "sm",
          color: "#FFF8EE",
          wrap: true,
        },
        {
          type: "box",
          layout: "vertical",
          spacing: "sm",
          paddingAll: "14px",
          margin: "md",
          backgroundColor: "#2A1744",
          borderColor: "#B780FF",
          borderWidth: "1px",
          cornerRadius: "16px",
          contents: [
            {
              type: "text",
              text: "可以這樣問",
              size: "sm",
              weight: "bold",
              color: "#F5D38B",
            },
            ...examples.map((text) => ({
              type: "text",
              text,
              size: "xs",
              color: "#F8EEDB",
              wrap: true,
            })),
          ],
        },
        {
          type: "box",
          layout: "vertical",
          spacing: "sm",
          margin: "md",
          contents: [
            {
              type: "button",
              style: "primary",
              color: "#B780FF",
              action: uriAction("進去寫問題並抽牌", liffPageUrl("demo")),
            },
            {
              type: "button",
              style: "secondary",
              color: "#F5D38B",
              action: uriAction("先設定生日資料", liffPageUrl("profile")),
            },
          ],
        },
        {
          type: "text",
          text: "免費版會給牌名、正逆位與簡易提醒；深度解析會延伸對方想法、阻礙來源、未來 14 到 30 天走勢、注意事項與適合選品。",
          size: "xs",
          color: "#CDBCEB",
          wrap: true,
        },
      ],
    },
  });
}

function tarotFlexMessage(card) {
  const isReversed = Math.random() > 0.68;
  const position = isReversed ? "逆位" : "正位";
  const ritualHint = isReversed ? "這張牌提醒你先停下來，看見卡住的地方。" : "這張牌像是一盞燈，先照亮你眼前的方向。";

  return flexMessage(`小夢老師替你抽到 ${card[0]}`, {
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
          text: "請在心裡默念你的問題",
          size: "sm",
          color: "#CDBCEB",
        },
        {
          type: "text",
          text: "小夢老師替你翻開這張牌",
          weight: "bold",
          size: "lg",
          color: "#F5D38B",
          wrap: true,
        },
        {
          type: "box",
          layout: "vertical",
          spacing: "sm",
          margin: "md",
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
              text: card[0],
              align: "center",
              weight: "bold",
              size: "xxl",
              color: "#FFF8EE",
              wrap: true,
            },
            {
              type: "text",
              text: position,
              align: "center",
              size: "sm",
              color: "#78E0D5",
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
          text: ritualHint,
          weight: "bold",
          size: "md",
          color: "#F5D38B",
          wrap: true,
        },
        {
          type: "text",
          text: card[1],
          size: "md",
          color: "#FFF8EE",
          wrap: true,
        },
        {
          type: "separator",
          margin: "md",
          color: "#6D5B8A",
        },
        {
          type: "button",
          style: "primary",
          color: "#B780FF",
          action: uriAction("進內頁看深度解析", liffPageUrl("demo")),
        },
      ],
    },
  });
}

function oracleEntryFlexMessage() {
  return flexMessage("求籤小幫手", {
    type: "bubble",
    size: "mega",
    body: {
      type: "box",
      layout: "vertical",
      spacing: "md",
      backgroundColor: "#170D25",
      contents: [
        {
          type: "text",
          text: "求籤前，先把問題寫清楚",
          weight: "bold",
          size: "xl",
          color: "#F5D38B",
          wrap: true,
        },
        {
          type: "text",
          text: "像到廟裡求籤一樣，先想好一件事，再選籤種。免費版看簡解，深度版再看注意事項、未來提醒與適合選品。",
          size: "sm",
          color: "#FFF8EE",
          wrap: true,
        },
        {
          type: "button",
          style: "primary",
          color: "#78E0D5",
          action: uriAction("進內頁求籤", liffPageUrl("demo")),
        },
      ],
    },
  });
}

function getAdminSummary() {
  const totalPoints = appData.members.reduce((sum, member) => sum + member.points, 0);
  const unlockedReadings = appData.readings.filter((reading) => reading.unlocked).length;
  const totalClicks = appData.productClicks.reduce((sum, item) => sum + item.clicks, 0);

  return {
    members: appData.members.length,
    readings: appData.readings.length,
    unlockedReadings,
    totalClicks,
    totalPoints,
    modules: {
      members: appData.members,
      readings: appData.readings,
      productClicks: appData.productClicks,
      pointLedger: appData.pointLedger,
    },
  };
}

function isEcpayConfigured() {
  return Boolean(ecpayConfig.merchantId && ecpayConfig.hashKey && ecpayConfig.hashIv);
}

function getPaymentPlans() {
  return [
    {
      id: "single-reading",
      name: "單次深度解析",
      amount: 99,
      points: 0,
      description: "解鎖一次塔羅、求籤、生命靈數或命盤的完整解析。",
    },
    {
      id: "points-300",
      name: "靈感點數包",
      amount: 300,
      points: 300,
      description: "常回來抽牌、求籤、看週運的人適合用點數扣款。",
    },
    {
      id: "monthly-member",
      name: "月度療癒會員",
      amount: 499,
      points: 600,
      description: "每月點數、週運提醒、深度解析折扣與會員選品推薦。",
    },
  ];
}

function getOrCreateMember(memberId = "demo-member-001") {
  let member = appData.members.find((item) => item.id === memberId);
  if (!member) {
    member = {
      id: memberId,
      nickname: "LINE 使用者",
      birthday: "",
      birthTime: "",
      birthPlace: "",
      points: 0,
      tier: "一般會員",
    };
    appData.members.push(member);
  }
  return member;
}

function addPointLedger(memberId, action, points, note) {
  const entry = {
    id: `point-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    memberId,
    action,
    points,
    note,
  };
  appData.pointLedger.unshift(entry);
  return entry;
}

function getMemberWallet(memberId = "demo-member-001") {
  const member = getOrCreateMember(memberId);
  return {
    member,
    ledger: appData.pointLedger.filter((item) => item.memberId === member.id).slice(0, 8),
    plans: getPaymentPlans(),
    ecpayConfigured: isEcpayConfigured(),
  };
}

function randomItem(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function calculateLifePath(input) {
  const digits = input.replace(/\D/g, "").split("").map(Number);
  if (digits.length < 6) return null;

  let total = digits.reduce((sum, number) => sum + number, 0);
  while (total > 9 && ![11, 22, 33].includes(total)) {
    total = String(total)
      .split("")
      .map(Number)
      .reduce((sum, number) => sum + number, 0);
  }
  return total;
}

function getOracleProduct(question) {
  if (/感情|愛情|復合|曖昧|交往|分手|對方|桃花/.test(question)) return oracleProductMap.love;
  if (/工作|事業|轉職|創業|考試|升遷|合作|客戶/.test(question)) return oracleProductMap.career;
  if (/財|錢|投資|收入|業績|賺|負債/.test(question)) return oracleProductMap.wealth;
  return oracleProductMap.general;
}

function buildReplyMessages(event) {
  const text = event.message?.type === "text" ? event.message.text.trim() : "";
  const lowerText = text.toLowerCase();

  if (event.type === "follow") {
    return [menuFlexMessage()];
  }

  if (!text) {
    return [menuFlexMessage()];
  }

  if (text.includes("塔羅") || lowerText.includes("tarot")) {
    return [tarotEntryFlexMessage()];
  }

  if (text.includes("求籤") || text.includes("籤")) {
    return [oracleEntryFlexMessage()];
  }

  if (text.includes("靈數") || text.includes("生命靈數") || lowerText.includes("number")) {
    const lifePath = calculateLifePath(text);
    if (!lifePath) {
      return [textMessage("請輸入生日，例如：靈數 1996-08-18。我會先幫你算免費主命數。")];
    }
    return [
      textMessage(
        `你的生命靈數是：${lifePath}\n\n免費簡易解析：這代表你目前的人生主題與天賦方向。完整人格、感情、事業與流年解析可做成付費報告。\n${liffPageUrl("demo")}`
      ),
    ];
  }

  if (text.includes("設定生日") || text.includes("生日") || text.includes("命盤") || text.includes("紫微") || text.includes("八字") || text.includes("占星")) {
    return [
      textMessage(
        `請先設定生日資料。\n\n需要填：暱稱、性別、出生日期、出生時間、出生地。\n之後會自動帶入八字、紫微斗數、生命靈數、合盤與擇日功能。\n${liffPageUrl("profile")}`
      ),
    ];
  }

  if (text.toUpperCase().includes("MBTI")) {
    return [
      textMessage(
        `MBTI 測驗會做成 12 題快速版與完整付費版。\n\n免費版看人格輪廓，完整版延伸感情、職場、溝通模式與適合商品推薦。\n${liffPageUrl("demo")}`
      ),
    ];
  }

  if (text.includes("市集") || text.includes("商品") || text.includes("推薦")) {
    return [textMessage(`命運市集已開啟：\n${liffPageUrl("market")}\n\n這裡可以放聯盟商品、追蹤點擊、導向合作品牌。`)];
  }

  return [menuFlexMessage()];
}

async function generateMasterLetterContent(letter) {
  const FORTUNE_OPENERS = [
    "展信悅,親愛的靈魂。",
    "願你的星軌此刻清晰。",
    "深呼吸,讓直覺引導你。",
    "萬物皆有星軌,靈魂皆有歸處。",
    "今夜,星圖為你敞開。"
  ];
  const FORTUNE_CLOSERS = [
    "願這封信成為你今夜的指引。",
    "記得,所有的答案都已在你的靈魂之中。",
    "若仍迷茫,小夢老師隨時在這裡為你調頻。",
    "把你的心安放在這段訊息上,讓它慢慢滊透。",
    "今夜,把窗打開,讓風進來,答案會自己走到你面前。"
  ];
  let ds = null;
  try {
    const dsModule = await import("./lib/divination-system.js");
    ds = dsModule;
  } catch (e) { ds = null; }
  const cardIndex = Math.floor(Math.random() * 22);
  const suits = ["major", "wands", "cups", "swords", "pentacles"];
  const suit = suits[Math.floor(Math.random() * suits.length)];
  let reading;
  if (ds && ds.generateReading) {
    reading = ds.generateReading(cardIndex, suit, "隨機一張", letter.topic || "love");
  } else {
    reading = "你內在的力量正在覺醒,宇宙正在為你安排最好的事。";
  }
  const opener = FORTUNE_OPENERS[Math.floor(Math.random() * FORTUNE_OPENERS.length)];
  const closer = FORTUNE_CLOSERS[Math.floor(Math.random() * FORTUNE_CLOSERS.length)];
  return opener + "\\n\\n看著你在信中傾訴的掙扎, 我能感受到你此刻靈魂的焦慮與沉重。萬物皆有星軌, 當前的卡關只是星象短暫的逆行。\\n\\n" + reading + "\\n\\n" + closer + "\\n\\n——小夢老師 深夜親筆\\n" + new Date().toLocaleString("zh-TW");
}

async function replyToLine(replyToken, messages) {
  if (!channelAccessToken) {
    console.log("LINE_CHANNEL_ACCESS_TOKEN is not set. Reply skipped:", messages);
    return;
  }

  const result = await fetch("https://api.line.me/v2/bot/message/reply", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${channelAccessToken}`,
    },
    body: JSON.stringify({ replyToken, messages }),
  });

  if (!result.ok) {
    const body = await result.text();
    throw new Error(`LINE reply failed: ${result.status} ${body}`);
  }
}

async function pushToLine(userId, messages) {
  if (!channelAccessToken) {
    console.log("LINE_CHANNEL_ACCESS_TOKEN is not set. Push skipped:", { userId, messages });
    return;
  }

  const result = await fetch("https://api.line.me/v2/bot/message/push", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${channelAccessToken}`,
    },
    body: JSON.stringify({ to: userId, messages }),
  });

  if (!result.ok) {
    const body = await result.text();
    throw new Error(`LINE push failed: ${result.status} ${body}`);
  }
}

async function handleLineWebhook(request, response) {
  const rawBody = await readRawBody(request);
  const signature = request.headers["x-line-signature"];

  if (!verifyLineSignature(rawBody, signature)) {
    jsonResponse(response, 401, { ok: false, error: "Invalid LINE signature" });
    return;
  }

  const payload = JSON.parse(rawBody.toString("utf8"));
  await Promise.all(
    (payload.events || []).map(async (event) => {
      if (!event.replyToken) return;
      const messages = buildReplyMessages(event);
      if (!messages.length) return;
      await replyToLine(event.replyToken, messages);
    })
  );

  jsonResponse(response, 200, { ok: true });
}

function serveStatic(request, response) {
  const url = new URL(request.url, `http://${request.headers.host}`);
  const pathname = decodeURIComponent(url.pathname);
  const requestedPath = pathname === "/" ? "/index.html" : pathname;
  const filePath = normalize(join(rootDir, requestedPath));
  const resolvedPath = resolve(filePath);

  if (!resolvedPath.startsWith(rootDir) || !existsSync(resolvedPath)) {
    response.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
    response.end("Not found");
    return;
  }

  const extension = extname(resolvedPath);
  response.writeHead(200, { "content-type": mimeTypes[extension] || "application/octet-stream" });
  createReadStream(resolvedPath).pipe(response);
}

const server = createServer(async (request, response) => {
  try {
    if (request.method === "OPTIONS") {
      jsonResponse(response, 204, {});
      return;
    }

    if (request.method === "GET" && request.url === "/health") {
      jsonResponse(response, 200, {
        ok: true,
        service: "fortune-line-web",
        webhook: `${publicBaseUrl}/api/line/webhook`,
      });
      return;
    }

    if (request.method === "GET" && request.url.startsWith("/api/automation/templates")) {
      jsonResponse(response, 200, {
        ok: true,
        templates: getAutomationTemplates(),
      });
      return;
    }

    if (request.method === "GET" && request.url.startsWith("/api/member/wallet")) {
      const url = new URL(request.url, `http://${request.headers.host}`);
      const memberId = url.searchParams.get("memberId") || "demo-member-001";
      jsonResponse(response, 200, {
        ok: true,
        wallet: getMemberWallet(memberId),
      });
      return;
    }

    if (request.method === "POST" && request.url === "/api/member/share-reward") {
      const payload = await readJsonBody(request);
      const member = getOrCreateMember(payload.memberId || "demo-member-001");
      const reward = Number(payload.points || 20);
      member.points += reward;
      const ledger = addPointLedger(member.id, "share_reward", reward, payload.note || "分享今日運勢");

      jsonResponse(response, 200, {
        ok: true,
        reward,
        ledger,
        wallet: getMemberWallet(member.id),
      });
      return;
    }

    if (request.method === "POST" && request.url === "/api/member/unlock") {
      const payload = await readJsonBody(request);
      const member = getOrCreateMember(payload.memberId || "demo-member-001");
      const cost = Number(payload.points || 60);

      if (member.points < cost) {
        jsonResponse(response, 402, {
          ok: false,
          error: "POINTS_NOT_ENOUGH",
          message: "點數不足，請先購買點數包或分享今日運勢取得獎勵。",
          wallet: getMemberWallet(member.id),
        });
        return;
      }

      member.points -= cost;
      const reading = {
        id: `reading-${Date.now()}`,
        memberId: member.id,
        type: payload.type || "tarot",
        topic: payload.topic || "深度解析",
        summary: payload.summary || "使用點數解鎖一份深度解析。",
        unlocked: true,
      };
      appData.readings.unshift(reading);
      const ledger = addPointLedger(member.id, "unlock", -cost, payload.note || "深度解析解鎖");

      jsonResponse(response, 200, {
        ok: true,
        reading,
        ledger,
        wallet: getMemberWallet(member.id),
      });
      return;
    }

    if (request.method === "GET" && request.url.startsWith("/api/admin/summary")) {
      jsonResponse(response, 200, {
        ok: true,
        summary: getAdminSummary(),
      });
      return;
    }

    if (request.method === "POST" && request.url === "/api/admin/track-click") {
      const payload = await readJsonBody(request);
      const product = payload.product || "未命名商品";
      const source = payload.source || "unknown";
      const existing = appData.productClicks.find((item) => item.product === product && item.source === source);

      if (existing) {
        existing.clicks += 1;
      } else {
        appData.productClicks.push({
          id: `click-${Date.now()}`,
          product,
          source,
          clicks: 1,
          revenueHint: "本機模擬紀錄，正式版會寫入資料庫",
        });
      }

      jsonResponse(response, 200, {
        ok: true,
        summary: getAdminSummary(),
      });
      return;
    }

    if (request.method === "GET" && request.url.startsWith("/api/payment/plans")) {
      jsonResponse(response, 200, {
        ok: true,
        provider: "ecpay",
        configured: isEcpayConfigured(),
        plans: getPaymentPlans(),
      });
      return;
    }

    if (request.method === "POST" && request.url === "/api/payment/ecpay/create") {
      const payload = await readJsonBody(request);
      const plan = getPaymentPlans().find((item) => item.id === payload.planId) || getPaymentPlans()[0];

      jsonResponse(response, isEcpayConfigured() ? 200 : 202, {
        ok: true,
        provider: "ecpay",
        configured: isEcpayConfigured(),
        mode: ecpayConfig.mode,
        plan,
        message: isEcpayConfigured()
          ? "綠界參數已設定，可進入正式付款串接。"
          : "綠界尚未提供 Merchant ID / HashKey / HashIV，目前先回傳付款流程預覽。",
        returnUrls: {
          success: `${publicBaseUrl}/payment-success.html`,
          failure: `${publicBaseUrl}/payment-failed.html`,
        },
      });
      return;
    }

    if (request.method === "POST" && request.url === "/api/line/push-preview") {
      const payload = await readJsonBody(request);
      const automationTemplates = getAutomationTemplates();
      const template = automationTemplates[payload.template] || automationTemplates.daily;

      if (!payload.userId) {
        jsonResponse(response, 400, {
          ok: false,
          error: "Missing userId. Store LINE userId after webhook events before sending pushes.",
          preview: template,
        });
        return;
      }

      await pushToLine(payload.userId, [textMessage(template)]);
      jsonResponse(response, 200, { ok: true });
      return;
    }

    // ============================================================
    // F30 入口 3 排程信件 + F30 分享 50 點
    // ============================================================
    if (request.method === "POST" && request.url === "/api/letter/schedule") {
      const payload = await readJsonBody(request);
      if (!payload || !payload.body || payload.body.length < 50) {
        jsonResponse(response, 400, { ok: false, error: "信文字數需 ≥ 50" });
        return;
      }
      // Use divination-system.js (lib/) if available
      const letter = {
        name: payload.name || "孩子",
        body: payload.body,
        topic: payload.topic || "感情",
        userId: payload.userId || null, // for LINE push
        submittedAt: Date.now(),
      };
      // Schedule 2-4h delivery (demo: 30s)
      const queued = {
        letterId: "ltr_" + Date.now(),
        submittedAt: letter.submittedAt,
        deliveryAt: letter.submittedAt + (payload.demo ? 30000 : 2 * 60 * 60 * 1000),
        retries: 0,
        status: "queued",
        letter,
      };
      // Generate master letter content using divination-system
      const reading = await generateMasterLetterContent(letter);
      queued.masterContent = reading;
      // Try LINE push if userId + token present
      if (letter.userId && channelAccessToken) {
        try {
          await pushToLine(letter.userId, [{
            type: "text",
            text: `【命運指引】來自小夢老師的一封深夜親筆信\n\n${reading}\n\n—— 小夢老師 深夜親筆`,
          }]);
          queued.status = "delivered";
          queued.deliveredAt = Date.now();
        } catch (e) {
          queued.pushError = String(e);
        }
      }
      // In-app fallback: store in queue
      try {
        const fs = await import("node:fs");
        const queuePath = join(rootDir, "data", "letter-queue.json");
        let queue = [];
        try { queue = JSON.parse(fs.readFileSync(queuePath, "utf8")); } catch {}
        queue.push(queued);
        if (!fs.existsSync(join(rootDir, "data"))) {
          fs.mkdirSync(join(rootDir, "data"), { recursive: true });
        }
        fs.writeFileSync(queuePath, JSON.stringify(queue, null, 2));
      } catch (e) {}
      jsonResponse(response, 200, {
        ok: true,
        letterId: queued.letterId,
        status: queued.status,
        deliveryAt: queued.deliveryAt,
        masterContent: queued.masterContent,
      });
      return;
    }

    if (request.method === "POST" && request.url === "/api/points/award") {
      const payload = await readJsonBody(request);
      // Award 50 points for sharing
      // Track in local server file (in production: Supabase)
      jsonResponse(response, 200, {
        ok: true,
        awarded: 50,
        reason: payload.reason || "share-friend",
        exp: Date.now() + 7 * 24 * 60 * 60 * 1000,
        message: "已為你封存 50 靈性積分,效期 7 天,單筆消費滿 $599 即可折抵 $50。",
      });
      return;
    }

    if (request.method === "POST" && request.url === "/api/line/webhook") {
      await handleLineWebhook(request, response);
      return;
    }

    if (request.method === "GET") {
      serveStatic(request, response);
      return;
    }

    jsonResponse(response, 405, { ok: false, error: "Method not allowed" });
  } catch (error) {
    console.error(error);
    if (error.statusCode === 400 && error.message === "INVALID_JSON") {
      jsonResponse(response, 400, { ok: false, error: "Invalid JSON body" });
      return;
    }
    jsonResponse(response, 500, { ok: false, error: "Internal server error" });
  }
});

server.listen(port, () => {
  console.log(`小夢老師網站：http://localhost:${port}`);
  console.log(`LINE Webhook URL：${publicBaseUrl}/api/line/webhook`);
});
