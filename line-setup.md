# LINE Messaging API 啟用指南

## 在 Render Dashboard 設定環境變數

到 https://dashboard.render.com/web-services → 選 `xiaomeng-bot` (或 `xiaomeng-fortune`) → Environment 標籤 → 加這 2 個 `Secret` 變數:

```
LINE_CHANNEL_ACCESS_TOKEN = (從 LINE Developers Console 取得)
LINE_CHANNEL_SECRET = (從 LINE Developers Console 取得)
```

### 怎麼取得這兩個值

1. 到 https://developers.line.biz/console/
2. 選 Provider (你之前建立小夢塔羅師的 Provider)
3. 選 Channel (Messaging API channel)
4. **Channel access token (long-lived)**: 「Messaging API」標籤 → 滾到底 → Issue → 複製
5. **Channel secret**: 「Basic settings」標籤最下面

### 部署 webhook URL(在 LINE Developers Console)

1. 「Messaging API」標籤 → **Webhook URL** 設為:
   ```
   https://xiaomeng-bot.onrender.com/api/line/webhook
   ```
2. **Use webhook**: 開啟
3. **Channel access token (long-lived)**: 已 Issue

### 驗證部署成功

```bash
curl https://xiaomeng-bot.onrender.com/health
```

應該回:
```json
{"ok":true,"service":"fortune-line-web","webhook":"https://xiaomeng-bot.onrender.com/api/line/webhook"}
```

如果 `ok: true` 表示 server 在跑,token 設定生效。

### 測試發信(用前端)

1. 開 https://xiaomeng-fortune.onrender.com
2. 進站填 Onboarding(暱稱 + 生日)
3. 從 LIFF 進入(`https://liff.line.me/2010549494-KRb0mn7U`)
4. LIFF 會自動帶 userId 給前端
5. 點入口 3 → 填信 → 提交
6. 前端 fetch → server `/api/letter/schedule` → 若有 token,push 到 LINE 聊天室
7. 若無 token,fallback 到 localStorage + 顯示 in-app modal

## OpenAI 圖像 token(等 server 恢復自動跑)

OpenAI API 設定在 Render env:
```
OPENAI_API_KEY = (從 https://platform.openai.com/api-keys 取得)
```

目前 OpenAI server overload 中(`request timed out`),22 張大牌的剩 14 張會在 server 恢復後自動 retry。

## 後台管理系統 admin.html(給大師用)

### 入口網址
打開瀏覽器輸入:

```
https://xiaomeng-fortune.onrender.com/admin.html?admin=1
```

(網址一定要帶 `?admin=1`,否則會直接卡在閘門)

### 進入步驟(3 步)
1. 開上面的網址
2. 看到「🔒 靈魂後台」密碼輸入框,輸入密碼
3. 按「進入後台」就會看到 7 大模組儀表板

### 密碼
**密碼: `tarot2026`**(寫死在 `admin.html` JS 第 341 行)

⚠️ **正式上線前務必改這個值**:
- 用編輯器打開 `admin.html`
- 找到 `const ADMIN_PASSWORD = "tarot2026";`
- 改成你自己的密碼
- 改完 `git add admin.html && git commit -m "admin: change password" && git push`

### 安全特性
- sessionStorage 8 小時內免重複輸入密碼
- 不輸入 `?admin=1` 的人直接看不到任何後台內容
- 沒有任何 URL 路徑暴露後台存在(`/admin.html` 連結只出現在首頁 footer 的「⚙️ 後台管理」紅色按鈕,**只給大師本人點**)

### 7 大模組(進入後可看)
1. **📊 總覽儀表板** — KPI 卡: 靈魂會員 / 占卜解讀 / 深度解鎖 / 聖物點擊 / 靈性積分總額
2. **👥 靈魂會員** — 會員列表 + 搜尋 + 編輯 + 刪除 + 匯出 CSV
3. **🃏 占卜解讀紀錄** — 4 系統(塔羅/毛孩/神諭)分頁查閱
4. **📜 深度解析排版工具** — 7 大情境 prompt 編輯器(毛孩心語用)
5. **✨ 靈性積分 / 599 折抵** — 點數 ledger + KPI(總發放/已折抵/活躍持有人)
6. **💎 聖物選品點擊** — 商品點擊排行 + URL 管理
7. **⚖️ 法律與隱私** — privacy.html + terms.html 開啟 / 用戶同意書狀態

---

## ECPay 金流(等上線前設定)

到 https://www.ecpay.com.tw → 商戶後台:
- MerchantID
- HashKey
- HashIV

加入 Render env 後,`/api/payment/ecpay/create` endpoint 會真實啟動。
