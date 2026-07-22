/**
 * NewebPay (藍新) env config — secrets MUST stay in process.env / Render Dashboard.
 * Never hard-code HashKey / HashIV / MerchantID.
 */

const SANDBOX_GATEWAY = "https://ccore.newebpay.com/MPG/mpg_gateway";
const PROD_GATEWAY = "https://core.newebpay.com/MPG/mpg_gateway";

function trimEnv(value) {
  return String(value || "")
    .trim()
    .replace(/^["']|["']$/g, "")
    .replace(/^\uFEFF/, "");
}

/**
 * @returns {{
 *   merchantId: string,
 *   hashKey: string,
 *   hashIv: string,
 *   gatewayUrl: string,
 *   version: string,
 * }}
 */
export function getNewebpayConfig() {
  const mode = (process.env.NEWEBPAY_MODE || "sandbox").toLowerCase();
  const explicitGateway = trimEnv(process.env.NEWEBPAY_GATEWAY_URL || process.env.NEWEBPAY_API_URL);
  const gatewayUrl =
    explicitGateway ||
    (mode === "prod" || mode === "production" ? PROD_GATEWAY : SANDBOX_GATEWAY);

  return {
    merchantId: trimEnv(process.env.NEWEBPAY_MERCHANT_ID),
    hashKey: trimEnv(process.env.NEWEBPAY_HASH_KEY),
    hashIv: trimEnv(process.env.NEWEBPAY_HASH_IV),
    gatewayUrl,
    version: trimEnv(process.env.NEWEBPAY_VERSION) || "2.0",
  };
}

export function isNewebpayConfigured() {
  const c = getNewebpayConfig();
  return Boolean(c.merchantId && c.hashKey && c.hashIv);
}

export { SANDBOX_GATEWAY, PROD_GATEWAY };
