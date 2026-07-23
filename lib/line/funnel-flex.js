/**
 * Flex builders for conversation growth funnel (Phase A+B).
 * Copy rules: no sentence-ending 「。」, no「AI」in user-facing text.
 */

import {
  CARD_POSITIONS,
  NEEDS,
  PROBLEMS_BY_TOPIC,
  TOPIC_BUTTON_COLORS,
  TOPICS,
  getProduct,
} from "./funnel-catalog.js";

const WELCOME_HERO_PATH = "assets/line/welcome-hero.png";
const DARK_TEXT = "#1A1520";
const DARK_HINT = "#3D3548";

function flexMessage(altText, contents) {
  return { type: "flex", altText, contents };
}

function postbackAction(label, data, displayText) {
  return {
    type: "postback",
    label: label.slice(0, 40),
    data,
    displayText: (displayText || label).slice(0, 300),
  };
}

function uriAction(label, uri) {
  return { type: "uri", label: label.slice(0, 40), uri };
}

function bubbleBody(title, subtitle, buttons, extra = []) {
  const contents = [
    {
      type: "text",
      text: title,
      weight: "bold",
      size: "lg",
      color: "#F5D38B",
      wrap: true,
    },
    ...(subtitle
      ? [
          {
            type: "text",
            text: subtitle,
            size: "sm",
            color: "#F8EEDB",
            wrap: true,
          },
        ]
      : []),
    ...extra,
  ];
  if (Array.isArray(buttons) && buttons.length) {
    contents.push({
      type: "box",
      layout: "vertical",
      spacing: "sm",
      margin: "md",
      contents: buttons,
    });
  }
  return {
    type: "bubble",
    size: "mega",
    body: {
      type: "box",
      layout: "vertical",
      spacing: "md",
      backgroundColor: "#12081C",
      contents,
    },
  };
}

function optionButtons(items, makeData, style = "secondary") {
  return items.map((item, index) => ({
    type: "button",
    style: index === 0 ? "primary" : style,
    height: "sm",
    color: index === 0 ? "#7C4DC4" : "#F5D38B",
    action: postbackAction(item.label, makeData(item), item.label),
  }));
}

/**
 * Colored topic rows — no hero/card images; dark text on pastel fills.
 * Each row is a tappable box (not LINE primary white-text buttons).
 */
function coloredTopicRows() {
  return TOPICS.map((t) => ({
    type: "box",
    layout: "vertical",
    spacing: "xs",
    paddingAll: "14px",
    cornerRadius: "12px",
    backgroundColor: TOPIC_BUTTON_COLORS[t.id] || "#E8DFF0",
    action: postbackAction(t.label, `funnel=topic&id=${t.id}`, t.label),
    contents: [
      {
        type: "text",
        text: t.label,
        weight: "bold",
        size: "md",
        color: DARK_TEXT,
        wrap: true,
      },
      {
        type: "text",
        text: t.hint,
        size: "xs",
        color: DARK_HINT,
        wrap: true,
      },
    ],
  }));
}

function resolveWelcomeHeroUrl(ctx) {
  if (ctx?.welcomeHeroUrl) return ctx.welcomeHeroUrl;
  const base = String(ctx?.publicBaseUrl || "").replace(/\/$/, "");
  return base ? `${base}/${WELCOME_HERO_PATH}` : "";
}

/**
 * Welcome — single bubble with hero image + copy +「開始解碼」only.
 * Do NOT show the 7 category cards here (they appear after start).
 * @param {{ pricingUrl?: string, publicBaseUrl?: string, welcomeHeroUrl?: string }} ctx
 */
export function welcomeFunnelFlex(ctx) {
  const heroUrl = resolveWelcomeHeroUrl(ctx);
  /** @type {Record<string, unknown>} */
  const bubble = {
    type: "bubble",
    size: "mega",
    body: {
      type: "box",
      layout: "vertical",
      spacing: "md",
      paddingAll: "20px",
      backgroundColor: "#0D0718",
      contents: [
        {
          type: "text",
          text: "嗨👋我是情感解碼",
          weight: "bold",
          size: "xl",
          color: "#FFF8EE",
          wrap: true,
        },
        {
          type: "text",
          text: "很高興遇見你 💜",
          size: "md",
          color: "#F5D38B",
          wrap: true,
          margin: "sm",
        },
        {
          type: "text",
          text: "有些事情不是沒有答案,只是當我們身在其中時,很難看清真正的原因\n也不知道下一步該怎麼走\n無論是感情、萌寵、工作、財運、事業,或是最近對自己感到迷惘\n今天我會一步一步陪你整理\n先選一個你現在最想了解的方向,我會陪你慢慢看清楚",
          size: "sm",
          color: "#F8EEDB",
          wrap: true,
          margin: "md",
        },
        {
          type: "separator",
          margin: "lg",
          color: "#3D2463",
        },
        {
          type: "text",
          text: "你將免費獲得",
          weight: "bold",
          size: "md",
          color: "#F5D38B",
          wrap: true,
          margin: "lg",
        },
        {
          type: "text",
          text: "✨ 初步分析\n🃏 免費塔羅三張解析",
          size: "sm",
          color: "#FFF8EE",
          wrap: true,
          margin: "sm",
        },
        {
          type: "text",
          text: "不用急著付費\n先看看我是否真的能幫助你\n再決定是否繼續深入解析",
          size: "sm",
          color: "#F8EEDB",
          wrap: true,
          margin: "md",
        },
        {
          type: "text",
          text: "👇\n請先選擇你想了解的方向",
          size: "sm",
          weight: "bold",
          color: "#FFF8EE",
          align: "center",
          wrap: true,
          margin: "lg",
        },
        {
          type: "box",
          layout: "vertical",
          margin: "xl",
          contents: [
            {
              type: "button",
              style: "primary",
              height: "md",
              color: "#7C4DC4",
              action: postbackAction("開始解碼", "funnel=start", "開始解碼"),
            },
          ],
        },
      ],
    },
  };

  if (heroUrl) {
    bubble.hero = {
      type: "image",
      url: heroUrl,
      size: "full",
      aspectRatio: "16:9",
      aspectMode: "cover",
    };
  }

  return flexMessage("歡迎 · 情感解碼", bubble);
}

/** Layer 1 — 7 service categories as colored dark-text buttons (no card images). */
export function topicSelectFlex() {
  return flexMessage("選擇解碼方向", {
    type: "bubble",
    size: "mega",
    body: {
      type: "box",
      layout: "vertical",
      spacing: "sm",
      paddingAll: "16px",
      backgroundColor: "#FAF7F2",
      contents: [
        {
          type: "text",
          text: "你想從哪個方向看起",
          weight: "bold",
          size: "lg",
          color: DARK_TEXT,
          wrap: true,
        },
        {
          type: "text",
          text: "選一個現在最靠近心裡的就好",
          size: "sm",
          color: DARK_HINT,
          wrap: true,
        },
        {
          type: "box",
          layout: "vertical",
          spacing: "md",
          margin: "lg",
          contents: coloredTopicRows(),
        },
      ],
    },
  });
}

/**
 * Layer 2 — problem / need style: text prompt + colored tappable rows (no hero images).
 * @param {string} topicId
 */
export function problemSelectFlex(topicId) {
  const pack = PROBLEMS_BY_TOPIC[topicId];
  if (!pack || !pack.problems.length) return null;
  const fill = TOPIC_BUTTON_COLORS[topicId] || "#E8DFF0";
  const rows = pack.problems.map((p) => ({
    type: "box",
    layout: "vertical",
    spacing: "xs",
    paddingAll: "12px",
    cornerRadius: "10px",
    backgroundColor: fill,
    action: postbackAction(p.label, `funnel=problem&id=${p.id}`, p.label),
    contents: [
      {
        type: "text",
        text: p.label,
        weight: "bold",
        size: "sm",
        color: DARK_TEXT,
        wrap: true,
      },
      ...(p.hint
        ? [
            {
              type: "text",
              text: p.hint,
              size: "xs",
              color: DARK_HINT,
              wrap: true,
            },
          ]
        : []),
    ],
  }));

  return flexMessage("選擇問題類型", {
    type: "bubble",
    size: "mega",
    body: {
      type: "box",
      layout: "vertical",
      spacing: "sm",
      paddingAll: "16px",
      backgroundColor: "#FAF7F2",
      contents: [
        {
          type: "text",
          text: pack.prompt,
          weight: "bold",
          size: "md",
          color: DARK_TEXT,
          wrap: true,
        },
        {
          type: "text",
          text: "選最接近你目前狀況的就可以",
          size: "xs",
          color: DARK_HINT,
          wrap: true,
        },
        {
          type: "box",
          layout: "vertical",
          spacing: "sm",
          margin: "lg",
          contents: rows,
        },
      ],
    },
  });
}

/** @deprecated Prefer plain text describe prompts in handlers (Layer 3). */
export function describePromptFlex() {
  return flexMessage(
    "請描述你的狀況",
    bubbleBody(
      "先把事情說清楚一點",
      "像跟朋友訴苦一樣打在聊天室就好\n最近發生什麼、你什麼感覺、最想弄清楚哪一件\n大概寫到四十個字以上 說完我們再抽免費三張牌\n略過描述暫時沒有辦法抽喔",
      []
    )
  );
}

export function freeOfferFlex() {
  return flexMessage(
    "免費三張塔羅",
    bubbleBody(
      "要不要先抽三張看看",
      "免費體驗：現況、關鍵、走向\n第三張會留一點懸念 想聽完整再說也可以",
      [
        {
          type: "button",
          style: "primary",
          color: "#7C4DC4",
          action: postbackAction("開始免費三張牌", "funnel=free_yes", "開始免費三張牌"),
        },
        {
          type: "button",
          style: "secondary",
          color: "#F5D38B",
          action: postbackAction("先不抽牌", "funnel=free_no", "先不抽牌"),
        },
      ]
    )
  );
}

/**
 * Card face Flex — hero image + short meaning + next-step buttons.
 * Long spoken interpretation is sent as a separate text message first.
 *
 * @param {{ name: string, meaning: string, imageUrl?: string, label?: string }} card
 * @param {number} index 0-based
 * @param {boolean} isLast
 */
export function cardRevealFlex(card, index, isLast) {
  const pos = CARD_POSITIONS[index] || { label: `第 ${index + 1} 張` };
  const shortMeaning = String(card.meaning || "").slice(0, 200);
  const bodyContents = [
    {
      type: "text",
      text: pos.label,
      weight: "bold",
      size: "lg",
      color: "#F5D38B",
      wrap: true,
    },
    {
      type: "text",
      text: `【${card.name}】`,
      size: "md",
      weight: "bold",
      color: "#FFF8EE",
      wrap: true,
      margin: "sm",
    },
    {
      type: "text",
      text: shortMeaning,
      size: "sm",
      color: "#F8EEDB",
      wrap: true,
      margin: "md",
    },
  ];

  if (isLast) {
    bodyContents.push({
      type: "box",
      layout: "vertical",
      spacing: "sm",
      margin: "md",
      paddingAll: "12px",
      backgroundColor: "#2A1744",
      borderColor: "#F5D38B",
      borderWidth: "1px",
      cornerRadius: "12px",
      contents: [
        {
          type: "text",
          text: "這張牌還藏著一個關鍵結論",
          size: "sm",
          weight: "bold",
          color: "#F5D38B",
          wrap: true,
        },
        {
          type: "text",
          text: "完整走向跟你可以怎麼走 解鎖後我會一次說清楚",
          size: "xs",
          color: "#FFF8EE",
          wrap: true,
        },
      ],
    });
  }

  const buttons = isLast
    ? [
        {
          type: "button",
          style: "primary",
          color: "#7C4DC4",
          action: postbackAction("想知道後續", "funnel=after_cards", "想知道後續"),
        },
        {
          type: "button",
          style: "secondary",
          color: "#F5D38B",
          action: postbackAction("先到這裡", "funnel=leave", "先到這裡"),
        },
      ]
    : [
        {
          type: "button",
          style: "primary",
          color: "#7C4DC4",
          // from= current index — handlers ignore stale duplicates so card1→2→3 advances once each
          action: postbackAction("下一張牌", `funnel=next_card&from=${index}`, "下一張牌"),
        },
      ];

  bodyContents.push({
    type: "box",
    layout: "vertical",
    spacing: "sm",
    margin: "lg",
    contents: buttons,
  });

  /** @type {Record<string, unknown>} */
  const bubble = {
    type: "bubble",
    size: "mega",
    body: {
      type: "box",
      layout: "vertical",
      spacing: "sm",
      paddingAll: "16px",
      backgroundColor: "#12081C",
      contents: bodyContents,
    },
  };

  if (card.imageUrl) {
    bubble.hero = {
      type: "image",
      url: card.imageUrl,
      size: "full",
      aspectRatio: "2:3",
      aspectMode: "cover",
    };
  }

  return flexMessage(`${pos.label}｜${card.name}`, bubble);
}

/**
 * Layer 3 style helper — need choices as text + quickReply (no Flex carousel).
 * Kept for callers that still import needSelectFlex; prefer needSelectTextMessage in handlers.
 */
export function needSelectFlex() {
  return needSelectTextMessage();
}

/** Plain text + quickReply for「你現在最需要什麼」. */
export function needSelectTextMessage() {
  return {
    type: "text",
    text: [
      "💜 你現在最想知道的是什麼？",
      "選一個最接近的就好 我會幫你推薦適合的方向",
      "",
      ...NEEDS.map((n) => `${n.label}\n${n.hint}`),
    ].join("\n"),
    quickReply: {
      items: NEEDS.map((n) => ({
        type: "action",
        action: postbackAction(n.label.slice(0, 20), `funnel=need&id=${n.id}`, n.label),
      })),
    },
  };
}

/**
 * @param {import('./funnel-catalog.js').RecommendProduct[]} products
 * @param {{ pricingUrl: (route: string) => string, allPlansUrl: string }} ctx
 */
export function recommendFlex(products, ctx) {
  const primary = products[0];
  const alts = products.slice(1);
  const buttons = [];

  if (primary) {
    buttons.push({
      type: "button",
      style: "primary",
      color: "#7C4DC4",
      action: postbackAction("立即開始", `funnel=start&pid=${primary.id}`, "立即開始"),
    });
  }

  for (const alt of alts) {
    buttons.push({
      type: "button",
      style: "secondary",
      color: "#B780FF",
      height: "sm",
      action: postbackAction(`改選 ${alt.title}`.slice(0, 40), `funnel=start&pid=${alt.id}`, alt.title),
    });
  }

  buttons.push({
    type: "button",
    style: "secondary",
    color: "#F5D38B",
    height: "sm",
    action: uriAction("查看所有方案", ctx.allPlansUrl),
  });

  const lines = products.map((p, i) => `${i === 0 ? "★" : "·"} ${p.title}\n  ${p.blurb}`).join("\n\n");

  return flexMessage(
    "為你推薦",
    bubbleBody(
      "為你推薦",
      `根據你剛選的需求 我先整理這幾個方向\n\n${lines}\n\n價格與完整內容請到方案頁確認`,
      buttons
    )
  );
}

/**
 * Light member first + optional pay CTA (legacy / fallback).
 * @param {{ productId: string|null, lineOaUrl: string|null, pricingUrl: string, payUrl?: string|null }} ctx
 */
export function startUnlockFlex(ctx) {
  const product = ctx.productId ? getProduct(ctx.productId) : null;
  const title = product ? `立即開始｜${product.title}` : "立即開始";
  const amountLine =
    product?.amount != null ? `方案金額 NT$ ${product.amount}` : "方案金額請至方案頁確認";
  const buttons = [];

  if (ctx.payUrl) {
    buttons.push({
      type: "button",
      style: "primary",
      color: "#7C4DC4",
      action: uriAction("前往付款", ctx.payUrl),
    });
  } else {
    buttons.push({
      type: "button",
      style: "primary",
      color: "#7C4DC4",
      action: postbackAction("確認建立輕會員", "funnel=light_member", "確認建立輕會員"),
    });
  }

  buttons.push({
    type: "button",
    style: "secondary",
    color: "#F5D38B",
    height: "sm",
    action: uriAction("查看方案細節", ctx.pricingUrl),
  });

  if (ctx.lineOaUrl) {
    buttons.push({
      type: "button",
      style: "secondary",
      color: "#78E0D5",
      height: "sm",
      action: uriAction("回到對話繼續", ctx.lineOaUrl),
    });
  }

  return flexMessage(
    title,
    bubbleBody(
      title,
      [
        amountLine,
        "",
        ctx.payUrl
          ? "點「前往付款」會開啟藍新金流安全頁\n付款完成後我會在對話裡通知你"
          : "先幫你建立 LINE 輕會員 保存今天的解碼紀錄\n接著再進入方案確認",
      ].join("\n"),
      buttons
    )
  );
}

/**
 * Checkout Flex with URI to /pay.html?token=…
 * @param {{ productTitle: string, amount: number, payUrl: string, pricingUrl: string, merchantOrderNo?: string }} ctx
 */
export function paymentCheckoutFlex(ctx) {
  const title = `付款｜${ctx.productTitle}`;
  return flexMessage(
    title,
    bubbleBody(
      title,
      [
        `金額 NT$ ${ctx.amount}`,
        ctx.merchantOrderNo ? `訂單 ${ctx.merchantOrderNo}` : "",
        "",
        "點下方按鈕前往藍新金流完成付款",
        "付款成功後會自動回來 並在對話通知你",
      ]
        .filter(Boolean)
        .join("\n"),
      [
        {
          type: "button",
          style: "primary",
          color: "#7C4DC4",
          action: uriAction("前往付款", ctx.payUrl),
        },
        {
          type: "button",
          style: "secondary",
          color: "#F5D38B",
          height: "sm",
          action: uriAction("查看方案細節", ctx.pricingUrl),
        },
      ]
    )
  );
}

/**
 * Shown when NEWEBPAY_* env is incomplete.
 * @param {{ pricingUrl: string, lineOaUrl?: string|null }} ctx
 */
export function paymentNotConfiguredFlex(ctx) {
  const buttons = [
    {
      type: "button",
      style: "primary",
      color: "#7C4DC4",
      action: uriAction("查看所有方案", ctx.pricingUrl),
    },
  ];
  if (ctx.lineOaUrl) {
    buttons.push({
      type: "button",
      style: "secondary",
      color: "#78E0D5",
      height: "sm",
      action: uriAction("回到對話", ctx.lineOaUrl),
    });
  }
  return flexMessage(
    "金流尚未設定",
    bubbleBody(
      "金流尚未設定",
      [
        "藍新付款參數還沒就緒",
        "請稍後再試 或先查看方案細節",
        "",
        "（站長需在 Render 設定 NEWEBPAY_MERCHANT_ID / HASH_KEY / HASH_IV）",
      ].join("\n"),
      buttons
    )
  );
}

export function lightMemberDoneFlex(ctx) {
  return flexMessage(
    "輕會員已建立",
    bubbleBody(
      "輕會員已建立",
      "今天的免費三張體驗與選擇已幫你留著\n接下來可以查看方案 或明確點「重新開始」再開一輪",
      [
        {
          type: "button",
          style: "primary",
          color: "#7C4DC4",
          action: uriAction("查看所有方案", ctx.allPlansUrl),
        },
        {
          type: "button",
          style: "secondary",
          color: "#F5D38B",
          height: "sm",
          action: postbackAction("重新開始", "funnel=restart", "重新開始"),
        },
      ]
    )
  );
}

/** Explicit restart CTA after free draw is done (never silent redraw). */
export function restartDecodeFlex() {
  return flexMessage(
    "重新開始",
    bubbleBody(
      "要重新解碼嗎",
      "這輪免費三張已經抽過了\n繼續的話選需求或看推薦；真的要重來再點下面",
      [
        {
          type: "button",
          style: "primary",
          color: "#7C4DC4",
          action: postbackAction("重新開始一輪", "funnel=restart", "重新開始"),
        },
      ]
    )
  );
}

export function softExitFlex(ctx) {
  return flexMessage(
    "先到這裡也可以",
    bubbleBody(
      "沒關係 先到這裡也可以",
      "之後想繼續 隨時回覆「開始解碼」\n若想先逛方案 也可以直接看完整貨架",
      [
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
          action: uriAction("查看所有方案", ctx.allPlansUrl),
        },
      ]
    )
  );
}

export function continueChatFlex(ctx) {
  return flexMessage(
    "繼續聊聊或看方案",
    bubbleBody(
      "好 我們先不抽牌也可以",
      "你可以繼續在聊天室告訴我更多 或先逛逛方案",
      [
        {
          type: "button",
          style: "primary",
          color: "#7C4DC4",
          // free_yes still requires adequate description in handlers
          action: postbackAction("還是想抽牌", "funnel=free_yes", "還是想抽牌"),
        },
        {
          type: "button",
          style: "secondary",
          color: "#F5D38B",
          action: uriAction("查看所有方案", ctx.allPlansUrl),
        },
      ]
    )
  );
}
