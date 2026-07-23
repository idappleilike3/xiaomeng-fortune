/**
 * In-memory NewebPay orders (MVP). Lost on process restart — OK for sandbox.
 */

import { randomBytes } from "node:crypto";
import { getProduct } from "../line/funnel-catalog.js";
import { isNewebpayConfigured } from "./config.js";
import { buildMpgFormFields } from "./mpg.js";

/** @type {Map<string, object>} merchantOrderNo -> order */
const ordersByNo = new Map();
/** @type {Map<string, string>} payToken -> merchantOrderNo */
const orderNoByToken = new Map();

function makeMerchantOrderNo() {
  // NewebPay: alphanumeric, commonly ≤ 20–30 chars
  const stamp = Date.now().toString(36).toUpperCase();
  const rnd = randomBytes(3).toString("hex").toUpperCase();
  return `XM${stamp}${rnd}`.slice(0, 20);
}

function makePayToken() {
  return randomBytes(24).toString("hex");
}

/**
 * Resolve amount for a funnel product or subscription plan id.
 * @param {string} productId
 * @param {number} [overrideAmt]
 */
export function resolveProductAmount(productId, overrideAmt) {
  if (overrideAmt != null && Number.isFinite(Number(overrideAmt))) {
    return Math.round(Number(overrideAmt));
  }
  const product = getProduct(productId);
  if (product?.amount) return Math.round(Number(product.amount));
  return null;
}

/**
 * @param {{
 *   userId?: string,
 *   productId: string,
 *   amt?: number,
 *   itemDesc?: string,
 *   publicBaseUrl: string,
 *   email?: string,
 * }} input
 */
export function createCheckoutOrder(input) {
  if (!isNewebpayConfigured()) {
    const err = new Error("NEWEBPAY_NOT_CONFIGURED");
    err.code = "NEWEBPAY_NOT_CONFIGURED";
    throw err;
  }

  const product = getProduct(input.productId);
  const amt = resolveProductAmount(input.productId, input.amt);
  if (!amt) {
    const err = new Error("UNKNOWN_PRODUCT_OR_AMT");
    err.code = "UNKNOWN_PRODUCT_OR_AMT";
    throw err;
  }

  const merchantOrderNo = makeMerchantOrderNo();
  const payToken = makePayToken();
  const publicBaseUrl = String(input.publicBaseUrl || "").replace(/\/$/, "");
  const notifyUrl = `${publicBaseUrl}/api/newebpay/notify`;
  const returnUrl = `${publicBaseUrl}/api/newebpay/return`;
  const itemDesc = (input.itemDesc || product?.title || "情感解碼方案").slice(0, 50);

  const order = {
    merchantOrderNo,
    payToken,
    productId: input.productId,
    itemDesc,
    amt,
    userId: input.userId || null,
    status: "pending",
    createdAt: Date.now(),
    paidAt: null,
    notifyPayload: null,
    returnPayload: null,
  };

  ordersByNo.set(merchantOrderNo, order);
  orderNoByToken.set(payToken, merchantOrderNo);

  const form = buildMpgFormFields({
    merchantOrderNo,
    amt,
    itemDesc,
    notifyUrl,
    returnUrl,
    email: input.email,
    clientBackUrl: `${publicBaseUrl}/erosee-l2-pricing.html`,
  });

  return {
    order,
    form,
    payUrl: `${publicBaseUrl}/pay.html?token=${encodeURIComponent(payToken)}`,
    notifyUrl,
    returnUrl,
  };
}

export function getOrderByToken(token) {
  const no = orderNoByToken.get(String(token || ""));
  if (!no) return null;
  return ordersByNo.get(no) || null;
}

export function getOrderByMerchantOrderNo(merchantOrderNo) {
  return ordersByNo.get(String(merchantOrderNo || "")) || null;
}

/**
 * @param {string} merchantOrderNo
 * @param {Record<string, string>} data
 */
export function markOrderPaid(merchantOrderNo, data = {}) {
  const order = getOrderByMerchantOrderNo(merchantOrderNo);
  if (!order) return null;
  if (order.status === "paid") {
    order.notifyPayload = data;
    return order;
  }
  order.status = "paid";
  order.paidAt = Date.now();
  order.notifyPayload = data;
  return order;
}

export function markOrderReturnSeen(merchantOrderNo, data = {}) {
  const order = getOrderByMerchantOrderNo(merchantOrderNo);
  if (!order) return null;
  order.returnPayload = data;
  return order;
}

export function listOrdersSnapshot(limit = 20) {
  return [...ordersByNo.values()]
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, limit)
    .map((o) => ({
      merchantOrderNo: o.merchantOrderNo,
      productId: o.productId,
      amt: o.amt,
      status: o.status,
      userId: o.userId,
      createdAt: o.createdAt,
      paidAt: o.paidAt,
    }));
}
