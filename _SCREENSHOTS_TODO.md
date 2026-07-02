# Screenshots TODO v1.0

> **狀態:** 待老闆實機截圖(2026-07-02 12:13)
> **原因:** 工具無 headless browser,需手動操作

## 4 尺寸清單

| 尺寸 | 設備 | 驗證項目 | 狀態 |
|---|---|---|---|
| 380 × 667 | iPhone 直 | Hero 文案 / 4 入口堆疊 / Topbar 收合 | ⏳ |
| 720 × 1024 | iPad 直 | Hero + 4 入口 1 列 / L2 收合 | ⏳ |
| 1200 × 800 | 筆電 | Hero + 4 入口 5 列 / L2 完整 | ⏳ |
| 1920 × 1080 | 桌機 | Hero + 4 入口 5 列 / L2 + L3 完整 | ⏳ |

## 老闆如何截圖

### 方法 A:瀏覽器 DevTools(推薦)

```
1. 開 Chrome → https://xiaomeng-fortune.onrender.com
2. F12 開 DevTools
3. 左上「Toggle device toolbar」(Ctrl+Shift+M)
4. 選尺寸(下拉選單):
   - iPhone SE(375×667)
   - iPad(768×1024)
   - Laptop(1280×800)
   - Desktop(1920×1080)
5. 截圖:右上 ⋮ → Capture screenshot
6. 存 PNG 對應到 _screenshots/ 資料夾
```

### 方法 B:實際裝置(更準)

```
1. iPhone Safari → 開網址
2. 全頁截圖(Safari 完整頁面)
3. 重複 iPad / MacBook / Desktop
4. AirDrop / iCloud 傳回電腦
```

## 驗證清單

| 項目 | 380 | 720 | 1200 | 1920 |
|---|---|---|---|---|
| Hero 主標不切邊 | ☐ | ☐ | ☐ | ☐ |
| 4 入口可見(命運/毛孩/神諭/神殿深處) | ☐ | ☐ | ☐ | ☐ |
| 角色立繪不擋文字 | ☐ | ☐ | ☐ | ☐ |
| 頂部用戶列正確顯示 | ☐ | ☐ | ☐ | ☐ |
| L2 5 顆主題可見 | n/a | ☐ | ☐ | ☐ |
| L3 8 顆 L3 入口可見 | n/a | n/a | ☐ | ☐ |
| 生命之花 240s 旋轉(可看見的話) | ☐ | ☐ | ☐ | ☐ |

## 自動驗證(已做)

```
✅ _sync_check.py 5/5 通過(commit bf10827 後)
✅ web_fetch 確認 200 OK + 正確 title
```

## 截圖後

老闆截完圖,把 PNG 放進 `_screenshots/` 資料夾,我幫你:
1. 寫 `_SCREENSHOTS_REPORT.md`(對齊)
2. 檢查每張是否合格
3. 標出需要修的
4. 進 git(對齊 RWD baseline)
