/**
 * NewebPay MPG (一次付清) — TradeInfo AES-256-CBC + TradeSha SHA256.
 * Spec: 藍新金流《MPG 串接技術文件》
 */

import { createCipheriv, createDecipheriv, createHash, timingSafeEqual } from "node:crypto";
import { getNewebpayConfig } from "./config.js";

/**
 * @param {Record<string, string|number|boolean|null|undefined>} fields
 */
export function buildQueryString(fields) {
  return Object.entries(fields)
    .filter(([, v]) => v !== undefined && v !== null && v !== "")
    .map(([k, v]) => `${k}=${encodeURIComponent(String(v))}`)
    .join("&");
}

/**
 * NewebPay TradeInfo uses raw key=value&... (NOT URL-encoded values in plaintext).
 * @param {Record<string, string|number|boolean|null|undefined>} fields
 */
export function buildTradeInfoPlaintext(fields) {
  return Object.entries(fields)
    .filter(([, v]) => v !== undefined && v !== null && v !== "")
    .map(([k, v]) => `${k}=${String(v)}`)
    .join("&");
}

/**
 * @param {string} plain
 * @param {string} [hashKey]
 * @param {string} [hashIv]
 */
export function aesEncrypt(plain, hashKey, hashIv) {
  const cfg = getNewebpayConfig();
  const key = hashKey || cfg.hashKey;
  const iv = hashIv || cfg.hashIv;
  const cipher = createCipheriv("aes-256-cbc", Buffer.from(key, "utf8"), Buffer.from(iv, "utf8"));
  return Buffer.concat([cipher.update(plain, "utf8"), cipher.final()]).toString("hex");
}

/**
 * @param {string} hex
 * @param {string} [hashKey]
 * @param {string} [hashIv]
 */
export function aesDecrypt(hex, hashKey, hashIv) {
  const cfg = getNewebpayConfig();
  const key = hashKey || cfg.hashKey;
  const iv = hashIv || cfg.hashIv;
  const decipher = createDecipheriv("aes-256-cbc", Buffer.from(key, "utf8"), Buffer.from(iv, "utf8"));
  return Buffer.concat([
    decipher.update(Buffer.from(String(hex).trim(), "hex")),
    decipher.final(),
  ]).toString("utf8");
}

/**
 * @param {string} tradeInfoHex
 * @param {string} [hashKey]
 * @param {string} [hashIv]
 */
export function createTradeSha(tradeInfoHex, hashKey, hashIv) {
  const cfg = getNewebpayConfig();
  const key = hashKey || cfg.hashKey;
  const iv = hashIv || cfg.hashIv;
  return createHash("sha256")
    .update(`HashKey=${key}&${tradeInfoHex}&HashIV=${iv}`)
    .digest("hex")
    .toUpperCase();
}

/**
 * @param {string} tradeInfoHex
 * @param {string} tradeSha
 */
export function verifyTradeSha(tradeInfoHex, tradeSha) {
  const expected = createTradeSha(tradeInfoHex);
  const a = Buffer.from(String(expected).toUpperCase());
  const b = Buffer.from(String(tradeSha || "").toUpperCase());
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

/**
 * Parse decrypted TradeInfo plaintext or JSON into a flat object.
 * @param {string} decrypted
 * @returns {Record<string, string>}
 */
export function parseTradeInfoPayload(decrypted) {
  const text = String(decrypted || "").trim();
  if (!text) return {};

  if (text.startsWith("{")) {
    try {
      const parsed = JSON.parse(text);
      if (parsed && typeof parsed === "object") {
        const result = {};
        const resultObj = parsed.Result && typeof parsed.Result === "object" ? parsed.Result : {};
        for (const [k, v] of Object.entries(parsed)) {
          if (k === "Result") continue;
          if (v != null && typeof v !== "object") result[k] = String(v);
        }
        for (const [k, v] of Object.entries(resultObj)) {
          if (v != null && typeof v !== "object") result[k] = String(v);
        }
        if (parsed.Status != null) result.Status = String(parsed.Status);
        if (parsed.Message != null) result.Message = String(parsed.Message);
        return result;
      }
    } catch {
      /* fall through to querystring */
    }
  }

  const out = {};
  for (const part of text.split("&")) {
    const idx = part.indexOf("=");
    if (idx === -1) continue;
    const k = decodeURIComponent(part.slice(0, idx));
    const v = decodeURIComponent(part.slice(idx + 1).replace(/\+/g, " "));
    out[k] = v;
  }
  return out;
}

/**
 * Build MPG form fields for auto-post to gateway.
 * @param {{
 *   merchantOrderNo: string,
 *   amt: number,
 *   itemDesc: string,
 *   notifyUrl: string,
 *   returnUrl: string,
 *   email?: string,
 *   clientBackUrl?: string,
 *   customerUrl?: string,
 * }} order
 */
export function buildMpgFormFields(order) {
  const cfg = getNewebpayConfig();
  if (!cfg.merchantId || !cfg.hashKey || !cfg.hashIv) {
    const err = new Error("NEWEBPAY_NOT_CONFIGURED");
    err.code = "NEWEBPAY_NOT_CONFIGURED";
    throw err;
  }

  const amt = Math.round(Number(order.amt));
  if (!Number.isFinite(amt) || amt < 1) {
    const err = new Error("INVALID_AMT");
    err.code = "INVALID_AMT";
    throw err;
  }

  const tradeFields = {
    MerchantID: cfg.merchantId,
    RespondType: "JSON",
    TimeStamp: String(Math.floor(Date.now() / 1000)),
    Version: cfg.version,
    MerchantOrderNo: String(order.merchantOrderNo).slice(0, 30),
    Amt: amt,
    ItemDesc: String(order.itemDesc || "小夢老師方案").slice(0, 50),
    NotifyURL: order.notifyUrl,
    ReturnURL: order.returnUrl,
    LoginType: 0,
    CREDIT: 1,
    ANDROIDPAY: 0,
    SAMSUNGPAY: 0,
    LINEPAY: 0,
    ImageUrl: "",
  };

  if (order.email) tradeFields.Email = order.email;
  if (order.clientBackUrl) tradeFields.ClientBackURL = order.clientBackUrl;
  if (order.customerUrl) tradeFields.CustomerURL = order.customerUrl;

  const plaintext = buildTradeInfoPlaintext(tradeFields);
  const tradeInfo = aesEncrypt(plaintext);
  const tradeSha = createTradeSha(tradeInfo);

  return {
    gatewayUrl: cfg.gatewayUrl,
    MerchantID: cfg.merchantId,
    Version: cfg.version,
    TradeInfo: tradeInfo,
    TradeSha: tradeSha,
    EncryptType: 0,
  };
}

/**
 * Verify + decrypt notify/return payload from NewebPay.
 * @param {{ Status?: string, MerchantID?: string, TradeInfo?: string, TradeSha?: string }} body
 */
export function decryptAndVerifyCallback(body) {
  const tradeInfo = body?.TradeInfo || "";
  const tradeSha = body?.TradeSha || "";
  if (!tradeInfo || !tradeSha) {
    return { ok: false, reason: "missing_trade_fields" };
  }
  if (!verifyTradeSha(tradeInfo, tradeSha)) {
    return { ok: false, reason: "trade_sha_mismatch" };
  }

  let decrypted;
  try {
    decrypted = aesDecrypt(tradeInfo);
  } catch (e) {
    return { ok: false, reason: "decrypt_failed", error: e?.message };
  }

  const data = parseTradeInfoPayload(decrypted);
  const status = data.Status || body.Status || "";
  return {
    ok: true,
    status,
    paid: status === "SUCCESS",
    data,
    decrypted,
  };
}

/**
 * HTML that auto-posts to NewebPay MPG gateway.
 * @param {ReturnType<typeof buildMpgFormFields>} form
 * @param {{ title?: string }} [opts]
 */
export function renderAutoPostHtml(form, opts = {}) {
  const title = opts.title || "前往藍新付款";
  const escape = (s) =>
    String(s)
      .replace(/&/g, "&amp;")
      .replace(/"/g, "&quot;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

  return `<!doctype html>
<html lang="zh-Hant">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escape(title)}</title>
  <style>
    body { margin: 0; min-height: 100vh; display: grid; place-items: center;
      font-family: "Noto Serif TC", "Songti TC", serif; background: #0b1c24; color: #f5efe4; }
    .box { text-align: center; padding: 2rem; }
    .hint { opacity: .75; font-size: .95rem; }
  </style>
</head>
<body>
  <div class="box">
    <p>正在前往藍新金流安全付款頁…</p>
    <p class="hint">若未自動跳轉，請按下方按鈕</p>
    <form id="newebpay" method="post" action="${escape(form.gatewayUrl)}">
      <input type="hidden" name="MerchantID" value="${escape(form.MerchantID)}" />
      <input type="hidden" name="Version" value="${escape(form.Version)}" />
      <input type="hidden" name="TradeInfo" value="${escape(form.TradeInfo)}" />
      <input type="hidden" name="TradeSha" value="${escape(form.TradeSha)}" />
      <input type="hidden" name="EncryptType" value="${escape(form.EncryptType)}" />
      <button type="submit" style="margin-top:1rem;padding:.7rem 1.4rem;border:0;border-radius:999px;background:#c9a45c;color:#1a1208;font-weight:700;cursor:pointer">前往付款</button>
    </form>
  </div>
  <script>document.getElementById("newebpay").submit();</script>
</body>
</html>`;
}
