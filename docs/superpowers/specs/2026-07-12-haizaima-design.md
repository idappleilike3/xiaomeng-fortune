# 還在嗎（HaiZaiMa）— 產品設計規格

**日期：** 2026-07-12  
**狀態：** 待實作  
**產品名：** 還在嗎  
**英文／專案代號：** `haizaima`  
**實作位置：** 獨立新專案（不掛在 xiaomeng-fortune 業務裡；本規格暫存於此 repo 的 docs）

---

## 1. 目標與定位

個人安全守護工具：使用者定期在 LINE 簽到；超過自訂寬限時間未簽到時，通知緊急聯絡人。

- **不是** 緊急救援／報警服務
- **不是** 定位追蹤或健康監測
- **避免**「我死了嗎／死了么」命名（市場已有爆紅產品 Demumu／死了么，且名稱爭議大）

成功標準（第一期）：

1. 使用者可透過 LINE Bot 或 LIFF 完成簽到  
2. 逾期時能真實寄出 **簡訊（電話）與／或 Email** 給緊急聯絡人  
3. 訂閱用戶能收到 LINE 到期前提醒  
4. 免費／訂閱權限在後端強制執行  
5. 訂閱金流走 **藍新 NewebPay**

---

## 2. 範圍

### 第一期（必做）

| 項目 | 說明 |
|------|------|
| LINE Bot 簽到 | 按鈕／postback／關鍵字「還在」「簽到」 |
| LIFF 簽到與設定 | 大按鈕簽到、寬限、聯絡人、訂閱入口 |
| LINE Login | 加好友／開 LIFF 即綁帳號 |
| 簡訊逾期通知 | 聯絡人手機必填；免費與訂閱皆有（三竹／Every8d 等閘道，實作擇一） |
| Email 逾期通知 | Resend（或同等）；Email 選填，有填且驗證後一併寄 |
| LINE 提醒本人 | **僅訂閱**；到期前 Push |
| 聯絡人 LINE 通知 | **僅訂閱**；對方已加 OA 且綁定時優先 LINE，否則簡訊（＋Email 若有） |
| 訂閱金流 | **藍新 NewebPay** 網頁／LIFF 結帳（信用卡等） |
| 假期暫停 | **僅訂閱**；設定結束日前不計時、不提醒、不告警 |
| 排程 | Vercel Cron 掃描逾期與提醒 |
| 警報去重 | 同一逾期週期、每位聯絡人只告警一次；簽到後重置 |

### 明確不做（第一期）

- 原生 iOS／Android App（之後可做）
- PWA 加到主畫面（之後；架構預留同一 LIFF 網頁）
- Google／Apple 登入（之後）
- 親屬儀表板／雙人守護帳號
- 語音電話撥打、即時定位
- 廣告

### 之後（第二期＋）

- PWA／原生 App 備援簽到
- Google／Apple 登入
- 親屬檢視頁（原方案 C）
- 更長簽到歷史、多語系

---

## 3. 商業模式

**免費＋訂閱（Freemium）**

| 能力 | 免費 | 訂閱 |
|------|------|------|
| Bot／LIFF 簽到 | ✅ | ✅ |
| 寬限時間 12–72 小時 | ✅ | ✅ |
| 緊急聯絡人 | 1 位（**手機必填**；Email 選填） | 最多 3 位 |
| 逾期通知聯絡人 | **簡訊**（＋已驗證 Email） | 有綁 LINE → 優先 LINE；否則簡訊（＋Email） |
| 到期前提醒本人 | ❌ | ✅ LINE Push |
| 假期暫停 | ❌ | ✅ |
| 簽到紀錄 | 最近幾次 | 可較長（可後做） |

**建議定價（可調）：** 月費約 NT$79，或年費約等同 10 個月。  
**收款：** 網頁／LIFF 開結帳頁，金流為 **藍新 NewebPay**（不做 Stripe／綠界）。

**成本意識：** LINE Messaging API 推播計入官方帳號訊息額度；簽到確認盡量用 Reply。免費層不推 LINE 提醒，以控制成本。

---

## 4. 架構

**推薦堆疊：**

- Next.js（App Router）部署於 Vercel  
- Postgres（Neon）  
- LINE Messaging API（Webhook）＋ LIFF  
- LINE Login（第一期唯一登入）  
- Resend（Email，選用）  
- 簡訊閘道（三竹 Mitake 或 Every8d，實作擇一）  
- 金流：**藍新 NewebPay**  
- Vercel Cron（每 5–15 分鐘）  

```
LINE App ──Webhook──► Next.js API ──► Postgres
                │
LIFF 頁面 ◄─────┘
                │
         Cron ──┼──► 逾期掃瞄 ──► SMS / Email / LINE Push
                │
         藍新回傳／Notify ──► subscriptions
```

不採用：長駐 VPS Bot（第一期）、第三方對話平台當核心邏輯。

---

## 5. 資料模型

### `users`

- `id`（uuid）
- `lineUserId`（unique）
- `displayName`
- `pictureUrl`（optional）
- `graceHours`（default 36）
- `lastCheckInAt`
- `vacationUntil`（nullable；訂閱功能）
- `plan`：`free` | `pro`
- `planExpiresAt`（nullable）
- `botBlocked`（boolean）
- `createdAt` / `updatedAt`

### `emergency_contacts`

- `id`, `userId`
- `name`
- `phone`（E.164 或台灣 09xxxxxxxx，必填）
- `phoneVerifiedAt`（nullable；第一期可用簡訊驗證碼，或先格式驗證＋使用者確認；建議做簡訊 OTP）
- `email`（nullable）
- `emailVerifiedAt`（nullable）
- `lineUserId`（nullable）
- `lineLinkedAt`（nullable）
- `inviteToken`（unique；綁 LINE 邀請用）
- `createdAt`

約束：免費用戶最多 1 筆；訂閱最多 3 筆（應用層＋盡量 DB 檢查）。

### `checkins`

- `id`, `userId`, `checkedInAt`, `source`：`bot` | `liff`

### `alert_logs`

- `id`, `userId`, `contactId`
- `channel`：`sms` | `email` | `line`
- `kind`：`overdue` | `reminder_self`
- `cycleKey`（字串；例如以 `lastCheckInAt` 或逾期起點識別本輪，用於去重）
- `status`：`sent` | `failed`
- `providerResponse`（optional text）
- `createdAt`

### `subscriptions`

- `id`, `userId`
- `provider`：`newebpay`
- `providerRef`
- `status`：`active` | `past_due` | `canceled`
- `currentPeriodEnd`
- `createdAt` / `updatedAt`

---

## 6. 核心流程

### 6.1 簽到

1. 驗證身份（LINE userId／LIFF session）  
2. 寫入 `checkins`；更新 `users.lastCheckInAt = now`  
3. 清除本輪逾期狀態（下輪 `cycleKey` 將改變）  
4. Reply 或 LIFF 顯示「已簽到」與下次需簽到的截止時間  

### 6.2 逾期告警（Cron）

對每位用戶，若：

- 非假期暫停中  
- `now > lastCheckInAt + graceHours`  
- 本輪 `cycleKey` 對該 `contactId`＋`kind=overdue` 尚無成功 `alert_logs`  

則：

1. 訂閱且聯絡人有 `lineUserId` → 嘗試 LINE Push  
2. 否則 → **簡訊**（`phone` 已驗證／可用）  
3. 若有已驗證 `email` → **另外**寄 Email（或與簡訊同輪各寫一筆 log；去重鍵含 channel）  
4. 寫 `alert_logs`（成功或失敗；失敗可立即重試一次）  

**同一逾期週期、每位聯絡人每個 channel 只成功告警一次。**

### 6.3 本人提醒（Cron，僅訂閱）

若：

- `plan = pro` 且未過期  
- 非假期  
- 尚未逾期  
- 剩餘時間 &lt; `graceHours * 0.2`  
- 本輪尚未發送 `reminder_self`  

則 LINE Push 給使用者本人一則，並寫 log。

### 6.4 通道選擇（聯絡人）

```
if contact.lineUserId && user.plan == pro:
  try LINE
  on failure → SMS
else:
  SMS

if contact.emailVerifiedAt:
  also Email (independent log row)
```

免費用戶：不走聯絡人 LINE；走簡訊（＋Email 若有）。

---

## 7. 通知文案原則

- 冷靜、事實、不恐嚇  
- **禁止**「可能已死亡」「請立即報警」等措辭  
- 清楚標示服務名「還在嗎」，並說明「這不是緊急救援通知」  

**提醒本人（訂閱）：**  
「還在嗎？距離需要簽到還有約 X 小時。點這裡簽到。」

**逾期給聯絡人：**  
「［顯示名］超過設定時間未在「還在嗎」簽到。這不是緊急救援通知，請用你平常的方式關心確認。上次簽到：［時間］。」

Email／簡訊須含簡短說明與（若有）取消／隱私連結。簡訊宜短：  
「［顯示名］超過「還在嗎」簽到時間。非緊急救援，請關心確認。上次：［時間］」

---

## 8. LIFF／UX

### 畫面

1. **簽到首頁** — 品牌「還在嗎」＋狀態一句＋倒數＋中央大按鈕「我還在」（單一構圖，非儀表板）  
2. **設定** — 寬限、聯絡人、假期暫停（pro）、訂閱入口  
3. **訂閱／付款結果** — 成功或失敗回 LIFF  
4. **LINE 聊天室** — 選單：簽到、設定、升級  

### 視覺

- 沉穩、台灣繁中  
- 主色：深青／暖灰系安心感  
- 避免死亡黑紅玩梗、避免常見 AI 紫漸層堆砌、避免 emoji 牆  

### 錯誤處理

| 情況 | 處理 |
|------|------|
| Webhook 簽章失敗 | 401／拒收，記 log |
| 未登入開 LIFF | 導 LINE Login |
| 免費用戶加第 2 聯絡人 | 拒絕並導訂閱 |
| 寄信／簡訊／Push 失敗 | log＋可重試一次；UI 不假裝成功 |
| Cron 重入 | `cycleKey`＋唯一約束或先查後寫 |
| 使用者封鎖 Bot | `botBlocked=true`；聯絡人改走簡訊（＋Email） |
| 金流未完成 | 維持 free 權限 |

---

## 9. LINE 營運注意

- 官方帳號訊息方案隨用量升級（輕／中／高用量）  
- 簽到確認優先 Reply；主動提醒／告警才用 Push  
- 緊急聯絡人要收 LINE，必須自行加 OA 並完成綁定流程（第一期：由使用者分享連結／配对碼，規格實作時採「邀請連結＋LINE Login 綁定 contact」）  

---

## 10. 測試計畫（第一期）

- [ ] Bot 關鍵字／按鈕簽到 → DB 更新＋Reply  
- [ ] LIFF 簽到同上  
- [ ] 模擬逾期 → **簡訊**發出、`alert_logs` 一筆、重複 Cron 不重發  
- [ ] 有驗證 Email → 同輪另寄 Email（獨立 log／channel）  
- [ ] 訂閱用戶 → 到期前 LINE 提醒一則  
- [ ] 聯絡人有／無 LINE → 通道正確；LINE 失敗 fallback **簡訊**  
- [ ] 免費擋第 2 聯絡人、擋本人 LINE 提醒  
- [ ] 假期暫停期間不提醒、不告警  
- [ ] LIFF 於 LINE iOS／Android 可開啟  
- [ ] **藍新**付款成功 → `plan=pro`；取消／過期 → 回 free  

---

## 11. 隱私與合規（最低要求）

- 隱私權政策頁（蒐集 LINE 顯示名、簽到時間、聯絡人**手機**、選填 Email）  
- 不蒐集定位；**不撥打語音電話**  
- 明確告知：本服務無法判斷生死，僅依「未簽到」觸發通知  
- 聯絡人手機建議驗證（簡訊 OTP）後才納入告警；Email 有填則驗證後才寄  

---

## 12. 決策摘要

| 決策 | 選擇 |
|------|------|
| 產品名 | 還在嗎 |
| 主入口 | LINE Bot／LIFF |
| 登入 | LINE Login |
| 部署 | Vercel Serverless（Next.js） |
| 逾期通知 | **簡訊為主**（手機必填）；Email 選填次要；訂閱可優先 LINE |
| 電話 | **僅簡訊 SMS**；不做語音撥打 |
| 金流 | **藍新 NewebPay** |
| 商業 | 免費＋訂閱 |
| App／PWA | 第一期不做，之後加 |
| 架構 | 方案 1：Next.js 全端 |

---

## 13. 開放實作細節（已選定預設，避免歧義）

以下在實作時採用本預設，不另開討論除非踩雷：

1. **提醒門檻：** 剩餘時間 &lt; 寬限的 20%  
2. **Cron 頻率：** 每 10 分鐘  
3. **金流：** **藍新 NewebPay**（週期／定期定額或每次月費授權，實作採藍新官方文件；不做 Stripe／綠界）  
4. **簡訊閘道：** 優先 **三竹 Mitake**；若申請卡住改 Every8d  
5. **手機驗證：** 第一期做簡訊 OTP；未驗證不納入逾期簡訊  
6. **Email 驗證：** 有填才寄驗證連結；未驗證不寄逾期 Email  
7. **專案目錄：** 實作開始時建立獨立 repo `haizaima`（或使用者指定路徑）  
