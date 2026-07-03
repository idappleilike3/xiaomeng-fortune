# 🔍 小夢神殿 — LINE + 首頁 Audit Report

> **對象**:首頁(`index.html`)、圖文選單(`line-rich-menu-config.json`)、歡迎詞(`line-welcome-message.txt`)
> **對齊基準**:PROJECT_BIBLE v1.2.0 / BRAND_BIBLE v1.0.0 / LINE_SYSTEM v1.0.0
> **價格基準**:老闆 2026-07-04 04:00 統整(MEMORY.md)
> **Audit 日期**:2026-07-04 05:08

---

## 🚨 P0 重大發現(必須修正)

### ❌ 發現 1:`line-welcome-message.txt` 過時 26 小時
- **最後更新**:2026/7/1 04:14(聖經前)
- **問題**:
  - 沒自我介紹小夢老師
  - 沒神殿世界觀
  - 沒引導註冊/登入
  - 沒提到 50 靈性積分、首次免費 1 次
  - 用「**求籤**」(錯誤)— 應為「**命運之門**」/「**命運塔羅**」
  - 完全沒套用 LINE_SYSTEM §1.1 迎星儀式歡迎詞
- **修正**:✅ **已重寫**,嚴格對齊 LINE_SYSTEM §1.1

### ❌ 發現 2:`index.html` 價格 **完全沒對齊** 老闆 2026-07-04 訂價
- **現狀**(unlock-grid 第 780-820 行):
  - 簡易解析 **$0** ← 舊版
  - 單次深度解析 **$99** ← 舊版
  - 靈感點數包 **300 點** ← 舊版
- **應為**(老闆 2026-07-04 04:00 統整):
  - ❌ 刪除:簡易 $0、單次深度 $99、點數包 300 點
  - ❌ 刪除:一對一命盤諮詢(商品卡)
  - ✅ 新增:命運塔羅 NT$99
  - ✅ 新增:感情關係 NT$199
  - ✅ 新加:財富豐盛 NT$199
  - ✅ 新增:尊榮會員訂閱 NT$399/月
  - ✅ 新增:殿堂大師訂閱 NT$999/月(主推)
  - ✅ 新增:大師調頻券 NT$3,600
  - ✅ 新增:節日限定流年 NT$599
- **修正**:✅ **已重寫 unlock-grid + membership-bar**

### ❌ 發現 3:`membership-bar` 會員等級 **沒寫價格**
- **現狀**:
  ```html
  <span class="tier-chip tier-member" data-tier="member">🔒 尊榮會員</span>
  <span class="tier-chip tier-premium" data-tier="premium">🔐 殿堂大師</span>
  ```
- **應為**:加上 `NT$399/月` / `NT$999/月`
- **修正**:✅ **已補上**

---

## 🟡 P1 中等發現(規格衝突 / Spec Drift)

### ⚠️ 發現 4:`line-rich-menu-config.json` 與 LINE_SYSTEM §3.2 不一致

| # | 聖經 §3.2 規格 | 實際 config | 狀態 |
|---|---|---|---|
| 1 | 命運之門 · 塔羅 | 命運塔羅 | ⚠️ 名稱略不同,但可接受 |
| 2 | 寵物占卜 · 靈魂解碼 | 毛孩心語 | ⚠️ 名稱略不同,但可接受 |
| 3 | 神諭訊息 · 今日祝福 | 今日神諭 | ⚠️ 名稱略不同,但可接受 |
| 4 | 靈性收件匣 · 命運紀錄 → inbox.html | 命運市集 → page=market | ❌ **結構衝突** |
| 5 | 靈性收益 · 50 積分 → 錢包頁 | 我的收藏 → page=favorites | ❌ **結構衝突** |
| 6 | 加入小夢 · 歡迎詞 → 重新觸發 | 大師調頻 → page=master | ❌ **結構衝突** |

**根因分析**:
- `line-rich-menu-config.json` 最後更新 2026/7/2 06:33
- LINE_SYSTEM §3.2 規格定稿 2026/7/2 06:59(晚 26 分鐘)
- 也就是 **聖經定義 §3.2 之前,config 就寫好了**,所以沒對齊

**建議**(待老闆決定):
- **方案 A**:保留實際 config,聖經 §3.2 改為對齊實際(改文件)
- **方案 B**:實際 config 改為對齊聖經,但需要 server.js 新增 `?page=inbox / wallet / welcome` 路由
- **方案 C**:兩者並存,聖經規格是「理想目標」,config 是「現況」

**本次處理**:
- ⚠️ **不動 config**(實際運行的東西,不能亂動)
- 標記在 §19 spec drift 索引,等老闆決定

---

## ✅ 已對齊聖經的部分(不要動)

### ✅ 發現 5:`index.html` 結構完整
- Opening Experience 8 階段(§21.1)✅
- Hero + 神女主視覺 ✅
- 22 張大阿爾克那 v3.0 ✅
- L3 神殿深處 8 個高階功能 ✅
- 12 視覺元素(深紫 `#19142e` / 香檳金 `#f5d38b` / 神女 / 光粒子)✅
- 命名公約:用「命運塔羅 / 毛孩心語 / 今日神諭」沒用 BOT ✅
- 靈性收件匣(✉ Icon)+ 靈性收益錢包(✨ Icon)✅
- BGM 播放器(3 種神聖神殿/宇宙蒼穹/古老儀式)✅
- 信任區塊(隱私 / 法律 / 寵物醫療警語)✅
- 大師後台(靈魂會員 / 深度解析 / 靈性積分 / 聖物選品 4 大 metrics)✅
- 聖物選品(月光石 / 雪松 / 韋特塔羅)✅

### ✅ 發現 6:F30 三大占卜系統卡 對齊聖經
- 塔羅探索:免費體驗 × 1 次 ✅
- 毛孩心語:尊榮會員 · 消費解鎖 ✅
- 今日神諭:免費體驗 × 1 次 ✅
- 全部使用「神諭之門」/「靈魂之門」/「命運之門」命名 ✅

### ✅ 發現 7:share-row 靈性積分激勵 對齊 LINE_SYSTEM §8
- 「分享好友得 50 靈性積分(7 天效期,每日 1 次)」✅
- LINE / Facebook / 複製連結 三管道 ✅
- 額外抽牌計數 ✅

### ✅ 發現 8:server.js API 完整性
- `/api/line/webhook`(LINE webhook)✅
- `/api/line/push-preview`(推播預覽)✅
- `/api/member/wallet`(錢包)✅
- `/api/member/share-reward`(分享獎勵)✅
- `/api/payment/plans`(消費方案)✅
- `/api/payment/ecpay/create`(ECPay)✅
- `/api/admin/summary`(後台)✅
- 支援 `?page=` 參數(用於 rich menu 導流)✅

---

## 📋 修正項目總覽

| # | 檔案 | 修正內容 | 狀態 |
|---|---|---|---|
| 1 | `line-welcome-message.txt` | 重寫為 LINE_SYSTEM §1.1 規格 | ✅ 已完成 |
| 2 | `index.html` unlock-grid | 改為老闆 2026-07-04 訂價 6+2 卡 | ✅ 已完成 |
| 3 | `index.html` membership-bar | 加 NT$399 / NT$999 月費標籤 | ✅ 已完成 |
| 4 | `line-rich-menu-config.json` | spec drift §3.2 vs 實際 | ⚠️ 待老闆決定 |

---

## 🎯 後續建議(待老闆決定)

1. **Rich Menu spec drift**(發現 4)— 三選一
2. **Pet 19-21 牌**(鹿/鯨/龜)— 還沒做
3. **LINE 推播實測** — webhook 已寫,但需要真實 LINE OA 測試
4. **ECPay 串接** — API 已寫,MerchantID 已申請,但 production 環境未驗證
5. **Render deploy** — webhook URL `xiaomeng-bot.onrender.com/api/line/webhook` 是否已部署?

---

**Audit 完成**:2026-07-04 05:08
**執行者**:小龍蝦 🦞(OpenClaw main session)