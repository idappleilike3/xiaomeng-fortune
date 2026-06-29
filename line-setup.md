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

加入好友歡迎詞由 LINE 官方後台負責，Webhook 的 follow 自動歡迎已關閉，避免使用者收到兩段重複訊息。

如果 LINE 後台顯示「驗證失敗」，先確認 Render 網站醒著，再按一次 Verify。

## 3. LIFF App

重要修正：新的 LIFF App 不能新增在 Messaging API Channel 裡，請改用 LINE Login Channel。

正確路徑：

```text
LINE Developers
→ 同一個 Provider
→ 建立或打開 LINE Login Channel
→ LIFF 分頁
→ Add LIFF app
```

建立 LIFF App 時填：

```text
LIFF app name：小夢老師命盤室
Size：Full
Endpoint URL：https://xiaomeng-fortune.onrender.com
Scopes：profile
Bot link feature：On
```

建立完成後，請把 LIFF ID 或 LIFF URL 貼給我。LIFF ID 通常不是 U 開頭，會類似 `2001234567-AbCdEfGh`。拿到後，我可以把圖文選單與頁面入口改成 LINE 內視窗。

LINE Login Channel 建立頁如果要求法律網址，請填：

```text
隱私權政策網址：https://xiaomeng-fortune.onrender.com/privacy.html
使用條款網址：https://xiaomeng-fortune.onrender.com/terms.html
```

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
{Nickname}，歡迎你來找小夢老師

如果你心裡剛好有一件事想問，可以先回我「求籤」；想看最近的感情、工作或財運，也可以回「塔羅」

第一次來建議先設定生日，之後我就能幫你帶入命盤、生命靈數和每日提醒
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
