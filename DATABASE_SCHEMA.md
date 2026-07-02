# Database Schema v1.0
## 小夢 Fortune Platform · 給後端開發者

> **版本:** v1.0(2026-07-02)
> **對齊:** MEMBERSHIP_BIBLE §4 + COMMERCE_BIBLE §2-§5 + REFERRAL_BIBLE §3

---

## 1 10 表記憶(已存在)

| # | 表 | 用途 | 對齊 |
|---|---|---|---|
| 1 | `members` | 會員主表(暱稱 / email / password_hash / tier / points / created_at) | MEMBERSHIP §4 |
| 2 | `records` | 占卜紀錄(系統 / 牌陣 / 牌面 / 解讀 / created_at) | UX §1 |
| 3 | `points_log` | 積分 ledger(誰 / 何時 / 多少 / 為何) | MEMBERSHIP §3 |
| 4 | `orders` | 訂單(SKU / 金額 / 狀態 / 綠界 txn_id) | COMMERCE §1 |
| 5 | `subscriptions` | 訂閱(tier / 月份 / auto_renew) | MEMBERSHIP §4 |
| 6 | `payments` | 綠界金流(CheckMacValue / txn_id) | COMMERCE §4 |
| 7 | `referrals` | 推薦關係(referrer → referred) | REFERRAL §3 |
| 8 | `notifications` | 推播 / 通知 log | NOTIFICATION |
| 9 | `line_users` | LINE ↔ member 綁定 | LINE_SYSTEM |
| 10 | `favorites` | 收藏(收藏牌卡 / 探索紀錄) | UX §6 |

## 2 需新增 3 表

| # | 表 | 用途 | 對齊 |
|---|---|---|---|
| 11 | `growth_progress` | 探索值累計 / 月相升級紀錄 | MEMBERSHIP §6 |
| 12 | `share_cards` | 分享圖卡 metadata(OG Image) | REFERRAL §2 |
| 13 | `ecpay_log` | 綠界金流完整 audit | COMMERCE §4 |

## 3 索引策略

```sql
-- 高頻查詢
CREATE INDEX idx_records_member_created ON records(member_id, created_at DESC);
CREATE INDEX idx_points_member_created ON points_log(member_id, created_at DESC);
CREATE INDEX idx_orders_member_status ON orders(member_id, status);
CREATE INDEX idx_referrals_referrer ON referrals(referrer_id);
CREATE INDEX idx_favorites_member ON favorites(member_id);
CREATE INDEX idx_growth_member ON growth_progress(member_id);
CREATE INDEX idx_share_cards_user ON share_cards(member_id);
```

## 4 members 主表(預估)

| 欄位 | 型態 | 規格 |
|---|---|---|
| id | UUID | 主鍵 |
| email | string(255) | 唯一 |
| password_hash | string(255) | bcrypt |
| nickname | string(50) | 顯示名 |
| tier | enum | free / plus / pro / master |
| tier_zh | string(20) | 初心旅人 / 星光旅人 / ... |
| level | int | 月相 1-6 |
| points_balance | int | 冗餘(主表方便查)|
| referral_code | string(20) | 推薦人用 |
| line_user_id | string(50) | LINE 綁定 |
| created_at | timestamp | 註冊 |
| last_active_at | timestamp | 活動 |

## 5 不變原則

- 任何 +/- 必須留 log(誰 / 何時 / 多少 / 為何)
- 不可逆(不能直接改 balance,只能加 -X 的紀錄)
- 過期:取得後 365 日未用 → 歸 0
- 反作弊:同 IP / 裝置指紋 → 拒絕
- 備份:每日 1 次全量 + 增量即時

## 6 個資合規(對齊 PROJECT_BIBLE)

- GDPR + 台灣個資法
- 用戶刪除帳號 → 軟刪除(30 日後真刪)
- 用戶匯出資料:JSON 格式
- 加密敏感欄位:email / phone / line_user_id
- 紀錄保留:5 年

---

**實作備註:** 目前 production 用 localStorage(client-side mock)。Backend 實作時按本 schema 對齊。
