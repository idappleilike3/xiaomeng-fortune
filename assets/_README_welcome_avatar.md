# welcome-avatar 圖檔狀態(2026-07-04)

## 歷史
- 2026-07-02 之前:`server.js welcomeFlexMessage()` 參考 `assets/welcome-avatar.png`,但**圖不存在**(破圖)
- 2026-07-04 修復:用小龍蝦 image_generate 工具生成小夢老師頭像,放到 `assets/welcome-avatar.png`

## 圖檔
- 路徑:`assets/welcome-avatar.png`
- 規格:1:1 方形 (小龍蝦生成)
- 風格:深紫背景 `#19142e` + 香檳金袍 + 神聖幾何(梅塔特隆立方體)
- 角色:小夢老師(冥想女性、香檳金袍、月亮額飾)

## server.js fallback 邏輯
```js
const avatarExists = fs.existsSync(avatarPath);
const avatarUrl = avatarExists
  ? "https://xiaomeng-fortune.onrender.com/assets/welcome-avatar.png"
  : null;

// 如果 avatarUrl 為 null,改用 🌙 emoji 取代圖檔位置
```

## LINE OA 後台「歡迎訊息」設定(老闆要做的)

> ⚠️ 這個**不在 GitHub repo 內**,要去 LINE Official Account Manager 後台設定

1. https://manager.line.biz/ → 登入
2. 選擇「小夢神殿」LINE OA
3. 左邊選單 → 「聊天」 → 「歡迎訊息」
4. 開啟「加入好友時的歡迎訊息」
5. 貼上 `line-welcome-message.txt` 的 12 行純文字
6. 儲存

## 雙重歡迎詞說明

| 來源 | 形式 | 何時觸發 |
|---|---|---|
| LINE OA Manager 歡迎訊息 | 純文字 | 加好友瞬間(由 LINE 平台處理) |
| server.js welcomeFlexMessage() | Flex Message(視覺卡片) | server 收到 follow event 時 |
| 「歡迎詞」keyword | Flex Message | 使用者打「歡迎詞」/「加入小夢」 |