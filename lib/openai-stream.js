/**
 * lib/openai-stream.js
 * OpenAI Streaming API 串接(2026-07-04 08:24 老闆指示:用 OpenAI API)
 *
 * 用法:
 *   const openai = require("./lib/openai-stream.js");
 *   const stream = openai.streamCompletion({ system, user, onChunk });
 *   await stream;
 *
 * 注意:
 *   - 需要 .env 有 OPENAI_API_KEY(老闆要貼 sk-... 開頭)
 *   - 沒 key 時,呼叫端 fallback 到本地 f22-reading.js
 *   - 對齊聖經命名:實際 prompt 內容用「深度解析排版」,不用「AI / 演算法」
 */

const SYSTEM_PROMPT = `你是小夢神殿的深度解析排版工具(絕對不是 AI / 演算法 / 機器人)。
你的工作是把抽到的塔羅牌,依用戶的問題,生成一段溫柔、神秘、有指引性的「深度靈性解讀」。
語氣要求:
- 像一位深夜會坐在沙發上聽你哭的朋友
- 溫暖、不批判、絕對不給予確切的醫療 / 財務 / 法律診斷
- 用繁體中文(台灣用語)
- 適時穿插金句,但不要連續

輸出格式:純文字(不要 markdown 標記),分 4 段,每段以兩個換行分隔:
1. 核心訊息(流淌隔空傳給你的訊息...)
2. 現況解析(你目前正處於...)
3. 建議方向(建議你可以...)
4. 今日祝福(願這份指引成為你今晚前進的光...)

每段 80-150 字。整體不超過 600 字。`;

function buildUserPrompt(card, theme, question) {
  const themeMap = {
    love: "感情 / 桃花 / 關係",
    work: "工作 / 事業 / 職涯",
    wealth: "財富 / 財務 / 豐盛",
    health: "健康 / 身心",
    growth: "自我探索 / 靈性成長",
  };
  return `今晚抽到的牌:${card.name || "未命名牌"}(${card.en || ""})
主題:${themeMap[theme] || theme}
用戶的問題:${question || "(無特定問題,給予一般性指引)"}

請依牌面 + 主題 + 問題,生成 4 段深度靈性解讀。`;
}

async function streamCompletion({ card, theme = "love", question = "", onChunk }) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY 尚未設定,請老闆在 .env 加上 OPENAI_API_KEY=sk-... 後重啟 server");
  }

  const model = process.env.OPENAI_MODEL || "gpt-4o-mini";
  const apiUrl = process.env.OPENAI_BASE_URL || "https://api.openai.com/v1/chat/completions";

  const body = {
    model,
    stream: true,
    temperature: 0.85,
    max_tokens: 900,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: buildUserPrompt(card, theme, question) },
    ],
  };

  const resp = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  });

  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`OpenAI API ${resp.status}: ${text.slice(0, 200)}`);
  }

  // OpenAI stream 格式是 SSE (data: {json}\n\n, 最後 data: [DONE])
  const reader = resp.body.getReader();
  const decoder = new TextDecoder("utf-8");
  let buffer = "";

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() || "";
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed.startsWith("data:")) continue;
      const data = trimmed.slice(5).trim();
      if (data === "[DONE]") return;
      try {
        const json = JSON.parse(data);
        const delta = json.choices?.[0]?.delta?.content || "";
        if (delta && onChunk) onChunk(delta);
      } catch (_) {}
    }
  }
}

module.exports = {
  streamCompletion,
  SYSTEM_PROMPT,
  buildUserPrompt,
  hasKey: () => !!process.env.OPENAI_API_KEY,
};