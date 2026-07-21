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

/**
 * @param {{ pricingUrl: string }} ctx
 */
export function welcomeFunnelFlex(ctx) {
  return flexMessage(
    "歡迎 · 開始解碼",
    bubbleBody(
      "嗨 我是情感解碼",
      "先選一個你現在最想了解的方向 我會陪你慢慢看清楚",
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
          action: uriAction("查看所有方案", ctx.pricingUrl),
        },
      ]
    )
  );
}

export function topicSelectFlex() {
  return flexMessage(
    "選擇服務分類",
    bubbleBody(
      "你想從哪裡開始",
      "先選一個你現在最想了解的方向 不用想得太複雜",
      optionButtons(TOPICS, (t) => `funnel=topic&id=${t.id}`)
    )
  );
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
      "好 我大概知道你現在想了解的方向了",
      "接下來可以把事情從頭到尾告訴我 你分享得越完整 我越能看清狀況\n\n直接在聊天室輸入文字即可",
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
      "已理解你的狀況",
      "要不要先做一輪免費三張塔羅 讓我們把現況、關鍵與走向攤開來看",
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
 * @param {{ name: string, meaning: string, label: string, cliffhanger?: boolean }} card
 * @param {number} index 0-based
 * @param {boolean} isLast
 */
export function cardRevealFlex(card, index, isLast) {
  const pos = CARD_POSITIONS[index] || { label: `第 ${index + 1} 張` };
  const extra = [];
  if (isLast) {
    extra.push({
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
          text: "完整走向與行動建議 會在解鎖後一次說清楚",
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

  return flexMessage(
    `${pos.label}｜${card.name}`,
    bubbleBody(
      `${pos.label}`,
      `【${card.name}】\n${card.meaning}${isLast ? "\n\n（此為體驗版摘要 完整解析稍後解鎖）" : ""}`,
      buttons,
      extra
    )
  );
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
 * Light member first + payment stub.
 * @param {{ productId: string|null, lineOaUrl: string|null, pricingUrl: string }} ctx
 */
export function startUnlockFlex(ctx) {
  const product = ctx.productId ? getProduct(ctx.productId) : null;
  const title = product ? `立即開始｜${product.title}` : "立即開始";
  const buttons = [
    {
      type: "button",
      style: "primary",
      color: "#7C4DC4",
      action: postbackAction("確認建立輕會員", "funnel=light_member", "確認建立輕會員"),
    },
    {
      type: "button",
      style: "secondary",
      color: "#F5D38B",
      height: "sm",
      action: uriAction("查看方案細節", product ? ctx.pricingUrl : ctx.pricingUrl),
    },
  ];

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
        "先幫你建立 LINE 輕會員 保存今天的解碼紀錄",
        "接著再進入方案確認",
        "",
        "【付款狀態】目前為預留入口",
        "正式綠界／點數扣款 API 接上後會自動帶你完成付款",
        "現在可先查看方案細節 或回覆「查看所有方案」逛完整貨架",
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
