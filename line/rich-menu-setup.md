# Erosée / 小夢神殿 Rich Menu 部署指南

本指南說明如何透過 LINE Messaging API 建立並套用 `line/rich-menu.json`（Erosée v5 六宮格）。

> **安全提醒**：Channel Access Token 僅能放在本機 `.env` 或 Render 環境變數，**勿提交至 Git**。  
> 完整 Render / LIFF 步驟見 [`docs/LINE_LIFF_RENDER_SETUP.md`](../docs/LINE_LIFF_RENDER_SETUP.md)。

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
npm run rich-menu:setup
```

腳本會讀取環境變數、替換 `${LIFF_ID}`，並呼叫 Messaging API。

### 選用哪張圖？

腳本優先順序：

1. 環境變數 `RICH_MENU_IMAGE`（絕對路徑或相對 repo 根目錄）
2. `assets/rich-menu-v5.png`（若有）
3. `assets/rich-menu-v4.png`（若有）
4. `assets/rich-menu-xiaomeng.png`（目前 repo 內唯一符合 2500×1686 且 <1MB 的六宮格）

```bash
# 明確指定舊圖（六宮格 F 版）
# PowerShell
$env:RICH_MENU_IMAGE="assets/rich-menu-xiaomeng.png"; npm run rich-menu:setup

# 若你有壓縮後的 Erosée 六宮格圖，放到 assets/rich-menu-v5.png 後直接：
npm run rich-menu:setup
```

**注意：** `assets/line-rich-menu-final.png` 是精緻 **四宮格** 圖且約 4MB（超過 LINE 1MB 上限），與現行 `line/rich-menu.json` 六宮格熱區不一致；要用它需先壓縮到 1MB 內並改成四宮格 JSON。

## 方法二：curl 手動建立

先把 `line/rich-menu.json` 內 `${LIFF_ID}` 全部換成真實 LIFF ID，再執行：

```bash
curl -X POST "https://api.line.me/v2/bot/richmenu" \
  -H "Authorization: Bearer $LINE_CHANNEL_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d @line/rich-menu.json
```

上傳選單圖片（2500×1686）並設為預設：

```bash
curl -X POST "https://api.line.me/v2/bot/richmenu/{richMenuId}/content" \
  -H "Authorization: Bearer $LINE_CHANNEL_ACCESS_TOKEN" \
  -H "Content-Type: image/png" \
  --data-binary @assets/rich-menu-v5.png

curl -X POST "https://api.line.me/v2/bot/user/all/richmenu/{richMenuId}" \
  -H "Authorization: Bearer $LINE_CHANNEL_ACCESS_TOKEN"
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

關鍵字「開始解碼」「占卜」「神殿」「命運」可由 webhook 回覆 Flex；「開始解碼」進入對話漏斗，「查看所有方案」開 L2 貨架。
