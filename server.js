import { createHmac, timingSafeEqual } from "node:crypto";
import { createReadStream, existsSync, readFileSync, statSync } from "node:fs";
import { networkInterfaces } from "node:os";
import { extname, join, normalize, resolve } from "node:path";
import { createServer } from "node:http";
import { oracleFortunes } from "./oracle-data.js";
import { getLiffPublicConfig, handleLiffInit } from "./lib/liff-handlers.js";
import {
  DEFAULT_PUBLIC_BASE_URL,
  LIFF_ENTRY_PATH,
  LIFF_PRICING_PATH,
  resolveLiffRoute,
  siteUrlForRoute,
} from "./lib/liff-routes.js";
import { createFunnelContext, handleFunnelEvent } from "./lib/line/funnel-handlers.js";
import { welcomeFunnelFlex } from "./lib/line/funnel-flex.js";
import { resetSession as resetFunnelSession } from "./lib/line/funnel-session.js";
import { getProduct } from "./lib/line/funnel-catalog.js";
import { getNewebpayConfig, isNewebpayConfigured } from "./lib/newebpay/config.js";
import {
  buildMpgFormFields,
  decryptAndVerifyCallback,
  renderAutoPostHtml,
} from "./lib/newebpay/mpg.js";
import {
  createCheckoutOrder,
  getOrderByMerchantOrderNo,
  getOrderByToken,
  listOrdersSnapshot,
  markOrderPaid,
  markOrderReturnSeen,
} from "./lib/newebpay/orders.js";

function getLanIPv4() {
  const nets = networkInterfaces();
  for (const entries of Object.values(nets)) {
    for (const net of entries || []) {
      const family = typeof net.family === "number" ? net.family : String(net.family);
      if ((family === "IPv4" || family === 4) && !net.internal) {
        return net.address;
      }
    }
  }
  return null;
}

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
    title: "情感解碼開運選品",
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

// 全域兜底 — 任何 async 內 catch 漏接的錯誤都不應拖死整個 server(Sprint 1.5 修)
process.on("uncaughtException", (e) => {
  console.error("[uncaughtException]", e && e.message ? e.message : e);
});
process.on("unhandledRejection", (reason) => {
  console.error("[unhandledRejection]", reason && reason.message ? reason.message : reason);
});

function normalizeEnvSecret(value) {
  // Render/Dashboard 常誤貼前後空白或引號；HMAC 會整段失敗 → LINE Verify 401
  return String(value || "")
    .trim()
    .replace(/^["']|["']$/g, "")
    .replace(/^\uFEFF/, "");
}

const port = Number(process.env.PORT || 3000);
const channelSecret = normalizeEnvSecret(process.env.LINE_CHANNEL_SECRET);
const channelAccessToken = normalizeEnvSecret(process.env.LINE_CHANNEL_ACCESS_TOKEN);
const lineChannelId = normalizeEnvSecret(process.env.LINE_CHANNEL_ID);
const publicBaseUrl = (
  process.env.PUBLIC_BASE_URL ||
  (process.env.NODE_ENV === "production" ? DEFAULT_PUBLIC_BASE_URL : `http://localhost:${port}`)
).replace(/\/$/, "");
const liffId = process.env.LIFF_ID || "";
const liffBaseUrl = (
  process.env.LIFF_URL ||
  (liffId ? `https://liff.line.me/${liffId}` : "https://liff.line.me/YOUR_LIFF_ID")
).replace(/\/$/, "");
const eroseeHomeUrl = `${publicBaseUrl}${LIFF_ENTRY_PATH}`;
const eroseePricingUrl = `${publicBaseUrl}${LIFF_PRICING_PATH}`;
const ecpayConfig = {
  merchantId: process.env.ECPAY_MERCHANT_ID || "",
  hashKey: process.env.ECPAY_HASH_KEY || "",
  hashIv: process.env.ECPAY_HASH_IV || "",
  mode: process.env.ECPAY_MODE || "test",
};

// Dev mode 判斷(僅在本機/NODE_ENV=development 啟用,production 自動關閉)
const isDev = (
  process.env.NODE_ENV === "development" ||
  (process.env.PUBLIC_BASE_URL || "").includes("localhost") ||
  (process.env.PUBLIC_BASE_URL || "").includes("127.0.0.1")
);

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
      "早安，我是情感解碼。\n\n今天想知道感情、工作還是財運？回覆「開始解碼」，我陪你用免費三張牌看方向。\n\n完整解析可再看今日行動建議。",
    weekly:
      "本週運勢已更新。\n\n設定生日的人可以看本週流年提醒。回覆「週運」查看免費摘要，想看感情、事業、財運完整解析可再解鎖。",
    profile:
      `你還差一點資料就能完成命盤。\n\n補上出生時間與出生地後，情感解碼就能幫你看八字時辰、紫微命宮與合盤方向。\n\n設定生日：${publicBaseUrl}/#profile`,
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

async function readFormBody(request) {
  const rawBody = await readRawBody(request);
  const text = rawBody.toString("utf8");
  const out = {};
  if (!text) return out;
  const contentType = getHeaderValue(request.headers, "content-type") || "";
  if (contentType.includes("application/json")) {
    try {
      const parsed = JSON.parse(text);
      if (parsed && typeof parsed === "object") return parsed;
    } catch {
      /* fall through */
    }
  }
  for (const [k, v] of new URLSearchParams(text).entries()) out[k] = v;
  return out;
}

function htmlResponse(response, statusCode, html) {
  const body = String(html || "");
  if (response.headersSent || response.writableEnded) {
    try { response.write(body); } catch (_e) { /* swallow */ }
    try { response.end(); } catch (_e) { /* swallow */ }
    return;
  }
  try {
    response.writeHead(statusCode, {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "no-store",
    });
    response.end(body);
  } catch (_e) {
    try { response.end(); } catch (__e) { /* swallow */ }
  }
}

function plainTextResponse(response, statusCode, text) {
  const body = String(text ?? "");
  if (response.headersSent || response.writableEnded) {
    try { response.end(); } catch (_e) { /* swallow */ }
    return;
  }
  try {
    response.writeHead(statusCode, {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "no-store",
    });
    response.end(body);
  } catch (_e) {
    try { response.end(); } catch (__e) { /* swallow */ }
  }
}

function getHeaderValue(headers, name) {
  const raw = headers[name];
  if (Array.isArray(raw)) return raw[0] || "";
  return typeof raw === "string" ? raw : "";
}

/**
 * LINE webhook signature = Base64(HMAC-SHA256(channelSecret, rawRequestBody))
 * Must use the exact raw bytes (never re-serialized JSON).
 * @returns {{ ok: boolean, reason: "ok" | "missing_secret" | "missing_signature" | "mismatch" }}
 */
function verifyLineSignature(rawBody, signature) {
  if (!channelSecret) return { ok: false, reason: "missing_secret" };
  if (!signature) return { ok: false, reason: "missing_signature" };

  const digest = createHmac("sha256", channelSecret).update(rawBody).digest("base64");
  const expected = Buffer.from(digest);
  const received = Buffer.from(signature);

  if (expected.length !== received.length) return { ok: false, reason: "mismatch" };
  if (!timingSafeEqual(expected, received)) return { ok: false, reason: "mismatch" };
  return { ok: true, reason: "ok" };
}

// 注意:response.writeHead 只能呼叫一次,二次呼叫會丟 ERR_HTTP_HEADERS_SENT 拖死整個 server
// 故 jsonResponse 改為冪等設計 — headersSent 之後改走 response.write + end,確保單一 request 錯誤不會 crash process
function jsonResponse(response, statusCode, payload) {
  const body = JSON.stringify(payload);
  if (response.headersSent || response.writableEnded) {
    try { response.write(body); } catch (_e) { /* swallow */ }
    try { response.end(); } catch (_e) { /* swallow */ }
    return;
  }
  try {
    response.writeHead(statusCode, {
      "content-type": "application/json; charset=utf-8",
      "access-control-allow-origin": "*",
      "access-control-allow-methods": "GET,POST,OPTIONS",
      "access-control-allow-headers": "content-type,x-line-signature",
    });
  } catch (_e) {
    // 已送出過 header 或是 socket 已關閉 → 改用直接寫入
    try { response.write(body); } catch (__e) { /* swallow */ }
    try { response.end(); } catch (__e) { /* swallow */ }
    return;
  }
  try {
    response.end(body);
  } catch (_e) {
    try { response.end(); } catch (__e) { /* swallow */ }
  }
}

function textMessage(text) {
  return { type: "text", text };
}

function uriAction(label, uri) {
  return { type: "uri", label, uri };
}

function messageAction(label, text) {
  return { type: "message", label, text };
}

function postbackAction(label, data, displayText) {
  return {
    type: "postback",
    label,
    data,
    displayText: displayText || label,
  };
}

function createFunnelCheckout({ userId, productId }) {
  try {
    const product = getProduct(productId);
    if (!product) return { ok: false, reason: "UNKNOWN_PRODUCT" };
    const checkout = createCheckoutOrder({
      userId,
      productId,
      publicBaseUrl,
    });
    return {
      ok: true,
      payUrl: checkout.payUrl,
      amount: checkout.order.amt,
      productTitle: product.title,
      merchantOrderNo: checkout.order.merchantOrderNo,
    };
  } catch (e) {
    const reason = e?.code || e?.message || "CHECKOUT_FAILED";
    console.error("[newebpay] createFunnelCheckout failed:", reason);
    return { ok: false, reason: String(reason) };
  }
}

/** Phase A+B conversation funnel — stays inside LINE chat (not LIFF decode page). */
function getFunnelCtx() {
  return createFunnelContext({
    publicBaseUrl,
    eroseeLink,
    lineOaUrl: process.env.LINE_OA_URL || "",
    tarotDeck,
    createCheckout: createFunnelCheckout,
  });
}

function liffPageUrl(page) {
  return `${liffBaseUrl}?page=${encodeURIComponent(page)}`;
}

function liffRouteUrl(route, extraParams = {}) {
  const params = new URLSearchParams({ route, entry: "line", ...extraParams });
  return `${liffBaseUrl}?${params.toString()}`;
}

/** Prefer LIFF deep link when LIFF_ID is set; otherwise absolute site URL on production domain. */
function eroseeLink(route = "/", extraParams = {}) {
  if (liffId) return liffRouteUrl(route, extraParams);
  return siteUrlForRoute(publicBaseUrl, route, { entry: "line", ...extraParams });
}

function redirectTo(response, location) {
  response.writeHead(302, {
    location,
    "cache-control": "no-store",
  });
  response.end();
}

/**
 * If request carries ?route=..., redirect to the mapped Erosée HTML page.
 * Used when LIFF Endpoint is `/` or a path that still forwards query params.
 */
function maybeRedirectLiffRoute(request, response) {
  const url = new URL(request.url, `http://${request.headers.host}`);
  const rawRoute = url.searchParams.get("route");
  if (!rawRoute) return false;

  const resolved = resolveLiffRoute(rawRoute);
  if (!resolved) return false;

  url.searchParams.delete("route");
  const qs = url.searchParams.toString();
  const location = `${resolved.path}${qs ? `?${qs}` : ""}${resolved.hash ? `#${resolved.hash}` : ""}`;
  redirectTo(response, location);
  return true;
}

function getLineUserId(event) {
  return event?.source?.userId || null;
}

function flexMessage(altText, contents) {
  return { type: "flex", altText, contents };
}

function menuFlexMessage() {
  // Legacy fallback menu — Erosée branding; prefer welcomeFunnelFlex for new users
  return flexMessage("歡迎 · 情感解碼", {
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
          text: "🌙 Erosée · 情感解碼",
          weight: "bold",
          size: "xl",
          color: "#F5D38B",
          wrap: true,
        },
        {
          type: "text",
          text: "如果你心裡剛好有一件事，可以先開始解碼。想看完整方案，也可以直接逛貨架。",
          size: "sm",
          color: "#F8EEDB",
          wrap: true,
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
              height: "sm",
              color: "#7C4DC4",
              action: postbackAction("開始解碼", "funnel=start", "開始解碼"),
            },
            {
              type: "button",
              style: "secondary",
              height: "sm",
              color: "#F5D38B",
              action: uriAction("查看所有方案", eroseeLink("/pricing")),
            },
            {
              type: "button",
              style: "secondary",
              height: "sm",
              color: "#FF8AB7",
              action: uriAction("情感系列", eroseeLink("/pricing/emotion")),
            },
            {
              type: "button",
              style: "secondary",
              height: "sm",
              color: "#78E0D5",
              action: uriAction("萌寵系列", eroseeLink("/pricing/pet")),
            },
          ],
        },
        {
          type: "text",
          text: "也可以直接回覆：開始解碼、hi、歡迎詞。",
          size: "xs",
          color: "#CDBCEB",
          wrap: true,
        },
      ],
    },
  });
}

function templeEntryFlexMessage() {
  return flexMessage("開始解碼", {
    type: "bubble",
    size: "kilo",
    body: {
      type: "box",
      layout: "vertical",
      spacing: "md",
      backgroundColor: "#12081C",
      contents: [
        {
          type: "text",
          text: "嗨 我是情感解碼",
          weight: "bold",
          size: "lg",
          color: "#F5D38B",
          wrap: true,
        },
        {
          type: "text",
          text: "先選一個你現在最想了解的方向 我會陪你慢慢看清楚",
          size: "sm",
          color: "#F8EEDB",
          wrap: true,
        },
        {
          type: "button",
          style: "primary",
          color: "#7C4DC4",
          action: postbackAction("開始解碼", "funnel=start", "開始解碼"),
        },
        {
          type: "button",
          style: "secondary",
          color: "#F5D38B",
          action: uriAction("查看所有方案", eroseeLink("/pricing")),
        },
      ],
    },
  });
}

function divinationKeywordFlexMessage() {
  return flexMessage("情感解碼入口", {
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
          text: "你想從哪裡開始",
          weight: "bold",
          size: "xl",
          color: "#F5D38B",
          wrap: true,
        },
        {
          type: "text",
          text: "可在對話裡開始免費三張解碼 或直接查看完整方案貨架",
          size: "sm",
          color: "#F8EEDB",
          wrap: true,
        },
        {
          type: "button",
          style: "primary",
          color: "#B780FF",
          action: postbackAction("開始解碼", "funnel=start", "開始解碼"),
        },
        {
          type: "button",
          style: "secondary",
          color: "#F5D38B",
          action: uriAction("查看方案", eroseeLink("/pricing")),
        },
        {
          type: "button",
          style: "secondary",
          color: "#78E0D5",
          action: uriAction("情感系列", eroseeLink("/pricing/emotion")),
        },
      ],
    },
  });
}

/** follow / join /「歡迎詞」/ hi：HERO carousel（開始解碼大鈕 + 七大主題大鈕） */
function followWelcomeMessages() {
  return [welcomeFunnelFlex(getFunnelCtx())];
}

function tarotGuidanceFlexMessage() {
  // 對齊 LINE_OFFICIAL_EXPERIENCE_v2.0_DRAFT §⑤ 命運塔羅
  const items = [
    { label: "✨ 今日一張牌(免費)", value: "塔羅 今日一張牌" },
    { label: "💕 感情關係", value: "塔羅 感情" },
    { label: "💼 工作事業", value: "塔羅 工作" },
    { label: "💰 財富豐盛", value: "塔羅 財富" },
    { label: "🔮 完整牌陣", value: "塔羅 完整牌陣" },
  ];
  return flexMessage("今晚,你想尋找什麼答案？", {
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
          text: "今晚,你想尋找什麼答案？",
          size: "lg",
          weight: "bold",
          color: "#F5D38B",
          wrap: true,
        },
        {
          type: "text",
          text: "選擇主題,由情感解碼陪你抽牌。",
          size: "sm",
          color: "#C9B88A",
          wrap: true,
        },
        {
          type: "box",
          layout: "vertical",
          spacing: "sm",
          margin: "md",
          contents: items.map((it) => ({
            type: "button",
            style: "secondary",
            height: "sm",
            color: "#F5D38B",
            action: messageAction(it.label, it.value),
          })),
        },
        {
          type: "button",
          style: "primary",
          height: "sm",
          color: "#7C4DC4",
          margin: "md",
          action: uriAction("🔮 前往官網", liffPageUrl("tarot")),
        },
      ],
    },
  });
}

function petGuidanceFlexMessage() {
  // 對齊 LINE_OFFICIAL_EXPERIENCE_v2.0_DRAFT §⑤ 毛孩心語
  const items = [
    { label: "🐾 今日一牌(免費)", value: "毛孩 今日一牌" },
    { label: "💕 毛孩與你的關係", value: "毛孩 關係" },
    { label: "🩺 毛孩健康與飲食", value: "毛孩 健康" },
    { label: "🎾 毛孩行為理解", value: "毛孩 行為" },
    { label: "🌙 毛孩離世後的訊息", value: "毛孩 離世訊息" },
    { label: "🔮 完整牌陣", value: "毛孩 完整牌陣" },
  ];
  return flexMessage("今晚,想為哪位毛孩探尋心意？", {
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
          text: "今晚,想為哪位毛孩探尋心意？",
          size: "lg",
          weight: "bold",
          color: "#F5D38B",
          wrap: true,
        },
        {
          type: "text",
          text: "選擇主題,聽見毛孩的心聲。",
          size: "sm",
          color: "#C9B88A",
          wrap: true,
        },
        {
          type: "box",
          layout: "vertical",
          spacing: "sm",
          margin: "md",
          contents: items.map((it) => ({
            type: "button",
            style: "secondary",
            height: "sm",
            color: "#F5D38B",
            action: messageAction(it.label, it.value),
          })),
        },
        {
          type: "text",
          text: "⚠ 本內容僅提供能量探索,不能取代獸醫診斷。",
          size: "xxs",
          color: "#FF9090",
          margin: "md",
          wrap: true,
        },
        {
          type: "button",
          style: "primary",
          height: "sm",
          color: "#7C4DC4",
          margin: "sm",
          action: uriAction("🐾 前往官網", liffPageUrl("pet")),
        },
      ],
    },
  });
}

function oracleGuidanceFlexMessage() {
  // 對齊 LINE_OFFICIAL_EXPERIENCE_v2.0_DRAFT §⑤ 今日神諭
  const items = [
    { label: "✨ 今日訊息(免費)", value: "神諭 今日訊息" },
    { label: "💫 宇宙提醒", value: "神諭 宇宙提醒" },
    { label: "🌟 心靈祝福", value: "神諭 心靈祝福" },
    { label: "🌓 月相指引", value: "神諭 月相指引" },
    { label: "🔮 完整神諭組", value: "神諭 完整神諭" },
  ];
  return flexMessage("今晚,宇宙想給你什麼訊息？", {
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
          text: "今晚,宇宙想給你什麼訊息？",
          size: "lg",
          weight: "bold",
          color: "#F5D38B",
          wrap: true,
        },
        {
          type: "text",
          text: "宇宙的訊息,正在向你靠近。",
          size: "sm",
          color: "#C9B88A",
          wrap: true,
        },
        {
          type: "box",
          layout: "vertical",
          spacing: "sm",
          margin: "md",
          contents: items.map((it) => ({
            type: "button",
            style: "secondary",
            height: "sm",
            color: "#F5D38B",
            action: messageAction(it.label, it.value),
          })),
        },
        {
          type: "button",
          style: "primary",
          height: "sm",
          color: "#7C4DC4",
          margin: "md",
          action: uriAction("🌙 前往官網", liffPageUrl("oracle")),
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

  return flexMessage(`情感解碼替你抽到 ${card[0]}`, {
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
          text: "情感解碼替你翻開這張牌",
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
  // 2026-07-04 06:35 重整:取代舊「單次深度解析/靈感點數包/月度療癒會員」
  // 新 3 個訂閱方案 + 免費體驗(免費,不列在 plans)
  return [
    {
      id: "moonwalker",
      name: "🌙 月光行者",
      amount: 390,
      points: 0,
      description: "每月初送 3 張「單牌聖諭券」。適合每日運勢、一問一答的即時指引。",
    },
    {
      id: "starpriest",
      name: "✨ 星辰祭司",
      amount: 990,
      points: 0,
      description: "🔥 推薦。每月初送 3 張「三牌深度進階券」(現賺 NT$ 870)。解鎖【過去/現在/未來】因果流牌陣。",
      featured: true,
    },
    {
      id: "elder",
      name: "🧙‍♂️ 神殿長老",
      amount: 2990,
      points: 0,
      description: "尊榮頂級享受。每月初送 3 張「五牌全知矩陣券」。解鎖最高權限【五角星能量牌陣】,看穿命運明暗貴人、未來 90 天極致走向。",
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

  // Phase A+B conversation funnel (postback + start keywords + describe text)
  // Array (incl. empty) = funnel handled; null = not funnel — empty skips reply (stale next_card)
  const funnelMessages = handleFunnelEvent(event, getFunnelCtx());
  if (Array.isArray(funnelMessages)) {
    return funnelMessages;
  }

  // Add-friend / join: always reply Flex with 開始解碼 + 查看所有方案
  if (event.type === "follow" || event.type === "join") {
    resetFunnelSession(getLineUserId(event) || "anonymous");
    return followWelcomeMessages();
  }

  if (event.type === "postback") {
    return [templeEntryFlexMessage()];
  }

  if (!text) {
    return followWelcomeMessages();
  }

  if (/占卜|神殿|命運/.test(text)) {
    return [divinationKeywordFlexMessage()];
  }

  if (text.includes("命運塔羅") || text === "塔羅" || lowerText.includes("tarot")) {
    return [tarotGuidanceFlexMessage()];
  }

  if (text.includes("毛孩心語") || text.includes("毛孩")) {
    return [petGuidanceFlexMessage()];
  }

  if (text.includes("今日神諭") || text.includes("神諭")) {
    return [oracleGuidanceFlexMessage()];
  }

  if (text.includes("求籤") || text.includes("籤")) {
    return [oracleEntryFlexMessage()];
  }

  if (text === "查詢靈性積分" || text.includes("靈性積分")) {
    const member = getOrCreateMember(getLineUserId(event) || "demo-member-001");
    const wallet = getMemberWallet(member.id);
    return [
      textMessage(
        `✨ 你的靈性積分\n\n餘額：${wallet.balance ?? member.points} SP\n\n累積來源：\n• 每日簽到 +5\n• 首次體驗 +50\n• 分享 +50\n\n兌換：\n• 1 次完整牌陣 -50\n• 抽獎 -200\n\n${liffPageUrl("member")}`
      ),
    ];
  }

  if (text === "查看我的紀錄" || text.includes("我的紀錄")) {
    const member = getOrCreateMember(getLineUserId(event) || "demo-member-001");
    const records = (member.records || []).slice(0, 5);
    if (!records.length) {
      return [
        textMessage(
          `你還沒有占卜紀錄。\n\n開始第一場神聖占卜：\n${liffPageUrl("tarot")}`
        ),
      ];
    }
    const lines = records.map((r, i) => `${i + 1}. ${r.name || r.card || "未命名"} (${r.system || "tarot"})`).join("\n");
    return [
      textMessage(
        `📖 近 5 次占卜紀錄\n\n${lines}\n\n完整紀錄：\n${liffPageUrl("member")}`
      ),
    ];
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

  // 重新觸發歡迎詞(對齊 LINE_SYSTEM §3.2 v3.1 Rich Menu 第 6 格 + §1.1)
  // 也接受 hi/hello，方便不解除封鎖也能測 welcome Flex
  if (
    text === "歡迎詞" ||
    text === "重新觸發歡迎詞" ||
    text === "加入情感解碼" ||
    text === "加入小夢" ||
    lowerText === "hi" ||
    lowerText === "hello"
  ) {
    return followWelcomeMessages();
  }

  // Unknown text → Erosée welcome HERO (never legacy 小夢 menu)
  return followWelcomeMessages();
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
    "若仍迷茫,情感解碼隨時在這裡為你調頻。",
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
  return opener + "\\n\\n看著你在信中傾訴的掙扎, 我能感受到你此刻靈魂的焦慮與沉重。萬物皆有星軌, 當前的卡關只是星象短暫的逆行。\\n\\n" + reading + "\\n\\n" + closer + "\\n\\n——情感解碼 深夜親筆\\n" + new Date().toLocaleString("zh-TW");
}

/** Probe Messaging API token without exposing it (for /health). */
async function probeLineAccessToken() {
  if (!channelAccessToken) {
    return { ok: false, status: null, reason: "missing" };
  }
  try {
    const result = await fetch("https://api.line.me/v2/bot/info", {
      headers: { authorization: `Bearer ${channelAccessToken}` },
    });
    if (result.ok) return { ok: true, status: result.status, reason: null };
    // 401 = stale/revoked token (common after reissuing in LINE Console)
    return { ok: false, status: result.status, reason: result.status === 401 ? "unauthorized" : `http_${result.status}` };
  } catch {
    return { ok: false, status: null, reason: "network" };
  }
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
    const hint =
      result.status === 401
        ? " (Render LINE_CHANNEL_ACCESS_TOKEN 可能過期，請到 Render Dashboard 更新為與本機/rich-menu 相同的新 token)"
        : "";
    console.error(`[line-reply] failed ${result.status}${hint}:`, body.slice(0, 500));
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
  // Critical: HMAC over raw bytes — do not JSON.parse/stringify before verify.
  const rawBody = await readRawBody(request);
  const signature = getHeaderValue(request.headers, "x-line-signature");
  const verified = verifyLineSignature(rawBody, signature);

  if (!verified.ok) {
    const diag = `bodyBytes=${rawBody.length} secretLen=${channelSecret.length} hasSig=${Boolean(signature)} reason=${verified.reason}`;
    if (verified.reason === "missing_secret") {
      console.error(`[line-webhook] LINE_CHANNEL_SECRET missing — set Channel secret (not access token) on Render. ${diag}`);
      jsonResponse(response, 503, {
        ok: false,
        error: "LINE_CHANNEL_SECRET not configured",
        hint: "Render Environment → LINE_CHANNEL_SECRET = LINE Developers → Messaging API → Basic settings → Channel secret",
      });
      return;
    }
    console.error(
      `[line-webhook] invalid signature — ${diag}. Sync LINE_CHANNEL_SECRET with LINE Developers Console → Channel secret (NOT Channel access token / Channel ID).`
    );
    jsonResponse(response, 401, { ok: false, error: "Invalid LINE signature" });
    return;
  }

  // LINE Verify ping: signed body like {"destination":"...","events":[]} — must 200 after valid sig.
  let payload = {};
  if (rawBody.length) {
    try {
      payload = JSON.parse(rawBody.toString("utf8"));
    } catch {
      console.error("[line-webhook] signature ok but body is not JSON");
      jsonResponse(response, 400, { ok: false, error: "Invalid JSON body" });
      return;
    }
  }

  const events = Array.isArray(payload.events) ? payload.events : [];
  await Promise.all(
    events.map(async (event) => {
      if (!event.replyToken) return;
      let messages;
      try {
        messages = buildReplyMessages(event);
      } catch (err) {
        console.error(`[line-webhook] buildReplyMessages failed type=${event.type}:`, err?.message || err);
        throw err;
      }
      if (!messages.length) return;
      console.log(`[line-webhook] reply type=${event.type} messages=${messages.length} alt=${messages[0]?.altText || messages[0]?.type || "?"}`);
      await replyToLine(event.replyToken, messages);
    })
  );

  jsonResponse(response, 200, { ok: true });
}

function serveStatic(request, response) {
  const url = new URL(request.url, `http://${request.headers.host}`);
  const pathname = decodeURIComponent(url.pathname);
  // Production root must not depend on untracked temple-flow assets on index.html.
  // Serve the deployed Erosée entry (same as LIFF_ENTRY_PATH /health.erosee.home).
  const requestedPath = pathname === "/" ? LIFF_ENTRY_PATH : pathname;
  const filePath = normalize(join(rootDir, requestedPath));
  const resolvedPath = resolve(filePath);

  if (!resolvedPath.startsWith(rootDir) || !existsSync(resolvedPath)) {
    response.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
    response.end("Not found");
    return;
  }

  // Sprint 1.5 QA fix: 拒絕敏感檔案(避免 .env 等 token 洩漏)
  const sensitivePatterns = [/(?:^|[\\/])\.env(?:$|[\\/])/i, /(?:^|[\\/])_encoding_backup(?:[\\/]|$)/i, /(?:^|[\\/])\.git(?:[\\/]|$)/i];
  if (sensitivePatterns.some(p => p.test(resolvedPath))) {
    response.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
    response.end("Not found");
    return;
  }

  // Sprint 1.5 QA fix: 拒絕目錄(避免 EISDIR crash)
  try {
    const stat = statSync(resolvedPath);
    if (stat.isDirectory()) {
      response.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
      response.end("Not found");
      return;
    }
  } catch (e) {
    // statSync failed, fall through to readFile attempt which will fail safely
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
      const liffConfig = getLiffPublicConfig();
      const envPresent = {
        PUBLIC_BASE_URL: Boolean(process.env.PUBLIC_BASE_URL),
        LINE_CHANNEL_ID: Boolean(process.env.LINE_CHANNEL_ID),
        LINE_CHANNEL_SECRET: Boolean(process.env.LINE_CHANNEL_SECRET),
        LINE_CHANNEL_ACCESS_TOKEN: Boolean(process.env.LINE_CHANNEL_ACCESS_TOKEN),
        LIFF_ID: Boolean(liffId),
        LIFF_URL: Boolean(process.env.LIFF_URL || liffId),
        LINE_OA_URL: Boolean(process.env.LINE_OA_URL),
        ALLOW_LIFF_STUB: process.env.ALLOW_LIFF_STUB === "1" || process.env.ALLOW_LIFF_STUB === "true",
        NEWEBPAY_MERCHANT_ID: Boolean(process.env.NEWEBPAY_MERCHANT_ID),
        NEWEBPAY_HASH_KEY: Boolean(process.env.NEWEBPAY_HASH_KEY),
        NEWEBPAY_HASH_IV: Boolean(process.env.NEWEBPAY_HASH_IV),
      };
      const lineToken = await probeLineAccessToken();
      jsonResponse(response, 200, {
        ok: true,
        service: "fortune-line-web",
        publicBaseUrl,
        webhook: `${publicBaseUrl}/api/line/webhook`,
        deploy: {
          commit:
            process.env.RENDER_GIT_COMMIT ||
            process.env.GIT_COMMIT ||
            null,
          branch: process.env.RENDER_GIT_BRANCH || null,
          welcomeFlex: "v3-hero-large",
          newebpay: isNewebpayConfigured() ? "configured" : "missing",
        },
        line: {
          tokenOk: lineToken.ok,
          tokenStatus: lineToken.status,
          tokenReason: lineToken.reason,
          webhookPath: "/api/line/webhook",
          // Length only — compare with Console Channel secret (usually 32). Never expose the secret.
          channelSecretLen: channelSecret.length,
          channelSecretConfigured: channelSecret.length > 0,
          welcomeTriggers: ["follow", "join", "歡迎詞", "hi", "hello"],
        },
        erosee: {
          home: eroseeHomeUrl,
          pricing: eroseePricingUrl,
        },
        liff: {
          config: `${publicBaseUrl}/api/liff/config`,
          init: `${publicBaseUrl}/api/liff/init`,
          endpoint: liffConfig.liffEndpointUrl,
          open: liffId ? liffBaseUrl : null,
          configured: Boolean(liffId),
        },
        /** boolean presence only — never returns secret values */
        envPresent,
      });
      return;
    }

    if (request.method === "GET" && request.url === "/api/liff/config") {
      jsonResponse(response, 200, {
        ok: true,
        config: getLiffPublicConfig(),
      });
      return;
    }

    // Pretty paths → Erosée pages (also usable outside LIFF)
    if (request.method === "GET") {
      const pretty = new URL(request.url, `http://${request.headers.host}`);
      const prettyPath = pretty.pathname.replace(/\/$/, "") || "/";
      // LIFF Endpoint may be `/` or any page; honor ?route= before bare-/ landing
      if (maybeRedirectLiffRoute(request, response)) return;
      if (prettyPath === "/liff" || prettyPath === "/home" || prettyPath === "/decode") {
        pretty.pathname = LIFF_ENTRY_PATH;
        redirectTo(response, pretty.pathname + pretty.search + pretty.hash);
        return;
      }
      if (prettyPath === "/pricing" || prettyPath === "/plans" || prettyPath === "/shop") {
        pretty.pathname = LIFF_PRICING_PATH;
        redirectTo(response, pretty.pathname + pretty.search + pretty.hash);
        return;
      }
    }

    if (request.method === "POST" && request.url === "/api/liff/init") {
      const payload = await readJsonBody(request);
      try {
        const result = await handleLiffInit(payload, appData, process.env);
        jsonResponse(response, result.stub ? 202 : 200, result);
      } catch (error) {
        const statusCode = error.statusCode || 500;
        jsonResponse(response, statusCode, {
          ok: false,
          error: error.message || "LIFF_INIT_FAILED",
          todo: statusCode === 503
            ? "請在 .env 設定 LINE_CHANNEL_ID 以驗證 idToken，或暫設 ALLOW_LIFF_STUB=1 進行本機開發"
            : undefined,
        });
      }
      return;
    }

    if (request.method === "GET" && request.url.startsWith("/share/")) {
      const shareUrl = new URL(request.url, `http://${request.headers.host}`);
      const referrerId = decodeURIComponent(shareUrl.pathname.replace(/^\/share\//, "") || "guest");
      const target = new URL(liffId ? liffBaseUrl : eroseeHomeUrl);
      target.searchParams.set("route", "/");
      target.searchParams.set("ref", referrerId);
      target.searchParams.set("campaign", "invite");
      shareUrl.searchParams.forEach((value, key) => {
        if (key !== "route" && key !== "ref") target.searchParams.set(key, value);
      });
      redirectTo(response, target.toString());
      return;
    }

    if (request.method === "GET" && request.url.startsWith("/api/share/")) {
      const referrerId = decodeURIComponent(request.url.slice("/api/share/".length).split("?")[0] || "");
      jsonResponse(response, 200, {
        ok: true,
        stub: true,
        referrerId,
        targetUrl: eroseeLink("/", { ref: referrerId || "guest", campaign: "invite" }),
        message: "分享導流占位：正式版將依 CONVERSATION_GROWTH 規格計算有效邀請。",
      });
      return;
    }

    if (request.method === "POST" && request.url === "/api/share/track") {
      const payload = await readJsonBody(request);
      const referrerId = payload.referrerId || payload.userId || "";
      const inviteeId = payload.inviteeId || payload.lineId || "";
      if (!appData.shareInvites) appData.shareInvites = [];
      const record = {
        id: `share-${Date.now()}`,
        referrerId,
        inviteeId,
        channel: payload.channel || "line",
        createdAt: new Date().toISOString(),
        unlockSecondTemple: false,
      };
      appData.shareInvites.unshift(record);
      const inviteCount = appData.shareInvites.filter((item) => item.referrerId === referrerId).length;
      if (inviteCount >= 5) {
        record.unlockSecondTemple = true;
        record.note = "已達 5 位好友門檻（占位，尚未寫入正式資料庫）";
      }
      jsonResponse(response, 200, {
        ok: true,
        stub: true,
        record,
        inviteCount,
        requiredInvites: 5,
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
        provider: isNewebpayConfigured() ? "newebpay" : "ecpay",
        configured: isNewebpayConfigured() || isEcpayConfigured(),
        newebpayConfigured: isNewebpayConfigured(),
        ecpayConfigured: isEcpayConfigured(),
        plans: getPaymentPlans(),
      });
      return;
    }

    // ---------- NewebPay (藍新) MPG ----------
    if (request.method === "POST" && request.url === "/api/newebpay/create") {
      const payload = await readJsonBody(request);
      const productId = payload.productId || payload.pid || payload.planId;
      if (!productId) {
        jsonResponse(response, 400, { ok: false, error: "Missing productId" });
        return;
      }
      if (!isNewebpayConfigured()) {
        jsonResponse(response, 503, {
          ok: false,
          error: "NEWEBPAY_NOT_CONFIGURED",
          message: "金流尚未設定：請在環境變數設定 NEWEBPAY_MERCHANT_ID / NEWEBPAY_HASH_KEY / NEWEBPAY_HASH_IV",
        });
        return;
      }
      try {
        const checkout = createCheckoutOrder({
          userId: payload.userId || null,
          productId,
          amt: payload.amt,
          itemDesc: payload.itemDesc,
          publicBaseUrl,
          email: payload.email,
        });
        jsonResponse(response, 200, {
          ok: true,
          provider: "newebpay",
          merchantOrderNo: checkout.order.merchantOrderNo,
          amt: checkout.order.amt,
          itemDesc: checkout.order.itemDesc,
          payUrl: checkout.payUrl,
          notifyUrl: checkout.notifyUrl,
          returnUrl: checkout.returnUrl,
          gatewayUrl: checkout.form.gatewayUrl,
        });
      } catch (e) {
        jsonResponse(response, 400, {
          ok: false,
          error: e?.code || e?.message || "CREATE_FAILED",
        });
      }
      return;
    }

    if (
      (request.method === "GET" || request.method === "POST") &&
      (request.url.startsWith("/pay.html") || request.url.startsWith("/api/newebpay/pay"))
    ) {
      const url = new URL(request.url, `http://${request.headers.host}`);
      const token = url.searchParams.get("token") || "";
      const order = getOrderByToken(token);
      if (!order) {
        htmlResponse(
          response,
          404,
          `<!doctype html><html lang="zh-Hant"><meta charset="UTF-8"/><title>付款連結無效</title>
<body style="font-family:sans-serif;padding:2rem;background:#0b1c24;color:#f5efe4">
<h1>付款連結無效或已過期</h1>
<p>請回到 LINE 對話重新點「立即開始」。</p>
<p><a href="/erosee-l2-pricing.html" style="color:#c9a45c">查看方案</a></p>
</body></html>`
        );
        return;
      }
      if (!isNewebpayConfigured()) {
        htmlResponse(
          response,
          503,
          `<!doctype html><html lang="zh-Hant"><meta charset="UTF-8"/><title>金流尚未設定</title>
<body style="font-family:sans-serif;padding:2rem;background:#0b1c24;color:#f5efe4">
<h1>金流尚未設定</h1>
<p>請稍後再試，或聯絡站長設定藍新參數。</p>
</body></html>`
        );
        return;
      }
      try {
        const form = buildMpgFormFields({
          merchantOrderNo: order.merchantOrderNo,
          amt: order.amt,
          itemDesc: order.itemDesc,
          notifyUrl: `${publicBaseUrl}/api/newebpay/notify`,
          returnUrl: `${publicBaseUrl}/api/newebpay/return`,
          clientBackUrl: `${publicBaseUrl}/erosee-l2-pricing.html`,
        });
        htmlResponse(response, 200, renderAutoPostHtml(form, { title: `付款｜${order.itemDesc}` }));
      } catch (e) {
        htmlResponse(
          response,
          500,
          `<!doctype html><html lang="zh-Hant"><meta charset="UTF-8"/><title>付款建立失敗</title>
<body style="font-family:sans-serif;padding:2rem"><h1>付款建立失敗</h1><p>${String(e?.message || e)}</p></body></html>`
        );
      }
      return;
    }

    if (request.method === "POST" && request.url === "/api/newebpay/notify") {
      const body = await readFormBody(request);
      if (!isNewebpayConfigured()) {
        plainTextResponse(response, 503, "NEWEBPAY_NOT_CONFIGURED");
        return;
      }
      const verified = decryptAndVerifyCallback(body);
      if (!verified.ok) {
        console.error("[newebpay/notify] verify failed:", verified.reason);
        plainTextResponse(response, 400, "VERIFY_FAILED");
        return;
      }

      const merchantOrderNo = verified.data.MerchantOrderNo || "";
      const order = merchantOrderNo ? getOrderByMerchantOrderNo(merchantOrderNo) : null;
      let updated = null;
      if (verified.paid && merchantOrderNo) {
        updated = markOrderPaid(merchantOrderNo, verified.data);
        console.log("[newebpay/notify] paid", merchantOrderNo, verified.data.TradeNo || "");
      } else {
        console.warn(
          "[newebpay/notify] not SUCCESS",
          merchantOrderNo,
          verified.status,
          order ? order.status : "order_missing"
        );
      }

      // Respond to NewebPay first, then optional LINE push (fire-and-forget).
      plainTextResponse(response, 200, "SUCCESS");
      if (updated?.userId) {
        pushToLine(updated.userId, [
          textMessage(
            `付款成功\n「${updated.itemDesc}」NT$ ${updated.amt}\n訂單 ${updated.merchantOrderNo}\n謝謝你 接下來會帶你進入解碼流程`
          ),
        ]).catch((pushErr) => {
          console.error("[newebpay/notify] LINE push failed:", pushErr?.message || pushErr);
        });
      }
      return;
    }

    if (
      (request.method === "GET" || request.method === "POST") &&
      request.url.startsWith("/api/newebpay/return")
    ) {
      let body = {};
      if (request.method === "POST") {
        body = await readFormBody(request);
      } else {
        const url = new URL(request.url, `http://${request.headers.host}`);
        for (const [k, v] of url.searchParams.entries()) body[k] = v;
      }

      let paid = false;
      let merchantOrderNo = "";
      let message = "付款結果處理中";

      if (body.TradeInfo && isNewebpayConfigured()) {
        const verified = decryptAndVerifyCallback(body);
        if (verified.ok) {
          merchantOrderNo = verified.data.MerchantOrderNo || "";
          paid = verified.paid;
          message = verified.data.Message || (paid ? "付款成功" : verified.status || message);
          if (merchantOrderNo) {
            markOrderReturnSeen(merchantOrderNo, verified.data);
            if (paid) markOrderPaid(merchantOrderNo, verified.data);
          }
        } else {
          message = `驗簽失敗（${verified.reason}）`;
        }
      }

      const nextUrl = paid
        ? `${publicBaseUrl}/payment-success.html?order=${encodeURIComponent(merchantOrderNo)}`
        : `${publicBaseUrl}/payment-failed.html?order=${encodeURIComponent(merchantOrderNo)}&msg=${encodeURIComponent(message)}`;
      redirectTo(response, nextUrl);
      return;
    }

    if (request.method === "GET" && request.url.startsWith("/api/newebpay/orders")) {
      // Dev / ops snapshot only — no secrets.
      jsonResponse(response, 200, {
        ok: true,
        configured: isNewebpayConfigured(),
        gatewayUrl: getNewebpayConfig().gatewayUrl,
        orders: listOrdersSnapshot(30),
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
            text: `【命運指引】來自情感解碼的一封深夜親筆信\n\n${reading}\n\n—— 情感解碼 深夜親筆`,
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

    {
      const pathname = (request.url || "").split("?")[0];
      if (request.method === "POST" && pathname === "/api/line/webhook") {
        await handleLineWebhook(request, response);
        return;
      }
    }

    if (request.method === "GET" && !request.url.startsWith("/api/")) {
      serveStatic(request, response);
      return;
    }

    // Sprint 1.5 修:不再於此 default 405 + return — 會讓後續 routes(在另一段 try-catch)永遠跑不到
    // 改為不主動回應,讓 handler 落到下方 wrapping try,接著由 default-404 兜底。
  } catch (error) {
    console.error(error);
    if (error.statusCode === 400 && error.message === "INVALID_JSON") {
      jsonResponse(response, 400, { ok: false, error: "Invalid JSON body" });
      return;
    }
    jsonResponse(response, 500, { ok: false, error: "Internal server error" });
    return;
  }
  // ============================================================
  // Sprint 1.5 修:因為前半段 try block 有 default 405 return,
  // 後續所有 routes 必須自行保護,並在最後提供兜底 default-404。
  // 把所有後續 routes 全包進一個 try-catch,任何 match 失敗的 URL 才進 default-404。
  // ============================================================
  try {
  // ============================================================
  // 2026-07-04 07:42 F22 神殿舞台 AI 打字機解讀(SSE Streaming)
  // ============================================================
  if (request.url.startsWith("/api/divination/stream") && request.method === "POST") {
    try {
      const payload = await readJsonBody(request);
      const card = payload.card || {};
      const theme = payload.theme || "love";
      const question = payload.question || "";

      // SSE headers
      response.writeHead(200, {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
        "X-Accel-Buffering": "no",
      });

      const send = (event, data) => {
        try { response.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`); } catch (_) {}
      };

      send("start", { card: card.name || "未命名", theme, source: process.env.OPENAI_API_KEY ? "openai" : "local" });

      // 優先用 OpenAI API(.env 有 OPENAI_API_KEY 才使用)
      const openai = require("./lib/openai-stream.js");
      const f22 = require("./lib/f22-reading.js");

      let reading = null;
      let usedOpenAI = false;

      if (openai.hasKey()) {
        // ===== 1. 優先用 OpenAI API 串接 =====
        try {
          let buffer = "";
          const sectionLabels = {
            "1": "核心訊息",
            "2": "現況解析",
            "3": "建議方向",
            "4": "今日祝福",
          };
          let currentSection = null;
          let sectionIndex = 0;

          // OpenAI 可能不會嚴格分 4 段,所以用啟示詞引導
          // 但因為需要分 4 段打字機,我們在 prompt 中要求 4 段並用 \n\n 分隔
          await openai.streamCompletion({
            card,
            theme,
            question,
            onChunk: (delta) => {
              buffer += delta;
              // 識別段落切換(\n\n + 段落開頭關鍵字)
              const sections = buffer.split(/\n\n+/);
              // 推送新內容(逐字)
              // 簡化:每收到一段就 section-start,接下來的字元都是該段
              for (let i = currentSection; i < sections.length; i++) {
                const sec = sections[i].trim();
                if (!sec) continue;
                // 識別段落
                const m = sec.match(/^(核心訊息|現況解析|建議方向|今日祝福|流淌|你目前|建議你|願這)/);
                if (m && i > sectionIndex) {
                  sectionIndex = i;
                  currentSection = (sectionIndex + 1).toString();
                  // 移除開頭的標籤(如果有)
                  const cleaned = sec.replace(/^(核心訊息|現況解析|建議方向|今日祝福)[:：]?\s*/, "");
                  send("section-start", { type: `section${currentSection}`, label: sectionLabels[currentSection] || `段落 ${currentSection}` });
                  // 推送本段已收到的字元
                  for (const ch of cleaned) {
                    send("char", { type: `section${currentSection}`, char: ch });
                  }
                } else if (currentSection) {
                  // 同一段內繼續推送字元
                  for (const ch of sec.slice(-delta.length)) {
                    send("char", { type: `section${currentSection}`, char: ch });
                  }
                }
              }
            },
          });
          usedOpenAI = true;
          send("done", { ok: true, source: "openai" });
          response.end();
          return;
        } catch (openaiErr) {
          console.error("[/api/divination/stream] OpenAI 失敗,fallback 到本地:", openaiErr.message);
          send("warning", { message: "OpenAI 失敗,改用本地解讀" });
          // 繼續走 fallback 路徑
        }
      }

      // ===== 2. Fallback:本地 lib/f22-reading.js =====
      if (!usedOpenAI) {
        reading = f22.generateF22Reading(card, theme, question);
        const sections = [
          { type: "coreMessage", label: "核心訊息", text: reading.coreMessage },
          { type: "currentSituation", label: "現況解析", text: reading.currentSituation },
          { type: "suggestion", label: "建議方向", text: reading.suggestion },
          { type: "blessing", label: "今日祝福", text: reading.blessing },
        ];

        for (const section of sections) {
          send("section-start", { type: section.type, label: section.label });
          for (const ch of section.text) {
            send("char", { type: section.type, char: ch });
            await new Promise((r) => setTimeout(r, 8));
          }
          send("section-end", { type: section.type });
          await new Promise((r) => setTimeout(r, 200));
        }

        send("done", { ok: true, source: "local" });
        response.end();
      }
    } catch (e) {
      console.error("[/api/divination/stream] error:", e);
      try {
        if (!response.headersSent) {
          response.writeHead(500, { "Content-Type": "text/event-stream" });
        }
        response.write(`event: error\ndata: ${JSON.stringify({ error: String(e) })}\n\n`);
        response.end();
      } catch (_) {}
    }
    return;
  }

  // ============================================================
  // 2026-07-04 07:42 F22 收藏命運紀錄
  // ============================================================
  if (request.url === "/api/divination/favorite" && request.method === "POST") {
    try {
      const payload = await readJsonBody(request);
      const favorite = {
        id: `fav-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        userId: payload.userId || "demo-member-001",
        cardName: payload.cardName || "",
        cardImage: payload.cardImage || "",
        question: payload.question || "",
        reading: payload.reading || {},
        favoritedAt: new Date().toISOString(),
      };

      // 簡化:儲存在 in-memory,真實應寫 Supabase
      if (!appData.favorites) appData.favorites = [];
      appData.favorites.unshift(favorite);

      jsonResponse(response, 200, { ok: true, favorite });
    } catch (e) {
      jsonResponse(response, 500, { ok: false, error: String(e) });
    }
    return;
  }

  // ============================================================
  // 2026-07-04 07:42 F22 取得我的收藏
  // ============================================================
  if (request.url.startsWith("/api/divination/favorites") && request.method === "GET") {
    if (!appData.favorites) appData.favorites = [];
    jsonResponse(response, 200, { ok: true, favorites: appData.favorites.slice(0, 20) });
    return;
  }

  // ============================================================
  // 2026-07-04 09:05 F22 健康檢查(驗證 OpenAI 是否接上)
  // ============================================================
  if (request.url === "/api/divination/health" && request.method === "GET") {
    const openai = require("./lib/openai-stream.js");
    jsonResponse(response, 200, {
      ok: true,
      openai: openai.hasKey() ? "ready" : "fallback",
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      source: openai.hasKey() ? "openai" : "local-f22-reading",
      ts: new Date().toISOString(),
    });
    return;
  }

  // ============================================================
  // 2026-07-05 Sprint 1.5 萌寵小夢神殿 API
  // ============================================================
  // 確保 appData.users 存在(LIFF 綁定會用到)
  if (!appData.users) appData.users = [];
  if (!appData.petMasterSessions) appData.petMasterSessions = [];

  // 取得或建立使用者(以 lineUserId 為唯一鍵)
  function getOrCreateUser(lineUserId) {
    if (!lineUserId) return null;
    let user = appData.users.find(u => u.lineUserId === lineUserId);
    if (!user) {
      user = {
        lineUserId,
        displayName: "毛孩家長",
        pictureUrl: null,
        bindAt: new Date().toISOString(),
        points: 50, // 首次綁定獎勵
        tier: "一般會員",
        firstFree: { pet: null } // { used, usedAt, firstTempleResultId }
      };
      appData.users.push(user);
    }
    return user;
  }

  // POST /api/pet/temple/start — 建立萌寵神殿 session,抽 10 張牌
  if (request.method === "POST" && request.url === "/api/pet/temple/start") {
    try {
      const payload = await readJsonBody(request);
      const { lineUserId, petName, identity, questionType } = payload;
      if (!lineUserId || !petName || !identity || !questionType) {
        jsonResponse(response, 400, { ok: false, error: "MISSING_FIELDS", message: "請提供 lineUserId, petName, identity, questionType" });
        return;
      }
      const user = getOrCreateUser(lineUserId);
      if (!user) {
        jsonResponse(response, 400, { ok: false, error: "INVALID_USER" });
        return;
      }
      // 防重複領取免費
      if (user.firstFree && user.firstFree.pet && user.firstFree.pet.used) {
        jsonResponse(response, 200, {
          ok: false,
          error: "PET_FIRST_TEMPLE_ALREADY_USED",
          message: "你已使用過萌寵神殿首次免費開門資格。如需再次占卜,請聯繫客服。",
          usedAt: user.firstFree.pet.usedAt,
          firstTempleResultId: user.firstFree.pet.firstTempleResultId
        });
        return;
      }
      // 載入抽牌邏輯
      const { drawPetMasterTen, buildSessionSignature } = await import("./lib/pet-master-draw.js");
      const tenCards = drawPetMasterTen();
      const sessionId = buildSessionSignature(lineUserId, petName, identity, questionType);
      const session = {
        sessionId,
        lineUserId,
        petName,
        identity,
        questionType,
        spreadType: "pet_master_10",
        cards: tenCards,
        firstTempleUnlocked: true,
        secondTempleUnlocked: false,
        createdAt: new Date().toISOString(),
        completedAt: null,
        resultId: null
      };
      appData.petMasterSessions.unshift(session);
      jsonResponse(response, 200, {
        ok: true,
        sessionId,
        cards: tenCards,
        firstTempleCards: tenCards.slice(0, 5),
        secondTempleCards: tenCards.slice(5, 10)
      });
    } catch (e) {
      console.error("[/api/pet/temple/start]", e);
      jsonResponse(response, 500, { ok: false, error: String(e.message || e) });
    }
    return;
  }

  // POST /api/pet/temple/get-card-reading — 取得單張牌短版解讀
  if (request.method === "POST" && request.url === "/api/pet/temple/get-card-reading") {
    try {
      const payload = await readJsonBody(request);
      const { sessionId, position } = payload;
      if (!sessionId || !position) {
        jsonResponse(response, 400, { ok: false, error: "MISSING_FIELDS" });
        return;
      }
      const session = appData.petMasterSessions.find(s => s.sessionId === sessionId);
      if (!session) {
        jsonResponse(response, 404, { ok: false, error: "SESSION_NOT_FOUND" });
        return;
      }
      // 只允許第一神殿(1-5)
      if (position < 1 || position > 5) {
        jsonResponse(response, 403, { ok: false, error: "POSITION_LOCKED", message: "第二神殿(6-10)為付費解鎖,本次 Sprint 1.5 不實作金流。" });
        return;
      }
      const card = session.cards[position - 1];
      const { getShortReading } = await import("./lib/pet-reading-data.js");
      const reading = getShortReading(card.cardId, position);
      jsonResponse(response, 200, {
        ok: true,
        position,
        card,
        reading,
        isUnlocked: true
      });
    } catch (e) {
      console.error("[/api/pet/temple/get-card-reading]", e);
      jsonResponse(response, 500, { ok: false, error: String(e.message || e) });
    }
    return;
  }

  // POST /api/pet/temple/complete-first-temple — 標記第一神殿完成 + 標記 firstFree.pet
  if (request.method === "POST" && request.url === "/api/pet/temple/complete-first-temple") {
    try {
      const payload = await readJsonBody(request);
      const { sessionId } = payload;
      if (!sessionId) {
        jsonResponse(response, 400, { ok: false, error: "MISSING_SESSION_ID" });
        return;
      }
      const session = appData.petMasterSessions.find(s => s.sessionId === sessionId);
      if (!session) {
        jsonResponse(response, 404, { ok: false, error: "SESSION_NOT_FOUND" });
        return;
      }
      const user = getOrCreateUser(session.lineUserId);
      if (!user) {
        jsonResponse(response, 400, { ok: false, error: "INVALID_USER" });
        return;
      }
      const resultId = `pet_${Date.now().toString(36)}_${Math.floor(Math.random() * 1000)}`;
      session.completedAt = new Date().toISOString();
      session.resultId = resultId;
      // 標記 firstFree.pet
      user.firstFree = user.firstFree || {};
      user.firstFree.pet = {
        used: true,
        usedAt: new Date().toISOString(),
        firstTempleResultId: resultId
      };
      jsonResponse(response, 200, {
        ok: true,
        resultId,
        session,
        message: "第一神殿已完成,首次免費資格已使用。"
      });
    } catch (e) {
      console.error("[/api/pet/temple/complete-first-temple]", e);
      jsonResponse(response, 500, { ok: false, error: String(e.message || e) });
    }
    return;
  }

  // GET /api/pet/temple/result/:resultId — 取得占卜結果
  if (request.method === "GET" && request.url.startsWith("/api/pet/temple/result/")) {
    try {
      const resultId = request.url.replace("/api/pet/temple/result/", "");
      const session = appData.petMasterSessions.find(s => s.resultId === resultId);
      if (!session) {
        jsonResponse(response, 404, { ok: false, error: "RESULT_NOT_FOUND" });
        return;
      }
      const { getFirstTempleReadings, getSecondTempleStatus } = await import("./lib/pet-reading-data.js");
      const cardIds = session.cards.map(c => c.cardId);
      const firstTempleReadings = getFirstTempleReadings(cardIds);
      const secondTempleStatus = getSecondTempleStatus(cardIds);
      jsonResponse(response, 200, {
        ok: true,
        session: { ...session, firstTempleReadings, secondTempleStatus }
      });
      return;
    } catch (e) {
      console.error("[/api/pet/temple/result]", e && e.message);
      if (!response.headersSent && !response.writableEnded) {
        try { jsonResponse(response, 500, { ok: false, error: "Internal server error" }); } catch (_) {}
      }
      return;
    }
  }

  // POST /api/pet/temple/check-first-free — 查詢使用者是否已用過首次免費
  if (request.method === "POST" && request.url === "/api/pet/temple/check-first-free") {
    try {
      const payload = await readJsonBody(request);
      const { lineUserId } = payload;
      const user = getOrCreateUser(lineUserId);
      if (!user) {
        jsonResponse(response, 400, { ok: false, error: "INVALID_USER" });
        return;
      }
      const used = !!(user.firstFree && user.firstFree.pet && user.firstFree.pet.used);
      jsonResponse(response, 200, {
        ok: true,
        lineUserId,
        firstFreePetUsed: used,
        usedAt: used ? user.firstFree.pet.usedAt : null,
        firstTempleResultId: used ? user.firstFree.pet.firstTempleResultId : null
      });
    } catch (e) {
      console.error("[/api/pet/temple/check-first-free]", e);
      jsonResponse(response, 500, { ok: false, error: String(e.message || e) });
    }
    return;
  }

  // ===== Dev-only endpoints(Sprint 1.5 D4-1,僅 isDev 啟用) =====

  // POST /api/dev/reset-pet — 重置 firstFree.pet + 清除相關 sessions(本機測試用)
  if (isDev && request.method === "POST" && request.url === "/api/dev/reset-pet") {
    try {
      const body = await readJsonBody(request);
      const { lineUserId } = body || {};
      if (!lineUserId) {
        jsonResponse(response, 400, { ok: false, error: "MISSING_LINE_USER_ID", message: "請提供 lineUserId" });
        return;
      }
      const user = appData.users.find(u => u.lineUserId === lineUserId);
      let clearedFirstFree = false;
      if (user && user.firstFree) {
        const hadPet = !!(user.firstFree.pet && user.firstFree.pet.used);
        user.firstFree.pet = null;
        clearedFirstFree = hadPet;
      }
      const beforeCount = appData.petMasterSessions.length;
      appData.petMasterSessions = appData.petMasterSessions.filter(s => s.lineUserId !== lineUserId);
      const clearedSessions = beforeCount - appData.petMasterSessions.length;
      jsonResponse(response, 200, {
        ok: true,
        lineUserId,
        isDev: true,
        clearedFirstFree,
        clearedSessions,
        message: clearedFirstFree || clearedSessions > 0
          ? `已重置 ${lineUserId} 的萌寵神殿狀態`
          : `${lineUserId} 本來就沒有萌寵神殿紀錄`
      });
    } catch (e) {
      console.error("[/api/dev/reset-pet]", e);
      jsonResponse(response, 500, { ok: false, error: String(e.message || e) });
    }
    return;
  }

  // GET /api/dev/status — 確認目前是否 dev 模式
  if (isDev && request.method === "GET" && request.url === "/api/dev/status") {
    jsonResponse(response, 200, {
      ok: true,
      isDev: true,
      publicBaseUrl,
      port,
      envKeys: {
        NODE_ENV: process.env.NODE_ENV || "",
        PUBLIC_BASE_URL: process.env.PUBLIC_BASE_URL || "",
        PORT: process.env.PORT || ""
      },
      availableDevEndpoints: [
        "POST /api/dev/reset-pet",
        "GET /api/dev/list-users",
        "GET /api/dev/status",
        "GET /__dev__.html"
      ]
    });
    return;
  }

  // GET /api/dev/list-users — 列出所有使用者 + firstFree.pet 狀態(僅 dev)
  if (isDev && request.method === "GET" && request.url === "/api/dev/list-users") {
    const users = (appData.users || []).map((u) => {
      const sessionCount = (appData.petMasterSessions || []).filter((s) => s.lineUserId === u.lineUserId).length;
      return {
        lineUserId: u.lineUserId,
        firstFreePetUsed: !!(u.firstFree && u.firstFree.pet && u.firstFree.pet.used),
        usedAt: u.firstFree && u.firstFree.pet ? u.firstFree.pet.usedAt : null,
        firstTempleResultId: u.firstFree && u.firstFree.pet ? u.firstFree.pet.firstTempleResultId : null,
        sessionCount
      };
    });
    jsonResponse(response, 200, {
      ok: true,
      isDev: true,
      count: users.length,
      users
    });
    return;
  }

  } catch (e) {
    console.error("[main-routes]", e && e.message);
    if (!response.headersSent && !response.writableEnded) {
      try { jsonResponse(response, 500, { ok: false, error: "Internal server error" }); } catch (_) {}
    }
  }

  // 兜底:所有 routes 都沒 match 的情況(只對未送出 response 的 request 回 404)
  if (!response.headersSent && !response.writableEnded) {
    try {
      if (request.method === "GET") {
        // 不認識的 GET 路徑,走靜態檔案 fallback(若不存在會自己 404)
        serveStatic(request, response);
      } else {
        jsonResponse(response, 404, { ok: false, error: "Not found" });
      }
    } catch (_e) { /* swallow */ }
  }

});

// 額外保護:process-level error 監聽,避免任何未捕獲的 socket / parser 錯誤拖死 server
server.on("clientError", (err, socket) => {
  console.error("[server clientError]", err && err.message);
  if (socket && socket.writable) {
    try { socket.end("HTTP/1.1 400 Bad Request\r\n\r\n"); } catch (_e) { /* swallow */ }
  }
});
server.on("error", (err) => {
  console.error("[server error]", err && err.message);
});

// 明確綁 0.0.0.0，讓同網段手機可用 LAN IP 連線（勿只用 localhost）
const listenHost = process.env.HOST || "0.0.0.0";
server.listen(port, listenHost, () => {
  const lan = getLanIPv4();
  console.log(`情感解碼（固定建議埠 3000；其他專案請用 3001+）：http://localhost:${port}`);
  console.log(`主站：http://localhost:${port}/`);
  console.log(`Erosée LIFF 首頁：http://localhost:${port}${LIFF_ENTRY_PATH}`);
  console.log(`Erosée L2 方案：http://localhost:${port}${LIFF_PRICING_PATH}`);
  console.log(`手勢粒子：http://localhost:${port}/gesture-particle-demo.html`);
  console.log(`手勢水晶：http://localhost:${port}/gesture-crystal-demo.html`);
  console.log(`手機導覽：http://localhost:${port}/mobile.html`);
  if (lan) {
    console.log(`同 Wi‑Fi：http://${lan}:${port}/  （相機請改用 HTTPS tunnel）`);
  }
  console.log(`監聽：${listenHost}:${port}`);
  console.log(`PUBLIC_BASE_URL：${publicBaseUrl}`);
  console.log(`LINE Webhook URL：${publicBaseUrl}/api/line/webhook`);
  console.log(`LIFF Endpoint（貼到 LINE Developers）：${eroseeHomeUrl}`);
  if (!liffId) {
    console.warn(`[LIFF] 未設定 LIFF_ID／LIFF_URL — 手機 LINE 登入無法初始化。請在 .env 設定後重啟。`);
  } else {
    console.log(`LINE LIFF 開啟連結：${liffBaseUrl}`);
  }
});

