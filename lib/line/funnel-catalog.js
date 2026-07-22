/**
 * Conversation Growth funnel catalog (Phase A+B).
 * Aligned with emotion-bridge CONVERSATION_GROWTH_AND_COMMERCE_SPEC + L2 pricing shelf.
 * `amount` mirrors erosee-l2-pricing.html (TWD) for NewebPay MPG checkout.
 */

/** @typedef {{ id: string, label: string, hint: string }} Topic */
/** @typedef {{ id: string, label: string, hint: string }} Problem */
/** @typedef {{ id: string, label: string, hint: string }} Need */
/** @typedef {{ id: string, title: string, blurb: string, pricingRoute: string, amount: number, needIds: string[], topicIds: string[] }} RecommendProduct */

/** @type {Topic[]} */
export const TOPICS = [
  { id: "love", label: "❤️ 感情關係", hint: "看懂對方態度、關係變化與下一步" },
  { id: "pet", label: "🐾 萌寵心語", hint: "了解毛孩心情、行為與你們的連結" },
  { id: "work", label: "💼 工作事業", hint: "看見盲點、機會與最值得投入的方向" },
  { id: "wealth", label: "💰 財富金流", hint: "看清金錢流動、機會與風險" },
  { id: "growth", label: "🌱 自我成長", hint: "釐清最近最在意的事與節奏" },
  { id: "life", label: "🧭 生活指引", hint: "想找一個方向時，慢慢理出頭緒" },
  { id: "other", label: "🌌 其他困擾", hint: "還沒整理好的事，也可以從這裡開始" },
];

/** @type {Record<string, { prompt: string, problems: Problem[] }>} */
export const PROBLEMS_BY_TOPIC = {
  love: {
    prompt: "感情裡，現在最讓你放不下的是哪一件事呢？",
    problems: [
      { id: "no_reply", label: "💬 已讀不回", hint: "對方看過訊息，卻遲遲沒有回覆" },
      { id: "sudden_coldness", label: "❄️ 突然冷淡", hint: "原本互動正常，最近態度明顯改變" },
      { id: "situationship", label: "💞 曖昧不明", hint: "有互動，卻不知道對方是否認真" },
      { id: "breakup_recovery", label: "💔 分手挽回", hint: "想知道還有沒有重新開始的可能" },
      { id: "conflict_repair", label: "⚡ 爭吵修復", hint: "衝突後不知道該主動還是先冷靜" },
      { id: "partner_intentions", label: "🔍 對方真實想法", hint: "想了解對方現在如何看待這段關係" },
      { id: "third_party", label: "👤 第三者疑慮", hint: "擔心關係受到干擾" },
      { id: "relationship_other", label: "🌙 其他感情問題", hint: "我的情況不在上面的選項裡" },
    ],
  },
  pet: {
    prompt: "關於你的毛孩，現在最想了解的是哪一件事呢？",
    problems: [
      { id: "pet_emotion", label: "🐶 毛孩現在的心情", hint: "想知道牠最近開不開心或有沒有壓力" },
      { id: "pet_connection", label: "💞 我和毛孩的連結", hint: "想了解你們之間的情感連結" },
      { id: "pet_behavior_change", label: "🐾 行為突然改變", hint: "變得黏人、躲起來或不吃東西" },
      { id: "pet_adaptation", label: "🏠 新環境與適應", hint: "搬家、新成員或寄宿後的適應" },
      { id: "pet_care_support", label: "🩺 生病與照護陪伴", hint: "生病、治療或年老時的陪伴" },
      { id: "pet_loss", label: "🌈 離世毛孩與思念", hint: "整理思念、遺憾與告別" },
      { id: "multiple_pets", label: "🐕 多寵相處問題", hint: "兩隻以上毛孩的相處狀態" },
      { id: "pet_other", label: "🌙 其他萌寵問題", hint: "想直接描述毛孩最近的狀況" },
    ],
  },
  work: {
    prompt: "最近在工作上，哪一件事最讓你困擾呢？",
    problems: [
      { id: "work_stress", label: "😣 工作壓力", hint: "工作量、責任或情緒壓力很重" },
      { id: "work_relationship", label: "👥 職場人際", hint: "與主管、同事或客戶出現摩擦" },
      { id: "job_change", label: "🔄 是否轉職", hint: "不確定該留下還是找新機會" },
      { id: "work_blockage", label: "📉 工作不順", hint: "努力很久卻卡住" },
      { id: "promotion", label: "📈 升遷與加薪", hint: "想了解被看見或升遷機會" },
      { id: "career_direction", label: "🧭 職涯方向", hint: "不確定下一步該往哪裡走" },
      { id: "work_other", label: "🌙 其他工作問題", hint: "我的情況不在上面的選項裡" },
    ],
  },
  wealth: {
    prompt: "你現在最想了解哪一方面的金錢問題呢？",
    problems: [
      { id: "income_instability", label: "💸 收入不穩", hint: "收入忽高忽低，缺乏安全感" },
      { id: "financial_pressure", label: "🧾 金錢壓力", hint: "支出、債務或生活負擔焦慮" },
      { id: "money_outlook", label: "💵 近期財運", hint: "想了解最近金錢流動與機會" },
      { id: "investment_decision", label: "📊 投資選擇", hint: "面對投資或資金配置猶豫" },
      { id: "spending_saving", label: "🛍️ 消費與存錢", hint: "想改善花錢習慣" },
      { id: "financial_cooperation", label: "🤝 金錢合作", hint: "借貸、合夥關係讓你猶豫" },
      { id: "finance_other", label: "🌙 其他財務問題", hint: "我的情況不在上面的選項裡" },
    ],
  },
  growth: {
    prompt: "最近的你，最想整理的是哪一部分呢？",
    problems: [
      { id: "emotional_distress", label: "😔 情緒低落", hint: "容易難過、焦慮或提不起精神" },
      { id: "self_worth", label: "🪞 自我價值", hint: "容易懷疑自己或過度在意看法" },
      { id: "repeating_pattern", label: "🔁 反覆卡關", hint: "總在相似的人事裡受傷" },
      { id: "life_direction", label: "🧭 人生方向", hint: "對未來感到迷惘" },
      { id: "healing", label: "🌿 放下與療癒", hint: "想走出一段經歷" },
      { id: "self_discovery", label: "🧠 內在探索", hint: "想更了解自己的需求與模式" },
      { id: "growth_other", label: "🌙 其他成長問題", hint: "我的情況不在上面的選項裡" },
    ],
  },
  life: {
    prompt: "生活裡，現在最想先看清楚的是哪一件？",
    problems: [
      { id: "life_choice", label: "⚖️ 重要選擇", hint: "兩個方向之間不知道怎麼選" },
      { id: "life_rhythm", label: "🕰️ 節奏重整", hint: "想把生活節奏重新調回來" },
      { id: "life_relationship", label: "👥 人際界線", hint: "家人朋友之間的界線與距離" },
      { id: "life_other", label: "🌙 其他生活問題", hint: "想直接描述現在的狀況" },
    ],
  },
  other: {
    prompt: "",
    problems: [],
  },
};

/** @type {Need[]} */
export const NEEDS = [
  {
    id: "solve_now",
    label: "① 解決目前問題",
    hint: "想知道現在該怎麼做，才能改善狀況",
  },
  {
    id: "full_arc",
    label: "② 看完整關係發展",
    hint: "想看完整解析、真實想法與關鍵時間點",
  },
  {
    id: "companion",
    label: "③ 希望持續有人陪伴",
    hint: "情緒與關係反覆，希望有人陪著整理",
  },
];

/**
 * Recommend products aligned with L2 shelf sections (erosee-l2-pricing.html).
 * @type {RecommendProduct[]}
 */
export const PRODUCTS = [
  {
    id: "emotion_depth",
    title: "情感深度分析",
    blurb: "看清對方態度、卡住原因，以及你下一步怎麼走",
    pricingRoute: "/pricing/emotion",
    amount: 899,
    needIds: ["solve_now", "full_arc"],
    topicIds: ["love", "growth", "life", "other"],
  },
  {
    id: "emotion_line",
    title: "LINE 對話解析",
    blurb: "整理對話裡的訊號，釐清對方真實態度",
    pricingRoute: "/pricing/emotion",
    amount: 1299,
    needIds: ["solve_now"],
    topicIds: ["love"],
  },
  {
    id: "emotion_relation",
    title: "關係健檢",
    blurb: "把關係全貌攤開，看投入、信任與發展空間",
    pricingRoute: "/pricing/emotion",
    amount: 1999,
    needIds: ["full_arc"],
    topicIds: ["love", "growth"],
  },
  {
    id: "emotion_tarot5",
    title: "五張塔羅（凱爾特十字）",
    blurb: "議題複雜時看全局，適合想看完整牌陣的你",
    pricingRoute: "/pricing/emotion",
    amount: 699,
    needIds: ["full_arc", "solve_now"],
    topicIds: ["love", "work", "wealth", "growth", "life", "other"],
  },
  {
    id: "pet_bond",
    title: "我們的陪伴關係",
    blurb: "看清你與毛孩之間更深一層的連結",
    pricingRoute: "/pricing/pet",
    amount: 3600,
    needIds: ["solve_now", "full_arc", "companion"],
    topicIds: ["pet"],
  },
  {
    id: "pet_triple",
    title: "萌寵三張牌指引",
    blurb: "用三張牌整理毛孩現況與你們的互動",
    pricingRoute: "/pricing/pet",
    amount: 399,
    needIds: ["solve_now"],
    topicIds: ["pet"],
  },
  {
    id: "career_fork",
    title: "職涯十字路",
    blurb: "適合轉職、升遷與方向選擇卡住時",
    pricingRoute: "/pricing/career",
    amount: 699,
    needIds: ["solve_now", "full_arc"],
    topicIds: ["work"],
  },
  {
    id: "wealth_celtic",
    title: "財運五張塔羅",
    blurb: "金錢議題複雜時，用全局視角整理機會與風險",
    pricingRoute: "/pricing/wealth",
    amount: 699,
    needIds: ["solve_now", "full_arc"],
    topicIds: ["wealth"],
  },
  {
    id: "subscribe_resonance",
    title: "共鳴會員陪伴",
    blurb: "適合想持續有人陪你整理情緒與關係的你",
    pricingRoute: "/pricing/subscribe",
    amount: 990,
    needIds: ["companion"],
    topicIds: ["love", "pet", "work", "wealth", "growth", "life", "other"],
  },
  {
    id: "heal_organize",
    title: "情緒整理",
    blurb: "先把混亂情緒安放好，再談下一步",
    pricingRoute: "/pricing/heal",
    amount: 299,
    needIds: ["solve_now", "companion"],
    topicIds: ["growth", "life", "other", "love"],
  },
];

export const CARD_POSITIONS = [
  { key: "past", label: "第一張｜現況" },
  { key: "present", label: "第二張｜關鍵" },
  { key: "future", label: "第三張｜走向" },
];

/**
 * Pick primary + up to 2 alternatives for need/topic.
 * @param {string} needId
 * @param {string} topicId
 */
export function pickRecommendations(needId, topicId) {
  const scored = PRODUCTS.map((p) => {
    let score = 0;
    if (p.needIds.includes(needId)) score += 2;
    if (p.topicIds.includes(topicId)) score += 2;
    if (needId === "companion" && p.id === "subscribe_resonance") score += 3;
    if (needId === "full_arc" && (p.id === "emotion_relation" || p.id === "emotion_tarot5")) score += 1;
    return { product: p, score };
  })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score);

  const unique = [];
  const seen = new Set();
  for (const row of scored) {
    if (seen.has(row.product.id)) continue;
    seen.add(row.product.id);
    unique.push(row.product);
    if (unique.length >= 3) break;
  }

  if (!unique.length) {
    return PRODUCTS.filter((p) => p.id === "emotion_depth" || p.id === "subscribe_resonance").slice(0, 2);
  }
  return unique;
}

export function getTopic(topicId) {
  return TOPICS.find((t) => t.id === topicId) || null;
}

export function getProblem(topicId, problemId) {
  const pack = PROBLEMS_BY_TOPIC[topicId];
  if (!pack) return null;
  return pack.problems.find((p) => p.id === problemId) || null;
}

export function getNeed(needId) {
  return NEEDS.find((n) => n.id === needId) || null;
}

export function getProduct(productId) {
  return PRODUCTS.find((p) => p.id === productId) || null;
}
