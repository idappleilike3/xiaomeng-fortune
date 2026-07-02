# 小夢 Fortune Platform

> **精品靈性 SaaS 平台** — 塔羅 / 寵物 / 神諭 / 星軌 / 靈性成長

[![Version](https://img.shields.io/badge/version-v1.0.0-f5d38b)](PROJECT_BIBLE.md)
[![License](https://img.shields.io/badge/license-Private-7c4dc4)]()
[![LINE](https://img.shields.io/badge/LINE-Official-00C300)](https://line.me/R/ti/p/@471cptxk)

---

## 🌙 專案簡介

**小夢 Fortune Platform** 不是一般塔羅網站。也不是 AI 聊天網站。

是一個結合 **Tarot Ritual / Pet Divination / Oracle Message / Astrology / Spiritual Growth** 的 **精品靈性 SaaS 平台**。

**核心循環:** 探索 → 收藏 → 成長 → 回訪

---

## 📁 專案結構

```
xiaomeng-fortune/
├── index.html                    ← 首頁(4 入口:L1)
├── script.js                     ← 既有 F22 流程(將被 SacredStage 取代)
├── styles.css                    ← 全站樣式
├── server.js                     ← Node.js 後端(LINE webhook / 綠界金流)
├── package.json                  ← Node 依賴
├── render.yaml                   ← Render 部署設定
│
├── lib/                          ← 共用模組
│   ├── sacred-stage-engine.js    ← SacredStage 引擎(11 步編舞,724 行)
│   ├── sse-bridge.js             ← SSE 對接既有音效 / record 系統
│   ├── l2-topics.js              ← L2 主題選擇 SPA
│   ├── user-bar-data.js          ← 頂部會員中心串接
│   ├── spread-library.js         ← 牌陣資料(對齊 9+7+3)
│   ├── divination-system.js      ← 78 牌解讀引擎
│   └── spread-themes/
│       └── _template.js          ← 牌陣主題範本
│
├── assets/                       ← 圖片 / 音樂 / 牌背
│   ├── hero-character.png        ← 角色立繪
│   ├── hero-bgm-mystical.mp3     ← Hero BGM(AI 生成)
│   ├── rich-menu-xiaomeng.png    ← Rich Menu v3 F 版
│   ├── tarot-XX-*.png            ← 22 塔羅
│   ├── pet-XX-*.png              ← 22 寵物
│   └── oracle-*.png              ← 12 神諭
│
├── 7 份獨立規格文件(SSOT):
│   ├── PROJECT_BIBLE.md          ← 總綱(§22 5 Bible 引用)
│   ├── BRAND_BIBLE.md            ← 品牌 / 視覺
│   ├── LINE_SYSTEM.md            ← LINE 平台細節
│   ├── BUSINESS_BIBLE.md         ← 商業模式 / 4 循環
│   ├── UX_BIBLE.md               ← 12 幕分鏡 / IA
│   ├── MEMBERSHIP_BIBLE.md       ← 3 Tier + SP + 月相 6 級
│   ├── COMMERCE_BIBLE.md         ← 9 SKU + 綠界
│   └── REFERRAL_BIBLE.md         ← 分享裂變 + OG Image
│
├── _archive_bibles_2026-07-02/  ← 8 份舊 DRAFT(已封存)
│
├── _SCREENSHOTS_TODO.md         ← 截圖指南(老闆實機)
├── _SCREENSHOTS_REPORT.md       ← 截圖對齊報告(待老闆截完)
│
└── admin.html                    ← 後台(密碼 tarot2026)
```

---

## 🚀 快速開始

### 本地開發

```bash
# 安裝依賴
npm install

# 啟動 server
npm start
# → http://localhost:3000

# 語法檢查
npm run check
# → 驗證 server.js 語法
```

### 部署

自動部署到 Render:
- push 到 main → Render 自動 build + deploy
- 設定 7 個環境變數(Render Dashboard):
  - `LINE_CHANNEL_ACCESS_TOKEN`
  - `LINE_CHANNEL_SECRET`
  - `PUBLIC_BASE_URL`
  - `LIFF_URL`
  - `PORT`
  - `LINE_CHANNEL_ID`(optional)
  - `LIFF_ID`(optional)

---

## 🎯 核心功能

### 已上線(2026-07-02)

| 功能 | 狀態 |
|---|---|
| 首頁 Hero(今晚,你想尋找什麼答案?) | ✅ |
| 4 入口(命運/毛孩/神諭/神殿深處) | ✅ |
| L2 主題選擇(5 顆) | ✅ |
| L3 神殿深處(8 顆) | ✅ |
| 頂部會員中心(👑 等級 + SP) | ✅ |
| 角色立繪 + 生命之花 240s 旋轉 | ✅ |
| Hero BGM(AI 生成 ambient) | ✅ |
| Rich Menu v3 F 版(小夢神殿) | ✅ |
| LINE 歡迎詞(迎星儀式) | ✅ |
| LINE 3 系統靈性導引(命運/毛孩/神諭) | ✅ |
| SacredStage 引擎(11 步編舞) | ✅ |
| Full SSE 整合(取代舊 F22) | ✅ |

### 業務功能(對齊 5 Bible)

| 功能 | 對齊 |
|---|---|
| 3 種訂閱(尊榮/殿堂) | MEMBERSHIP §1 |
| 靈性積分 SP 系統 | MEMBERSHIP §3 |
| 月相 6 級探索等級 | MEMBERSHIP §6 |
| 命運市集商城 | COMMERCE §1 |
| 9 SKU 商品 | COMMERCE §2 |
| 滿 599 折抵 50 積分 | COMMERCE §3(老闆硬規則)|
| 分享裂變 + OG Image | REFERRAL §1-§2 |
| 5 種儲值包 | COMMERCE §2(7:57)|

---

## 🎵 音效系統(對齊 BRAND_BIBLE §17)

### 12 個音效

| 音效 | 觸發時機 | 檔名 |
|---|---|---|
| Opening | 進入 SacredStage | `f22-opening.mp3` |
| Shuffle | 開始洗牌 | `f22-shuffle.mp3` |
| Cut | 切牌瞬間 | `f22-cut.mp3` |
| Fan | 展牌扇形 | `f22-fan.mp3` |
| Hover | 滑鼠懸停牌卡 | `f22-hover.mp3` |
| Select | 點擊選牌 | `f22-select.mp3` |
| Flip | 翻牌動畫 | `f22-flip.mp3` |
| Complete | 解讀完成 | `f22-complete.mp3` |
| Blessing | 今日祝福 | `f22-blessing.mp3` |
| Tarot BGM | 塔羅系統背景 | `bgm-tarot.mp3` |
| Pet BGM | 寵物系統背景 | `bgm-pet.mp3` |
| Oracle BGM | 神諭系統背景 | `bgm-oracle.mp3` |

### Hero BGM(已上線)

`assets/hero-bgm-mystical.mp3` — AI 生成 2 分鐘 ambient,60 BPM,神聖神殿氛圍。

### 音量規範

- BGM: 0.3(最輕)
- 主音效: 0.4-0.6
- Hover 音效: 0.25

---

## 📐 7 份獨立 Bible(SSOT)

任何修改必須先更新對應 Bible,再開始 Coding。

| 文件 | 章節 |
|---|---|
| [PROJECT_BIBLE.md](PROJECT_BIBLE.md) | 總綱(§22 5 Bible 引用) |
| [BRAND_BIBLE.md](BRAND_BIBLE.md) | 品牌 / 視覺 |
| [LINE_SYSTEM.md](LINE_SYSTEM.md) | LINE 平台細節 |
| [BUSINESS_BIBLE.md](BUSINESS_BIBLE.md) | §0-§8 商業模式 |
| [UX_BIBLE.md](UX_BIBLE.md) | §0-§7 使用者流程 |
| [MEMBERSHIP_BIBLE.md](MEMBERSHIP_BIBLE.md) | §0-§10 會員 / SP / 等級 |
| [COMMERCE_BIBLE.md](COMMERCE_BIBLE.md) | §0-§10 商城 / 金流 |
| [REFERRAL_BIBLE.md](REFERRAL_BIBLE.md) | §0-§11 分享 / 裂變 |

**修改流程:**
1. 查對應 Bible 章節
2. 更新 Bible → commit
3. 才開始改 code
4. commit code 引用 Bible 章節

---

## 🔧 技術棧

- **Frontend:** Vanilla JS(無框架)+ ES Modules
- **CSS:** 原生 CSS(無預處理器)
- **Backend:** Node.js 18+(`http` 內建模組)
- **Deploy:** Render
- **LINE:** Messaging API + LIFF
- **Payment:** 綠界 ECPay(待串接)
- **Auth:** LIFF + email(待串接)
- **DB:** PostgreSQL(待串接,目前用 localStorage)

---

## 📊 規格書索引

| 文件 | 行數 | 對齊 |
|---|---|---|
| PROJECT_BIBLE.md | ~1500 | 總綱 |
| BRAND_BIBLE.md | ~600 | 視覺 |
| LINE_SYSTEM.md | ~900 | LINE |
| BUSINESS_BIBLE.md | ~200 | 商業 |
| UX_BIBLE.md | ~250 | UX |
| MEMBERSHIP_BIBLE.md | ~250 | 會員 |
| COMMERCE_BIBLE.md | ~200 | 商城 |
| REFERRAL_BIBLE.md | ~150 | 分享 |
| **總計** | **~4,250 行** | 7 份 Bible |

---

## 🆘 疑難排解

### 看不到新版本

```bash
# 強制重整瀏覽器
Ctrl + Shift + R(Windows/Linux)
Cmd + Shift + R(Mac)
```

### Render 部署失敗

1. 看 Render Dashboard → service → Events
2. 看 build log 找錯誤
3. 確認 7 個環境變數都設對

### LINE 收不到歡迎詞

1. 確認 2 個 env(LINE_CHANNEL_ACCESS_TOKEN + SECRET)有設
2. 確認 webhook URL:`{PUBLIC_BASE_URL}/api/line/webhook`
3. LINE Developers Console → Webhook 設定對

### 角色立繪 / Hero BGM 沒顯示

1. 確認 `assets/hero-character.png` + `assets/hero-bgm-mystical.mp3` 存在
2. 強制重整瀏覽器

---

## 📝 License

Private — 蝦董 / 龍蝦團隊 / 小夢老師 共同持有

未經授權不得複製 / 修改 / 散布

---

## 🌙 聯絡

- LINE 官方帳號: [@471cptxk](https://line.me/R/ti/p/@471cptxk)
- 網站: [xiaomeng-fortune.onrender.com](https://xiaomeng-fortune.onrender.com)
- 維護者: 蝦董 / 龍蝦團隊 / 小夢老師

---

**小夢老師** · 願你的星軌此刻清晰
