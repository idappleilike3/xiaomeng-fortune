/**
 * Full 78-card tarot deck for paid / deep readings only.
 *
 * Free LINE funnel MUST keep using FREE_TAROT_CARDS (22 Major Arcana) in
 * funnel-catalog.js — do not import this module into free draw handlers.
 *
 * Deck = 22 Major + 56 Minor (權杖／聖杯／寶劍／錢幣).
 * Minor faces: no dedicated PNGs yet → suit-themed major faces that already exist
 * (Magician holds all four suit tools; other majors map by theme). Paths are real
 * assets under assets/ so LINE Flex images will not 404.
 *
 * Copy: Taiwanese spoken, no sentence-ending 「。」, no AI / 小夢 branding.
 */

import { FREE_TAROT_CARDS, resolveTarotImageUrl } from "./funnel-catalog.js";

/** @typedef {import("./funnel-catalog.js").FreeTarotCard} FreeTarotCard */

/**
 * @typedef {FreeTarotCard & {
 *   arcana: "major" | "minor",
 *   suit?: "wands" | "cups" | "swords" | "pentacles" | "major"
 * }} PaidTarotCard
 */

/** Suit-themed face images that already ship in assets/ (22 majors only on disk). */
const SUIT_IMAGE = {
  wands: {
    imagePath: "assets/tarot-new-07-chariot.png",
    imagePathFallback: "assets/tarot-07-the-chariot.png",
  },
  cups: {
    imagePath: "assets/tarot-new-06-lovers.png",
    imagePathFallback: "assets/tarot-06-the-lovers.png",
  },
  swords: {
    imagePath: "assets/tarot-new-11-justice.png",
    imagePathFallback: "assets/tarot-11-justice.png",
  },
  pentacles: {
    imagePath: "assets/tarot-new-04-emperor.png",
    imagePathFallback: "assets/tarot-04-the-emperor.png",
  },
};

/** Generic minor fallback when suit map misses — Magician shows all four suit tools. */
const MINOR_GENERIC_IMAGE = {
  imagePath: "assets/tarot-new-01-magician.png",
  imagePathFallback: "assets/tarot-01-the-magician.png",
};

const SUIT_META = {
  wands: {
    zh: "權杖",
    theme: "行動與熱情",
    psych: "行動、意志、想把事情推出去的那股力",
    bodyCue: "胸口或肩膀那種想衝又怕衝錯的緊",
  },
  cups: {
    zh: "聖杯",
    theme: "情感與連結",
    psych: "情緒、依附、想被懂也被靠近的需要",
    bodyCue: "胸口悶悶的、或忽然很想哭的那種軟",
  },
  swords: {
    zh: "寶劍",
    theme: "思緒與界線",
    psych: "念頭、判斷、腦內吵個不停的那個戰場",
    bodyCue: "太陽穴或後腦杓一直轉個不停",
  },
  pentacles: {
    zh: "錢幣",
    theme: "安全感與現實",
    psych: "資源、身體、金錢、生活能不能站穩",
    bodyCue: "胃或下腹那種空、或不夠穩的感覺",
  },
};

/**
 * Rank hooks: short meaning + psych angle (used to compose spoken paragraphs).
 * @type {Record<string, { label: string, short: string, angle: string, cliff: string }>}
 */
const RANK_META = {
  王牌: {
    label: "王牌",
    short: "新的開始正在敲門 先別急著否定自己",
    angle: "種子剛落地 你可能還不太敢相信它是真的",
    cliff: "這顆種子會不會長成 跟你願不願意給它一點空間有關",
  },
  二: {
    label: "二",
    short: "你站在分岔口 兩邊都在拉你",
    angle: "選擇焦慮常常不是資訊不夠 是怕選錯就被否定",
    cliff: "分岔後面真正要面對的 是你比較怕失去哪一邊",
  },
  三: {
    label: "三",
    short: "事情開始長出來了 也開始需要合作或承擔",
    angle: "你可能一邊期待成果 一邊又怕被看見或不被看見",
    cliff: "長出來之後怎麼接 跟你敢不敢讓別人進來有關",
  },
  四: {
    label: "四",
    short: "穩定很重要 但穩太死也會變成卡住",
    angle: "你在找安全的節奏 可是安全有時會變成逃避改變",
    cliff: "穩定要不要鬆一點 會牽動後面的流動",
  },
  五: {
    label: "五",
    short: "摩擦或失落進來了 先承認痛再談下一步",
    angle: "衝突感或空缺感 常常勾起舊的自我價值傷口",
    cliff: "痛過之後你會怎麼護住自己 我先留一點給後面",
  },
  六: {
    label: "六",
    short: "有流動、被看見或被支持的機會",
    angle: "你可能不習慣被幫忙 或一被看見就開始緊張",
    cliff: "這股流動能不能接住 跟你對「值得」的看法有關",
  },
  七: {
    label: "七",
    short: "評估、防禦或幻想正在干擾判斷",
    angle: "你可能用想很多來換一點掌控感 結果更耗",
    cliff: "真正要拆的那層防衛 我先不一次講破",
  },
  八: {
    label: "八",
    short: "速度在變 或你正從舊狀態裡抽身",
    angle: "移動會激發不安 也會激發自由感 兩者常一起來",
    cliff: "離開之後會落到哪 跟你對自己的承諾有關",
  },
  九: {
    label: "九",
    short: "快到了 也最容易累、最容易反覆懷疑",
    angle: "接近完成時的焦慮 常常比開始時還大聲",
    cliff: "臨門那一步會不會跨出去 我先留個懸念",
  },
  十: {
    label: "十",
    short: "一個循環到頂了 該收或該放下超載",
    angle: "你可能把責任跟愛綁在一起 於是越扛越沉",
    cliff: "收完之後空出來的位置 會接到什麼我稍後說",
  },
  侍者: {
    label: "侍者",
    short: "新鮮訊息進來了 適合先學、先觀察",
    angle: "新芽很嫩 你若用舊標準量它 很容易提早掐掉",
    cliff: "這則新訊息值不值得跟 跟你的直覺校準有關",
  },
  騎士: {
    label: "騎士",
    short: "動能很強 方向對了就推進 別只剩衝動",
    angle: "行動慾上來時 你可能用速度蓋住更深的害怕",
    cliff: "這股衝勁往哪用最不傷自己 我先留白",
  },
  皇后: {
    label: "皇后",
    short: "成熟的感受力 先照顧內在再對外給",
    angle: "你很會照顧別人 卻常把「我需要什麼」排到最後",
    cliff: "這份成熟感要怎麼回到自己身上 稍後再說",
  },
  國王: {
    label: "國王",
    short: "把主導權拿穩 用清楚取代硬撐",
    angle: "掌控欲有時是恐懼的外套 真正的穩是界線清楚",
    cliff: "主導權怎麼拿才不會把自己逼太緊 我先留著",
  },
};

/**
 * @param {keyof typeof SUIT_META} suitKey
 * @param {keyof typeof RANK_META} rankKey
 * @returns {PaidTarotCard}
 */
function buildMinorCard(suitKey, rankKey) {
  const suit = SUIT_META[suitKey];
  const rank = RANK_META[rankKey];
  const img = SUIT_IMAGE[suitKey] || MINOR_GENERIC_IMAGE;
  const name = `${suit.zh}${rank.label}`;
  const id = `${suitKey}-${rankKey === "王牌" ? "ace" : rankKey}`;

  const spoken = [
    `${name}跑出來了 這張落在「${suit.theme}」這一帶 我比較想用心理的角度跟你說`,
    `它在講的比較像${suit.psych} 不是叫你立刻做一個完美決定`,
    rank.angle,
    `你身體那邊也可能有一點訊號——${suit.bodyCue} 那常常比嘴上的理由更早講真話`,
    `很多人會在這種牌出現時 要嘛用力否認 要嘛把自己罵一頓 其實兩邊都太急了`,
    `先把「我現在真正卡在哪」認出來 比先表演堅強更保護你 這張牌比較像在陪你看清楚自己`,
  ].join("\n\n");

  const spokenCliff = [
    `${name}落在走向這格 後面跟「${suit.theme}」還有一段沒拆完`,
    rank.cliff,
    `細節我先不完全掀開 因為它會跟你剛才說的卡點連在一起`,
    `你先把牌面放著 完整怎麼走 我留到後面一次說清楚`,
  ].join("\n\n");

  return {
    id,
    name,
    arcana: "minor",
    suit: suitKey,
    imagePath: img.imagePath,
    imagePathFallback: img.imagePathFallback,
    meaningShort: `${rank.short}（${suit.theme}）`,
    spoken,
    spokenCliff,
  };
}

const MINOR_RANKS = /** @type {(keyof typeof RANK_META)[]} */ ([
  "王牌",
  "二",
  "三",
  "四",
  "五",
  "六",
  "七",
  "八",
  "九",
  "十",
  "侍者",
  "騎士",
  "皇后",
  "國王",
]);

const MINOR_SUITS = /** @type {(keyof typeof SUIT_META)[]} */ ([
  "wands",
  "cups",
  "swords",
  "pentacles",
]);

/** @type {PaidTarotCard[]} */
const MINOR_ARCANA = MINOR_SUITS.flatMap((suit) =>
  MINOR_RANKS.map((rank) => buildMinorCard(suit, rank))
);

/** @type {PaidTarotCard[]} */
const MAJOR_FROM_FREE = FREE_TAROT_CARDS.map((card) => ({
  ...card,
  arcana: "major",
  suit: "major",
}));

/**
 * Full paid deck: 22 Major (rich unique copy from free catalog) + 56 Minor (suit templates).
 * @type {PaidTarotCard[]}
 */
export const TAROT_DECK_78 = [...MAJOR_FROM_FREE, ...MINOR_ARCANA];

/**
 * @param {string} name
 * @returns {PaidTarotCard|null}
 */
export function getPaidTarotCard(name) {
  return TAROT_DECK_78.find((c) => c.name === name) || null;
}

/**
 * Draw N unique cards from the paid 78 deck (no replacement within one draw).
 * Not used by free funnel — wire from paid/deep reading entry when ready.
 *
 * @param {string} publicBaseUrl
 * @param {number} [count=3]
 * @returns {Array<{
 *   name: string,
 *   meaning: string,
 *   spoken: string,
 *   spokenCliff: string,
 *   imageUrl: string,
 *   arcana: string,
 *   suit?: string
 * }>}
 */
export function drawPaidCards(publicBaseUrl, count = 3) {
  const n = Math.max(1, Math.min(Number(count) || 3, TAROT_DECK_78.length));
  const pool = TAROT_DECK_78;
  const picks = [];
  const used = new Set();
  while (picks.length < n && used.size < pool.length) {
    const idx = Math.floor(Math.random() * pool.length);
    if (used.has(idx)) continue;
    used.add(idx);
    const card = pool[idx];
    picks.push({
      name: card.name,
      meaning: card.meaningShort,
      spoken: card.spoken,
      spokenCliff: card.spokenCliff,
      imageUrl: resolveTarotImageUrl(publicBaseUrl, card.imagePath),
      arcana: card.arcana,
      suit: card.suit,
    });
  }
  return picks;
}

/** Convenience counts for tests / smoke checks. */
export const TAROT_DECK_78_COUNTS = {
  total: TAROT_DECK_78.length,
  major: MAJOR_FROM_FREE.length,
  minor: MINOR_ARCANA.length,
};
