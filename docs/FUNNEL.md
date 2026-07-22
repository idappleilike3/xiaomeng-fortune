# LINE 對話漏斗 Phase A+B（FUNNEL）

> 規格對齊：`emotion-bridge/CONVERSATION_GROWTH_AND_COMMERCE_SPEC.md`  
> 正式站：`https://xiaomeng-fortune.onrender.com`  
> Webhook：`https://xiaomeng-fortune.onrender.com/api/line/webhook`

## 目標

- **「開始解碼」留在既有 LINE Bot 對話**（postback / 關鍵字），**不**另開 LIFF 解碼頁
- A：歡迎 → 免費三張塔羅（可懸念）→「查看所有方案」開 L2 貨架
- B：需求選擇 → 對齊 L2 的商品推薦 →「立即開始」（先輕會員，付款 API stub）
- Erosée 網站維持**貨架**；不在本 repo 重建完整 emotion-bridge 成交引擎

## 文案規則

- 句尾不用全形「。」
- 使用者可見文案不出現「AI」

## 按鈕對照

| 按鈕 | 行為 | 實作 |
|---|---|---|
| 開始解碼 | 進入對話漏斗（主題選單） | postback `funnel=start` 或文字「開始解碼」 |
| 主題（七大類） | 寫入 topic → 問題類型 / 描述 | postback `funnel=topic&id=…` |
| 問題類型 | 寫入 problem → 請描述 | postback `funnel=problem&id=…` |
| （聊天室輸入） | 詳細描述 | session `stage=describe` 收下文字 |
| 略過描述 直接抽牌 | 跳過描述 | postback `funnel=skip_describe` |
| 開始免費三張牌 | 抽三張體驗牌 | postback `funnel=free_yes` |
| 下一張牌 / 想知道後續 | 翻牌 / 進需求 | `funnel=next_card` / `funnel=after_cards` |
| 三種需求 | 推薦 1+備選 | `funnel=need&id=solve_now\|full_arc\|companion` |
| 立即開始 | 輕會員 + 付款 stub | `funnel=start&pid=…` |
| 確認建立輕會員 | stub 輕會員 | `funnel=light_member` |
| 查看所有方案 | 開 L2 pricing | URI → LIFF `/pricing` 或 `erosee-l2-pricing.html` |

## 流程

```
follow / 歡迎 Flex
  → 開始解碼 (postback)
  → 七大主題 → 問題類型（其他可跳過）
  → 詳細描述（或略過）
  → 免費三張（1、2 完整摘要；3 懸念）
  → 三種需求 → 推薦卡
  → 立即開始（輕會員 stub） / 查看所有方案（L2）
```

## Stub / TODO

| 項目 | 現況 |
|---|---|
| 三張牌解讀 | 使用 `server.js` tarotDeck 結構化摘要，標示體驗版 |
| Dify / emotion-bridge 完整生成 | **TODO** |
| Relationship Case 持久化 | 記憶體 session（24h TTL）**TODO → DB** |
| 綠界／點數付款 | **付款 stub**（文案說明 + 導向方案頁） |
| LINE 輕會員寫入正式會員系統 | 本機 session 標記 **TODO** |

## 本機 / LINE 測試

1. 部署或本機 ngrok 指向 webhook（憑證僅用 Render / `.env` 的 `process.env`）
2. 加好友或回覆「開始解碼」
3. 走完主題 → 問題 → 描述 → 三張牌 → 需求 → 立即開始 / 查看所有方案
4. Rich Menu 左上應為 postback；套用：`npm run rich-menu:setup`
5. 「查看所有方案」應開到 `…/erosee-l2-pricing.html`（或 LIFF `?route=/pricing`）

## 相關檔案

| 檔案 | 說明 |
|---|---|
| `lib/line/funnel-catalog.js` | 主題／問題／需求／推薦商品 |
| `lib/line/funnel-session.js` | 記憶體 session |
| `lib/line/funnel-flex.js` | Flex 訊息 |
| `lib/line/funnel-handlers.js` | postback / 文字處理 |
| `server.js` | webhook 接入；歡迎 CTA 改 postback |
| `line/rich-menu.json` | v5.1 左上 postback |
| `docs/LINE_LIFF_RENDER_SETUP.md` | Render / LIFF 設定 |
