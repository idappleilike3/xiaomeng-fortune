/**
 * LIFF / LINE deep-link route map for Erosée × xiaomeng-fortune.
 * Single source for server redirects and docs. Client mirrors in js/liff-entry.js.
 */

export const LIFF_ENTRY_PATH = "/erosee-cosmic-home.html";
export const LIFF_PRICING_PATH = "/erosee-l2-pricing.html";
export const DEFAULT_PUBLIC_BASE_URL = "https://xiaomeng-fortune.onrender.com";

/** @type {Record<string, { path: string, hash?: string }>} */
export const LIFF_ROUTE_MAP = {
  "/": { path: LIFF_ENTRY_PATH },
  "/home": { path: LIFF_ENTRY_PATH },
  "/welcome": { path: LIFF_ENTRY_PATH },
  "/decode": { path: LIFF_ENTRY_PATH },
  "/pricing": { path: LIFF_PRICING_PATH },
  "/plans": { path: LIFF_PRICING_PATH },
  "/shop": { path: LIFF_PRICING_PATH },
  "/all-plans": { path: LIFF_PRICING_PATH },
  "/pricing/emotion": { path: LIFF_PRICING_PATH, hash: "emotion" },
  "/pricing/pet": { path: LIFF_PRICING_PATH, hash: "pet" },
  "/pricing/career": { path: LIFF_PRICING_PATH, hash: "career" },
  "/pricing/wealth": { path: LIFF_PRICING_PATH, hash: "wealth" },
  "/pricing/temple": { path: LIFF_PRICING_PATH, hash: "temple" },
  "/pricing/vip": { path: LIFF_PRICING_PATH, hash: "vip" },
  "/pricing/heal": { path: LIFF_PRICING_PATH, hash: "heal" },
  "/pricing/subscribe": { path: LIFF_PRICING_PATH, hash: "subscribe" },
  "/divination": { path: LIFF_ENTRY_PATH },
  "/temple/pet": { path: LIFF_PRICING_PATH, hash: "pet" },
  "/member": { path: LIFF_ENTRY_PATH },
  "/points": { path: LIFF_PRICING_PATH, hash: "subscribe" },
  "/records": { path: LIFF_ENTRY_PATH },
  "/promotions": { path: LIFF_PRICING_PATH },
  "/invite": { path: LIFF_ENTRY_PATH },
  "/checkin": { path: LIFF_ENTRY_PATH },
};

/**
 * Normalize route query values like `/pricing`, `pricing`, `%2Fpricing`.
 * @param {string} raw
 */
export function normalizeLiffRoute(raw = "") {
  let route = String(raw || "").trim();
  try {
    route = decodeURIComponent(route);
  } catch {
    /* keep raw */
  }
  if (!route) return "/";
  if (!route.startsWith("/")) route = `/${route}`;
  // strip trailing slash except root
  if (route.length > 1 && route.endsWith("/")) route = route.slice(0, -1);
  return route;
}

/**
 * @param {string} rawRoute
 * @returns {{ path: string, hash: string } | null}
 */
export function resolveLiffRoute(rawRoute) {
  const route = normalizeLiffRoute(rawRoute);
  const hit = LIFF_ROUTE_MAP[route];
  if (hit) {
    return { path: hit.path, hash: hit.hash || "" };
  }
  // /pricing/<section> fallback
  const pricingMatch = route.match(/^\/pricing\/([a-z0-9-]+)$/i);
  if (pricingMatch) {
    return { path: LIFF_PRICING_PATH, hash: pricingMatch[1].toLowerCase() };
  }
  return null;
}

/**
 * Build absolute site URL for a route (for Flex / docs), not the liff.line.me wrapper.
 * @param {string} publicBaseUrl
 * @param {string} rawRoute
 * @param {Record<string, string>} [extraParams]
 */
export function siteUrlForRoute(publicBaseUrl, rawRoute, extraParams = {}) {
  const base = String(publicBaseUrl || DEFAULT_PUBLIC_BASE_URL).replace(/\/$/, "");
  const resolved = resolveLiffRoute(rawRoute) || { path: LIFF_ENTRY_PATH, hash: "" };
  const url = new URL(resolved.path, `${base}/`);
  Object.entries(extraParams).forEach(([key, value]) => {
    if (value != null && value !== "") url.searchParams.set(key, String(value));
  });
  if (resolved.hash) url.hash = resolved.hash;
  return url.toString();
}
