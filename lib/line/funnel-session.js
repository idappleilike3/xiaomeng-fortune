/**
 * In-memory funnel session store (MVP).
 * TODO: persist to DB / emotion-bridge Relationship Case when available.
 */

/** @typedef {'welcome'|'topic'|'problem'|'describe'|'free_offer'|'cards'|'need'|'recommend'|'start'|'checkout'} FunnelStage */

/**
 * @typedef {object} FunnelSession
 * @property {string} userId
 * @property {FunnelStage} stage
 * @property {string|null} topicId
 * @property {string|null} problemId
 * @property {string|null} description
 * @property {string} describeBuffer
 * @property {number} describeHelpCount
 * @property {string|null} lastDescribeNudgeKey
 * @property {string|null} needId
 * @property {string|null} productId
 * @property {Array<{name:string,meaning:string,position:string,label:string}>} cards
 * @property {number} cardIndex
 * @property {boolean} freeDrawDone True after free 3-card reveal finished (blocks silent redraw)
 * @property {string|null} difyConversationId Dify chat continuity (chat-messages conversation_id)
 * @property {number} updatedAt
 */

const sessions = new Map();
const TTL_MS = 24 * 60 * 60 * 1000;

function prune() {
  const now = Date.now();
  for (const [id, session] of sessions) {
    if (now - session.updatedAt > TTL_MS) sessions.delete(id);
  }
}

/**
 * @param {string} userId
 * @returns {FunnelSession}
 */
export function getOrCreateSession(userId) {
  prune();
  const key = userId || "anonymous";
  let session = sessions.get(key);
  if (!session) {
    session = createFreshSession(key);
    sessions.set(key, session);
  }
  return session;
}

/**
 * @param {string} userId
 * @returns {FunnelSession}
 */
export function resetSession(userId) {
  const key = userId || "anonymous";
  const session = createFreshSession(key);
  sessions.set(key, session);
  return session;
}

/**
 * @param {FunnelSession} session
 * @param {Partial<FunnelSession>} patch
 */
export function updateSession(session, patch) {
  Object.assign(session, patch, { updatedAt: Date.now() });
  sessions.set(session.userId, session);
  return session;
}

function createFreshSession(userId) {
  return {
    userId,
    stage: "welcome",
    topicId: null,
    problemId: null,
    description: null,
    describeBuffer: "",
    describeHelpCount: 0,
    lastDescribeNudgeKey: null,
    needId: null,
    productId: null,
    cards: [],
    cardIndex: 0,
    freeDrawDone: false,
    difyConversationId: null,
    updatedAt: Date.now(),
  };
}

/** Test helper */
export function _clearSessionsForTests() {
  sessions.clear();
}
