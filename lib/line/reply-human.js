/**
 * Human-like LINE delivery: paragraph bubbles with paced pauses.
 * replyToken is valid once — first unit uses reply; later units use push.
 */

const SHORT_PAUSE_MS = 5000;
const MID_PAUSE_MS = 8000;
const LONG_PAUSE_MIN_MS = 8000;
const LONG_PAUSE_MAX_MS = 12000;
/** Below this → ~5s; mid psych paras → ~8s; longer → up to 12s. */
const SHORT_TEXT_CHARS = 50;
const LONG_TEXT_CHARS = 100;
/** Short lead + Flex/buttons: send together (no inter-bubble pause). */
const MENU_LEAD_MAX_CHARS = 120;
const DEFAULT_MAX_BUBBLES = 6;
const DEFAULT_MAX_TOTAL_PAUSE_MS = 40000;

/**
 * @param {number} ms
 * @returns {Promise<void>}
 */
export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Pause after a segment based on its text length.
 * Short ~5s; typical psych paras ~8s; longer ~8–12s scaled by length.
 * @param {string} text
 * @returns {number}
 */
export function pauseMsForText(text) {
  const len = String(text || "").length;
  if (len <= 0) return SHORT_PAUSE_MS;
  if (len <= SHORT_TEXT_CHARS) return SHORT_PAUSE_MS;
  if (len <= LONG_TEXT_CHARS) return MID_PAUSE_MS;
  const t =
    LONG_PAUSE_MIN_MS +
    Math.round(((len - LONG_TEXT_CHARS) / 180) * (LONG_PAUSE_MAX_MS - LONG_PAUSE_MIN_MS));
  return Math.min(LONG_PAUSE_MAX_MS, Math.max(LONG_PAUSE_MIN_MS, t));
}

/**
 * Split multi-paragraph copy into bubble strings (cap count).
 * @param {string} text
 * @param {number} [maxBubbles]
 * @returns {string[]}
 */
export function splitParagraphs(text, maxBubbles = DEFAULT_MAX_BUBBLES) {
  const raw = String(text || "").trim();
  if (!raw) return [];
  const paras = raw
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean);
  if (!paras.length) return [raw];

  const chunks = [...paras];
  while (chunks.length > maxBubbles) {
    const last = chunks.pop();
    chunks[chunks.length - 1] = `${chunks[chunks.length - 1]}\n\n${last}`;
  }
  return chunks.map((t) => t.slice(0, 4800));
}

/**
 * Expand text messages that contain blank-line paragraphs into separate bubbles.
 * Keeps quickReply / non-text messages intact.
 * @param {object[]} messages
 * @param {number} [maxBubbles]
 * @returns {object[]}
 */
export function expandTextSegments(messages, maxBubbles = DEFAULT_MAX_BUBBLES) {
  if (!Array.isArray(messages) || !messages.length) return [];
  /** @type {object[]} */
  const out = [];
  let textBudget = maxBubbles;

  for (const msg of messages) {
    if (
      msg?.type === "text" &&
      typeof msg.text === "string" &&
      !msg.quickReply &&
      /\n\n/.test(msg.text)
    ) {
      const paras = splitParagraphs(msg.text, Math.max(1, textBudget));
      for (const p of paras) {
        out.push({ type: "text", text: p });
        textBudget = Math.max(0, textBudget - 1);
      }
    } else {
      out.push(msg);
      if (msg?.type === "text") textBudget = Math.max(0, textBudget - 1);
    }
  }
  return out;
}

/**
 * Merge excess plain-text bubbles into the last kept text (preserve Flex / quickReply).
 * @param {object[]} messages
 * @param {number} maxBubbles
 * @returns {object[]}
 */
function capTextBubbles(messages, maxBubbles) {
  const textIndices = [];
  for (let i = 0; i < messages.length; i++) {
    const m = messages[i];
    if (m?.type === "text" && !m.quickReply) textIndices.push(i);
  }
  if (textIndices.length <= maxBubbles) return messages;

  const keep = new Set(textIndices.slice(0, maxBubbles));
  const lastKeep = textIndices[maxBubbles - 1];
  const overflow = textIndices
    .slice(maxBubbles)
    .map((i) => messages[i].text)
    .join("\n\n");

  return messages
    .map((m, i) => {
      if (i !== lastKeep) return m;
      return {
        ...m,
        text: `${m.text}\n\n${overflow}`.slice(0, 4800),
      };
    })
    .filter((m, i) => {
      if (m?.type === "text" && !m.quickReply) return keep.has(i);
      return true;
    });
}

/**
 * @param {object|object[]} unit
 * @returns {string}
 */
function unitText(unit) {
  const list = Array.isArray(unit) ? unit : [unit];
  return list
    .filter((m) => m?.type === "text")
    .map((m) => String(m.text || ""))
    .join("\n\n");
}

/**
 * Batch short text lead + following non-text (Flex / image) into one API call
 * so topic button menus are not over-delayed.
 * Only when there is a single plain-text bubble (menu pattern). Multi-paragraph
 * readings (e.g. tarot) keep text and Flex as separate paced units.
 * @param {object[]} messages
 * @returns {Array<object|object[]>}
 */
export function coalesceMenuPairs(messages) {
  const plainTextCount = messages.filter(
    (m) => m?.type === "text" && !m.quickReply
  ).length;
  if (plainTextCount > 1) {
    return messages.map((m) => m);
  }

  /** @type {Array<object|object[]>} */
  const units = [];
  for (let i = 0; i < messages.length; i++) {
    const cur = messages[i];
    const next = messages[i + 1];
    if (
      cur?.type === "text" &&
      next &&
      next.type !== "text" &&
      String(cur.text || "").length <= MENU_LEAD_MAX_CHARS
    ) {
      units.push([cur, next]);
      i += 1;
      continue;
    }
    units.push(cur);
  }
  return units;
}

/**
 * Send segments with human pacing.
 *
 * @param {{
 *   reply: (replyToken: string, messages: object[]) => Promise<unknown>,
 *   push: (userId: string, messages: object[]) => Promise<unknown>,
 * }} client
 * @param {{ replyToken?: string, userId?: string } | string} target
 *        string = userId only (all push); object may include replyToken for first bubble
 * @param {object[]} segments LINE message objects
 * @param {{
 *   maxBubbles?: number,
 *   maxTotalPauseMs?: number,
 *   expandParagraphs?: boolean,
 *   coalesceMenus?: boolean,
 * }} [opts]
 */
export async function replyHumanLike(client, target, segments, opts = {}) {
  if (!client?.reply || !client?.push) {
    throw new Error("replyHumanLike requires client.reply and client.push");
  }
  if (!Array.isArray(segments) || segments.length === 0) return;

  const replyToken =
    typeof target === "string" ? undefined : target?.replyToken || undefined;
  const userId =
    typeof target === "string" ? target : target?.userId || undefined;

  const maxBubbles = opts.maxBubbles ?? DEFAULT_MAX_BUBBLES;
  const maxTotalPauseMs = opts.maxTotalPauseMs ?? DEFAULT_MAX_TOTAL_PAUSE_MS;
  const expand = opts.expandParagraphs !== false;
  const coalesce = opts.coalesceMenus !== false;

  let messages = expand ? expandTextSegments(segments, maxBubbles) : [...segments];
  messages = capTextBubbles(messages, maxBubbles);

  const units = coalesce ? coalesceMenuPairs(messages) : messages.map((m) => m);

  // No userId → cannot push; send as many as possible in one reply (LINE max 5).
  if (!userId && replyToken) {
    const flat = units.flatMap((u) => (Array.isArray(u) ? u : [u])).slice(0, 5);
    if (flat.length) await client.reply(replyToken, flat);
    return;
  }

  let usedReply = false;
  let pauseSpent = 0;

  for (let i = 0; i < units.length; i++) {
    if (i > 0) {
      const prevText = unitText(units[i - 1]);
      let wait = pauseMsForText(prevText);
      const remaining = Math.max(0, maxTotalPauseMs - pauseSpent);
      wait = Math.min(wait, remaining);
      if (wait > 0) {
        await sleep(wait);
        pauseSpent += wait;
      }
    }

    const batch = Array.isArray(units[i]) ? units[i] : [units[i]];
    if (!batch.length) continue;

    if (!usedReply && replyToken) {
      await client.reply(replyToken, batch);
      usedReply = true;
    } else if (userId) {
      await client.push(userId, batch);
    } else {
      throw new Error("replyHumanLike: no replyToken/userId for remaining segments");
    }
  }
}
