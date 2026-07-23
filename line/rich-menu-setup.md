# Erosée / 情感解碼 Rich Menu 部署指南

本指南說明如何透過 LINE Messaging API 建立並套用 `line/rich-menu.json`（Erosée v5.1 六宮格）。

> **安全提醒**：Channel Access Token 僅能放在本機 `.env` 或 Render 環境變數，**勿提交至 Git**。  
> 完整 Render / LIFF 步驟見 [`docs/LINE_LIFF_RENDER_SETUP.md`](../docs/LINE_LIFF_RENDER_SETUP.md)。

## 品牌注意

此 OA 是 **Erosée / 情感解碼**，不是「小夢神殿」。

| 圖檔 | 說明 |
|---|---|
| `assets/rich-menu-v5.png` | **現行熱區對齊**：六宮格、標籤對齊漏斗（開始解碼／方案…）、無小夢字樣 |
| `assets/rich-menu-erosee-v6.png` | **華麗插畫版（字已加大）**：2500×1686、未滿 1MB。畫面標籤為情感分析／塔羅指引／更多神殿／萌寵神殿／會員中心／活動中心，**與現行 `line/rich-menu.json` 熱區標籤不一致**；上線前請先改 JSON 對應行為，或僅用 `RICH_MENU_IMAGE` 明確指定 |
| `assets/rich-menu-erosee-v6-source.png` | v6 原始插畫（未加大字、未壓成 LINE 尺寸） |
| `assets/line-rich-menu-final.png` | 舊四宮格精緻圖（約 4MB，超過 LINE 1MB；熱區與現行 JSON 不一致） |
| `assets/rich-menu-xiaomeng.png` | **錯誤品牌**：圖上印「小夢神殿」；預設腳本**不會**再用它 |

## 前置準備

1. 於 [LINE Developers Console](https://developers.line.biz/) 建立 Messaging API Channel。
2. 建立 LIFF App：
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

5. `line/rich-menu.json` 使用 `${LIFF_ID}` 占位；`npm run rich-menu:setup` 會自動替換。

## 方法一：使用專案腳本（建議）

```bash
# 1) 產生 Erosée 六宮格圖（無小夢）
npm run rich-menu:image

# 2) 若超過 1MB 再壓縮
node scripts/compress-rich-menu.mjs assets/rich-menu-v5.png

# 3) 上傳並設為預設選單
npm run rich-menu:setup
```

腳本優先順序：

1. 環境變數 `RICH_MENU_IMAGE`
2. `assets/rich-menu-v5.png`
3. `assets/rich-menu-v4.png`

**不會**自動使用 `rich-menu-xiaomeng.png`（需 `ALLOW_XIAOMENG_RICH_MENU=1` 才允許，不建議）。

```powershell
$env:RICH_MENU_IMAGE="assets/rich-menu-v5.png"; npm run rich-menu:setup

# 華麗插畫 v6（須先確認 hotzone／文案與 line/rich-menu.json 一致，否則點擊行為會對錯格）
$env:RICH_MENU_IMAGE="assets/rich-menu-erosee-v6.png"; npm run rich-menu:setup
```

## Rich Menu 對照（v5.1）

| 格位 | 標籤 | 行為 | 落地 |
|---|---|---|---|
| 1 | 開始解碼 | **postback** `funnel=start` | 對話內漏斗（見 [`docs/FUNNEL.md`](../docs/FUNNEL.md)） |
| 2 | 查看方案 | LIFF `route=/pricing` | `erosee-l2-pricing.html` |
| 3 | 情感系列 | LIFF `route=/pricing/emotion` | L2 `#emotion` |
| 4 | 萌寵系列 | LIFF `route=/pricing/pet` | L2 `#pet` |
| 5 | 月費訂閱 | LIFF `route=/pricing/subscribe` | L2 `#subscribe` |
| 6 | 邀請好友 | LIFF `route=/invite` | cosmic home（`campaign=invite`） |

關鍵字「開始解碼」「占卜」「神殿」「命運」可由 webhook 回覆 Flex；歡迎詞 / hi / follow 會回 **Erosée 情感解碼** HERO（大鈕開始解碼 + 七大主題），不會再出現「小夢」。
