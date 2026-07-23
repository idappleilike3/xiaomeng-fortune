/**
 * Conversation Growth funnel handlers (Phase A+B).
 * Keeps「開始解碼」inside LINE chat — does not open a separate LIFF decode page.
 *
 * Free 3-card draws use local Major Arcana only (`FREE_TAROT_CARDS`, 22 cards)
 * + face images (not LLM). Full 78-card deck lives in `./tarot-deck-78.js` for
 * paid/deep readings — do not import it into free draw.
 * TODO: Persist sessions + Relationship Case; NewebPay orders currently in-memory MVP.
 */

import {
  pickRecommendations,
  getTopic,
  getProblem,
  getNeed,
  getProduct,
  CARD_POSITIONS,
  FREE_TAROT_CARDS,
  resolveTarotImageUrl,
  getFreeTarotCard,
} from "./funnel-catalog.js";
import { getOrCreateSession, resetSession, updateSession } from "./funnel-session.js";
import {
  welcomeFunnelFlex,
  topicSelectFlex,
  problemSelectFlex,
  freeOfferFlex,
  cardRevealFlex,
  needSelectTextMessage,
  recommendFlex,
  startUnlockFlex,
  lightMemberDoneFlex,
  softExitFlex,
  continueChatFlex,
  paymentCheckoutFlex,
  paymentNotConfiguredFlex,
} from "./funnel-flex.js";
import { sleep, splitParagraphs } from "./reply-human.js";
import {
  appendDescribeBuffer,
  buildDescribeHelpMessages,
  buildOffScriptChatMessages,
  describeReady,
  generateFunnelChatText,
  hasLlmConfig,
  isAiIdentityAsk,
  isOffScriptChat,
  isStuckDescribe,
  MIN_DESCRIBE_HARD,
} from "./funnel-chat.js";

const START_KEYWORDS = /^(開始解碼|解碼|情感解碼|start)$/i;
const PLANS_KEYWORDS = /^(查看所有方案|查看方案|方案|pricing|plans)$/i;
/** Exact free-draw intents only — do NOT match「下一張牌」(contains 抽牌). */
const FREE_DRAW_EXACT = /^(開始免費三張牌|還是想抽牌)$/;
/** Min non-whitespace chars before free cards (reject short / skip). */
const MIN_DESCRIBE_CHARS = MIN_DESCRIBE_HARD;
/** After user answers a step — pause before bot reply (anti-robot UX). */
const HUMAN_REPLY_DELAY_MS = 5000;
/** Max psych / copy text bubbles per step (Flex/image extra). */
const MAX_TEXT_BUBBLES = 6;

/**
 * @param {object} deps
 * @param {string} deps.publicBaseUrl
 * @param {(route?: string, extra?: Record<string,string>) => string} deps.eroseeLink
 * @param {string} [deps.lineOaUrl]
 * @param {Array<[string,string]>} deps.tarotDeck
 * @param {(input: { userId: string, productId: string }) =>
 *   | { ok: true, payUrl: string, amount: number, productTitle: string, merchantOrderNo: string }
 *   | { ok: false, reason: string }
 * } [deps.createCheckout]
 */
export function createFunnelContext(deps) {
  const allPlansUrl = deps.eroseeLink("/pricing");
  const pricingUrlFor = (route) => deps.eroseeLink(route || "/pricing");
  return {
    allPlansUrl,
    pricingUrl: allPlansUrl,
    pricingUrlFor,
    lineOaUrl: deps.lineOaUrl || null,
    tarotDeck: deps.tarotDeck || [],
    publicBaseUrl: deps.publicBaseUrl,
    createCheckout: deps.createCheckout || null,
  };
}

function textMessage(text) {
  return { type: "text", text };
}

/**
 * Delay before returning messages when the user just completed a step.
 * Webhook already ACKs 200 first — this runs in the async worker (~5s).
 * @param {object[]|null} messages
 * @param {boolean} shouldDelay
 */
async function maybeHumanDelay(messages, shouldDelay) {
  if (shouldDelay && Array.isArray(messages) && messages.length > 0) {
    await sleep(HUMAN_REPLY_DELAY_MS);
  }
  return messages;
}

function parsePostbackData(raw = "") {
  const params = new URLSearchParams(String(raw || ""));
  const out = {};
  for (const [k, v] of params.entries()) out[k] = v;
  return out;
}

/**
 * Draw 3 unique Major Arcana with face image URLs + spoken copy.
 * Falls back to legacy [name, meaning] tuples only if FREE_TAROT_CARDS is empty.
 * @param {string} publicBaseUrl
 * @param {Array<[string,string]>} [legacyDeck]
 */
function drawThreeCards(publicBaseUrl, legacyDeck) {
  const pool =
    FREE_TAROT_CARDS.length > 0
      ? FREE_TAROT_CARDS
      : (Array.isArray(legacyDeck) && legacyDeck.length
          ? legacyDeck.map(([name, meaning]) => ({
              name,
              meaningShort: meaning,
              spoken: meaning,
              spokenCliff: meaning,
              imagePath: "",
              imagePathFallback: "",
            }))
          : [
              {
                name: "愚者",
                meaningShort: "新的旅程正在展開 先讓心保持開放",
                spoken: "新的旅程正在展開 先讓心保持開放",
                spokenCliff: "新的旅程正在展開 先讓心保持開放",
                imagePath: "assets/tarot-new-00-fool.png",
                imagePathFallback: "assets/tarot-00-the-fool.png",
              },
            ]);

  const picks = [];
  const used = new Set();
  while (picks.length < 3 && used.size < pool.length) {
    const idx = Math.floor(Math.random() * pool.length);
    if (used.has(idx)) continue;
    used.add(idx);
    const card = pool[idx];
    const catalog = getFreeTarotCard(card.name) || card;
    const pos = CARD_POSITIONS[picks.length];
    const imagePath = catalog.imagePath || card.imagePath || "";
    picks.push({
      name: catalog.name || card.name,
      meaning: catalog.meaningShort || card.meaningShort || "",
      spoken: catalog.spoken || card.spoken || catalog.meaningShort || "",
      spokenCliff: catalog.spokenCliff || card.spokenCliff || catalog.spoken || "",
      imageUrl: imagePath ? resolveTarotImageUrl(publicBaseUrl, imagePath) : "",
      position: pos.key,
      label: pos.label,
    });
  }
  return picks;
}

/**
 * Count non-whitespace chars (Chinese / Latin) for describe gate.
 * @param {string|null|undefined} text
 */
function countDescribeChars(text) {
  return String(text || "").replace(/\s/g, "").length;
}

function hasAdequateDescription(text, helpCount = 0) {
  return describeReady(text, helpCount);
}

/**
 * One LINE text bubble per paragraph (human pacing via replyHumanLike).
 * @param {string} text
 * @param {number} [maxBubbles]
 * @returns {object[]}
 */
function splitTextBubbles(text, maxBubbles = MAX_TEXT_BUBBLES) {
  return splitParagraphs(text, maxBubbles).map((t) => textMessage(t));
}

/**
 * Spoken paras as separate bubbles, then Flex with card face + next.
 * Intro is its own short bubble; body capped so total texts ≤ MAX_TEXT_BUBBLES.
 * @param {object} card
 * @param {number} index
 * @param {boolean} isLast
 * @param {{ intro?: string }} [opts]
 */
function cardRevealMessages(card, index, isLast, opts = {}) {
  const pos = CARD_POSITIONS[index] || { label: `第 ${index + 1} 張` };
  const body = isLast ? card.spokenCliff || card.spoken : card.spoken || card.meaning;
  const intro =
    opts.intro ||
    (index === 0
      ? `好 我幫你抽了三張牌\n先來看${pos.label}——【${card.name}】`
      : `接著是${pos.label}——【${card.name}】`);
  const bodyBubbles = splitTextBubbles(body, Math.max(1, MAX_TEXT_BUBBLES - 1));
  return [textMessage(intro), ...bodyBubbles, cardRevealFlex(card, index, isLast)];
}

/** Layer 3 — plain text only (no Flex). First ask is gentle; never spam「四十個字」wall. */
function describePromptMessages() {
  return [
    textMessage(
      "先把事情說清楚一點就好\n像跟朋友訴苦一樣打在聊天室就行"
    ),
    textMessage(
      "最近發生什麼、你什麼感覺、最想弄清楚哪一件\n說完我們再抽免費三張牌"
    ),
  ];
}

/**
 * Stuck / short describe → guiding help (rotated), never identical 40-char lecture twice.
 * @param {import('./funnel-session.js').FunnelSession} session
 * @param {string} userText
 */
async function describeHelpReply(session, userText) {
  const prevKey = session.lastDescribeNudgeKey;
  let llmGuide = null;
  if (hasLlmConfig() && (isStuckDescribe(userText) || (session.describeHelpCount || 0) > 0)) {
    llmGuide = await generateFunnelChatText({
      userText,
      session,
      ctx: {},
      mode: "describe_guide",
    });
  }
  let pack = buildDescribeHelpMessages(session, { llmGuide });
  // Never send the same template key twice in a row
  if (pack.nudgeKey === prevKey) {
    updateSession(session, { describeHelpCount: (session.describeHelpCount || 0) + 1 });
    pack = buildDescribeHelpMessages(session, { llmGuide: null });
  }
  updateSession(session, {
    stage: "describe",
    describeHelpCount: pack.nextHelpCount,
    lastDescribeNudgeKey: pack.nudgeKey,
    describeBuffer: appendDescribeBuffer(session.describeBuffer, userText),
  });
  return pack.messages;
}

function requireDescribeBeforeDraw(session) {
  updateSession(session, { stage: "describe" });
  return [
    textMessage(
      "抽牌之前我想先多聽你一點\n把最近發生什麼、你卡在哪、最在意哪一件 慢慢打給我\n這樣三張牌才對得上你現在的狀態"
    ),
  ];
}

/**
 * Accept describe text / accumulate buffer → free_offer when enough context.
 * @param {import('./funnel-session.js').FunnelSession} session
 * @param {string} text
 */
function completeDescribe(session, text) {
  const merged = appendDescribeBuffer(session.describeBuffer || session.description || "", text);
  updateSession(session, {
    description: merged.slice(0, 2000),
    describeBuffer: merged,
    stage: "free_offer",
    lastDescribeNudgeKey: null,
  });
  return maybeHumanDelay(
    [
      textMessage(
        "謝謝你願意跟我說這些\n我先把你剛講的重點放在心上了\n\n要不要先抽一輪免費三張牌 我們把現況、關鍵跟走向慢慢攤開來看"
      ),
      freeOfferFlex(),
    ],
    true
  );
}

/**
 * Create NewebPay checkout Flex for funnel「立即開始」.
 * @param {string} userId
 * @param {string} productId
 * @param {ReturnType<typeof createFunnelContext>} ctx
 */
function buildPaymentMessages(userId, productId, ctx) {
  const product = getProduct(productId);
  const pricingUrl = ctx.pricingUrlFor(product?.pricingRoute || "/pricing");

  if (!ctx.createCheckout) {
    return [
      paymentNotConfiguredFlex({ pricingUrl, lineOaUrl: ctx.lineOaUrl }),
    ];
  }

  const result = ctx.createCheckout({ userId, productId });
  if (!result?.ok) {
    if (result?.reason === "NEWEBPAY_NOT_CONFIGURED") {
      return [
        paymentNotConfiguredFlex({ pricingUrl, lineOaUrl: ctx.lineOaUrl }),
      ];
    }
    return [
      textMessage("這份方案暫時無法建立付款單 請稍後再試或先查看方案頁"),
      startUnlockFlex({
        productId,
        lineOaUrl: ctx.lineOaUrl,
        pricingUrl,
      }),
    ];
  }

  return [
    textMessage(`好 我們為你準備「${result.productTitle}」付款連結`),
    paymentCheckoutFlex({
      productTitle: result.productTitle,
      amount: result.amount,
      payUrl: result.payUrl,
      pricingUrl,
      merchantOrderNo: result.merchantOrderNo,
    }),
  ];
}

/**
 * @param {object} event LINE webhook event
 * @param {ReturnType<typeof createFunnelContext>} ctx
 * @returns {Promise<object[]|null>} messages, or null if funnel does not handle this event
 */
export async function handleFunnelEvent(event, ctx) {
  const userId = event?.source?.userId || "anonymous";

  // follow/join: server.js replies welcome Flex (開始解碼 only)
  if (event.type === "follow" || event.type === "join") {
    resetSession(userId);
    return null;
  }

  if (event.type === "postback") {
    const data = parsePostbackData(event.postback?.data || "");
    if (data.funnel == null && data.action !== "start_decode") return null;
    return handleFunnelPostback(userId, data, ctx);
  }

  if (event.type === "message" && event.message?.type === "text") {
    const text = String(event.message.text || "").trim();
    if (!text) return null;

    if (PLANS_KEYWORDS.test(text)) {
      return [
        textMessage(`完整方案在這裡\n${ctx.allPlansUrl}`),
        welcomeFunnelFlex(ctx),
      ];
    }

    if (START_KEYWORDS.test(text) || FREE_DRAW_EXACT.test(text)) {
      const funnel = FREE_DRAW_EXACT.test(text) ? "free_yes" : "start";
      return handleFunnelPostback(userId, { funnel }, ctx);
    }

    const session = getOrCreateSession(userId);

    // AI / 真人 identity — honest fast path at any funnel stage
    if (isAiIdentityAsk(text) && session.stage !== "welcome") {
      return buildOffScriptChatMessages({ userText: text, session, ctx });
    }

    if (session.stage === "describe") {
      // Question / fee / clarifying chat → real dialogue, keep stage
      if (isOffScriptChat(text, "describe") && !isStuckDescribe(text)) {
        return buildOffScriptChatMessages({ userText: text, session, ctx });
      }

      const merged = appendDescribeBuffer(session.describeBuffer || session.description || "", text);
      if (describeReady(merged, session.describeHelpCount || 0) || hasAdequateDescription(text)) {
        return completeDescribe(session, text);
      }

      // Stuck (我不知道) or still short → guiding help, never identical 40-char wall
      return describeHelpReply(session, text);
    }

    // Mid-funnel button stages: free text → chat, keep stage
    if (isOffScriptChat(text, session.stage)) {
      return buildOffScriptChatMessages({ userText: text, session, ctx });
    }

    // Soft entry: keyword diversion into funnel without stealing all chat
    if (/占卜|神殿|命運|塔羅|解碼/.test(text) && session.stage === "welcome") {
      return [welcomeFunnelFlex(ctx)];
    }

    // Welcome + AI ask
    if (isAiIdentityAsk(text)) {
      return buildOffScriptChatMessages({ userText: text, session, ctx });
    }
  }

  return null;
}

/**
 * @param {string} userId
 * @param {Record<string,string>} data
 * @param {ReturnType<typeof createFunnelContext>} ctx
 * @returns {Promise<object[]>}
 */
async function handleFunnelPostback(userId, data, ctx) {
  const action = data.funnel || (data.action === "start_decode" ? "start" : "");
  const session = getOrCreateSession(userId);

  switch (action) {
    case "start":
    case "start_decode": {
      // If pid present → NewebPay checkout; else start topic flow
      if (data.pid) {
        updateSession(session, { productId: data.pid, stage: "checkout" });
        return buildPaymentMessages(userId, data.pid, ctx);
      }
      resetSession(userId);
      const fresh = getOrCreateSession(userId);
      updateSession(fresh, { stage: "topic" });
      return maybeHumanDelay(
        [
          textMessage("好呀 我們開始\n你現在最想從哪個方向看起 選一個最靠近心裡的就好"),
          topicSelectFlex(),
        ],
        true
      );
    }

    case "pay": {
      const productId = data.pid || session.productId;
      if (!productId) {
        return [
          textMessage("請先選擇方案"),
          recommendFlex([], { allPlansUrl: ctx.allPlansUrl, pricingUrl: ctx.pricingUrlFor }),
        ];
      }
      updateSession(session, { productId, stage: "checkout" });
      return buildPaymentMessages(userId, productId, ctx);
    }

    case "topic": {
      const topicId = data.id;
      if (!getTopic(topicId)) {
        return [textMessage("這個分類暫時無法使用 請再選一次"), topicSelectFlex()];
      }
      updateSession(session, { topicId, problemId: null, stage: "problem" });
      if (topicId === "other") {
        updateSession(session, { problemId: "other", stage: "describe" });
        return maybeHumanDelay(
          [
            textMessage(
              "沒關係呀 有些事本來就很難塞進固定選項裡\n你就當跟朋友說話一樣 把最近發生什麼、你現在最卡住或最想知道的 慢慢跟我說就好"
            ),
            ...describePromptMessages(),
          ],
          true
        );
      }
      const problemFlex = problemSelectFlex(topicId);
      if (!problemFlex) {
        return maybeHumanDelay(
          [
            textMessage("好 方向收到了\n你可以直接跟我說最近發生什麼"),
            ...describePromptMessages(),
          ],
          true
        );
      }
      return maybeHumanDelay(
        [textMessage("嗯 那在這個方向裡 哪一件事最讓你放不下"), problemFlex],
        true
      );
    }

    case "problem": {
      const topicId = session.topicId;
      const problemId = data.id;
      if (!topicId || !getProblem(topicId, problemId)) {
        return [textMessage("請先選主題 再選問題類型"), topicSelectFlex()];
      }
      updateSession(session, { problemId, stage: "describe" });
      return maybeHumanDelay(
        [
          textMessage(
            "好 我大概知道你卡在哪了\n接下來請你多說一點細節再抽牌\n最近發生什麼、你什麼感覺、最想弄清楚哪一件 打給我就好"
          ),
          ...describePromptMessages(),
        ],
        true
      );
    }

    case "skip_describe": {
      // Skip removed: always require a real description before free cards
      return requireDescribeBeforeDraw(session);
    }

    case "free_yes": {
      if (!hasAdequateDescription(session.description)) {
        return requireDescribeBeforeDraw(session);
      }
      // Mid-reveal resume — never redraw from card 1 on accidental free_yes
      if (session.stage === "cards" && Array.isArray(session.cards) && session.cards.length) {
        const i = Math.min(Math.max(session.cardIndex || 0, 0), session.cards.length - 1);
        return cardRevealMessages(session.cards[i], i, i >= session.cards.length - 1);
      }
      const cards = drawThreeCards(ctx.publicBaseUrl, ctx.tarotDeck);
      updateSession(session, { cards, cardIndex: 0, stage: "cards" });
      return maybeHumanDelay(cardRevealMessages(cards[0], 0, false), true);
    }

    case "free_no": {
      updateSession(session, { stage: "need" });
      return maybeHumanDelay(
        [
          textMessage("沒關係 不抽也可以\n你想繼續聊聊 或先看看有哪些方案 都沒問題"),
          continueChatFlex(ctx),
        ],
        true
      );
    }

    case "next_card": {
      // Root cause fix: never fall back to free_yes (that re-draws card 1).
      // Require from= index so duplicate / stale postbacks do not double-advance.
      if (session.stage !== "cards" || !Array.isArray(session.cards) || !session.cards.length) {
        return [
          textMessage("這輪好像中斷了 回「開始解碼」重新走一次就好"),
          welcomeFunnelFlex(ctx),
        ];
      }
      const current = Number.isFinite(session.cardIndex) ? session.cardIndex : 0;
      const fromRaw = data.from != null ? Number(data.from) : NaN;
      if (Number.isFinite(fromRaw) && fromRaw !== current) {
        // Stale / duplicate click after already advanced — handled, no extra reply
        return [];
      }
      const nextIndex = current + 1;
      if (nextIndex >= session.cards.length) {
        return handleFunnelPostback(userId, { funnel: "after_cards" }, ctx);
      }
      updateSession(session, { cardIndex: nextIndex });
      const isLast = nextIndex >= session.cards.length - 1;
      return maybeHumanDelay(
        cardRevealMessages(session.cards[nextIndex], nextIndex, isLast),
        true
      );
    }

    case "after_cards": {
      updateSession(session, { stage: "need" });
      return maybeHumanDelay(
        [
          textMessage(
            "這三張牌大概把輪廓打開了\n我心裡還留著一個會牽動全局的關鍵點\n\n在繼續之前 想先問你——你現在最想要的是哪一種幫忙"
          ),
          needSelectTextMessage(),
        ],
        true
      );
    }

    case "leave": {
      updateSession(session, { stage: "welcome" });
      return [softExitFlex(ctx)];
    }

    case "need": {
      const needId = data.id;
      if (!getNeed(needId)) {
        return [
          textMessage("請再選一次你現在最需要的協助"),
          needSelectTextMessage(),
        ];
      }
      const topicId = session.topicId || "love";
      const products = pickRecommendations(needId, topicId);
      updateSession(session, {
        needId,
        productId: products[0]?.id || null,
        stage: "recommend",
      });
      const titles = products.map((p) => p.title).filter(Boolean);
      const needLabel = (getNeed(needId)?.label || "").replace(/^[①②③]\s*/, "");
      const lead =
        titles.length > 0
          ? `聽起來你比較需要「${needLabel || "下一步"}」這一塊\n我先幫你整理幾個比較貼近的方向：${titles.join("、")}`
          : "我先幫你整理幾個比較貼近你現在狀態的方向";
      return maybeHumanDelay(
        [
          textMessage(lead),
          recommendFlex(products, {
            allPlansUrl: ctx.allPlansUrl,
            pricingUrl: ctx.pricingUrlFor,
          }),
        ],
        true
      );
    }

    case "light_member": {
      updateSession(session, { stage: "welcome" });
      return [
        textMessage("好 已經幫你把今天的解碼紀錄留著了\n之後想繼續 隨時回「開始解碼」就好"),
        lightMemberDoneFlex(ctx),
      ];
    }

    default:
      return [welcomeFunnelFlex(ctx)];
  }
}

/**
 * Welcome + primary CTA for follow / rich menu entry.
 * Exported for server.js follow path that may compose with legacy welcome.
 */
export function buildWelcomeFunnelMessages(ctx) {
  return [welcomeFunnelFlex(ctx)];
}
