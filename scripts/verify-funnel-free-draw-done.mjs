/**
 * Regression: after free 3-card draw, start/topic/free_yes must not reshuffle.
 * Run: node scripts/verify-funnel-free-draw-done.mjs
 */
import {
  handleFunnelEvent,
  createFunnelContext,
} from "../lib/line/funnel-handlers.js";
import {
  getOrCreateSession,
  updateSession,
  _clearSessionsForTests,
} from "../lib/line/funnel-session.js";

const ctx = createFunnelContext({
  publicBaseUrl: "https://example.com",
  eroseeLink: (route = "/pricing") => `https://example.com${route}`,
  tarotDeck: [],
});

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

function hasText(messages, needle) {
  return (messages || []).some((m) => m.type === "text" && String(m.text || "").includes(needle));
}

function postback(userId, data) {
  return handleFunnelEvent(
    { type: "postback", source: { userId }, postback: { data } },
    ctx
  );
}

function text(userId, body) {
  return handleFunnelEvent(
    { type: "message", source: { userId }, message: { type: "text", text: body } },
    ctx
  );
}

_clearSessionsForTests();
const userId = "verify-free-draw-done";

// Seed a completed free-draw session (need stage)
{
  const s = getOrCreateSession(userId);
  updateSession(s, {
    stage: "need",
    topicId: "love",
    problemId: "ex",
    description: "我們最近常常冷战 我很想知道他還在不在意我這件事",
    describeBuffer: "我們最近常常冷战 我很想知道他還在不在意我這件事",
    cards: [
      { name: "愚者", meaning: "a", spoken: "a", spokenCliff: "a", imageUrl: "", position: "now", label: "現況" },
      { name: "魔術師", meaning: "b", spoken: "b", spokenCliff: "b", imageUrl: "", position: "key", label: "關鍵" },
      { name: "女祭司", meaning: "c", spoken: "c", spokenCliff: "c", imageUrl: "", position: "path", label: "走向" },
    ],
    cardIndex: 2,
    freeDrawDone: true,
  });
}

const afterStart = await postback(userId, "funnel=start");
assert(hasText(afterStart, "已經抽過"), "start after freeDrawDone should resume, not topic reset");
assert(!hasText(afterStart, "最想從哪個方向"), "start must not restart topic select");
{
  const s = getOrCreateSession(userId);
  assert(s.freeDrawDone === true, "start must keep freeDrawDone");
  assert(Array.isArray(s.cards) && s.cards.length === 3, "start must not clear cards");
}

const afterFreeYes = await postback(userId, "funnel=free_yes");
assert(hasText(afterFreeYes, "不會再幫你重抽") || hasText(afterFreeYes, "已經抽"), "free_yes must refuse redraw");
{
  const s = getOrCreateSession(userId);
  assert(s.cards[0].name === "愚者", "free_yes must not reshuffle cards");
}

const afterTopic = await postback(userId, "funnel=topic&id=love");
assert(hasText(afterTopic, "已經抽過"), "topic rich-menu shortcut must not wipe completed draw");
{
  const s = getOrCreateSession(userId);
  assert(s.freeDrawDone === true, "topic must keep freeDrawDone");
}

const afterRestart = await text(userId, "重新開始");
assert(hasText(afterRestart, "最想從哪個方向"), "explicit 重新開始 should begin topic flow");
{
  const s = getOrCreateSession(userId);
  assert(s.freeDrawDone === false, "restart clears freeDrawDone");
  assert(s.stage === "topic", "restart sets topic stage");
  assert(!s.cards.length, "restart clears cards");
}

// next_card from= guard still advances once then refuses stale
_clearSessionsForTests();
{
  const s = getOrCreateSession("verify-next-card");
  updateSession(s, {
    stage: "cards",
    freeDrawDone: false,
    description: "足夠長的描述文字用來通過門檻測試一二三四五六七八九十",
    cards: [
      { name: "A", meaning: "a", spoken: "a1", spokenCliff: "a1", imageUrl: "", position: "now", label: "現況" },
      { name: "B", meaning: "b", spoken: "b1", spokenCliff: "b1", imageUrl: "", position: "key", label: "關鍵" },
      { name: "C", meaning: "c", spoken: "c1", spokenCliff: "c1", imageUrl: "", position: "path", label: "走向" },
    ],
    cardIndex: 0,
  });
}
const next1 = await postback("verify-next-card", "funnel=next_card&from=0");
assert(hasText(next1, "關鍵") || hasText(next1, "B") || hasText(next1, "接著"), "next_card from=0 advances");
const stale = await postback("verify-next-card", "funnel=next_card&from=0");
assert(Array.isArray(stale) && stale.length === 0, "stale next_card from=0 returns empty");
{
  const s = getOrCreateSession("verify-next-card");
  assert(s.cardIndex === 1, "stale click must not double-advance");
}

// Finish cards → freeDrawDone
await postback("verify-next-card", "funnel=next_card&from=1");
const afterLast = await postback("verify-next-card", "funnel=next_card&from=2");
assert(hasText(afterLast, "最想要的是哪一種幫忙") || hasText(afterLast, "牽動全局"), "after last card → need");
{
  const s = getOrCreateSession("verify-next-card");
  assert(s.freeDrawDone === true, "after_cards sets freeDrawDone");
  assert(s.stage === "need", "after_cards stage need");
}

console.log("OK verify-funnel-free-draw-done");
