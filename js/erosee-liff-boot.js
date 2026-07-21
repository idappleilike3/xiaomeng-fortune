/**
 * Boot LIFF + LINE OA links on Erosée marketing pages.
 * - Applies ?route= redirects (via liff-entry.js)
 * - Inits liff-bridge when LINE SDK is present
 * - Fills [data-line-oa] / .btn-line / topbar CTA from /api/liff/config
 */

import "./liff-entry.js";
import { initLiffBridge } from "./liff-bridge.js";

const PLACEHOLDER_OA = "https://line.me/R/ti/p/@YOUR_LINE_OA_ID";

async function loadPublicConfig() {
  try {
    const response = await fetch("/api/liff/config", { credentials: "same-origin" });
    if (!response.ok) return null;
    const payload = await response.json();
    return payload?.ok ? payload.config : null;
  } catch {
    return null;
  }
}

function applyLineOaLinks(lineOaUrl) {
  const href = lineOaUrl || PLACEHOLDER_OA;
  document.querySelectorAll("[data-line-oa], a.btn-line, a.topbar__cta").forEach((el) => {
    if (!(el instanceof HTMLAnchorElement)) return;
    const current = el.getAttribute("href") || "";
    if (
      !current ||
      current === "#" ||
      current.includes("line.me") ||
      current.includes("@YOUR_LINE_OA_ID") ||
      el.hasAttribute("data-line-oa")
    ) {
      el.setAttribute("href", href);
      el.setAttribute("rel", "noopener");
      if (!el.target) el.target = "_blank";
    }
  });
}

function ensureStatusBadge() {
  if (document.querySelector("#liffStatus")) return;
  const badge = document.createElement("span");
  badge.id = "liffStatus";
  badge.className = "liff-status";
  badge.hidden = true;
  badge.setAttribute("aria-live", "polite");
  document.body.appendChild(badge);
}

async function boot() {
  ensureStatusBadge();
  const config = await loadPublicConfig();
  if (config) {
    window.__liffBridgeConfig = config;
    applyLineOaLinks(config.lineOaUrl);
    document.documentElement.dataset.eroseePublicBase = config.publicBaseUrl || "";
  } else {
    applyLineOaLinks(PLACEHOLDER_OA);
  }

  if (window.liff) {
    await initLiffBridge();
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    boot();
  });
} else {
  boot();
}
