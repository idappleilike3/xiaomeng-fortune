# LINE LIFF + Bot 設定（Render / Erosée）

> 正式站：`https://xiaomeng-fortune.onrender.com`  
> LIFF Endpoint：`https://xiaomeng-fortune.onrender.com/erosee-cosmic-home.html`  
> L2 方案頁：`https://xiaomeng-fortune.onrender.com/erosee-l2-pricing.html`  
> Webhook：`https://xiaomeng-fortune.onrender.com/api/line/webhook`

程式只從 `process.env` 讀取憑證（名稱與 `.env.example` / `server.js` 一致）。  
**Render 上已有 LINE 憑證時，不要把 Secret / Token / LIFF ID 貼到聊天或 Git。**

---

## 1. Render 環境變數名稱（預期已存在）

| 變數名 | 用途 | 正式建議值 / 備註 |
|---|---|---|
| `PUBLIC_BASE_URL` | 對外網域 | `https://xiaomeng-fortune.onrender.com` |
| `LINE_CHANNEL_ID` | idToken 驗證、公開 channelId | Messaging API Channel ID |
| `LINE_CHANNEL_SECRET` | Webhook 簽章驗證 | Dashboard 已設即可 |
| `LINE_CHANNEL_ACCESS_TOKEN` | reply / push / rich menu | Dashboard 已設即可 |
| `LIFF_ID` | `liff.init` + Flex / Rich Menu 連結 | LINE LIFF App ID |
| `LIFF_URL` | 可選；未設時由 `LIFF_ID` 組出 | `https://liff.line.me/<LIFF_ID>` |
| `LINE_OA_URL` | 前台「加入好友 / 立即開始」 | `https://line.me/R/ti/p/@…` |
| `ALLOW_LIFF_STUB` | 正式站應為 `0` | 僅本機無 secret 時用 `1` |
| `PORT` | Render 通常自動注入 | `3000` 或平台指定 |

程式讀取位置：

- `server.js` → webhook / Flex / `PUBLIC_BASE_URL` / `LIFF_*`
- `lib/liff-handlers.js` → `/api/liff/config`、`/api/liff/init`
- 前端 → 只打 `/api/liff/config`（**不**內嵌 secret）

部署後用（不會洩漏 secret）：

```bash
curl https://xiaomeng-fortune.onrender.com/health
```

檢查 `envPresent.* === true`、`liff.endpoint`、`erosee.home`。

```bash
curl https://xiaomeng-fortune.onrender.com/api/liff/config
```

應回傳 `liffId`、`entryUrl`、`pricingUrl`、`lineOaUrl`（無 secret）。

---

## 2. LINE Developers Console — 核對用 URL

### Messaging API → Webhook

```
https://xiaomeng-fortune.onrender.com/api/line/webhook
```

- Use webhook = ON  
- Verify 成功即可（憑證在 Render）

### LIFF App → Endpoint URL

```
https://xiaomeng-fortune.onrender.com/erosee-cosmic-home.html
```

- Size: Full  
- Scope: `profile`、`openid`（分享再加 `chat_message.write`）

### 開啟連結樣板（`{LIFF_ID}` = Render 上的 `LIFF_ID`）

| 用途 | URL |
|---|---|
| 開始解碼 | `https://liff.line.me/{LIFF_ID}?route=%2F` |
| 查看方案 | `https://liff.line.me/{LIFF_ID}?route=%2Fpricing` |
| 情感系列 | `https://liff.line.me/{LIFF_ID}?route=%2Fpricing%2Femotion` |
| 萌寵系列 | `https://liff.line.me/{LIFF_ID}?route=%2Fpricing%2Fpet` |
| 月費訂閱 | `https://liff.line.me/{LIFF_ID}?route=%2Fpricing%2Fsubscribe` |

直接網站（非 LIFF 包裝）：

| 頁面 | URL |
|---|---|
| Cosmic home | `https://xiaomeng-fortune.onrender.com/erosee-cosmic-home.html` |
| L2 pricing | `https://xiaomeng-fortune.onrender.com/erosee-l2-pricing.html` |
| Pretty | `/home`、`/pricing`、`/liff` |

---

## 3. Rich Menu

`line/rich-menu.json` 使用 `${LIFF_ID}` 占位。本機若已有與 Render 相同的 `.env`：

```bash
npm run rich-menu:setup
```

會替換 `${LIFF_ID}` 並呼叫 Messaging API（需 Access Token）。

---

## 4. Spec 對應範圍

| Spec 節點 | 本輪落地 |
|---|---|
| 開始解碼 / 歡迎 CTA | Flex + Rich Menu → cosmic home |
| 查看所有方案 | → `erosee-l2-pricing.html` |
| 商品 CTA | → `LINE_OA_URL`（config 注入） |
| 完整對話 / 付款 / 簽到輪盤 | 未做（emotion-bridge 後續） |

---

## 5. 無 Dashboard 時仍卡住的項目

| 項目 | 原因 |
|---|---|
| 確認 Console Endpoint / Webhook 是否已改到上述 URL | 需 LINE Developers 或有權限的人核對 |
| 上傳 / 套用 Rich Menu 圖 | 需 Messaging API 呼叫或 Console UI |
| 本 repo 變更上線 | 需 push 後 Render 自動部署；目前正式站若仍 404 `/api/liff/config` 代表舊版未部署 |
| 完整對話成交漏斗 | 非本 repo LIFF 接線範圍 |

---

## 6. 相關檔案

| 檔案 | 說明 |
|---|---|
| `render.yaml` | 環境變數 key 清單 |
| `.env.example` | 本機變數名範本 |
| `erosee-cosmic-home.html` | LIFF Endpoint |
| `erosee-l2-pricing.html` | L2 方案 |
| `js/erosee-liff-boot.js` / `js/liff-bridge.js` / `js/liff-entry.js` | 前端 LIFF |
| `lib/liff-routes.js` / `lib/liff-handlers.js` | 路由與驗證 |
| `line/rich-menu.json` | Rich Menu v5 |
