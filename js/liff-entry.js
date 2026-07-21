/**
 * LIFF entry router for Erosée pages.
 * When LINE opens Endpoint URL with ?route=..., redirect to the mapped HTML page.
 * Keep query params (ref, entry, liff state) except `route`.
 */

const ENTRY_PATH = "/erosee-cosmic-home.html";
const PRICING_PATH = "/erosee-l2-pricing.html";

const ROUTE_MAP = {
  "/": ENTRY_PATH,
  "/home": ENTRY_PATH,
  "/welcome": ENTRY_PATH,
  "/decode": ENTRY_PATH,
  "/pricing": PRICING_PATH,
  "/plans": PRICING_PATH,
  "/shop": PRICING_PATH,
  "/all-plans": PRICING_PATH,
  "/pricing/emotion": `${PRICING_PATH}#emotion`,
  "/pricing/pet": `${PRICING_PATH}#pet`,
  "/pricing/career": `${PRICING_PATH}#career`,
  "/pricing/wealth": `${PRICING_PATH}#wealth`,
  "/pricing/temple": `${PRICING_PATH}#temple`,
  "/pricing/vip": `${PRICING_PATH}#vip`,
  "/pricing/heal": `${PRICING_PATH}#heal`,
  "/pricing/subscribe": `${PRICING_PATH}#subscribe`,
  "/divination": ENTRY_PATH,
  "/temple/pet": `${PRICING_PATH}#pet`,
  "/member": ENTRY_PATH,
  "/points": `${PRICING_PATH}#subscribe`,
  "/records": ENTRY_PATH,
  "/promotions": PRICING_PATH,
  "/invite": ENTRY_PATH,
  "/checkin": ENTRY_PATH,
};

function normalizeRoute(raw) {
  let route = String(raw || "").trim();
  try {
    route = decodeURIComponent(route);
  } catch {
    /* keep */
  }
  if (!route) return "";
  if (!route.startsWith("/")) route = `/${route}`;
  if (route.length > 1 && route.endsWith("/")) route = route.slice(0, -1);
  return route;
}

function currentPageKey() {
  const path = location.pathname || "";
  if (path.endsWith("erosee-l2-pricing.html")) return "pricing";
  if (path.endsWith("erosee-cosmic-home.html")) return "home";
  if (path === "/" || path.endsWith("index.html")) return "index";
  return "other";
}

function targetForRoute(route) {
  if (ROUTE_MAP[route]) return ROUTE_MAP[route];
  const pricingMatch = route.match(/^\/pricing\/([a-z0-9-]+)$/i);
  if (pricingMatch) return `${PRICING_PATH}#${pricingMatch[1].toLowerCase()}`;
  return null;
}

function alreadyOnTarget(target) {
  const [pathPart, hashPart] = target.split("#");
  const page = currentPageKey();
  const onHome = page === "home" && pathPart.endsWith("erosee-cosmic-home.html");
  const onPricing = page === "pricing" && pathPart.endsWith("erosee-l2-pricing.html");
  if (!onHome && !onPricing) return false;
  if (hashPart) {
    return location.hash.replace(/^#/, "") === hashPart;
  }
  return true;
}

function applyRouteRedirect() {
  const params = new URLSearchParams(location.search);
  const rawRoute = params.get("route");
  if (!rawRoute) return;

  const route = normalizeRoute(rawRoute);
  const target = targetForRoute(route);
  if (!target) return;
  if (alreadyOnTarget(target)) {
    // Drop route param once resolved to avoid loops on refresh
    params.delete("route");
    const next = `${location.pathname}${params.toString() ? `?${params}` : ""}${location.hash || (target.includes("#") ? `#${target.split("#")[1]}` : "")}`;
    history.replaceState(null, "", next);
    return;
  }

  params.delete("route");
  const [pathPart, hashPart] = target.split("#");
  const qs = params.toString();
  const next = `${pathPart}${qs ? `?${qs}` : ""}${hashPart ? `#${hashPart}` : ""}`;
  location.replace(next);
}

applyRouteRedirect();

export { applyRouteRedirect, ROUTE_MAP };
