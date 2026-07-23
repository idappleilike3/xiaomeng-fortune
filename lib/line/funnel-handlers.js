/**
 * Conversation Growth funnel handlers (Phase A+B).
 * Keeps「開始解碼」inside LINE chat — does not open a separate LIFF decode page.
 *
 * Free 3-card draws use local Major Arcana deck + face images (not LLM).
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
 * Text (spoken) first, then Flex with card face + buttons.
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
  const spoken = `${intro}\n\n${body}`.slice(0, 4800);
  return [textMessage(spoken), cardRevealFlex(card, index, isLast)];
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
        textMessage(
          "謝謝你願意跟我說這些\n我先把你剛講的重點放在心上了\n\n要不要先抽一輪免費三張牌 我們把現況、關鍵跟走向慢慢攤開來看"
        ),
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
      return [
        textMessage("好呀 我們開始\n你現在最想從哪個方向看起 選一個最靠近心裡的就好"),
        topicSelectFlex(),
      ];
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
          textMessage(
            "沒關係呀 有些事本來就很難塞進固定選項裡\n你就當跟朋友說話一樣 把最近發生什麼、你現在最卡住或最想知道的 慢慢跟我說就好"
          ),
          describePromptFlex(),
        ];
      }
      const problemFlex = problemSelectFlex(topicId);
      if (!problemFlex) {
        return [
          textMessage("好 方向收到了\n你可以直接跟我說最近發生什麼"),
          describePromptFlex(),
        ];
      }
      return [
        textMessage("嗯 那在這個方向裡 哪一件事最讓你放不下"),
        problemFlex,
      ];
    }

    case "problem": {
      const topicId = session.topicId;
      const problemId = data.id;
      if (!topicId || !getProblem(topicId, problemId)) {
        return [textMessage("請先選主題 再選問題類型"), topicSelectFlex()];
      }
      updateSession(session, { problemId, stage: "describe" });
      return [
        textMessage(
          "好 我大概知道你卡在哪了\n如果你願意 可以再多跟我說一點細節 不想說也沒關係 可以直接抽牌"
        ),
        describePromptFlex(),
      ];
    }

    case "skip_describe": {
      updateSession(session, { description: session.description || "(略過)", stage: "free_offer" });
      return [
        textMessage("好 那我們先不糾結細節\n要不要直接抽一輪免費三張牌 先把感覺打開"),
        freeOfferFlex(),
      ];
    }

    case "free_yes": {
      const cards = drawThreeCards(ctx.publicBaseUrl, ctx.tarotDeck);
      updateSession(session, { cards, cardIndex: 0, stage: "cards" });
      return cardRevealMessages(cards[0], 0, false);
    }

    case "free_no": {
      updateSession(session, { stage: "need" });
      return [
        textMessage("沒關係 不抽也可以\n你想繼續聊聊 或先看看有哪些方案 都沒問題"),
        continueChatFlex(ctx),
      ];
    }

    case "next_card": {
      if (!session.cards?.length) {
        return handleFunnelPostback(userId, { funnel: "free_yes" }, ctx);
      }
      const nextIndex = Math.min((session.cardIndex || 0) + 1, session.cards.length - 1);
      updateSession(session, { cardIndex: nextIndex });
      const isLast = nextIndex >= session.cards.length - 1;
      return cardRevealMessages(session.cards[nextIndex], nextIndex, isLast);
    }

    case "after_cards": {
      updateSession(session, { stage: "need" });
      return [
        textMessage(
          "這三張牌大概把輪廓打開了\n我心裡還留著一個會牽動全局的關鍵點\n\n在繼續之前 想先問你——你現在最想要的是哪一種幫忙"
        ),
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
      const titles = products.map((p) => p.title).filter(Boolean);
      const needLabel = (getNeed(needId)?.label || "").replace(/^[①②③]\s*/, "");
      const lead =
        titles.length > 0
          ? `聽起來你比較需要「${needLabel || "下一步"}」這一塊\n我先幫你整理幾個比較貼近的方向：${titles.join("、")}`
          : "我先幫你整理幾個比較貼近你現在狀態的方向";
      return [
        textMessage(lead),
        recommendFlex(products, {
          allPlansUrl: ctx.allPlansUrl,
          pricingUrl: ctx.pricingUrlFor,
        }),
      ];
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
