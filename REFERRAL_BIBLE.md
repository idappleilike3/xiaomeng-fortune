# REFERRAL_BIBLE.md — 小夢 Fortune Platform
## 分享裂變 + OG Image + 好友邀請

> **版本:** v1.0
> **對齊:** PROJECT_BIBLE v1.5.0 + BUSINESS_ARCHITECTURE v2.0 + SOUL_POINTS_ECOSYSTEM v1.0
> **目的:** 分享裂變 / OG Image / 反作弊 / 推廣等級

---

## 0 設計理念

> **「分享不是推銷,是把祝福傳出去」**

裂變不是「拉人賺錢」,是把占卜的祝福分享給朋友,雙方都得利。

---

## 1 分享 4 大管道

| 管道 | 獎勵 | 限制 |
|---|---|---|
| LINE | +50 SP + 1 次完整牌陣券 | 1 次/日 |
| Facebook | +50 SP | 1 次/日 |
| Twitter | +50 SP | 1 次/日 |
| 複製連結 | +20 SP | 1 次/日 |

---

## 2 分享圖卡(OG Image)

| 元素 | 規格 |
|---|---|
| 標題 | 「今晚,我想尋找什麼答案?」 |
| 配圖 | 用戶占卜結果(牌面 + 1 句解讀) |
| QR Code | 自動生成(連結到小夢神殿) |
| 品牌 | 小夢老師 · Tarot Ritual |
| 尺寸 | 1200 × 630(FB / Twitter 標準) |
| 位置 | `assets/share-card-{spread-id}.png` |

---

## 3 裂變循環(對齊 7:13)

```
A(老會員)→ 分享卡 + 連結給 B
B 點連結 → 註冊 → 自動綁 A 為 referrer
B 首次付費 → A 拿 +200 SP + 5% 回饋
A 拉 10 人 → 解鎖 Lv.5 + 殿堂邀請資格
A 達 Lv.5 → 永久 20% 回饋
```

---

## 4 獎勵結構(對齊 6:55)

| 事件 | 推薦人 | 被推薦人 |
|---|---|---|
| B 註冊 | +50 | +20 |
| B 首次付費 | +200 | +50 |
| B 月訂閱 | +50/月 | — |
| B 拉 C(下線) | +20% C 的回饋 | — |

---

## 5 反作弊(對齊 6:55)

- 同 IP / 裝置指紋 → 拒絕
- 24h 內 5 個推薦 → 人工審核
- 退費 → 撤銷推薦獎勵
- 自我推薦 → 拒絕
- 機器人推薦 → 拒絕(驗證碼)

---

## 6 推廣等級(對齊 SP Ecosystem v1.0)

| 推薦人數 | 獎勵 |
|---|---|
| 推薦 1 人 | +50 SP(被推薦者首次註冊) |
| 推薦 5 人 | 解鎖「分享達人」稱號 |
| 推薦 10 人 | 永久 5% 回饋 + 殿堂邀請資格 |
| 推薦 50 人 | 永久 10% 回饋 + 限定徽章 |
| 推薦 100 人 | 永久 20% 回饋 + 大師調頻免費 |

---

## 7 OG Image 動態生成(技術規格)

### 7.1 服務端

```
GET /api/share-card?spread=tarot-3-card&userId=xxx
  ↓
讀取 user + spread 資料
  ↓
用 Puppeteer / Canvas 生成 PNG
  ↓
return 1200×630 PNG(快取 24h)
```

### 7.2 客戶端 fallback

```
<meta property="og:image" content="https://xiaomeng-fortune.onrender.com/assets/share-card-default.png" />
```

---

## 8 分享按鈕規格

| 按鈕 | 動作 | 規格 |
|---|---|---|
| 🟢 LINE 分享 | 開 LIFF shareTargetPicker | 帶標題 + 描述 + 縮圖 + URL |
| 🔵 Facebook | 開 sharer.php | 同上 |
| ⚪ 複製連結 | Clipboard API | 帶 +execCommand fallback |
| 🐦 Twitter | 開 intent | 同 LINE |

---

## 9 多層下線(MLM 風險評估)

| 層級 | 獎勵 | 風險 |
|---|---|---|
| L1(直接推薦) | +200 SP | 低 |
| L2(下線推薦) | +20% | 中(可能踩法律) |
| L3+ | 不開放 | 高 |

**政策:** 只開放 L1 + L2,L3+ 不做(避免 MLM 法律風險)。

---

## 10 推廣排行榜(對齊 7:13)

| 類型 | 週期 | 獎勵 |
|---|---|---|
| 週推廣王 | 週 | +500 SP + 限定徽章 |
| 月推廣王 | 月 | +2,000 SP + 大師調頻 1 次 |
| 季推廣王 | 季 | 殿堂會員 1 季免費 |

---

## 11 對齊與版本

- 對齊 PROJECT_BIBLE §20
- 取代 BUSINESS_ARCHITECTURE_v2.0 §7
- v1.0 2026-07-02
