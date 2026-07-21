import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import {
  DEFAULT_PUBLIC_BASE_URL,
  LIFF_ENTRY_PATH,
  LIFF_PRICING_PATH,
} from "./liff-routes.js";

const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000;

export function extractLiffId(liffUrl = "") {
  const match = String(liffUrl).match(/liff\.line\.me\/([^/?#]+)/i);
  return match ? match[1] : "";
}

export function getLiffPublicConfig(env = process.env) {
  const liffUrl = (env.LIFF_URL || "").replace(/\/$/, "");
  const liffId = env.LIFF_ID || extractLiffId(liffUrl);
  const channelId = env.LINE_CHANNEL_ID || "";
  const publicBaseUrl =
    (env.PUBLIC_BASE_URL || "").replace(/\/$/, "") || DEFAULT_PUBLIC_BASE_URL;

  return {
    liffId,
    liffUrl: liffId ? `https://liff.line.me/${liffId}` : liffUrl,
    channelId: channelId || null,
    lineOaUrl: env.LINE_OA_URL || "https://line.me/R/ti/p/@YOUR_LINE_OA_ID",
    publicBaseUrl,
    entryPath: LIFF_ENTRY_PATH,
    pricingPath: LIFF_PRICING_PATH,
    entryUrl: `${publicBaseUrl}${LIFF_ENTRY_PATH}`,
    pricingUrl: `${publicBaseUrl}${LIFF_PRICING_PATH}`,
    /** LIFF Endpoint URL to paste in LINE Developers Console */
    liffEndpointUrl: `${publicBaseUrl}${LIFF_ENTRY_PATH}`,
    features: {
      shareTargetPicker: true,
      templeEntry: true,
      eroseeHome: true,
      eroseePricing: true,
    },
  };
}

function sessionSecret(env) {
  return env.LINE_CHANNEL_SECRET || env.SESSION_SECRET || "dev-liff-session-stub-todo-set-env";
}

export function createSessionToken(env = process.env) {
  const payload = {
    sid: randomBytes(16).toString("hex"),
    iat: Date.now(),
    exp: Date.now() + SESSION_TTL_MS,
  };
  const data = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const sig = createHmac("sha256", sessionSecret(env)).update(data).digest("base64url");
  return { token: `${data}.${sig}`, payload };
}

export function verifySessionToken(token, env = process.env) {
  if (!token || typeof token !== "string" || !token.includes(".")) return null;
  const [data, sig] = token.split(".");
  if (!data || !sig) return null;

  const expected = createHmac("sha256", sessionSecret(env)).update(data).digest("base64url");
  const a = Buffer.from(expected);
  const b = Buffer.from(sig);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;

  try {
    const payload = JSON.parse(Buffer.from(data, "base64url").toString("utf8"));
    if (!payload?.exp || Date.now() > payload.exp) return null;
    return payload;
  } catch {
    return null;
  }
}

export async function verifyLineAccessToken(accessToken) {
  const result = await fetch("https://api.line.me/v2/profile", {
    headers: { authorization: `Bearer ${accessToken}` },
  });
  if (!result.ok) {
    const body = await result.text();
    const error = new Error("INVALID_ACCESS_TOKEN");
    error.statusCode = 401;
    error.detail = body;
    throw error;
  }
  return result.json();
}

export async function verifyLineIdToken(idToken, channelId) {
  if (!channelId) {
    const error = new Error("LINE_CHANNEL_ID_NOT_CONFIGURED");
    error.statusCode = 503;
    throw error;
  }

  const body = new URLSearchParams({
    id_token: idToken,
    client_id: channelId,
  });

  const result = await fetch("https://api.line.me/oauth2/v2.1/verify", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body,
  });

  if (!result.ok) {
    const detail = await result.text();
    const error = new Error("INVALID_ID_TOKEN");
    error.statusCode = 401;
    error.detail = detail;
    throw error;
  }

  return result.json();
}

export function bindLineUser(appData, profile, verificationMode = "verified") {
  if (!appData.users) appData.users = [];
  if (!appData.sessions) appData.sessions = [];

  const lineId = profile.userId || profile.sub;
  let user = appData.users.find((item) => item.lineUserId === lineId);
  if (!user) {
    user = {
      lineUserId: lineId,
      displayName: profile.displayName || profile.name || "神殿訪客",
      pictureUrl: profile.pictureUrl || null,
      bindAt: new Date().toISOString(),
      points: 50,
      tier: "一般會員",
      firstFree: { pet: null },
      shareInvites: [],
    };
    appData.users.push(user);
  } else {
    user.displayName = profile.displayName || profile.name || user.displayName;
    user.pictureUrl = profile.pictureUrl || user.pictureUrl;
    user.lastSeenAt = new Date().toISOString();
  }

  const { token, payload } = createSessionToken();
  const session = {
    sessionId: payload.sid,
    lineId,
    memberId: lineId,
    displayName: user.displayName,
    pictureUrl: user.pictureUrl,
    verificationMode,
    createdAt: new Date().toISOString(),
    expiresAt: new Date(payload.exp).toISOString(),
  };
  appData.sessions = appData.sessions.filter((item) => item.lineId !== lineId);
  appData.sessions.unshift(session);

  return {
    sessionToken: token,
    lineId,
    displayName: user.displayName,
    pictureUrl: user.pictureUrl,
    member: user,
    session,
  };
}

export async function handleLiffInit(requestBody, appData, env = process.env) {
  const accessToken = requestBody.accessToken || requestBody.access_token || "";
  const idToken = requestBody.idToken || requestBody.id_token || "";
  const channelSecret = env.LINE_CHANNEL_SECRET || "";
  const channelId = env.LINE_CHANNEL_ID || "";
  const allowStub = env.ALLOW_LIFF_STUB === "1" || env.ALLOW_LIFF_STUB === "true";

  if (!accessToken && !idToken) {
    if (allowStub || !channelSecret) {
      return {
        ok: true,
        stub: true,
        todo: "設定 LINE_CHANNEL_SECRET 與 LINE_CHANNEL_ID 後移除 ALLOW_LIFF_STUB 以啟用正式驗證",
        lineId: requestBody.lineId || "stub-line-user",
        displayName: requestBody.displayName || "神殿訪客（開發模式）",
        pictureUrl: requestBody.pictureUrl || null,
        sessionToken: createSessionToken(env).token,
        verification: "stub",
      };
    }

    const error = new Error("MISSING_LIFF_TOKEN");
    error.statusCode = 400;
    throw error;
  }

  if (!channelSecret && allowStub) {
    return {
      ok: true,
      stub: true,
      todo: "設定 LINE_CHANNEL_SECRET 與 LINE_CHANNEL_ID 後移除 ALLOW_LIFF_STUB 以啟用正式驗證",
      lineId: requestBody.lineId || "stub-line-user",
      displayName: requestBody.displayName || "神殿訪客（開發模式）",
      pictureUrl: requestBody.pictureUrl || null,
      sessionToken: createSessionToken(env).token,
      verification: "stub",
    };
  }

  let profile = null;
  let verification = "access_token";

  if (accessToken) {
    profile = await verifyLineAccessToken(accessToken);
  } else if (idToken) {
    const claims = await verifyLineIdToken(idToken, channelId);
    profile = {
      userId: claims.sub,
      displayName: claims.name,
      pictureUrl: claims.picture,
    };
    verification = "id_token";
  }

  const bound = bindLineUser(appData, profile, verification);
  return {
    ok: true,
    stub: false,
    verification,
    ...bound,
  };
}
