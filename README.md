# 小夢老師｜塔羅命盤療癒室

這個專案現在包含：

- 高質感命理網站前台
- LINE 官方帳號 Webhook 後端
- 塔羅、求籤、生命靈數、命盤、MBTI、市集文字指令回覆
- 免費簡易解析 + 付費深入解析的文案雛形
- 聯盟行銷商品入口

## 1. 啟動網站

需要 Node.js 18 以上。

```bash
npm run dev
```

打開：

```text
http://localhost:3001
```

健康檢查：

```text
http://localhost:3001/health
```

## 2. 設定 LINE Token

複製 `.env.example` 成 `.env`，填入 LINE Developers 的資料：

```text
LINE_CHANNEL_SECRET=你的_Channel_secret
LINE_CHANNEL_ACCESS_TOKEN=你的_Channel_access_token
PUBLIC_BASE_URL=https://你的正式網址
PORT=3000
```

不要把 `.env` 上傳到公開網路，裡面是你的私密金鑰。

## 3. LINE Developers 後台設定

1. 建立或打開 LINE 官方帳號
2. 到 LINE Developers 啟用 Messaging API
3. 找到 `Channel secret` 與 `Channel access token`
4. 將你的網站部署成公開網址，例如 Vercel、Render、Railway
5. Webhook URL 填：

```text
https://你的正式網址/api/line/webhook
```

6. 開啟 `Use webhook`
7. 建議關閉會干擾測試的預設自動回覆
8. 在 LINE 對官方帳號傳訊息測試

## 4. 目前可用 LINE 指令

```text
設定生日
塔羅
求籤
靈數 1996-08-18
命盤
MBTI
市集
```

## 5. 建議歡迎詞

```text
歡迎光臨，我是小夢老師。

先設定生日，就能幫你看塔羅、求籤、生命靈數與命盤方向。

你可以輸入：
設定生日
塔羅
求籤
靈數 1996-08-18
命盤
MBTI
市集
```

## 6. 下一步

- 把網站部署到公開網址
- 建立 LIFF App，讓網頁可在 LINE 內開啟
- 接 Supabase 儲存會員、解析紀錄、商品點擊
- 做管理後台管理牌義、籤詩、文章、商品連結
- 串付款，做完整解析付費解鎖

## 7. 目前完成與未完成

已完成：

- 前台網站頁面
- 高級塔羅宇宙視覺背景
- 小夢老師品牌文案
- 78 張塔羅牌簡易牌義
- 求籤與生命靈數前台互動
- 出生資料填寫與用途說明
- 自動化推播文案模板
- LINE Webhook 後端
- Channel secret 與 access token 本機設定
- Render 部署設定檔 `render.yaml`

尚未完成：

- 正式部署到 Render / Railway / Vercel
- 正式 Webhook HTTPS 網址
- LINE Developers 後台驗證 Webhook
- LIFF App 建立
- 資料庫儲存會員資料
- 管理後台
- 付款與付費解鎖
- 紫微斗數真正排盤
- 八字完整排盤
- MBTI 完整測驗流程
- 聯盟點擊報表

現在正在做的階段：

```text
部署準備與正式 Webhook 產生
```

## 8. Render 部署設定

Render 可使用：

```text
Build Command: npm install
Start Command: npm start
Health Check Path: /health
```

環境變數：

```text
LINE_CHANNEL_SECRET=你的 Channel secret
LINE_CHANNEL_ACCESS_TOKEN=你的 Channel access token
PUBLIC_BASE_URL=https://Render給你的網址
```

正式 Webhook：

```text
https://Render給你的網址/api/line/webhook
```

## 9. 如果另一邊也有人在做網站

不衝突，但要分工清楚：

- 小龍蝦那邊可以負責：正式視覺設計、品牌頁、商品頁、RWD 切版。
- 這個專案負責：LINE Webhook、官方帳號自動回覆、生日資料流程、塔羅/求籤/靈數邏輯、自動化訊息、後台與資料庫。
- 最後整合時，只要把正式網站網址填入 `PUBLIC_BASE_URL`，再把 LINE Developers 的 Webhook URL 指到 `/api/line/webhook`。

請避免兩邊同時改同一份 `index.html`。如果對方做好新版網站，請讓對方提供完整資料夾或 GitHub 連結，再把這裡的 `server.js` 與 LINE 設定接上去。
