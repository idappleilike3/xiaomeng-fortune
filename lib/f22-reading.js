/**
 * lib/f22-reading.js
 * F22 神殿舞台 4 段深度解讀(對齊 LINE_SYSTEM §0 命名公約,不稱 AI/演算法)
 * 對應商業指令第三階段:打字機效果分段顯示
 *
 * 4 段結構:
 *   - coreMessage     核心訊息(流淌隔空傳給你的訊息...)
 *   - currentSituation 現況解析(你目前正處於...)
 *   - suggestion       建議方向(建議你可以...)
 *   - blessing         今日祝福(願這份指引成為你今晚前進的光...)
 *
 * 對齊聖經命名:實際為「深度解析排版工具」(lib/divination-system.js 擴充)
 */

// 4 段開頭模板(對應老闆商業指令第三階段的「流淌」「你目前」「建議你」「願這份」)
const F22_OPENERS = {
  coreMessage: [
    "流淌隔空傳給你的訊息是——",
    "從星軌的彼端,有訊息正在流向你——",
    "今晚宇宙想告訴你——",
    "請安靜下來,接收這份訊息——",
    "有一道光穿越時空,正在傳遞給你——",
  ],
  currentSituation: [
    "你目前正處於一個轉折的路口。",
    "此刻的你,正站在命運的十字路口。",
    "你現在的位置,正是這張牌想照亮的地方。",
    "你正在經歷的,是靈魂成長必經的洗禮。",
    "今晚的你,正被命運溫柔地看顧著。",
  ],
  suggestion: [
    "建議你可以放慢腳步,讓直覺帶領你。",
    "建議你今晚給自己一段安靜的時光。",
    "建議你相信內在最深的聲音,它會引領你。",
    "建議你允許自己脆弱,因為那是力量的源頭。",
    "建議你今晚寫下三件感恩的事。",
  ],
  blessing: [
    "願這份指引成為你今晚前進的光。",
    "願星光指引你每一日,在自己的節奏裡。",
    "願你在最深的夜裡,仍被溫柔守護。",
    "願這道光,陪你走過每一個未知的明天。",
    "願你的靈魂,在今晚找到歸處。",
  ],
};

const F22_CLOSERS = {
  coreMessage: [
    "請記得,這份訊息從未離開你。",
    "把它放在心裡,讓它慢慢滲透你的日常。",
    "你已經準備好接收它了。",
  ],
  currentSituation: [
    "看清它,接納它,這是蛻變的起點。",
    "不要逃避,因為這正是你需要的。",
    "允許自己停下來,看清楚再走。",
  ],
  suggestion: [
    "從最小的行動開始,宇宙會為你開路。",
    "今晚就給自己 10 分鐘,安靜地坐下來。",
    "相信第一個念頭,它通常是最準的。",
  ],
  blessing: [
    "晚安,小夢老師為你守護。",
    "明天的太陽升起時,你會更勇敢。",
    "願你今夜好眠,明天醒來更完整。",
  ],
};

/**
 * 生成 4 段解讀(對齊 F22 神殿舞台 + 打字機效果)
 * @param {Object} card - { name, en, suit, index, keywords }
 * @param {string} theme - love / work / wealth / health / growth
 * @param {string} question - 用戶問題(可選,影響 body 內容)
 * @returns {Object} { coreMessage, currentSituation, suggestion, blessing }
 */
function generateF22Reading(card, theme = "love", question = "") {
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

  // 從 card 取得主題 body
  let bodyText = "";
  if (card.themes && card.themes[theme]) {
    bodyText = card.themes[theme][Math.floor(Math.random() * card.themes[theme].length)];
  } else if (card.meaning) {
    bodyText = card.meaning;
  } else {
    bodyText = `${card.name} 正在為你帶來重要的訊息。`;
  }

  // 加入用戶問題(如果提供)
  const questionEcho = question
    ? `\n\n(你問的:${question.slice(0, 60)}${question.length > 60 ? "..." : ""})`
    : "";

  return {
    coreMessage: `${pick(F22_OPENERS.coreMessage)}\n\n${bodyText}${questionEcho}\n\n${pick(F22_CLOSERS.coreMessage)}`,
    currentSituation: `${pick(F22_OPENERS.currentSituation)}\n\n${pick(F22_CLOSERS.currentSituation)}`,
    suggestion: `${pick(F22_OPENERS.suggestion)}\n\n${pick(F22_CLOSERS.suggestion)}`,
    blessing: `${pick(F22_OPENERS.blessing)}\n\n${pick(F22_CLOSERS.blessing)}`,
  };
}

/**
 * 把 4 段解讀轉成 SSE 串流格式
 * @param {Object} reading - generateF22Reading 的回傳
 * @returns {string} SSE 格式字串
 */
function readingToSSE(reading) {
  const sections = [
    { type: "coreMessage", label: "核心訊息", text: reading.coreMessage },
    { type: "currentSituation", label: "現況解析", text: reading.currentSituation },
    { type: "suggestion", label: "建議方向", text: reading.suggestion },
    { type: "blessing", label: "今日祝福", text: reading.blessing },
  ];

  let sse = "";
  for (const section of sections) {
    sse += `event: section-start\ndata: ${JSON.stringify({ type: section.type, label: section.label })}\n\n`;
    // 模擬 AI 打字機:每 30ms 一個字元
    for (let i = 0; i < section.text.length; i++) {
      const ch = section.text[i];
      // 換行要用 \\n 表示(LINE 換行)
      sse += `event: char\ndata: ${JSON.stringify({ type: section.type, char: ch })}\n\n`;
    }
    sse += `event: section-end\ndata: ${JSON.stringify({ type: section.type })}\n\n`;
  }
  sse += `event: done\ndata: ${JSON.stringify({ ok: true })}\n\n`;
  return sse;
}

module.exports = {
  generateF22Reading,
  readingToSSE,
  F22_OPENERS,
  F22_CLOSERS,
};

// ES module export(給 browser / script.js 用)
if (typeof window !== "undefined") {
  window.__f22Reading = { generateF22Reading, readingToSSE, F22_OPENERS, F22_CLOSERS };
}