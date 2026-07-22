# 藍新 NewebPay（MPG）設定指南

小夢老師 Bot 漏斗按鈕「立即開始」會建立藍新 MPG 訂單，並用 URI 開啟 `/pay.html?token=…` 自動 POST 到藍新閘道。

## 必要環境變數

| 變數 | 說明 |
|------|------|
| `NEWEBPAY_MERCHANT_ID` | 商店代號（MerchantID） |
| `NEWEBPAY_HASH_KEY` | HashKey |
| `NEWEBPAY_HASH_IV` | HashIV |
| `NEWEBPAY_MODE` | `sandbox`（預設）或 `production` |
| `NEWEBPAY_GATEWAY_URL` | 可選覆寫閘道 URL |
| `PUBLIC_BASE_URL` | 正式站 `https://xiaomeng-fortune.onrender.com` |

**請勿把 HashKey / HashIV / MerchantID 寫進 git。** 只放本機 `.env` 與 Render Dashboard → Environment。

### 閘道 URL

| 環境 | URL |
|------|-----|
| 測試 | `https://ccore.newebpay.com/MPG/mpg_gateway` |
| 正式 | `https://core.newebpay.com/MPG/mpg_gateway` |

未設 `NEWEBPAY_GATEWAY_URL` 時，依 `NEWEBPAY_MODE` 自動選擇。

### 回傳 URL（已寫死於訂單參數）

- Notify：`https://xiaomeng-fortune.onrender.com/api/newebpay/notify`
- Return：`https://xiaomeng-fortune.onrender.com/api/newebpay/return`

## Render 設定步驟

1. Render → 你的 Web Service → Environment
2. 新增上表變數（值從藍新商店後台複製）
3. 部署完成後打開 `/health`，確認 `newebpay: "configured"` 與 env 旗標為 true
4. 若金鑰曾貼在聊天室：**到藍新後台重新產生 HashKey/HashIV 並輪換**，舊金鑰作廢

## API 一覽

| Method | Path | 用途 |
|--------|------|------|
| POST | `/api/newebpay/create` | JSON 建立訂單，回 `payUrl` |
| GET | `/pay.html?token=…` | 自動 POST 表單到藍新 |
| POST | `/api/newebpay/notify` | 藍新背景通知（驗 TradeSha → 標記已付 → LINE「付款成功」） |
| GET/POST | `/api/newebpay/return` | 使用者瀏覽器導回 → success/failed 頁 |
| GET | `/api/newebpay/orders` | MVP 記憶體訂單快照（除錯用） |

### 建立訂單範例

```bash
curl -X POST https://xiaomeng-fortune.onrender.com/api/newebpay/create \
  -H "content-type: application/json" \
  -d "{\"productId\":\"emotion_depth\",\"userId\":\"Uxxxxxxxx\"}"
```

成功時回傳 `payUrl`；缺設定時 `503` + `NEWEBPAY_NOT_CONFIGURED`。

## 怎麼測「立即開始」

1. 在 Render 填好 `NEWEBPAY_*`（含 MerchantID）
2. LINE 加好友 → 回「開始解碼」走完主題／問題／需求
3. 推薦卡片點 **立即開始**（postback `funnel=start&pid=…`）
4. 應收到 Flex「前往付款」；點開後跳藍新測試頁
5. 用藍新測試卡完成付款
6. Notify 應回 `SUCCESS`；對話收到「付款成功」；瀏覽器進 `payment-success.html`

若未設定 MerchantID／金鑰，Bot 會回 Flex **「金流尚未設定」**。

## 安全提醒

- `.env` 已在 `.gitignore`；`.env.example` 只有 placeholder
- HashKey/HashIV 若曾出現在聊天紀錄，視為已外洩 → **立刻輪換**
- 訂單目前為 **行程內記憶體（MVP）**；Render 重啟會清空，正式版需改 DB
