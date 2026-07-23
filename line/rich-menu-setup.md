# Erosée / 情感解碼 Rich Menu 部署指南

本指南說明如何透過 LINE Messaging API 建立並套用 `line/rich-menu.json`（Erosée **v6** 六宮格）。

> **安全提醒**：Channel Access Token 僅能放在本機 `.env` 或 Render 環境變數，**勿提交至 Git**。  
> 完整 Render / LIFF 步驟見 [`docs/LINE_LIFF_RENDER_SETUP.md`](../docs/LINE_LIFF_RENDER_SETUP.md)。

## 品牌注意

此 OA 是 **Erosée / 情感解碼**，不是「小夢神殿」。

| 圖檔 | 說明 |
|---|---|
| `assets/rich-menu-erosee-v6.png` | **現行**：華麗插畫六宮格（情感分析／塔羅指引／更多神殿／萌寵神殿／會員中心／活動中心），2500×1686、未滿 1MB |
| `assets/rich-menu-erosee-v6-source.png` | v6 原始插畫（未加大字、未壓成 LINE 尺寸） |
| `assets/rich-menu-v5.png` | 舊熱區標籤（開始解碼／方案…） |
| `assets/line-rich-menu-final.png` | 舊四宮格精緻圖（約 4MB，超過 LINE 1MB） |
| `assets/rich-menu-xiaomeng.png` | **錯誤品牌**：圖上印「小夢神殿」；預設腳本**不會**再用它 |

## 前置準備

1. 於 [LINE Developers Console](https://developers.line.biz/) 建立 Messaging API Channel。
2. 建立 LIFF App（選用；現行 v6 URI 可用 HTTPS 直連，不強制 LIFF）：
   - **Endpoint URL** = `https://xiaomeng-fortune.onrender.com/erosee-cosmic-home.html`
   - Size = Full
3. Webhook URL = `https://xiaomeng-fortune.onrender.com/api/line/webhook`
4. 在 `.env` / Render 設定（參考 `.env.example`）：

```env
LINE_CHANNEL_ID=你的_Channel_ID
LINE_CHANNEL_SECRET=你的_Channel_Secret
LINE_CHANNEL_ACCESS_TOKEN=你的_Channel_Access_Token
LIFF_ID=你的_LIFF_ID
LIFF_URL=https://liff.line.me/你的_LIFF_ID
PUBLIC_BASE_URL=https://xiaomeng-fortune.onrender.com
LINE_OA_URL=https://line.me/R/ti/p/@你的_OA_ID
```

5. `line/rich-menu.json` 使用 `${PUBLIC_BASE_URL}`（與可選的 `${LIFF_ID}`）占位；`npm run rich-menu:setup` 會自動替換。

## 方法一：使用專案腳本（建議）

```powershell
$env:RICH_MENU_IMAGE="assets/rich-menu-erosee-v6.png"; npm run rich-menu:setup
```

腳本優先順序：

1. 環境變數 `RICH_MENU_IMAGE`
2. `assets/rich-menu-erosee-v6.png`
3. `assets/rich-menu-v5.png`
4. `assets/rich-menu-v4.png`

**不會**自動使用 `rich-menu-xiaomeng.png`（需 `ALLOW_XIAOMENG_RICH_MENU=1` 才允許，不建議）。

## Rich Menu 對照（v6）

| 格位 | 畫面標籤 | 行為 | 落地 |
|---|---|---|---|
| 1 | 情感分析 | **postback** `funnel=topic&id=love` | 對話內感情主題漏斗 |
| 2 | 塔羅指引 | **postback** `funnel=start` | 對話內開始解碼 → 七大方向 |
| 3 | 更多神殿 | URI L2 貨架 | `erosee-l2-pricing.html` |
| 4 | 萌寵神殿 | **postback** `funnel=topic&id=pet` | 對話內萌寵主題漏斗 |
| 5 | 會員中心 | URI 訂閱／方案 | `erosee-l2-pricing.html#subscribe` |
| 6 | 活動中心 | URI 方案／活動 | `erosee-l2-pricing.html?campaign=promo` |

上傳後若畫面沒變：關閉聊天室再開、或等約 1 分鐘讓 LINE 端快取更新。

## 歡迎詞（Webhook Flex 才是真的）

加好友／傳 `hi`／`歡迎`／`歡迎詞` 時，由 **Messaging API webhook** 回覆 Flex（`welcomeFlex: v4-hero-start-only`：hero 圖 + 文案 + 僅「開始解碼」；七大主題在點「開始解碼」後才出現）。

### LINE Official Account Manager「加入好友歡迎訊息」常見衝突

OA Manager → 回應設定 → **加入好友歡迎訊息** 只能設**純文字／簡易訊息**，容易蓋過或搶在 webhook Flex 之前顯示舊文案。

建議：

1. **關閉** OA Manager 的「加入好友歡迎訊息」，或改成極短提示（例如「傳 hi 開始」），真正的歡迎體驗交給 webhook Flex。
2. 確認 Developers Console 的 Webhook 已啟用，URL = `{PUBLIC_BASE_URL}/api/line/webhook`。
3. `PUBLIC_BASE_URL` 必須是正式站 `https://xiaomeng-fortune.onrender.com`，hero 圖才載得進 LINE。
4. 驗證：刪好友再加，或在對話傳 `hi` → 應看到 hero +「開始解碼」（不是舊的七主題 carousel）。

關鍵字「開始解碼」「占卜」「神殿」「命運」可由 webhook 回覆；歡迎詞不會再出現「小夢」。
