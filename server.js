import { createHmac, timingSafeEqual } from "node:crypto";
import { createReadStream, existsSync, readFileSync } from "node:fs";
import { extname, join, normalize, resolve } from "node:path";
import { createServer } from "node:http";

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

const oraclePoems = [
  "心定則路明，事緩則局開。",
  "雲散月自現，貴人近身來。",
  "先守後可進，勿急自有成。",
  "一念轉方向，舊局生新光。",
  "話到七分止，緣分十分留。",
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

function verifyLineSignature(rawBody, signature) {
  if (!channelSecret || !signature) return false;

  const digest = createHmac("sha256", channelSecret).update(rawBody).digest("base64");
  const expected = Buffer.from(digest);
  const received = Buffer.from(signature);

  if (expected.length !== received.length) return false;
  return timingSafeEqual(expected, received);
}

function jsonResponse(response, statusCode, payload) {
  response.writeHead(statusCode, { "content-type": "application/json; charset=utf-8" });
  response.end(JSON.stringify(payload));
}

function textMessage(text) {
  return { type: "text", text };
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

function buildReplyMessages(event) {
  const text = event.message?.type === "text" ? event.message.text.trim() : "";
  const lowerText = text.toLowerCase();

  if (event.type === "follow") {
    return [
      textMessage(
        `歡迎光臨，我是小夢老師。\n\n先設定生日，就能幫你看塔羅、求籤、生命靈數與命盤方向。\n\n你可以輸入：\n設定生日\n塔羅\n求籤\n靈數 1996-08-18\n命盤\nMBTI\n市集\n\n設定生日入口：${publicBaseUrl}/#profile`
      ),
    ];
  }

  if (!text) {
    return [textMessage("請輸入「設定生日」「塔羅」「求籤」「靈數 1996-08-18」「命盤」「MBTI」或「市集」。")];
  }

  if (text.includes("塔羅") || lowerText.includes("tarot")) {
    const card = randomItem(tarotDeck);
    return [
      textMessage(
        `小夢老師替你抽到：${card[0]}\n\n免費簡易解析：${card[1]}\n\n想看完整解析，可解鎖感情、事業、財運與下一步行動建議。\n${publicBaseUrl}/#demo`
      ),
    ];
  }

  if (text.includes("求籤") || text.includes("籤")) {
    return [
      textMessage(
        `今日籤詩：${randomItem(oraclePoems)}\n\n這是免費籤詩。想看完整解籤、感情/事業/財運分項，之後可接付費解鎖。\n${publicBaseUrl}/#demo`
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
        `你的生命靈數是：${lifePath}\n\n免費簡易解析：這代表你目前的人生主題與天賦方向。完整人格、感情、事業與流年解析可做成付費報告。\n${publicBaseUrl}/#demo`
      ),
    ];
  }

  if (text.includes("設定生日") || text.includes("生日") || text.includes("命盤") || text.includes("紫微") || text.includes("八字") || text.includes("占星")) {
    return [
      textMessage(
        `請先設定生日資料。\n\n需要填：暱稱、性別、出生日期、出生時間、出生地。\n之後會自動帶入八字、紫微斗數、生命靈數、合盤與擇日功能。\n${publicBaseUrl}/#profile`
      ),
    ];
  }

  if (text.toUpperCase().includes("MBTI")) {
    return [
      textMessage(
        `MBTI 測驗會做成 12 題快速版與完整付費版。\n\n免費版看人格輪廓，完整版延伸感情、職場、溝通模式與適合商品推薦。\n${publicBaseUrl}/#demo`
      ),
    ];
  }

  if (text.includes("市集") || text.includes("商品") || text.includes("推薦")) {
    return [textMessage(`命運市集已開啟：\n${publicBaseUrl}/#market\n\n這裡可以放聯盟商品、追蹤點擊、導向合作品牌。`)];
  }

  return [
    textMessage(
      "小夢老師收到你的訊息了。\n\n目前可輸入：\n設定生日\n塔羅\n求籤\n靈數 1996-08-18\n命盤\nMBTI\n市集"
    ),
  ];
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

    if (request.method === "POST" && request.url === "/api/line/push-preview") {
      const rawBody = await readRawBody(request);
      const payload = JSON.parse(rawBody.toString("utf8") || "{}");
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
    jsonResponse(response, 500, { ok: false, error: "Internal server error" });
  }
});

server.listen(port, () => {
  console.log(`小夢老師網站：http://localhost:${port}`);
  console.log(`LINE Webhook URL：${publicBaseUrl}/api/line/webhook`);
});
