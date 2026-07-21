/**
 * 小夢神殿 LIFF Bridge（Phase 1 最小整合）
 * - 從 /api/liff/config 取得公開 LIFF 設定（不含 secret）
 * - LINE 內：init → profile → /api/liff/init 綁定 session
 * - 桌機瀏覽器：顯示「使用 LINE 登入」占位，不強制 liff.login() 迴圈
 */

const STORAGE_KEYS = {
  session: "xiaomengSessionToken",
  profile: "xiaomengLineProfile",
};

function setStatus(message) {
  const badge = document.querySelector("#liffStatus");
  if (badge) badge.textContent = message;
}

function ensureDesktopLoginPlaceholder() {
  let btn = document.querySelector("#lineLoginPlaceholder");
  if (btn) return btn;

  btn = document.createElement("button");
  btn.id = "lineLoginPlaceholder";
  btn.type = "button";
  btn.className = "line-login-placeholder";
  btn.hidden = true;
  btn.textContent = "使用 LINE 登入";
  btn.setAttribute("aria-label", "使用 LINE 登入");

  const anchor = document.querySelector("#liffStatus");
  if (anchor?.parentElement) {
    anchor.parentElement.appendChild(btn);
  } else {
    document.body.appendChild(btn);
  }

  btn.addEventListener("click", () => {
    login();
  });

  return btn;
}

async function fetchConfig() {
  const response = await fetch("/api/liff/config", { credentials: "same-origin" });
  if (!response.ok) throw new Error("LIFF_CONFIG_UNAVAILABLE");
  const payload = await response.json();
  if (!payload?.ok || !payload.config?.liffId) throw new Error("LIFF_ID_MISSING");
  return payload.config;
}

async function bindServerSession(tokens, profile) {
  const response = await fetch("/api/liff/init", {
    method: "POST",
    headers: { "content-type": "application/json" },
    credentials: "same-origin",
    body: JSON.stringify({
      accessToken: tokens.accessToken || "",
      idToken: tokens.idToken || "",
      lineId: profile?.userId || "",
      displayName: profile?.displayName || "",
      pictureUrl: profile?.pictureUrl || "",
    }),
  });

  const payload = await response.json();
  if (!response.ok || !payload.ok) {
    throw new Error(payload.error || "LIFF_INIT_FAILED");
  }
  return payload;
}

function persistSession(payload, profile) {
  if (payload.sessionToken) {
    sessionStorage.setItem(STORAGE_KEYS.session, payload.sessionToken);
    localStorage.setItem(STORAGE_KEYS.session, payload.sessionToken);
  }

  const profileData = {
    userId: payload.lineId || profile?.userId || "",
    displayName: payload.displayName || profile?.displayName || "",
    pictureUrl: payload.pictureUrl || profile?.pictureUrl || "",
    stub: Boolean(payload.stub),
    verification: payload.verification || "unknown",
  };

  sessionStorage.setItem(STORAGE_KEYS.profile, JSON.stringify(profileData));
  localStorage.setItem("lineProfile", JSON.stringify(profileData));
  if (profileData.userId) {
    localStorage.setItem("memberId", profileData.userId);
  }

  window.__liffBridge = {
    ready: true,
    inClient: Boolean(window.liff?.isInClient?.()),
    profile: profileData,
    sessionToken: payload.sessionToken || null,
    stub: Boolean(payload.stub),
  };

  document.documentElement.dataset.liffBridge = payload.stub ? "stub" : "ready";
  window.dispatchEvent(new CustomEvent("liff-bridge:ready", { detail: window.__liffBridge }));
}

function clearLocalSession() {
  sessionStorage.removeItem(STORAGE_KEYS.session);
  localStorage.removeItem(STORAGE_KEYS.session);
  sessionStorage.removeItem(STORAGE_KEYS.profile);
  localStorage.removeItem("lineProfile");
  localStorage.removeItem("memberId");
  delete window.__liffBridge;
  delete document.documentElement.dataset.liffBridge;
  window.__liffBridgeInitialized = false;
}

async function ensureConfig() {
  if (window.__liffBridgeConfig) return window.__liffBridgeConfig;
  const config = await fetchConfig();
  window.__liffBridgeConfig = config;
  return config;
}

function openLineOaLink(config) {
  const oaUrl = config?.lineOaUrl;
  if (oaUrl) {
    window.open(oaUrl, "_blank", "noopener,noreferrer");
    setStatus("請在 LINE 內開啟小夢神殿，或先加入官方帳號好友");
    return true;
  }
  setStatus("LINE 官方帳號連結尚未設定");
  return false;
}

export async function initLIFF() {
  return initLiffBridge();
}

export async function getProfile() {
  if (!window.liff?.isLoggedIn?.()) return null;
  return window.liff.getProfile();
}

export async function login(options = {}) {
  const config = await ensureConfig().catch(() => window.__liffBridgeConfig || null);

  if (window.liff?.isInClient?.()) {
    if (window.liff.isLoggedIn()) return true;
    const loginOptions = options.redirectUri ? { redirectUri: options.redirectUri } : undefined;
    window.liff.login(loginOptions);
    return true;
  }

  // 手機一般瀏覽器（非 LINE App）無法完成 LIFF 登入
  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent || "");
  if (isMobile && config?.liffUrl) {
    setStatus("請用 LINE App 開啟 LIFF 連結登入");
    window.location.href = config.liffUrl;
    return false;
  }
  if (isMobile && !config?.liffId) {
    setStatus("尚未設定 LIFF_ID，無法 LINE 登入");
    return false;
  }

  return openLineOaLink(config);
}

export async function logout() {
  clearLocalSession();
  if (typeof window.liff?.logout === "function") {
    window.liff.logout();
  }
  setStatus("已登出 LINE 連結");
}

export async function initLiffBridge() {
  if (window.__liffBridgeInitialized) return window.__liffBridge || null;
  window.__liffBridgeInitialized = true;

  const desktopBtn = ensureDesktopLoginPlaceholder();

  try {
    const config = await fetchConfig();
    window.__liffBridgeConfig = config;

    if (!window.liff) {
      desktopBtn.hidden = false;
      setStatus("一般瀏覽器預覽");
      return null;
    }

    await window.liff.init({ liffId: config.liffId });
    document.documentElement.dataset.liffReady = "true";

    const inClient = window.liff.isInClient();
    if (!inClient) {
      desktopBtn.hidden = false;
      const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent || "");
      if (isMobile) {
        setStatus(config.liffUrl ? "請從 LINE 內開啟神殿" : "需設定 LIFF_ID 才能登入");
      } else {
        setStatus("LIFF 網頁模式");
      }
      return null;
    }

    setStatus("LINE 內頁已連線");

    if (!window.liff.isLoggedIn()) {
      setStatus("等待 LINE 授權");
      return null;
    }

    const profile = await window.liff.getProfile();
    const tokens = {
      accessToken: window.liff.getAccessToken?.() || "",
      idToken: window.liff.getIDToken?.() || "",
    };

    const payload = await bindServerSession(tokens, profile);
    persistSession(payload, profile);
    setStatus(`已連結：${payload.displayName || profile.displayName || "神殿會員"}`);
    return window.__liffBridge;
  } catch (error) {
    console.warn("[liff-bridge]", error);
    desktopBtn.hidden = false;
    setStatus("LIFF 等待 LINE 環境");
    return null;
  }
}

const LiffBridge = {
  initLIFF,
  initLiffBridge,
  getProfile,
  login,
  logout,
};

window.LiffBridge = LiffBridge;

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    initLiffBridge();
  });
} else {
  initLiffBridge();
}
