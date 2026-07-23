/**
 * Flex builders for conversation growth funnel (Phase A+B).
 * Copy rules: no sentence-ending 「。」, no「AI」in user-facing text.
 */

import {
  CARD_POSITIONS,
  NEEDS,
  PROBLEMS_BY_TOPIC,
  TOPICS,
  getProduct,
} from "./funnel-catalog.js";

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
  return {
    type: "bubble",
    size: "mega",
    body: {
      type: "box",
      layout: "vertical",
      spacing: "md",
      backgroundColor: "#12081C",
      contents: [
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
        {
          type: "box",
          layout: "vertical",
          spacing: "sm",
          margin: "md",
          contents: buttons,
        },
      ],
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

/** Large full-width topic rows (height md) for hero / topic menu. */
function largeTopicButtons() {
  return TOPICS.map((t, index) => ({
    type: "button",
    style: index === 0 ? "primary" : "secondary",
    height: "md",
    color: index === 0 ? "#7C4DC4" : "#3D2463",
    action: postbackAction(t.label, `funnel=topic&id=${t.id}`, t.label),
  }));
}

/**
 * Welcome HERO — carousel:
 * Bubble1 = brand + large「開始解碼」
 * Bubble2 = 7 major topics as large tappable rows
 * @param {{ pricingUrl: string }} ctx
 */
export function welcomeFunnelFlex(ctx) {
  const heroBubble = {
    type: "bubble",
    size: "mega",
    body: {
      type: "box",
      layout: "vertical",
      spacing: "lg",
      paddingAll: "20px",
      backgroundColor: "#0D0718",
      contents: [
        {
          type: "text",
          text: "🌙 Erosée · 情感解碼",
          weight: "bold",
          size: "xl",
          color: "#F5D38B",
          align: "center",
          wrap: true,
        },
        {
          type: "text",
          text: "把心裡卡住的事 慢慢攤開來看",
          size: "md",
          weight: "bold",
          color: "#FFF8EE",
          align: "center",
          wrap: true,
          margin: "md",
        },
        {
          type: "text",
          text: "免費三張牌體驗 · 選方向就能開始",
          size: "sm",
          color: "#F8EEDB",
          align: "center",
          wrap: true,
          margin: "sm",
        },
        {
          type: "box",
          layout: "vertical",
          margin: "xl",
          spacing: "md",
          paddingAll: "4px",
          contents: [
            {
              type: "button",
              style: "primary",
              height: "md",
              color: "#7C4DC4",
              action: postbackAction("開始解碼", "funnel=start", "開始解碼"),
            },
            {
              type: "button",
              style: "secondary",
              height: "sm",
              color: "#F5D38B",
              action: uriAction("查看所有方案", ctx.pricingUrl),
            },
          ],
        },
        {
          type: "text",
          text: "或往右滑 直接選主題 →",
          size: "xs",
          color: "#B8A99A",
          align: "center",
          margin: "md",
        },
      ],
    },
  };

  const topicsBubble = {
    type: "bubble",
    size: "mega",
    body: {
      type: "box",
      layout: "vertical",
      spacing: "md",
      paddingAll: "16px",
      backgroundColor: "#12081C",
      contents: [
        {
          type: "text",
          text: "七大解碼方向",
          weight: "bold",
          size: "lg",
          color: "#F5D38B",
          align: "center",
          wrap: true,
        },
        {
          type: "text",
          text: "點一個最接近現在的你",
          size: "sm",
          color: "#F8EEDB",
          align: "center",
          wrap: true,
        },
        {
          type: "box",
          layout: "vertical",
          spacing: "md",
          margin: "lg",
          contents: largeTopicButtons(),
        },
      ],
    },
  };

  return flexMessage("歡迎 · Erosée 情感解碼", {
    type: "carousel",
    contents: [heroBubble, topicsBubble],
  });
}

export function topicSelectFlex() {
  return flexMessage("選擇服務分類", {
    type: "bubble",
    size: "mega",
    body: {
      type: "box",
      layout: "vertical",
      spacing: "md",
      paddingAll: "16px",
      backgroundColor: "#12081C",
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
          text: "選一個最接近的方向 不用想得太複雜",
          size: "sm",
          color: "#F8EEDB",
          wrap: true,
        },
        {
          type: "box",
          layout: "vertical",
          spacing: "md",
          margin: "lg",
          contents: largeTopicButtons(),
        },
      ],
    },
  });
}

/**
 * @param {string} topicId
 */
export function problemSelectFlex(topicId) {
  const pack = PROBLEMS_BY_TOPIC[topicId];
  if (!pack || !pack.problems.length) return null;
  return flexMessage(
    "選擇問題類型",
    bubbleBody(
      pack.prompt,
      "選最接近你目前狀況的就可以",
      optionButtons(pack.problems, (p) => `funnel=problem&id=${p.id}`)
    )
  );
}

export function describePromptFlex() {
  return flexMessage(
    "請描述你的狀況",
    bubbleBody(
      "好 方向我大概抓到了",
      "接下來你可以像跟朋友說話一樣 把事情慢慢打給我\n說得越完整 我越能對到你現在真正卡的點",
      [
        {
          type: "button",
          style: "secondary",
          color: "#F5D38B",
          height: "sm",
          action: postbackAction("略過描述 直接抽牌", "funnel=skip_describe", "略過描述 直接抽牌"),
        },
      ]
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
          action: postbackAction("下一張牌", "funnel=next_card", "下一張牌"),
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

export function needSelectFlex() {
  return flexMessage(
    "你現在最需要什麼",
    bubbleBody(
      "💜 你現在最想知道的是什麼？",
      "選一個最接近的 我會為你推薦適合的方案",
      optionButtons(NEEDS, (n) => `funnel=need&id=${n.id}`)
    )
  );
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
      "今天的免費三張體驗與選擇已幫你留著\n接下來可以查看方案 或隨時回覆「開始解碼」再走一輪",
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
          action: postbackAction("再解碼一次", "funnel=start", "開始解碼"),
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
