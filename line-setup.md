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

加入好友時，Webhook 會自動送出一段歡迎文字與聊天內功能選單卡。即使手機端暫時看不到底部圖文選單，使用者也能直接點卡片進入內頁。

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

目前已建立：

```text
LIFF ID：2010549494-KRb0mn7U
LIFF URL：https://liff.line.me/2010549494-KRb0mn7U
shareTargetPicker：建議開啟，用於分享今日運勢、分享後多抽一次、邀請好友送點數
```

LINE Login Channel 建立頁如果要求法律網址，請填：

```text
隱私權政策網址：https://xiaomeng-fortune.onrender.com/privacy.html
使用條款網址：https://xiaomeng-fortune.onrender.com/terms.html
```

## 4. Rich Menu 建議

六格按鈕：

```text
設定生日 -> https://liff.line.me/2010549494-KRb0mn7U?page=profile
塔羅抽牌 -> https://liff.line.me/2010549494-KRb0mn7U?page=demo
求籤 -> https://liff.line.me/2010549494-KRb0mn7U?page=demo
生命靈數 -> https://liff.line.me/2010549494-KRb0mn7U?page=demo
命盤 -> https://liff.line.me/2010549494-KRb0mn7U?page=profile
命運市集 -> https://liff.line.me/2010549494-KRb0mn7U?page=market
```

這樣使用者從 LINE 點按鈕時，會在 LINE 內頁開啟，不會跳成一般外部網頁。

已新增可用素材與工具：

```text
圖文選單圖片：assets/rich-menu-xiaomeng.png
圖文選單設定：line-rich-menu-config.json
產生圖片指令：npm run rich-menu:image
用 API 建立並設成預設：npm run rich-menu:setup
```

如果用 LINE 官方後台手動設定：

```text
1. LINE Official Account Manager
2. 圖文選單
3. 建立新的圖文選單
4. 選大型 3 欄 x 2 列版型
5. 上傳 assets/rich-menu-xiaomeng.png
6. 六格動作全部選「連結」
7. 貼上上方六個 LIFF URL
8. 儲存後設為啟用中的圖文選單
```

舊圖文選單處理方式：

```text
1. 不要急著全部刪除。
2. 先把舊圖文選單取消預設，或將新版設定成預設。
3. 用自己的 LINE 帳號測試新版按鈕是否都能正常開啟。
4. 確認新版穩定後，再把不會用到的舊圖文選單下架或刪除。
```

如果舊選單裡有舊商品連結、舊價格、舊活動、錯誤導購，建議下架；如果只是備用設計，可以先保留但不要設為預設。

## 5. 歡迎詞

現在建議以 Webhook 歡迎卡為主，LINE 官方後台歡迎詞可以關閉或只留很短一句，避免重複。

```text
{Nickname}，歡迎你來找小夢老師

如果你心裡剛好有一件事想問，可以點下方選單的「求籤」。

想看最近的感情、工作或財運，就點「塔羅」先抽一張牌。

第一次來，建議先點「生日」設定資料。之後我就能幫你帶入命盤、生命靈數和每日提醒。
```

同一份文字也放在 `line-welcome-message.txt`，方便直接複製到 LINE 官方後台。

Webhook 自動回覆規則：

```text
加好友 -> 歡迎文字 + 聊天內功能選單卡
輸入「塔羅」 -> 直接抽一張牌，並給深度解析入口
輸入「求籤」 -> 不直接給籤詩，先開求籤內頁讓使用者輸入問題
輸入「生日 / 命盤 / 靈數 / MBTI / 市集」 -> 導到對應 LIFF 內頁
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
