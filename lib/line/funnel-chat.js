/**
 * Funnel off-script chat + describe help (Erosée / 情感解碼).
 * OpenAI-compatible or Dify when keyed; warm templates otherwise.
 * Never claim to be a human; never use「小夢」.
 */

import { getTopic, getProblem, getNeed, pickRecommendations } from "./funnel-catalog.js";
import {
  topicSelectFlex,
  problemSelectFlex,
  freeOfferFlex,
  needSelectTextMessage,
  recommendFlex,
  continueChatFlex,
} from "./funnel-flex.js";

const AI_ASK_RE =
  /AI|人工智慧|人工智能|機器人|ChatGPT|chatgpt|GPT|是不是自動|自動回|是不是程式|你是程式|你是機器人|你是真人|是真人嗎|真人嗎|是不是機器人|會不會是AI|是AI嗎|你是AI/i;

const STUCK_DESCRIBE_RE =
  /^(我)?不[知曉]道([耶啊啦齁喔哦]|怎麼[說講]|怎麼辦)?$|不知道怎麼[說講]|講不出來|說不出口|想不到|沒想法|不清楚|隨便|亂打|亂寫|無|沒有|嗯+|哈+|好難[說講]|卡卡的|不知從何[說講]起/;

const OFF_SCRIPT_QUESTION_RE =
  /[?？]|嗎$|呢$|怎麼|怎樣|為什麼|為啥|什麼意思|可以問|我想問|請問|是不是|會不會|能不能|可不可以|要收費|多少錢|真人|AI|機器人/;

/** Soft min after user already got describe-help once. */
export const MIN_DESCRIBE_SOFT = 28;
export const MIN_DESCRIBE_HARD = 40;

const DESCRIBE_HELP_TEMPLATES = [
  {
    key: "help_recent",
    bubbles: [
      "沒關係 一時講不清很常見 心裡其實已經有畫面了 只是還沒找到字",
      "我們縮小一點——最近一次讓你心裡不舒服的，大概是什麼小事？",
    ],
    chips: [
      { label: "已讀不回好焦慮", text: "最近對方已讀不回 我很焦慮 想知道對方是什麼態度 我下一步該怎麼辦" },
      { label: "突然變冷淡", text: "本來還好好的 對方最近突然變冷淡 我很不安 想弄清楚關係還有沒有救" },
      { label: "不知道他怎麼想", text: "我們一直曖昧不明 我不知道對方是不是認真 想看清楚他對我的真實想法" },
    ],
  },
  {
    key: "help_fear",
    bubbles: [
      "我懂 卡住的時候腦裡常常一片空白 那通常不是沒感覺 是感覺太多",
      "換個問法——你比較怕的是哪一種結果？被放生、被騙感情，還是自己想太多？",
    ],
    chips: [
      { label: "怕被放生", text: "我最怕最後是被放生 對方越來越遠 我卻還在原地等 心裡很慌" },
      { label: "怕自己想太多", text: "我怕是自己想太多 把小事放大 但又沒辦法不在意 想釐清到底發生什麼" },
      { label: "怕被騙感情", text: "我擔心對方只是玩玩 不是認真的 想看這段關係值不值得我繼續投入" },
    ],
  },
  {
    key: "help_action",
    bubbles: [
      "慢慢來就好 不用一次講完整篇小說 一件小事就夠當鏡子",
      "對方最近有沒有做一件讓你特別在意的事？或你自己做了什麼之後心情變了？",
    ],
    chips: [
      { label: "他突然少回訊", text: "對方最近回訊變少也變短 以前不是這樣 我很在意 想知道這代表什麼" },
      { label: "吵完後冷戰", text: "我們前幾天吵過 之後幾乎冷戰 我不知道該不該先道歉 還是等他來找我" },
      { label: "想主動又怕", text: "我想主動傳訊又怕被當煩 心裡拉扯很大 想先弄清楚現在適合不適合靠近" },
    ],
  },
  {
    key: "help_feeling",
    bubbles: [
      "你願意說「不知道」其實也很誠實 至少沒有硬裝沒事",
      "先不管事情細節——你現在最明顯的感覺是什麼？悶、慌、委屈，還是生氣？",
    ],
    chips: [
      { label: "心裡很慌", text: "我現在心裡很慌 一直翻訊息又不敢傳 想透過牌看看這段關係現在卡在哪" },
      { label: "覺得很委屈", text: "我覺得自己很委屈 付出很多卻得不到回應 想弄清楚對方到底在不在乎我" },
      { label: "又氣又捨不得", text: "我又氣又捨不得 想放手又做不到 想看清楚繼續或停下哪個對我比較好" },
    ],
  },
];

/**
 * @param {string} text
 */
export function isAiIdentityAsk(text) {
  return AI_ASK_RE.test(String(text || ""));
}

/**
 * @param {string} text
 */
export function isStuckDescribe(text) {
  const t = String(text || "").trim();
  if (!t) return true;
  if (STUCK_DESCRIBE_RE.test(t)) return true;
  const chars = t.replace(/\s/g, "").length;
  if (chars <= 8 && /不[知曉]道|沒有|不清楚|隨便|亂/.test(t)) return true;
  return false;
}

/**
 * Off-script chat / clarifying question (not a valid funnel answer).
 * @param {string} text
 * @param {string} stage
 */
export function isOffScriptChat(text, stage) {
  const t = String(text || "").trim();
  if (!t) return false;
  if (isAiIdentityAsk(t)) return true;
  if (stage === "describe") {
    if (isStuckDescribe(t)) return false; // handled by describe-help path
    return OFF_SCRIPT_QUESTION_RE.test(t);
  }
  // Button / structured stages: any free text is off-script
  return ["topic", "problem", "free_offer", "cards", "need", "recommend", "checkout"].includes(stage);
}

/**
 * @param {import('./funnel-session.js').FunnelSession} session
 * @param {object} [ctx]
 */
export function pendingFunnelAsk(session, ctx) {
  const stage = session?.stage || "welcome";
  switch (stage) {
    case "topic":
      return "你現在最想從哪個方向看起 選一個最靠近心裡的就好";
    case "problem":
      return "在這個方向裡 哪一件事最讓你放不下 選一個最接近的就好";
    case "describe":
      return "若還不知道怎麼講完整段 我們可以先從「最近一次讓你不舒服的小事」慢慢說起";
    case "free_offer":
      return "想先攤開現況的話 可以點「開始免費三張牌」";
    case "cards": {
      const i = (session.cardIndex || 0) + 1;
      return `想繼續的話 點「下一張牌」我們看第 ${Math.min(i + 1, 3)} 張`;
    }
    case "need":
      return "你現在最想要的是哪一種幫忙 選一個最靠近現在心情的";
    case "recommend":
      return "若想往下 可以點方案或「查看所有方案」";
    case "checkout":
      return "付款連結還在上面 需要的話再點一次就好";
    default:
      return ctx?.allPlansUrl
        ? "想開始的話回「開始解碼」就好"
        : "想開始的話回「開始解碼」就好";
  }
}

/**
 * @param {import('./funnel-session.js').FunnelSession} session
 * @param {object} ctx
 * @returns {object|null}
 */
export function pendingFunnelMenu(session, ctx) {
  switch (session?.stage) {
    case "topic":
      return topicSelectFlex();
    case "problem":
      return session.topicId ? problemSelectFlex(session.topicId) : topicSelectFlex();
    case "free_offer":
      return freeOfferFlex();
    case "need":
      return needSelectTextMessage();
    case "recommend": {
      const products = pickRecommendations(session.needId || "companion", session.topicId || "love");
      return recommendFlex(products, {
        allPlansUrl: ctx.allPlansUrl,
        pricingUrl: ctx.pricingUrlFor,
      });
    }
    case "checkout":
      return null;
    default:
      if (session?.stage === "describe" && session.describeHelpCount > 0) {
        return null;
      }
      return null;
  }
}

/**
 * Hybrid human+AI identity — warm, honest, no「全程真人在線」lie, no「我只是 AI」.
 * @param {import('./funnel-session.js').FunnelSession} session
 * @param {object} ctx
 * @returns {object[]}
 */
export function buildAiIdentityMessages(session, ctx) {
  const pending = pendingFunnelAsk(session, ctx);
  const messages = [
    { type: "text", text: "我這邊是真人專業與 AI 一起協助解析的，不是冷冰冰的自動回覆" },
    { type: "text", text: "可以陪你把卡住的地方慢慢講清楚" },
    {
      type: "text",
      text: `重要決定還是你自己做；若要更深，之後再選方案就好\n\n${pending}`,
    },
  ];
  const menu = pendingFunnelMenu(session, ctx);
  if (menu) messages.push(menu);
  return messages;
}

/**
 * @param {number} helpCount
 */
export function pickDescribeHelpTemplate(helpCount = 0) {
  const idx = Math.abs(helpCount) % DESCRIBE_HELP_TEMPLATES.length;
  return DESCRIBE_HELP_TEMPLATES[idx];
}

/**
 * Empathetic describe help + Quick Reply example chips.
 * Never repeats the long「四十個字」lecture.
 * @param {import('./funnel-session.js').FunnelSession} session
 * @param {{ llmGuide?: string|null }} [opts]
 * @returns {{ messages: object[], nudgeKey: string, nextHelpCount: number }}
 */
export function buildDescribeHelpMessages(session, opts = {}) {
  const helpCount = session.describeHelpCount || 0;
  const tpl = pickDescribeHelpTemplate(helpCount);
  /** @type {object[]} */
  const messages = [];

  if (opts.llmGuide && String(opts.llmGuide).trim()) {
    const paras = String(opts.llmGuide)
      .trim()
      .split(/\n\n+/)
      .map((p) => p.trim())
      .filter(Boolean)
      .slice(0, 2);
    for (const p of paras) messages.push({ type: "text", text: p.slice(0, 900) });
  } else {
    for (const b of tpl.bubbles) messages.push({ type: "text", text: b });
  }

  const chipLine = {
    type: "text",
    text: "也可以先點下面一句 當作開頭 再慢慢補也行",
    quickReply: {
      items: tpl.chips.map((c) => ({
        type: "action",
        action: {
          type: "message",
          label: c.label.slice(0, 20),
          text: c.text,
        },
      })),
    },
  };
  messages.push(chipLine);

  return {
    messages,
    nudgeKey: tpl.key,
    nextHelpCount: helpCount + 1,
  };
}

/**
 * Fallback when no LLM for general off-script chat.
 * @param {string} userText
 * @param {import('./funnel-session.js').FunnelSession} session
 * @param {object} ctx
 */
export function buildFallbackChatMessages(userText, session, ctx) {
  const pending = pendingFunnelAsk(session, ctx);
  const topic = session.topicId ? getTopic(session.topicId)?.label : null;
  const problem =
    session.topicId && session.problemId
      ? getProblem(session.topicId, session.problemId)?.label
      : null;
  const ctxHint = [topic, problem].filter(Boolean).join("／");

  const ack = ctxHint
    ? `我聽到了 你剛問的這句我放在心上（我們現在走的是「${ctxHint}」這條線）`
    : "我聽到了 你剛問的這句我放在心上";

  const messages = [
    { type: "text", text: ack },
    {
      type: "text",
      text: `卡住的時候 把感受講清楚本身就是一步 像先把鏡子擦乾淨\n若你願意 我們還是把眼前這一步走完 會比較對得上你現在的狀態\n\n${pending}`,
    },
  ];
  const menu = pendingFunnelMenu(session, ctx);
  if (menu) messages.push(menu);
  return messages;
}

function sessionContextBlurb(session) {
  const topic = session.topicId ? getTopic(session.topicId)?.label : "尚未選";
  const problem =
    session.topicId && session.problemId
      ? getProblem(session.topicId, session.problemId)?.label
      : "尚未選";
  const need = session.needId ? getNeed(session.needId)?.label : "尚未選";
  const desc = session.description || session.describeBuffer || "（尚無）";
  return [
    `漏斗階段: ${session.stage}`,
    `主題: ${topic}`,
    `問題類型: ${problem}`,
    `需求: ${need}`,
    `已累積描述: ${String(desc).slice(0, 500)}`,
    `待完成步驟提醒: ${pendingFunnelAsk(session)}`,
  ].join("\n");
}

const SYSTEM_PROMPT = `你是「情感解碼」Erosée 的深度陪伴助手。解析由「真人專業 × AI」一起完成：有專業架構與溫度，也有 AI 協助整理；被問是不是 AI／機器人／真人時，說明「真人專業與 AI 一起協助解析，不是冷冰冰的自動回覆」，不要說「我只是 AI」，也不要謊稱全程真人即時在線盯著對話。
品牌：情感解碼 / Erosée。禁止提到「小夢」。禁止輸出「AI 智能／ChatGPT」等行銷詞。

分析與對話時，請內化並融合以下三種專業視角（用白話自然流露，不要點名專家、不要術語堆砌）：
1) 卡爾·榮格取向：看見陰影、投射、原型與無意識象徵，協助對方把「卡住」對焦到內在與關係動力，而非只評對錯
2) 三十年資深塔羅老師：牌意準、對題、有層次（現況／關鍵／走向），比喻清晰，不故弄玄虛
3) 三十年高情商情感專家：共情、界線、依附與關係動態；溫柔但不溺愛，敢點出模式又保護尊嚴

用台灣繁體中文。語氣暖、穩、像懂人心的諮商師朋友：同理、舉一反三、不說教、不冷冰冰、不裝機器人腔。
句尾不要用全形「。」。不要 markdown。
先認真回答使用者這一則離題／追問／情緒，再在結尾用一兩句溫柔帶回目前漏斗還在等的步驟（會提供 pending ask，請自然融入）。
回覆總長約 120–280 字，可用空行分成 2–3 段（每段會變成一則聊天氣泡）。`;

/**
 * @returns {boolean}
 */
export function hasLlmConfig() {
  return Boolean(process.env.OPENAI_API_KEY || process.env.DIFY_API_KEY);
}

/**
 * Non-streaming OpenAI-compatible chat.
 * @param {{ system: string, user: string }} msgs
 */
async function callOpenAiChat(msgs) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;
  const model = process.env.OPENAI_MODEL || "gpt-4o-mini";
  const apiUrl = process.env.OPENAI_BASE_URL || "https://api.openai.com/v1/chat/completions";

  const resp = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      temperature: 0.75,
      max_tokens: 500,
      messages: [
        { role: "system", content: msgs.system },
        { role: "user", content: msgs.user },
      ],
    }),
  });
  if (!resp.ok) {
    const errText = await resp.text();
    console.error(`[funnel-chat] OpenAI ${resp.status}:`, errText.slice(0, 200));
    return null;
  }
  const json = await resp.json();
  return String(json?.choices?.[0]?.message?.content || "").trim() || null;
}

/**
 * Dify chat-messages API (blocking).
 * @param {string} query
 * @param {string} userId
 */
async function callDifyChat(query, userId) {
  const apiKey = process.env.DIFY_API_KEY;
  if (!apiKey) return null;
  const base = (process.env.DIFY_API_URL || "https://api.dify.ai/v1").replace(/\/$/, "");
  const url = `${base}/chat-messages`;

  const resp = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      inputs: {},
      query,
      response_mode: "blocking",
      user: userId || "funnel-user",
    }),
  });
  if (!resp.ok) {
    const errText = await resp.text();
    console.error(`[funnel-chat] Dify ${resp.status}:`, errText.slice(0, 200));
    return null;
  }
  const json = await resp.json();
  return String(json?.answer || "").trim() || null;
}

/**
 * @param {{
 *   userText: string,
 *   session: import('./funnel-session.js').FunnelSession,
 *   ctx: object,
 *   mode?: 'chat'|'describe_guide',
 * }} input
 * @returns {Promise<string|null>}
 */
export async function generateFunnelChatText(input) {
  const { userText, session, mode = "chat" } = input;
  const pending = pendingFunnelAsk(session, input.ctx);
  const userBlock =
    mode === "describe_guide"
      ? `使用者卡在「描述」步驟（可能說不知道／講不出來）。請給 1–2 段短回覆：先同理，再只問一個好回答的引導問題。不要提「四十個字」。結尾不要催促按鈕。\n\n使用者說：${userText}\n\n${sessionContextBlurb(session)}`
      : `使用者離題／追問如下，請回答後自然帶回待完成步驟「${pending}」。\n\n使用者說：${userText}\n\n${sessionContextBlurb(session)}`;

  try {
    if (process.env.OPENAI_API_KEY) {
      const text = await callOpenAiChat({ system: SYSTEM_PROMPT, user: userBlock });
      if (text) return text;
    }
    if (process.env.DIFY_API_KEY) {
      const text = await callDifyChat(`${SYSTEM_PROMPT}\n\n${userBlock}`, session.userId);
      if (text) return text;
    }
  } catch (err) {
    console.error("[funnel-chat] LLM failed:", err?.message || err);
  }
  return null;
}

/**
 * Full off-script reply messages (LLM or template). AI-ask uses fast path.
 * @param {{
 *   userText: string,
 *   session: import('./funnel-session.js').FunnelSession,
 *   ctx: object,
 * }} input
 * @returns {Promise<object[]>}
 */
export async function buildOffScriptChatMessages(input) {
  const { userText, session, ctx } = input;
  if (isAiIdentityAsk(userText)) {
    return buildAiIdentityMessages(session, ctx);
  }

  const llm = await generateFunnelChatText({ userText, session, ctx, mode: "chat" });
  if (llm) {
    const paras = llm
      .split(/\n\n+/)
      .map((p) => p.trim())
      .filter(Boolean)
      .slice(0, 3);
    /** @type {object[]} */
    const messages = paras.map((p) => ({ type: "text", text: p.slice(0, 1200) }));
    // Ensure pending ask appears if model forgot
    const pending = pendingFunnelAsk(session, ctx);
    if (!messages.some((m) => String(m.text).includes(pending.slice(0, 12)))) {
      messages.push({ type: "text", text: pending });
    }
    const menu = pendingFunnelMenu(session, ctx);
    if (menu) messages.push(menu);
    return messages;
  }

  return buildFallbackChatMessages(userText, session, ctx);
}

/**
 * Merge describe fragments; stuck phrases do not pollute buffer.
 * @param {string} buffer
 * @param {string} text
 */
export function appendDescribeBuffer(buffer, text) {
  const t = String(text || "").trim();
  if (!t || isStuckDescribe(t)) return String(buffer || "");
  const prev = String(buffer || "").trim();
  if (!prev) return t.slice(0, 2000);
  if (prev.includes(t)) return prev.slice(0, 2000);
  return `${prev}\n${t}`.slice(0, 2000);
}

/**
 * @param {string} combined
 * @param {number} helpCount
 */
export function describeReady(combined, helpCount = 0) {
  const n = String(combined || "").replace(/\s/g, "").length;
  const min = helpCount > 0 ? MIN_DESCRIBE_SOFT : MIN_DESCRIBE_HARD;
  return n >= min;
}
