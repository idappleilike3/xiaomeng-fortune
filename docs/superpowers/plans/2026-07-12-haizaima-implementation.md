# 還在嗎（HaiZaiMa）Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 打造獨立產品「還在嗎」：LINE Bot／LIFF 簽到、**簡訊（SMS）逾期通知**（Email 選填）、訂閱制 LINE 提醒與多聯絡人、**藍新 NewebPay** 訂閱，部署於 Vercel。

**Architecture:** Next.js App Router 全端；Postgres（Neon）存使用者／簽到／警報；LINE Webhook 處理 Bot 簽到與 Reply；LIFF 提供簽到與設定 UI；Vercel Cron 每 10 分鐘掃逾期與訂閱提醒；三竹 Mitake 發簡訊；Resend 寄選填 Email；**藍新定期定額**訂閱。核心時間／權限邏輯放純函式並用 Vitest 鎖住。**不做語音撥打。**

**Tech Stack:** Next.js 15、TypeScript、Prisma、Postgres、LINE Messaging API + LIFF + LINE Login、Mitake（SMS）、Resend、**藍新 NewebPay**、Vitest、Vercel Cron

**Spec:** `docs/superpowers/specs/2026-07-12-haizaima-design.md`（目前在 xiaomeng-fortune；實作 repo 為獨立 `haizaima`，實作時把 spec／本 plan 複製進去）

## Global Constraints

- 產品名對外一律「還在嗎」；禁止「我死了嗎／死了么」與「可能已死亡／請報警」文案
- 第一期唯一登入：LINE Login；不做 Google／Apple、不做原生 App／PWA
- 提醒門檻：剩餘時間 `< graceHours * 0.2`；Cron：每 10 分鐘
- 金流：**藍新 NewebPay 定期定額**；月費 NT$79；不做 Stripe／綠界
- 逾期通知：**簡訊為主**（聯絡人手機必填＋OTP 驗證後才發）；Email 選填次要；**禁止語音電話**
- 未驗證手機：不納入逾期簡訊；未驗證 Email：不寄逾期信
- 同一逾期週期、每位聯絡人每個 channel 只成功告警一次；簽到後 `cycleKey` 自然更換
- 簽到確認優先 LINE Reply；主動提醒／告警才用 Push
- 視覺：深青／暖灰、台灣繁中；禁止紫漸層玩梗與 emoji 牆

---

## File Map（將建立於 `C:/Users/WIN11/Projects/haizaima`）

```
haizaima/
  package.json
  vitest.config.ts
  vercel.json
  .env.example
  prisma/schema.prisma
  src/
    lib/
      db.ts
      domain/
        time.ts          # grace / remaining / cycleKey / reminder threshold
        plans.ts         # free vs pro limits, isProActive
        copy.ts          # notification strings
        checkin-service.ts
        alert-service.ts
      line/
        signature.ts
        client.ts
        webhook-handlers.ts
      email/
        resend.ts
        templates.ts
      sms/
        mitake.ts           # 三竹簡訊：OTP + 逾期通知
        templates.ts
      newebpay/
        client.ts           # AES 加解密、定期定額表單、Notify 驗簽
        period.ts
      auth/
        session.ts
        line-login.ts
    app/
      layout.tsx
      globals.css
      page.tsx                    # LIFF 簽到首頁
      settings/page.tsx
      upgrade/page.tsx
      privacy/page.tsx
      invite/[token]/page.tsx    # 聯絡人綁 LINE
      api/
        line/webhook/route.ts
        auth/line/callback/route.ts
        checkin/route.ts
        me/route.ts
        settings/route.ts
        contacts/route.ts
        contacts/verify-email/route.ts
        contacts/verify-phone/route.ts
        cron/tick/route.ts
        newebpay/checkout/route.ts
        newebpay/notify/route.ts
        newebpay/return/route.ts
  tests/
    domain/time.test.ts
    domain/plans.test.ts
    domain/copy.test.ts
    domain/alert-service.test.ts
    line/signature.test.ts
    sms/phone.test.ts
```

---

### Task 1: 建立獨立專案骨架

**Files:**
- Create: `C:/Users/WIN11/Projects/haizaima/**`（整個 Next.js 專案）
- Create: `haizaima/.env.example`
- Create: `haizaima/README.md`（僅環境變數與本機指令，不寫長文）

**Interfaces:**
- Consumes: 無
- Produces: 可 `npm run dev` / `npm test` 的空專案；之後所有路徑相對此 repo root

- [ ] **Step 1: 建立專案目錄與 git**

```bash
mkdir C:/Users/WIN11/Projects/haizaima
cd C:/Users/WIN11/Projects/haizaima
git init
npx create-next-app@latest . --typescript --eslint --app --src-dir --import-alias "@/*" --tailwind --turbopack --yes
```

Expected: 專案建立成功，無 prompt 卡住。

- [ ] **Step 2: 安裝相依**

```bash
npm install prisma @prisma/client jose zod resend @line/bot-sdk
npm install -D vitest @vitejs/plugin-react tsx
npx prisma init
```

（藍新加解密用 Node `crypto` 自實作於 `src/lib/newebpay/`，不依賴 Stripe。簡訊用三竹 HTTP API，無額外 npm 必裝。）
- [ ] **Step 3: 設定 scripts 與 Vitest**

在 `package.json` scripts 加入：

```json
{
  "test": "vitest run",
  "test:watch": "vitest",
  "db:push": "prisma db push",
  "db:generate": "prisma generate"
}
```

建立 `vitest.config.ts`：

```ts
import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: { environment: "node", include: ["tests/**/*.test.ts"] },
  resolve: { alias: { "@": path.resolve(__dirname, "./src") } },
});
```

- [ ] **Step 4: 寫 `.env.example`**

```env
DATABASE_URL=postgresql://user:pass@host/db?sslmode=require
LINE_CHANNEL_SECRET=
LINE_CHANNEL_ACCESS_TOKEN=
LINE_LOGIN_CHANNEL_ID=
LINE_LOGIN_CHANNEL_SECRET=
LINE_LIFF_ID=
RESEND_API_KEY=
EMAIL_FROM="還在嗎 <noreply@yourdomain.com>"
MITAKE_USERNAME=
MITAKE_PASSWORD=
MITAKE_API_URL=https://smsapi.mitake.com.tw/api/mtk/SmSend
NEWEBPAY_MERCHANT_ID=
NEWEBPAY_HASH_KEY=
NEWEBPAY_HASH_IV=
NEWEBPAY_ENV=sandbox
NEWEBPAY_PERIOD_AMT=79
APP_BASE_URL=http://localhost:3000
CRON_SECRET=dev-cron-secret
SESSION_SECRET=replace-with-32+-char-secret
```

- [ ] **Step 5: 複製規格與計畫進新 repo**

```bash
mkdir -p docs/superpowers/specs docs/superpowers/plans
cp "C:/Users/WIN11/Projects/xiaomeng-fortune/docs/superpowers/specs/2026-07-12-haizaima-design.md" docs/superpowers/specs/
cp "C:/Users/WIN11/Projects/xiaomeng-fortune/docs/superpowers/plans/2026-07-12-haizaima-implementation.md" docs/superpowers/plans/
```

- [ ] **Step 6: Commit**

```bash
git add .
git commit -m "chore: scaffold Next.js HaiZaiMa project"
```

- [ ] **Step 7: 把 Cursor agent root 切到新專案**

使用 `move_agent_to_root` → `C:/Users/WIN11/Projects/haizaima`。之後所有任務在此 root 執行。

---

### Task 2: Prisma schema 與 DB client

**Files:**
- Create: `prisma/schema.prisma`
- Create: `src/lib/db.ts`

**Interfaces:**
- Consumes: `DATABASE_URL`
- Produces: `prisma` singleton；表 `User` `EmergencyContact` `Checkin` `AlertLog` `Subscription`

- [ ] **Step 1: 寫 schema**

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum Plan {
  free
  pro
}

enum CheckinSource {
  bot
  liff
}

enum AlertChannel {
  sms
  email
  line
}

enum AlertKind {
  overdue
  reminder_self
}

enum AlertStatus {
  sent
  failed
}

enum SubStatus {
  active
  past_due
  canceled
}

model User {
  id             String    @id @default(cuid())
  lineUserId     String    @unique
  displayName    String
  pictureUrl     String?
  graceHours     Int       @default(36)
  lastCheckInAt  DateTime?
  vacationUntil  DateTime?
  plan           Plan      @default(free)
  planExpiresAt  DateTime?
  botBlocked     Boolean   @default(false)
  createdAt      DateTime  @default(now())
  updatedAt      DateTime  @updatedAt
  contacts       EmergencyContact[]
  checkins       Checkin[]
  alertLogs      AlertLog[]
  subscriptions  Subscription[]
}

model EmergencyContact {
  id              String    @id @default(cuid())
  userId          String
  user            User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  name            String
  phone           String
  phoneVerifiedAt DateTime?
  email           String?
  emailVerifiedAt DateTime?
  lineUserId      String?
  lineLinkedAt    DateTime?
  inviteToken     String    @unique @default(cuid())
  createdAt       DateTime  @default(now())
  alertLogs       AlertLog[]

  @@index([userId])
}

model Checkin {
  id          String         @id @default(cuid())
  userId      String
  user        User           @relation(fields: [userId], references: [id], onDelete: Cascade)
  checkedInAt DateTime       @default(now())
  source      CheckinSource
  @@index([userId, checkedInAt])
}

model AlertLog {
  id               String        @id @default(cuid())
  userId           String
  user             User          @relation(fields: [userId], references: [id], onDelete: Cascade)
  contactId        String?
  contact          EmergencyContact? @relation(fields: [contactId], references: [id], onDelete: SetNull)
  channel          AlertChannel
  kind             AlertKind
  cycleKey         String
  status           AlertStatus
  providerResponse String?
  createdAt        DateTime      @default(now())

  @@unique([userId, contactId, kind, cycleKey, status])
  @@index([userId, kind, cycleKey])
}

model Subscription {
  id               String    @id @default(cuid())
  userId           String
  user             User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  provider         String    @default("newebpay")
  providerRef      String    @unique
  status           SubStatus
  currentPeriodEnd DateTime
  createdAt        DateTime  @default(now())
  updatedAt        DateTime  @updatedAt
}
```

Note: Prisma `@@unique` 含 nullable `contactId` 時，reminder_self（無 contact）用 `contactId = null` 可能允許多筆 null（Postgres UNIQUE NULL 行為）。實作 reminder 去重改以應用層「先查成功 log」為準；schema 的 unique 主要服務 overdue＋contactId。

- [ ] **Step 2: db client**

```ts
// src/lib/db.ts
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
```

- [ ] **Step 3: 連 Neon 後 push**

```bash
npx prisma db push
npx prisma generate
```

Expected: tables created, client generated.

- [ ] **Step 4: Commit**

```bash
git add prisma src/lib/db.ts
git commit -m "feat: add Prisma schema and db client"
```

---

### Task 3: Domain 純函式（時間／方案／文案）— TDD

**Files:**
- Create: `src/lib/domain/time.ts`
- Create: `src/lib/domain/plans.ts`
- Create: `src/lib/domain/copy.ts`
- Test: `tests/domain/time.test.ts`
- Test: `tests/domain/plans.test.ts`
- Test: `tests/domain/copy.test.ts`

**Interfaces:**
- Produces:
  - `graceMs(hours: number): number`
  - `cycleKey(lastCheckInAt: Date): string` → `lastCheckInAt.toISOString()`
  - `deadlineAt(lastCheckInAt: Date, graceHours: number): Date`
  - `remainingMs(now, lastCheckInAt, graceHours): number`
  - `isOverdue(now, lastCheckInAt, graceHours): boolean`
  - `shouldRemindSelf(now, lastCheckInAt, graceHours): boolean` → not overdue && remaining < grace*0.2
  - `isOnVacation(now, vacationUntil: Date | null): boolean`
  - `isProActive(plan, planExpiresAt, now): boolean`
  - `maxContacts(isPro: boolean): number` → 1 | 3
  - `allowedGraceHours: number[]` → `[12,24,36,48,72]`
  - `copyReminderSelf(hoursLeft: number): string`
  - `copyOverdueContact(displayName: string, lastCheckInLabel: string): string`
  - `copyOverdueContactSms(displayName: string, lastCheckInLabel: string): string`

- [ ] **Step 1: 寫失敗測試 `tests/domain/time.test.ts`**

```ts
import { describe, expect, it } from "vitest";
import {
  cycleKey,
  isOverdue,
  shouldRemindSelf,
  isOnVacation,
  remainingMs,
} from "@/lib/domain/time";

describe("time domain", () => {
  const checkIn = new Date("2026-07-01T00:00:00.000Z");

  it("cycleKey uses ISO of last check-in", () => {
    expect(cycleKey(checkIn)).toBe("2026-07-01T00:00:00.000Z");
  });

  it("is overdue after grace hours", () => {
    const now = new Date("2026-07-02T13:00:00.000Z"); // 37h later
    expect(isOverdue(now, checkIn, 36)).toBe(true);
  });

  it("shouldRemindSelf when under 20% remaining", () => {
    // grace 10h = 36000000ms; 20% = 2h. At 9h elapsed → 1h left → remind
    const now = new Date(checkIn.getTime() + 9 * 3600_000);
    expect(shouldRemindSelf(now, checkIn, 10)).toBe(true);
  });

  it("shouldRemindSelf false when overdue", () => {
    const now = new Date(checkIn.getTime() + 40 * 3600_000);
    expect(shouldRemindSelf(now, checkIn, 36)).toBe(false);
  });

  it("vacation blocks when now < vacationUntil", () => {
    expect(isOnVacation(new Date("2026-07-02"), new Date("2026-07-10"))).toBe(true);
    expect(isOnVacation(new Date("2026-07-11"), new Date("2026-07-10"))).toBe(false);
    expect(isOnVacation(new Date("2026-07-02"), null)).toBe(false);
  });

  it("remainingMs floors at 0", () => {
    const now = new Date(checkIn.getTime() + 100 * 3600_000);
    expect(remainingMs(now, checkIn, 36)).toBe(0);
  });
});
```

- [ ] **Step 2: 跑測試確認失敗**

```bash
npm test -- tests/domain/time.test.ts
```

Expected: FAIL module not found / export missing.

- [ ] **Step 3: 實作 `src/lib/domain/time.ts`**

```ts
export function graceMs(hours: number): number {
  return hours * 60 * 60 * 1000;
}

export function cycleKey(lastCheckInAt: Date): string {
  return lastCheckInAt.toISOString();
}

export function deadlineAt(lastCheckInAt: Date, graceHours: number): Date {
  return new Date(lastCheckInAt.getTime() + graceMs(graceHours));
}

export function remainingMs(
  now: Date,
  lastCheckInAt: Date,
  graceHours: number,
): number {
  return Math.max(0, deadlineAt(lastCheckInAt, graceHours).getTime() - now.getTime());
}

export function isOverdue(
  now: Date,
  lastCheckInAt: Date,
  graceHours: number,
): boolean {
  return now.getTime() > deadlineAt(lastCheckInAt, graceHours).getTime();
}

export function shouldRemindSelf(
  now: Date,
  lastCheckInAt: Date,
  graceHours: number,
): boolean {
  if (isOverdue(now, lastCheckInAt, graceHours)) return false;
  const rem = remainingMs(now, lastCheckInAt, graceHours);
  return rem < graceMs(graceHours) * 0.2;
}

export function isOnVacation(now: Date, vacationUntil: Date | null): boolean {
  if (!vacationUntil) return false;
  return now.getTime() < vacationUntil.getTime();
}
```

- [ ] **Step 4: 測試通過**

```bash
npm test -- tests/domain/time.test.ts
```

Expected: PASS

- [ ] **Step 5: plans + copy 測試與實作**

`tests/domain/plans.test.ts`：

```ts
import { describe, expect, it } from "vitest";
import { isProActive, maxContacts, allowedGraceHours } from "@/lib/domain/plans";

describe("plans", () => {
  it("pro active only when plan=pro and not expired", () => {
    const now = new Date("2026-07-01");
    expect(isProActive("pro", new Date("2026-08-01"), now)).toBe(true);
    expect(isProActive("pro", new Date("2026-06-01"), now)).toBe(false);
    expect(isProActive("free", new Date("2026-08-01"), now)).toBe(false);
    expect(isProActive("pro", null, now)).toBe(false);
  });

  it("contact limits", () => {
    expect(maxContacts(false)).toBe(1);
    expect(maxContacts(true)).toBe(3);
  });

  it("grace options", () => {
    expect(allowedGraceHours).toEqual([12, 24, 36, 48, 72]);
  });
});
```

`src/lib/domain/plans.ts`：

```ts
export const allowedGraceHours = [12, 24, 36, 48, 72] as const;

export function isProActive(
  plan: "free" | "pro",
  planExpiresAt: Date | null,
  now: Date,
): boolean {
  if (plan !== "pro" || !planExpiresAt) return false;
  return planExpiresAt.getTime() > now.getTime();
}

export function maxContacts(isPro: boolean): number {
  return isPro ? 3 : 1;
}
```

`tests/domain/copy.test.ts`：

```ts
import { describe, expect, it } from "vitest";
import { copyOverdueContact, copyReminderSelf } from "@/lib/domain/copy";

describe("copy", () => {
  it("reminder is calm and branded", () => {
    const s = copyReminderSelf(3);
    expect(s).toContain("還在嗎");
    expect(s).toContain("3");
    expect(s).not.toMatch(/死|報警/);
  });

  it("overdue disclaimer present", () => {
    const s = copyOverdueContact("小明", "2026-07-01 12:00");
    expect(s).toContain("小明");
    expect(s).toContain("這不是緊急救援通知");
    expect(s).not.toMatch(/死亡|報警/);
  });

  it("sms overdue is short and calm", () => {
    const s = copyOverdueContactSms("小明", "07-01 12:00");
    expect(s.length).toBeLessThan(70);
    expect(s).toContain("還在嗎");
    expect(s).not.toMatch(/死亡|報警/);
  });
});
```

`src/lib/domain/copy.ts`：

```ts
export function copyReminderSelf(hoursLeft: number): string {
  const h = Math.max(1, Math.ceil(hoursLeft));
  return `還在嗎？距離需要簽到還有約 ${h} 小時。點這裡簽到。`;
}

export function copyOverdueContact(
  displayName: string,
  lastCheckInLabel: string,
): string {
  return `${displayName}超過設定時間未在「還在嗎」簽到。這不是緊急救援通知，請用你平常的方式關心確認。上次簽到：${lastCheckInLabel}。`;
}

export function copyOverdueContactSms(
  displayName: string,
  lastCheckInLabel: string,
): string {
  return `${displayName}超過「還在嗎」簽到時間。非緊急救援，請關心確認。上次：${lastCheckInLabel}`;
}
```

- [ ] **Step 6: 全跑 domain 測試並 commit**

```bash
npm test -- tests/domain
git add src/lib/domain tests/domain
git commit -m "feat: add domain time, plan, and copy helpers"
```

---

### Task 4: 簽到服務

**Files:**
- Create: `src/lib/domain/checkin-service.ts`
- Test: `tests/domain/checkin-service.test.ts`（可用 prisma mock 或 in-memory 介面）

**Interfaces:**
- Produces: `recordCheckIn({ userId, source, now }): Promise<{ lastCheckInAt, deadlineAt }>`
- Consumes: `prisma`, `deadlineAt` from time.ts

為保持可測，服務接受 `db` 介面：

```ts
export type CheckinDb = {
  createCheckin: (userId: string, source: "bot" | "liff", at: Date) => Promise<void>;
  updateUserLastCheckIn: (userId: string, at: Date) => Promise<{ graceHours: number }>;
};
```

- [ ] **Step 1: 寫測試**

```ts
import { describe, expect, it, vi } from "vitest";
import { recordCheckIn } from "@/lib/domain/checkin-service";

describe("recordCheckIn", () => {
  it("writes checkin and returns deadline", async () => {
    const now = new Date("2026-07-01T00:00:00.000Z");
    const db = {
      createCheckin: vi.fn(async () => {}),
      updateUserLastCheckIn: vi.fn(async () => ({ graceHours: 36 })),
    };
    const result = await recordCheckIn(db, {
      userId: "u1",
      source: "bot",
      now,
    });
    expect(db.createCheckin).toHaveBeenCalledWith("u1", "bot", now);
    expect(db.updateUserLastCheckIn).toHaveBeenCalledWith("u1", now);
    expect(result.lastCheckInAt).toEqual(now);
    expect(result.deadlineAt.toISOString()).toBe("2026-07-02T12:00:00.000Z");
  });
});
```

- [ ] **Step 2: 跑測失敗 → 實作 → 通過**

```ts
// src/lib/domain/checkin-service.ts
import { deadlineAt } from "./time";

export type CheckinDb = {
  createCheckin: (userId: string, source: "bot" | "liff", at: Date) => Promise<void>;
  updateUserLastCheckIn: (userId: string, at: Date) => Promise<{ graceHours: number }>;
};

export async function recordCheckIn(
  db: CheckinDb,
  input: { userId: string; source: "bot" | "liff"; now: Date },
) {
  await db.createCheckin(input.userId, input.source, input.now);
  const user = await db.updateUserLastCheckIn(input.userId, input.now);
  return {
    lastCheckInAt: input.now,
    deadlineAt: deadlineAt(input.now, user.graceHours),
  };
}
```

Prisma adapter（同檔或 `checkin-prisma.ts`）：

```ts
import { prisma } from "@/lib/db";
import type { CheckinDb } from "./checkin-service";

export const prismaCheckinDb: CheckinDb = {
  async createCheckin(userId, source, at) {
    await prisma.checkin.create({
      data: { userId, source, checkedInAt: at },
    });
  },
  async updateUserLastCheckIn(userId, at) {
    const u = await prisma.user.update({
      where: { id: userId },
      data: { lastCheckInAt: at },
      select: { graceHours: true },
    });
    return u;
  },
};
```

- [ ] **Step 3: Commit**

```bash
git add src/lib/domain/checkin-service.ts src/lib/domain/checkin-prisma.ts tests/domain/checkin-service.test.ts
git commit -m "feat: add check-in service"
```

---

### Task 5: LINE 簽章驗證

**Files:**
- Create: `src/lib/line/signature.ts`
- Test: `tests/line/signature.test.ts`

**Interfaces:**
- Produces: `verifyLineSignature(body: string, signature: string | null, channelSecret: string): boolean`

- [ ] **Step 1: 測試（用已知 HMAC）**

```ts
import { createHmac } from "crypto";
import { describe, expect, it } from "vitest";
import { verifyLineSignature } from "@/lib/line/signature";

describe("verifyLineSignature", () => {
  it("accepts valid signature", () => {
    const body = '{"events":[]}';
    const secret = "testsecret";
    const sig = createHmac("sha256", secret).update(body).digest("base64");
    expect(verifyLineSignature(body, sig, secret)).toBe(true);
  });

  it("rejects invalid", () => {
    expect(verifyLineSignature("{}", "bad", "testsecret")).toBe(false);
    expect(verifyLineSignature("{}", null, "testsecret")).toBe(false);
  });
});
```

- [ ] **Step 2: 實作**

```ts
import { createHmac, timingSafeEqual } from "crypto";

export function verifyLineSignature(
  body: string,
  signature: string | null,
  channelSecret: string,
): boolean {
  if (!signature) return false;
  const digest = createHmac("sha256", channelSecret).update(body).digest("base64");
  try {
    const a = Buffer.from(digest);
    const b = Buffer.from(signature);
    return a.length === b.length && timingSafeEqual(a, b);
  } catch {
    return false;
  }
}
```

- [ ] **Step 3: 測試通過並 commit**

```bash
npm test -- tests/line/signature.test.ts
git add src/lib/line/signature.ts tests/line/signature.test.ts
git commit -m "feat: verify LINE webhook signatures"
```

---

### Task 6: LINE client、使用者 upsert、Webhook 簽到

**Files:**
- Create: `src/lib/line/client.ts`
- Create: `src/lib/line/webhook-handlers.ts`
- Create: `src/app/api/line/webhook/route.ts`

**Interfaces:**
- Produces:
  - `replyMessage(replyToken, messages)`
  - `pushMessage(lineUserId, messages)`
  - `upsertUserFromLineProfile(lineUserId): Promise<User>`
  - `handleWebhookEvents(events): Promise<void>`
- Consumes: `recordCheckIn`, `verifyLineSignature`, `@line/bot-sdk`

- [ ] **Step 1: LINE client 包裝**

```ts
// src/lib/line/client.ts
import { messagingApi } from "@line/bot-sdk";

export function lineClient() {
  return new messagingApi.MessagingApiClient({
    channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN!,
  });
}

export async function replyText(replyToken: string, text: string) {
  await lineClient().replyMessage({
    replyToken,
    messages: [{ type: "text", text }],
  });
}

export async function pushText(to: string, text: string) {
  await lineClient().pushMessage({
    to,
    messages: [{ type: "text", text }],
  });
}
```

- [ ] **Step 2: follow／message／postback 處理**

規則：
- `follow` → upsert user；歡迎文＋教「回『還在』或開 LIFF」
- 文字含「還在」或「簽到」（trim）→ check-in source=bot + reply 截止時間
- `postback.data === "action=checkin"` → 同上
- `unfollow` → `botBlocked=true`

格式化截止時間用 `Asia/Taipei`（`Intl.DateTimeFormat("zh-TW", { timeZone: "Asia/Taipei", ... })`）。

- [ ] **Step 3: Webhook route**

```ts
// src/app/api/line/webhook/route.ts
import { NextRequest, NextResponse } from "next/server";
import { verifyLineSignature } from "@/lib/line/signature";
import { handleWebhookEvents } from "@/lib/line/webhook-handlers";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const ok = verifyLineSignature(
    body,
    req.headers.get("x-line-signature"),
    process.env.LINE_CHANNEL_SECRET!,
  );
  if (!ok) return new NextResponse("unauthorized", { status: 401 });

  const json = JSON.parse(body) as { events: unknown[] };
  await handleWebhookEvents(json.events);
  return NextResponse.json({ ok: true });
}
```

- [ ] **Step 4: 本機用 ngrok／Cloudflare tunnel 對 LINE webhook 測一次 follow＋簽到**（手動）

Expected: DB 有 user、checkin；聊天室收到確認。

- [ ] **Step 5: Commit**

```bash
git add src/lib/line src/app/api/line
git commit -m "feat: LINE webhook check-in and welcome"
```

---

### Task 7: LINE Login session ＋ `/api/me` ＋ `/api/checkin`

**Files:**
- Create: `src/lib/auth/session.ts`
- Create: `src/lib/auth/line-login.ts`
- Create: `src/app/api/auth/line/callback/route.ts`
- Create: `src/app/api/me/route.ts`
- Create: `src/app/api/checkin/route.ts`

**Interfaces:**
- Produces:
  - `createSessionToken(userId: string): Promise<string>`（jose HS256, 30d）
  - `readSession(req): Promise<{ userId } | null>`
  - Cookie name: `hzm_session`
- LIFF 端：前端用 `liff.getIDToken()` 換 session，或走 OAuth callback；第一期採 **LIFF ID token 驗證** 較適合內嵌：

額外 API：`POST /api/auth/line/liff` body `{ idToken }` → 驗證 → set cookie。

- [ ] **Step 1: session helpers（jose）**

```ts
// src/lib/auth/session.ts
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const COOKIE = "hzm_session";

function secret() {
  return new TextEncoder().encode(process.env.SESSION_SECRET!);
}

export async function createSessionToken(userId: string) {
  return new SignJWT({ sub: userId })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("30d")
    .sign(secret());
}

export async function setSessionCookie(userId: string) {
  const token = await createSessionToken(userId);
  (await cookies()).set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function getSessionUserId(): Promise<string | null> {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret());
    return typeof payload.sub === "string" ? payload.sub : null;
  } catch {
    return null;
  }
}
```

- [ ] **Step 2: 驗證 LIFF ID token**

呼叫 LINE：`GET https://api.line.me/oauth2/v2.1/verify?id_token=...&client_id=LINE_LOGIN_CHANNEL_ID`  
成功後用 `sub`（line user id）upsert user，設 cookie。

- [ ] **Step 3: `POST /api/checkin`**

需 session；`source: "liff"`；回傳 `{ lastCheckInAt, deadlineAt }` JSON。

- [ ] **Step 4: `GET /api/me`**

回傳 displayName、plan、graceHours、lastCheckInAt、deadline、remainingMs、contacts 摘要、vacationUntil、isPro。

- [ ] **Step 5: Commit**

```bash
git add src/lib/auth src/app/api/auth src/app/api/me src/app/api/checkin
git commit -m "feat: LIFF session auth and check-in API"
```

---

### Task 8: LIFF 簽到首頁 UI

**Files:**
- Modify: `src/app/layout.tsx`, `src/app/globals.css`, `src/app/page.tsx`
- Create: `src/components/CheckInButton.tsx`, `src/components/StatusPanel.tsx`
- Create: `public/liff-init note` — 在 page 用 script 載入 `https://static.line-scdn.net/liff/edge/2/sdk.js`

**Interfaces:**
- Consumes: `/api/auth/line/liff`, `/api/me`, `/api/checkin`

- [ ] **Step 1: CSS 變數（深青／暖灰）**

```css
:root {
  --bg: #f3f1ec;
  --ink: #1c2b2a;
  --muted: #5c6b68;
  --accent: #1f6f64;
  --accent-press: #185a52;
  --panel: #fffdf8;
}
```

單一構圖：品牌「還在嗎」→ 一句狀態 → 倒數 → 大圓鈕「我還在」。設定連到 `/settings`。

- [ ] **Step 2: page 啟動 LIFF**

```ts
await liff.init({ liffId: process.env.NEXT_PUBLIC_LINE_LIFF_ID! });
if (!liff.isLoggedIn()) liff.login();
const idToken = liff.getIDToken();
await fetch("/api/auth/line/liff", {
  method: "POST",
  headers: { "content-type": "application/json" },
  body: JSON.stringify({ idToken }),
});
```

`.env` 加 `NEXT_PUBLIC_LINE_LIFF_ID=`。

- [ ] **Step 3: 每秒更新倒數（前端用 me.deadlineAt）**

- [ ] **Step 4: 在 LINE 內建瀏覽器手動驗證版面與簽到**

- [ ] **Step 5: Commit**

```bash
git add src/app src/components
git commit -m "feat: LIFF check-in home screen"
```

---

### Task 9: 設定 API — 寬限、聯絡人、手機 OTP、Email 驗證、假期

**Files:**
- Create: `src/app/api/settings/route.ts`
- Create: `src/app/api/contacts/route.ts`
- Create: `src/app/api/contacts/verify-phone/route.ts`
- Create: `src/app/api/contacts/verify-email/route.ts`
- Create: `src/lib/sms/mitake.ts`
- Create: `src/lib/sms/templates.ts`
- Create: `src/lib/domain/phone.ts`（正規化台灣手機）
- Create: `src/lib/email/resend.ts`
- Create: `src/lib/email/templates.ts`
- Create: `src/app/settings/page.tsx`
- Create: `src/app/api/invite/claim/route.ts`
- Create: `src/app/invite/[token]/page.tsx`
- Test: `tests/sms/phone.test.ts`

**Interfaces:**
- `PATCH /api/settings` body `{ graceHours?: number, vacationUntil?: string | null }`
  - grace 必須 ∈ allowedGraceHours
  - vacationUntil 僅 isPro；否則 403
- `POST /api/contacts` `{ name, phone, email? }` — `phone` 必填；超過 maxContacts → 403 `{ code: "UPGRADE_REQUIRED" }`
- `DELETE /api/contacts?id=`
- 新增聯絡人後：
  1. 寄 **簡訊 OTP**（`POST /api/contacts/verify-phone` 提交 `{ contactId, code }` 成功後設 `phoneVerifiedAt`）
  2. 若有 email → 寄驗證連結 `GET /api/contacts/verify-email?token=...`
- Cron：**僅 `phoneVerifiedAt != null`** 發逾期簡訊；僅 `emailVerifiedAt != null` 發逾期 Email
- 邀請綁 LINE：`${APP_BASE_URL}/invite/${inviteToken}`（僅 pro 逾期優先 LINE）
- **禁止任何語音撥號 API**

- [ ] **Step 1: 手機正規化測試＋實作**

```ts
// tests/sms/phone.test.ts
import { describe, expect, it } from "vitest";
import { normalizeTwMobile } from "@/lib/domain/phone";

describe("normalizeTwMobile", () => {
  it("accepts 09xxxxxxxx", () => {
    expect(normalizeTwMobile("0912-345-678")).toBe("0912345678");
  });
  it("rejects landline", () => {
    expect(() => normalizeTwMobile("02-12345678")).toThrow();
  });
});
```

```ts
// src/lib/domain/phone.ts
export function normalizeTwMobile(input: string): string {
  const digits = input.replace(/\D/g, "");
  const local = digits.startsWith("886") ? `0${digits.slice(3)}` : digits;
  if (!/^09\d{8}$/.test(local)) throw new Error("INVALID_TW_MOBILE");
  return local;
}
```

- [ ] **Step 2: Mitake 簡訊包裝**

```ts
// src/lib/sms/mitake.ts
export async function sendSms(to: string, text: string): Promise<{ ok: boolean; raw: string }> {
  const phone = normalizeTwMobile(to);
  const params = new URLSearchParams({
    username: process.env.MITAKE_USERNAME!,
    password: process.env.MITAKE_PASSWORD!,
    dstaddr: phone,
    smbody: text,
    encoding: "UTF8",
  });
  const res = await fetch(`${process.env.MITAKE_API_URL}?${params.toString()}`);
  const raw = await res.text();
  return { ok: res.ok && /statuscode=[^0]/i.test(raw) === false ? /statuscode=1/i.test(raw) || raw.includes("1") : true, raw };
  // 實作時依三竹回傳格式精確判斷成功碼，上列為示意；以官方文件為準
}
```

OTP 文案：`【還在嗎】驗證碼 ******，10 分鐘內有效。`  
逾期文案用 `copyOverdueContactSms(...)`（短版，見 domain/copy）。

- [ ] **Step 3: Resend（選填 Email）＋ settings／contacts API ＋ LIFF 設定頁**

設定頁：寬限、聯絡人（手機必填、Email 選填）、OTP 輸入、複製 LINE 邀請、假期（pro）、升級 CTA。

- [ ] **Step 4: 手動測：免費加第 2 人被擋；OTP 後 phoneVerifiedAt 有值；未驗證不進告警名單**

- [ ] **Step 5: Commit**

```bash
git add src/app/api/settings src/app/api/contacts src/app/api/invite src/app/settings src/app/invite src/lib/email src/lib/sms src/lib/domain/phone.ts tests/sms
git commit -m "feat: contacts with SMS OTP and optional email verify"
```

---

### Task 10: 警報服務 ＋ Cron tick（簡訊為主）

**Files:**
- Create: `src/lib/domain/alert-service.ts`
- Create: `src/app/api/cron/tick/route.ts`
- Create: `vercel.json`
- Modify: `src/lib/domain/copy.ts`（加短版 SMS 文案）
- Test: `tests/domain/alert-service.test.ts`

**Interfaces:**
- Produces: `runAlertTick(now, deps): Promise<{ reminders: number, overdues: number }>`
- Deps: list users, list contacts, hasSent(cycleKey, kind, contactId, channel), sendSms, sendEmail, pushLine, writeLog

規則實作（對齊 spec）：

1. Skip if `isOnVacation`
2. Skip users without `lastCheckInAt`
3. Reminder: `isProActive` && `shouldRemindSelf` && !hasSent(reminder_self, cycleKey, sms/email N/A) → push 本人 → log channel=line
4. Overdue: `isOverdue` && for each contact：
   - Primary: if pro && `lineUserId` → try LINE；失敗 → SMS（需 `phoneVerifiedAt`）
   - Else：SMS（需 `phoneVerifiedAt`）
   - Secondary：若 `emailVerifiedAt` → 另寄 Email（獨立 channel log）
   - 每個 `(contactId, kind, cycleKey, channel)` 成功只一次；失敗可立即重試一次
5. **永不呼叫語音／撥號 API**

Cron route：

```ts
export async function GET(req: NextRequest) {
  if (req.headers.get("authorization") !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse("unauthorized", { status: 401 });
  }
  const result = await runAlertTick(new Date(), /* wired deps */);
  return NextResponse.json(result);
}
```

`vercel.json`：

```json
{
  "crons": [{ "path": "/api/cron/tick", "schedule": "*/10 * * * *" }]
}
```

- [ ] **Step 1: 單元測試覆蓋：假期跳過、去重、免費只 SMS、pro LINE 優先、LINE 失敗→SMS、有驗證 Email 另寄**

- [ ] **Step 2: 實作至測試全綠**

- [ ] **Step 3: 本機把 `lastCheckInAt` 調過去 → curl Cron → 確認簡訊／log（Email 若有）**

- [ ] **Step 4: Commit**

```bash
git add src/lib/domain/alert-service.ts src/lib/domain/copy.ts src/app/api/cron vercel.json tests/domain/alert-service.test.ts
git commit -m "feat: overdue SMS alerts and reminder cron"
```

---

### Task 11: 藍新 NewebPay 定期定額訂閱

**Files:**
- Create: `src/lib/newebpay/client.ts`（AES-256-CBC + SHA256）
- Create: `src/lib/newebpay/period.ts`
- Create: `src/app/api/newebpay/checkout/route.ts`
- Create: `src/app/api/newebpay/notify/route.ts`
- Create: `src/app/api/newebpay/return/route.ts`
- Create: `src/app/upgrade/page.tsx`

**Interfaces:**
- `POST /api/newebpay/checkout`（需登入）→ 回傳定期定額表單 HTML 或 TradeInfo 欄位，前端 auto-post 至藍新  
  - 測試：`https://ccore.newebpay.com/MPG/period`  
  - 正式：`https://core.newebpay.com/MPG/period`  
  - `PeriodAmt=79`、`PeriodType=M`、`PeriodTimes` 足夠大（如 99）、`NotifyURL`／`ReturnURL`／`BackURL` 指向本站
- `POST /api/newebpay/notify`：驗簽解密每期授權結果  
  - 成功：`user.plan=pro`，`planExpiresAt` 設為本期結束＋約 31 天（或依回傳下次授權日），upsert `Subscription`（`provider=newebpay`，`providerRef=PeriodNo/MerOrderNo`）  
  - 失敗／停止委託：`plan=free`
- Upgrade 頁：免費 vs pro、NT$79／月、按鈕觸發 checkout（回 LIFF）

- [ ] **Step 1: newebpay client（加解密）**

```ts
// src/lib/newebpay/client.ts
import { createCipheriv, createDecipheriv, createHash } from "crypto";

export function aesEncrypt(plain: string, key = process.env.NEWEBPAY_HASH_KEY!, iv = process.env.NEWEBPAY_HASH_IV!) {
  const cipher = createCipheriv("aes-256-cbc", Buffer.from(key), Buffer.from(iv));
  return Buffer.concat([cipher.update(plain, "utf8"), cipher.final()]).toString("hex");
}

export function aesDecrypt(hex: string, key = process.env.NEWEBPAY_HASH_KEY!, iv = process.env.NEWEBPAY_HASH_IV!) {
  const decipher = createDecipheriv("aes-256-cbc", Buffer.from(key), Buffer.from(iv));
  return Buffer.concat([decipher.update(Buffer.from(hex, "hex")), decipher.final()]).toString("utf8");
}

export function sha256TradeSha(tradeInfo: string) {
  const key = process.env.NEWEBPAY_HASH_KEY!;
  const iv = process.env.NEWEBPAY_HASH_IV!;
  return createHash("sha256")
    .update(`HashKey=${key}&${tradeInfo}&HashIV=${iv}`)
    .digest("hex")
    .toUpperCase();
}
```

（欄位組裝／定期定額參數名稱以藍新《信用卡定期定額串接技術手冊》為準；上列為核心原語。）

- [ ] **Step 2: checkout 產生委託＋ notify／return 路由**

Notify 必須回藍新要求的字串（常見 `SUCCESS`）；更新 DB 後再回應。

- [ ] **Step 3: 藍新測試商店手動測一筆定期定額**

Expected: notify 入庫、`plan=pro`；停止委託後下次邏輯回 free（或依過期日）。

- [ ] **Step 4: Commit**

```bash
git add src/lib/newebpay src/app/api/newebpay src/app/upgrade
git commit -m "feat: NewebPay period subscription checkout"
```

---

### Task 12: 隱私頁、聊天室選單文案、README 上線清單

**Files:**
- Create: `src/app/privacy/page.tsx`
- Modify: `src/lib/line/webhook-handlers.ts`（關鍵字「設定」「升級」回 LIFF URL）
- Modify: `README.md`

**Interfaces:**
- 隱私頁說明：蒐集顯示名、簽到時間、聯絡人**手機**、選填 Email；不蒐集定位；**不撥打語音電話**；無法判斷生死
- README 列出：LINE OA、Messaging API、LIFF、Login、**三竹 Mitake**、Resend（選用）、Neon、Vercel env、Cron secret、**藍新商店／HashKey／定期定額**

- [ ] **Step 1: 隱私頁繁中內容（短、清楚）**

- [ ] **Step 2: Bot 回覆帶 LIFF 連結**（`https://liff.line.me/${LIFF_ID}` 與 `/settings` path 依 LIFF endpoint 設定）

- [ ] **Step 3: README 上線檢查清單（checkbox）**

- [ ] **Step 4: 跑全測試**

```bash
npm test
npm run build
```

Expected: tests PASS；build 成功。

- [ ] **Step 5: Commit**

```bash
git add src/app/privacy README.md src/lib/line
git commit -m "docs: privacy page and launch checklist"
```

---

## Spec coverage self-check

| Spec 要求 | Task |
|-----------|------|
| Bot／關鍵字／按鈕簽到 | 6 |
| LIFF 簽到＋設定 | 8, 9 |
| LINE Login | 7 |
| **簡訊逾期（手機必填＋OTP）** | 9, 10 |
| Email 逾期（選填） | 9, 10 |
| 訂閱 LINE 提醒本人 | 10, 11 |
| 聯絡人 LINE 優先＋**SMS fallback** | 9 invite, 10 |
| **藍新 NewebPay 訂閱** | 11 |
| 假期暫停 | 9, 10 |
| Cron 10 分鐘 | 10 |
| 警報去重 cycleKey＋channel | 3, 10 |
| 文案原則（含短 SMS） | 3, 10 |
| 隱私頁（含不語音撥打） | 12 |
| 手機／Email 驗證才告警 | 9, 10 |
| 不做語音撥打／App／Google 登入 | Global Constraints（不實作） |

## Placeholder scan

無 TBD；藍新欄位組裝以官方定期定額手冊為準；三竹成功碼以官方回傳為準。

## Type consistency

- `cycleKey(lastCheckInAt)` ISO 字串貫穿 alert logs  
- `plan`: `free` | `pro`  
- Check-in `source`: `bot` | `liff`  
- Alert `channel`: `sms` | `email` | `line`  
- Subscription `provider`: `newebpay`  
- Session cookie: `hzm_session`  

---

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-07-12-haizaima-implementation.md`.

**Two execution options:**

1. **Subagent-Driven（建議）** — 每個 Task 派一個新 subagent，Task 之間我做 review  
2. **Inline Execution** — 本對話用 executing-plans 連續做，設檢查點  

你要哪一種？
