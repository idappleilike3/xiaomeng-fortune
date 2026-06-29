# LINE 官方帳號設定表

正式網站：

```text
https://xiaomeng-fortune.onrender.com
```

正式 Webhook：

```text
https://xiaomeng-fortune.onrender.com/api/line/webhook
```

## 1. 聊天回應方式

在 LINE Official Account Manager 的「聊天的回應方式」建議設定：

```text
回應時間：開啟
回應時間內：手動聊天 + 自動回應訊息
非回應時間：自動回應訊息
Webhook：開啟
```

這樣你可以保留真人回覆，也能讓使用者輸入「塔羅」「求籤」「靈數」時自動得到服務。

## 2. LINE Developers 必開項目

Messaging API：

```text
Use webhook：開啟
Webhook URL：https://xiaomeng-fortune.onrender.com/api/line/webhook
Auto-reply messages：測試期建議關閉或只保留簡短引導
Greeting messages：可開啟
```

如果 LINE 後台顯示「驗證失敗」，先確認 Render 網站醒著，再按一次 Verify。

## 3. LIFF App

建立 LIFF App 時填：

```text
LIFF app name：小夢老師命盤室
Size：Full
Endpoint URL：https://xiaomeng-fortune.onrender.com
Scopes：profile
Bot link feature：On
```

建立完成後，請把 LIFF ID 貼給我。拿到 LIFF ID 後，我可以把網頁改成在 LINE 裡自動讀取使用者基本資料，並把「設定生日」做成 LINE 內視窗。

## 4. Rich Menu 建議

六格按鈕：

```text
設定生日 -> https://xiaomeng-fortune.onrender.com/#profile
塔羅抽牌 -> https://xiaomeng-fortune.onrender.com/#demo
求籤 -> 傳送文字：求籤
生命靈數 -> https://xiaomeng-fortune.onrender.com/#demo
命盤 -> https://xiaomeng-fortune.onrender.com/#profile
命運市集 -> https://xiaomeng-fortune.onrender.com/#market
```

如果使用 LIFF，前四個網址之後會換成 LIFF URL。

舊圖文選單處理方式：

```text
1. 不要急著全部刪除。
2. 先把舊圖文選單取消預設，或將新版設定成預設。
3. 用自己的 LINE 帳號測試新版按鈕是否都能正常開啟。
4. 確認新版穩定後，再把不會用到的舊圖文選單下架或刪除。
```

如果舊選單裡有舊商品連結、舊價格、舊活動、錯誤導購，建議下架；如果只是備用設計，可以先保留但不要設為預設。

## 5. 歡迎詞

```text
歡迎光臨，我是小夢老師。

第一次來，先設定生日與出生資料，我會用來整理你的生命靈數、命盤方向與每日提醒。

資料只用於你的個人解析，不會公開顯示。

你可以先試試：
塔羅
求籤
靈數 1996-08-18
命盤

設定生日：
https://xiaomeng-fortune.onrender.com/#profile
```

## 6. 我可以幫你做什麼

我可以直接幫你做：

```text
Webhook 程式
LINE 自動回覆內容
LIFF 網頁串接
Rich Menu 圖文與設定 JSON
求籤、塔羅、靈數流程
付費解鎖文案與漏斗
```

需要你提供或親自操作：

```text
LINE 官方後台登入與權限確認
LIFF ID
Rich Menu 圖片上傳或授權 API 操作
付款平台商家資料
```
