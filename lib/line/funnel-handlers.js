/**
 * Conversation Growth funnel handlers (Phase A+B).
 * Keeps「開始解碼」inside LINE chat — does not open a separate LIFF decode page.
 *
 * TODO: Replace placeholder card text with Dify / emotion-bridge tarot generation.
 * TODO: Persist sessions + Relationship Case; NewebPay orders currently in-memory MVP.
 */

import {
  pickRecommendations,
  getTopic,
  getProblem,
  getNeed,
  getProduct,
  CARD_POSITIONS,
} from "./funnel-catalog.js";
import { getOrCreateSession, resetSession, updateSession } from "./funnel-session.js";
import {
  welcomeFunnelFlex,
  topicSelectFlex,
  problemSelectFlex,
  describePromptFlex,
  freeOfferFlex,
  cardRevealFlex,
  needSelectFlex,
  recommendFlex,
  startUnlockFlex,
  lightMemberDoneFlex,
  softExitFlex,
  continueChatFlex,
  paymentCheckoutFlex,
  paymentNotConfiguredFlex,
} from "./funnel-flex.js";

const START_KEYWORDS = /^(開始解碼|解碼|情感解碼|start)$/i;
const PLANS_KEYWORDS = /^(查看所有方案|查看方案|方案|pricing|plans)$/i;

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

function parsePostbackData(raw = "") {
  const params = new URLSearchParams(String(raw || ""));
  const out = {};
  for (const [k, v] of params.entries()) out[k] = v;
  return out;
}

function drawThreeCards(deck) {
  const pool = Array.isArray(deck) && deck.length ? deck : [
    ["愚者", "新的旅程正在展開 先讓心保持開放"],
    ["戀人", "你面前有重要選擇 請同時看心動與現實"],
    ["星星", "希望正在回來 適合療癒與重新相信自己"],
  ];
  const picks = [];
  const used = new Set();
  while (picks.length < 3 && used.size < pool.length) {
    const idx = Math.floor(Math.random() * pool.length);
    if (used.has(idx)) continue;
    used.add(idx);
    const [name, meaning] = pool[idx];
    const pos = CARD_POSITIONS[picks.length];
    picks.push({
      name,
      meaning,
      position: pos.key,
      label: pos.label,
    });
  }
  return picks;
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
 * @returns {object[]|null} messages, or null if funnel does not handle this event
 */
export function handleFunnelEvent(event, ctx) {
  const userId = event?.source?.userId || "anonymous";

  // follow/join: server.js replies welcome Flex with buttons (開始解碼 + 查看所有方案)
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

    if (START_KEYWORDS.test(text) || text === "開始免費三張牌" || text === "還是想抽牌") {
      const funnel =
        text === "開始免費三張牌" || text === "還是想抽牌" || /抽牌/.test(text)
          ? "free_yes"
          : "start";
      return handleFunnelPostback(userId, { funnel }, ctx);
    }

    const session = getOrCreateSession(userId);
    if (session.stage === "describe") {
      updateSession(session, { description: text.slice(0, 2000), stage: "free_offer" });
      return [
        textMessage("謝謝你告訴我 我先把重點收起來了"),
        freeOfferFlex(),
      ];
    }

    // Soft entry: keyword diversion into funnel without stealing all chat
    if (/占卜|神殿|命運|塔羅|解碼/.test(text) && session.stage === "welcome") {
      return [welcomeFunnelFlex(ctx)];
    }
  }

  return null;
}

/**
 * @param {string} userId
 * @param {Record<string,string>} data
 * @param {ReturnType<typeof createFunnelContext>} ctx
 */
function handleFunnelPostback(userId, data, ctx) {
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
      return [topicSelectFlex()];
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
        return [
          textMessage("沒關係 有些事情本來就很難被放進固定分類裡\n你可以直接告訴我最近發生了什麼 以及你現在最想知道的答案是什麼"),
          describePromptFlex(),
        ];
      }
      const problemFlex = problemSelectFlex(topicId);
      return problemFlex ? [problemFlex] : [describePromptFlex()];
    }

    case "problem": {
      const topicId = session.topicId;
      const problemId = data.id;
      if (!topicId || !getProblem(topicId, problemId)) {
        return [textMessage("請先選主題 再選問題類型"), topicSelectFlex()];
      }
      updateSession(session, { problemId, stage: "describe" });
      return [describePromptFlex()];
    }

    case "skip_describe": {
      updateSession(session, { description: session.description || "(略過)", stage: "free_offer" });
      return [freeOfferFlex()];
    }

    case "free_yes": {
      const cards = drawThreeCards(ctx.tarotDeck);
      updateSession(session, { cards, cardIndex: 0, stage: "cards" });
      return [
        textMessage("好 我們開始抽牌\n（體驗版牌義為結構化摘要 完整生成稍後接上）"),
        cardRevealFlex(cards[0], 0, false),
      ];
    }

    case "free_no": {
      updateSession(session, { stage: "need" });
      return [continueChatFlex(ctx)];
    }

    case "next_card": {
      if (!session.cards?.length) {
        return handleFunnelPostback(userId, { funnel: "free_yes" }, ctx);
      }
      const nextIndex = Math.min((session.cardIndex || 0) + 1, session.cards.length - 1);
      updateSession(session, { cardIndex: nextIndex });
      const isLast = nextIndex >= session.cards.length - 1;
      return [cardRevealFlex(session.cards[nextIndex], nextIndex, isLast)];
    }

    case "after_cards": {
      updateSession(session, { stage: "need" });
      return [
        textMessage("這三張牌已經把大致輪廓打開了\n我還看到一個影響全局的關鍵 想先問你——"),
        needSelectFlex(),
      ];
    }

    case "leave": {
      updateSession(session, { stage: "welcome" });
      return [softExitFlex(ctx)];
    }

    case "need": {
      const needId = data.id;
      if (!getNeed(needId)) {
        return [textMessage("請再選一次你現在最需要的協助"), needSelectFlex()];
      }
      const topicId = session.topicId || "love";
      const products = pickRecommendations(needId, topicId);
      updateSession(session, {
        needId,
        productId: products[0]?.id || null,
        stage: "recommend",
      });
      return [
        recommendFlex(products, {
          allPlansUrl: ctx.allPlansUrl,
          pricingUrl: ctx.pricingUrlFor,
        }),
      ];
    }

    case "light_member": {
      updateSession(session, { stage: "welcome" });
      return [
        textMessage("已為你建立 LINE 輕會員（本機紀錄）\n正式會員資料庫接上後會自動同步"),
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
