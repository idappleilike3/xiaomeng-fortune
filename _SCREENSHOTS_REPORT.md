# Screenshots Report v1.0
## 4 尺寸驗證報告 · 對齊老闆 11:54 截圖需求

> **狀態:** 🟡 待老闆實機截圖(2026-07-02 20:35)
> **狀態:** 等老闆截完圖後,我幫對齊驗證

---

## 0 自動驗證(已過)

```
✅ _sync_check.py 5/5 通過(commit bf10827)
✅ web_fetch 確認 200 OK
✅ 網站 title 正確:「小夢老師｜塔羅命盤療癒室」
✅ 16 個 @media breakpoint
✅ 必要檔案齊全(index.html / styles.css / script.js / admin.html / privacy.html / terms.html)
✅ 牌卡資產完整(pet 23/22 + tarot 22/22)
```

---

## 1 老闆實機截圖步驟

### 1.1 用 Chrome DevTools(推薦)

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

### 1.2 實際裝置(更準)

```
1. iPhone Safari → 開網址
2. 全頁截圖(Safari 完整頁面)
3. 重複 iPad / MacBook / Desktop
4. AirDrop / iCloud 傳回電腦
```

---

## 2 4 尺寸驗證清單

### 2.1 380 × 667(iPhone SE)

| 項目 | 預期 | 結果 |
|---|---|---|
| Hero 主標「今晚,你想尋找什麼答案?」不切邊 | ✅ | ☐ |
| 4 入口(命運/毛孩/神諭/神殿深處)堆疊為 1 列 | ✅ | ☐ |
| 頂部 Topbar 收合(只顯示 👤 🔔 icon) | ✅ | ☐ |
| Hero BGM 用戶首次互動後播放 | ✅ | ☐ |
| 角色立繪縮小並淡出(opacity 0.55) | ✅ | ☐ |
| 生命之花 360s 旋轉(減速) | ✅ | ☐ |

### 2.2 720 × 1024(iPad)

| 項目 | 預期 | 結果 |
|---|---|---|
| Hero 主標 + 副標 + CTA + 4 入口完整可見 | ✅ | ☐ |
| 4 入口切 5 列 grid | ✅ | ☐ |
| 頂部用戶列顯示 tier + SP(完整) | ✅ | ☐ |
| L2 主題 5 顆並排(等寬) | ✅ | ☐ |

### 2.3 1200 × 800(筆電)

| 項目 | 預期 | 結果 |
|---|---|---|
| Hero 完整 + 角色立繪在右側 | ✅ | ☐ |
| 4 入口 5 列 grid,中央偏左 | ✅ | ☐ |
| L2 主題 5 顆並排(完整) | ✅ | ☐ |
| L3 神殿深處 4 列 grid(完整) | ✅ | ☐ |
| 頂部用戶列 + Topbar 完整 | ✅ | ☐ |

### 2.4 1920 × 1080(桌機)

| 項目 | 預期 | 結果 |
|---|---|---|
| Hero 完整 + 角色立繪在右側 65vh | ✅ | ☐ |
| 4 入口 5 列 grid | ✅ | ☐ |
| L2 主題 5 顆並排 | ✅ | ☐ |
| L3 神殿深處 4 列 grid | ✅ | ☐ |
| 整體設計(精品靈性品牌) | ✅ | ☐ |

---

## 3 老闆截完圖後的動作

把 4 張 PNG 放進 `_screenshots/` 資料夾,命名:

```
_screenshots/
├── 380x667-iphone.png
├── 720x1024-ipad.png
├── 1200x800-laptop.png
└── 1920x1080-desktop.png
```

老闆貼到 chat 給我看,我幫:
1. 對齊驗證清單(每張 6 個項目)
2. 寫完整 `_SCREENSHOTS_REPORT.md`
3. 標出需要修的項目
4. 進 git(對齊 RWD baseline)

---

## 4 截圖已知對齊規範(對齊 PROJECT_BIBLE §23)

| 對齊 | 規範 |
|---|---|
| RWD 4 尺寸 | PROJECT_BIBLE §23 |
| 380 breakpoint | styles.css `(max-width: 380px)` |
| 720 breakpoint | styles.css `(max-width: 720px)` |
| 1200 breakpoint | styles.css `(min-width: 1200px)` |
| Hero BGM 自動播放 | lib/sse-bridge.js + lib/sse-bridge.js(2026-07-02 11:24) |
| 生命之花 240s 旋轉 | styles.css `hero-flower-rotate` |
| 角色立繪漂浮 | styles.css `hero-character-float` |

---

## 5 截圖後續行動

| 項目 | 動作 |
|---|---|
| ✅ 自動驗證已過 | `_sync_check.py` 5/5 |
| ⏳ 實機截圖 | 老闆 DevTools 或實機 |
| ⏳ 截圖對齊 | 我對照清單 1 個 1 個驗 |
| ⏳ RWD baseline 進 git | 截圖 OK 後 commit `_screenshots/` |
| ⏳ 報告寫入 PROJECT_BIBLE §23 | 對齊結果 |

---

**老闆,截圖後貼來,我幫對齊。** 📸
