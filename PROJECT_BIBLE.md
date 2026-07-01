# 📖 小夢 Fortune Platform — Project Bible

> **唯一官方規格文件。本檔案為所有功能、PR、Commit、Codex Task、OpenClaw Task 的最高依據。**
>
> **聊天內容不得直接覆蓋 Bible。若需求修改,必須先更新 Bible,再開始 Coding。**
>
> 版本: **v1.0.0** | 生效日: 2026-07-02 | 維護者: 小夢老師 / 蝦董 / 龍蝦團隊

---

## §1 專案定位 (Spirit)

**小夢 Fortune Platform**

不是一般塔羅網站。
也不是 AI 聊天網站。

而是一個結合:

- **Tarot Ritual** (塔羅儀式)
- **Pet Divination** (寵物占卜)
- **Oracle Message** (神諭訊息)
- **Astrology** (星軌命盤)
- **Spiritual Growth** (靈性成長)

的 **精品靈性 SaaS 平台**。

---

## §2 品牌定位 (Brand)

### 核心品牌
**小夢老師**

### 品牌精神
> 「我不預言未來,
> 而是陪伴每一位使用者,
> 看見屬於自己的答案。」

### 打造方向

| 屬性 | 說明 |
|---|---|
| 精品 | 高質感,精雕細琢 |
| 神秘 | 深邃,不可測 |
| 療癒 | 溫柔,撫慰 |
| 高級 | 香檳金,絲綢質感 |
| 儀式感 | 每一次點擊都是儀式 |
| 電影感 | 史詩級視覺 |
| 互動式體驗 | 不只是觀看,而是參與 |

**不是一般占卜網站。**

---

## §3 世界觀 (World)

整個網站 **不是網站**。

而是一座 **數位神殿**。

使用者 **不是瀏覽**。

而是 **進入神殿**。

每一次點擊。

都是一次 **儀式**。

---

## §4 設計原則 (Visual DNA)

所有畫面遵守以下 12 個視覺元素:

| # | 元素 | 應用 |
|---|---|---|
| 1 | 深紫 | 主背景色 `#19142e` / `#0d0718` |
| 2 | 黑金 | 文字與邊框 `#f5d38b` (香檳金) |
| 3 | 星空 | Hero 大底圖 + Loading 星空 |
| 4 | 神殿 | 拱門、雕花、巴洛克框架 |
| 5 | 月亮 | 神諭系統符號 |
| 6 | 神聖幾何 | 梅塔特隆立方體、生命之花 |
| 7 | 生命之花 | 背景紋理 |
| 8 | 香檳金 | 細字 + 發光邊框 |
| 9 | 光粒子 | 翻牌爆破、Loading 點陣 |
| 10 | 水晶 | 按鈕 hover 反光 |
| 11 | 符文 | 塔羅象徵符號 |
| 12 | 神女 | Hero 主視覺 + 塔羅主角 |

### 字型規範
- **品牌字 (Brand)**: Georgia, "Times New Roman", serif
  - 小夢老師 / 塔羅命盤療癒室
  - 顏色 `#f5d38b` 香檳金
  - 字重 600,letter-spacing 0.04em
- **內文 (Body)**: 系統中文 sans-serif (Noto Sans TC / PingFang TC fallback)
- **羅馬數字 / 英文**: Georgia, serif italic

---

## §5 命名公約 (硬規則)

### §5.1 正式官方命名(整個專案統一,不可混用)

| 功能 / 場景 | 正式名稱 | 禁用詞 |
|---|---|---|
| LINE 引導流程 | **小夢靈性導引** | BOT / ChatBot / Line Bot / AI 助理 |
| 占卜後解讀 | **深度靈性解讀** | AI 解牌 / AI Reading / Robot Reading / Machine Reading |
| 後台名稱 | **小夢深度解析排版工具** | AI 後台 / 演算法後台 / ChatGPT 後台 |
| 抽牌體驗 | **命運之門 / 神聖儀式** | 遊戲 / 測試 / 算命 |
| 收件匣 | **靈性收件匣** | 訊息匣 / 通知匣 |
| 積分 | **靈性積分** | 點數 / 幣 / 積分幣 |
| 錢包 | **靈性收益錢包** | 帳戶 / 餘額 |
| 占卜系統 | **塔羅 / 寵物占卜 / 神諭訊息** | 算命 / AI 占卜 / 機器占卜 |
| 入口 | **三大命運入口** | 功能 / 變現 / 服務 |
| 加好友 | **加入小夢** | 訂閱 / 追蹤 |

### §5.2 不可混用詞(永久黑名單)

```
BOT
ChatBot
Line Bot
AI 助理
AI 解牌
AI Reading
Robot Reading
Machine Reading
ChatGPT
大模型
LLM
OpenAI
Anthropic
演算法
機器人
機器學習
深度學習
神經網路
```

---

## §6 系統清單 (Systems)

### §6.1 三大占卜系統

| 代號 | 系統 | 牌背視覺 | 翻牌粒子 | 環境音 |
|---|---|---|---|---|
| `tarot` | 塔羅儀式 | 深紫黑金 + 巴洛克雕花 | `gold-sparkles-burst` 金粉爆裂 | 古典豎琴低頻 |
| `pet` | 寵物占卜 | 奶油星空粉 + 貓肉墊 | `pink-hearts-paws-burst` 粉肉墊愛心 | 輕柔鋼琴 + 鳥鳴 |
| `oracle` | 神諭訊息 | 黑金神聖幾何太陽 | `white-light-rays-burst` 白光放射 | 教堂風琴 + 唱誦 |

### §6.2 入口卡片(三大命運入口)

| 編號 | 名稱 | 主視覺 | 對應塔羅 |
|---|---|---|---|
| 入口 1 | 命運之門 · 塔羅儀式 | `tarot-01-the-magician.png` | The Magician I |
| 入口 2 | 靈魂之門 · 星軌命盤 | `tarot-02-the-high-priestess.png` | The High Priestess II |
| 入口 3 | 豐盛之門 · 今日神諭 | `tarot-03-the-empress.png` | The Empress III |

---

## §7 卡片庫 (Card Library)

### §7.1 塔羅 22 大阿爾卡納 (Major Arcana)
完整 22 張,位於 `assets/tarot-XX-*.png`,規格 1024×1536 PNG,巴洛克金框,深紫宇宙,羅馬數字必含。

### §7.2 寵物 22 大阿爾卡納 (Pet Master Animal Cards)
完整 22 張,位於 `assets/pet-XX-*.png`,規格 1024×1536 PNG,與塔羅同視覺家族但動物主角。

| 編號 | 主題 | 動物 |
|---|---|---|
| 00 | The Fool | Ragdoll |
| 01 | The Magician | Snow Leopard |
| 02 | The High Priestess | White Persian |
| 03 | The Empress | Rabbit |
| 04 | The Emperor | Lion |
| 05 | The Hierophant | Fox |
| 06 | The Lovers | Swans |
| 07 | The Chariot | Arabian Horse |
| 08 | Strength | Bengal Tiger |
| 09 | The Hermit | Owl |
| 10 | Wheel of Fortune | Chameleon |
| 11 | Justice | (待補) |
| 12 | The Hanged Man | Bat |
| 13 | Death | Coral Snake |
| 14 | Temperance | Koi Goldfish |
| 15 | The Devil | Black Cat |
| 16 | The Tower | Rooster |
| 17 | The Star | Phoenix |
| 18 | The Moon | Grey Wolf |
| 19 | The Sun | (待補) |
| 20 | Judgement | (待補) |
| 21 | The World | (待補) |

### §7.3 神諭 12 訊息 (Oracle Message)
12 張中文神諭 face,位於 `assets/oracle-card-face-*.png`。

### §7.4 牌背規格
- Tarot: `assets/tarot-card-back.png` — 深紫黑金
- Pet: `assets/pet-card-back.png` — 奶油星空 + 貓肉墊
- Oracle: `assets/oracle-card-back.png` — 黑金神聖幾何太陽

---

## §8 商業規則 (Commerce)

### §8.1 解鎖方式
| 方式 | 觸發條件 |
|---|---|
| 首抽免費 | 每個系統每用戶 1 次 |
| 現金 599 元 | 折抵 50 靈性積分 |
| 靈性積分 | 100 積分可兌換 1 次 |
| 會員階級 | 初窺 → 調頻 → 解碼 → 終極 |

### §8.2 分享獎勵
- 分享獎 50 靈性積分
- 7 天有效
- 每日 1 次

### §8.3 三大分類(對應「F22」儀式選擇畫面)

| 系統 | 類別數 | 名稱 |
|---|---|---|
| Tarot | 9 大分類 | 熱門/感情/事業/財富/自我/靈性/時間線/決策/經典 |
| Pet | 7 大情境 | 日常/關係/健康/行為/新養/離世/失蹤 |
| Oracle | 3 模式 | 每日訊息/宇宙提醒/心靈祝福 |

---

## §9 技術棧 (Stack)

| 層 | 技術 |
|---|---|
| 前台 | 純 HTML + CSS + Vanilla JS (無框架,LIFF 行動優先) |
| 後台 | `admin.html` + 同樣技術 |
| 部署 | Render (`xiaomeng-fortune.onrender.com`) |
| 圖庫 | `assets/` 資料夾,git LFS 不啟用,直接 commit |
| 後端 | `server.js` Node.js Express |
| LIFF | LINE Front-end Framework |
| Bot | LINE Messaging API (Webhook) |

---

## §10 字眼過濾清單 (Forbidden Words)

### §10.1 永久禁用詞(任何地方都不准出現)

```
AI
Bot
BOT
ChatBot
Line Bot
機器人
演算法
機器學習
深度學習
神經網路
大模型
LLM
ChatGPT
OpenAI
Anthropic
智慧系統
智能助理
AI 助理
AI 解牌
AI Reading
Robot Reading
Machine Reading
資料分析
推薦引擎
功能
變現
```

### §10.2 必須用詞(正向替代)

```
儀式
星軌
命運
神諭
深度靈性解讀
守護
陪伴
指引
探索
療癒
小夢靈性導引
小夢老師
靈性積分
靈性收益
靈性收件匣
命運之門
```

### §10.3 文案風格守則

| ✅ 要用 | ❌ 不要用 |
|---|---|
| 「啟動星軌解碼」 | 「啟動 AI 分析」 |
| 「深度靈性解讀」 | 「AI 為你解牌」 |
| 「小夢靈性導引」 | 「Bot 自動回覆」 |
| 「命運之門」 | 「功能選單」 |
| 「加入小夢」 | 「訂閱 Bot」 |
| 「靈性收件匣」 | 「訊息通知」 |

---

## §11 開發守則 (Dev Rules)

### §11.1 修改流程(硬性)
1. 任何需求修改 → 先更新 PROJECT_BIBLE.md → commit `[Bible vX.Y.Z]`
2. 確認 Bible 章節對齊後才動工
3. Coding commit 訊息必須引用 Bible 章節:`[Bible §X.Y] feat: ...`
4. 聊天內容不得直接覆蓋 Bible 規格

### §11.2 Git 守則
- **絕不使用** `git add -A`(會抓到 `__*.py` scratch)
- **永遠用** `git add <file>` 精準 add
- 排除 `__*.py` `_*.py` 與 `shots/_*.py` 等 scratch scripts

### §11.3 同步驗證
- 每次 commit 前跑 `_sync_check.py`
- 必須在 380/720/1200px 三裝置都通過

### §11.4 圖片規格
- 塔羅/寵物牌: 1024×1536 PNG
- 神諭 face: 1024×1536 PNG
- Hero 大底圖: 1536×1024 PNG (16:9)
- 必須含:羅馬數字 + 巴洛克金框 + 紫黑金 + 神聖幾何

---

## §12 版本歷史 (Changelog)

### v1.0.0 (2026-07-02) — 初始版
- 建立 18 章節
- 命名公約定稿:小夢靈性導引 / 深度靈性解讀
- 字眼過濾清單生效
- 加入 §14 Motion / §15 Writing Style / §16 UI Component Rules / §17 Audio Bible / §18 Sacred Flow

### v1.1.0 (2026-07-02) — 補上 Brand Bible 索引
- 新增 §19 Brand Bible 索引,指向獨立檔案 `BRAND_BIBLE.md`
- Brand Bible v1.0.0 上線:15 章節,含品牌定位 / Logo / 語言 / 世界觀 / 色彩 / 字型 / Icon / 按鈕 / 陰影 / 金框 / 光暈 / 粒子 / 動畫 / 跨頁一致性檢查表

---

## §13 整合索引 — 今晚已完成對齊清單

| 項目 | 對齊章節 | Commit |
|---|---|---|
| Hero 神女大底圖 16:9 + 12 星座 | §4 + §18 | `490c2f3` |
| Topbar 香檳金 Georgia serif | §4 + §16 | `490c2f3` |
| 三大入口毛玻璃 + 香檳金邊框 | §4 + §16 | `490c2f3` |
| 表單精簡 + tooltip 問號 + 12px 隱私小字 | §16 | `490c2f3` |
| Footer 🔒 隱私 + ⚖️ 法律毛玻璃 modal | §16 + §10 | `b0ec629` |
| Pet 牌卡 11-17 (Bat/Snake/Goldfish/Black Cat/Rooster/Phoenix/Wolf) | §7 | `490c2f3` + 本次 |
| 三大占卜系統 + 牌背 + 翻牌粒子 | §6 | `b0ec629` |
| Schema 9 大分類 + 7 情境 + 3 模式 | §8 | `b0ec629` |
| Admin → 前台連回按鈕 (後台管理用) | §16 | `b0ec629` |

---

## §14 Motion & Ritual (動畫集中管理)

### §14.1 動畫類別清單

| 類別 | 動畫名 | 觸發 | 規格 |
|---|---|---|---|
| 首頁 Opening | `temple-curtain-rise` | 首頁載入完成 | 1.8s ease,深紫漸層淡入 + 神女顯現 |
| 轉場 | `fade-through-gold` | 系統切換 | 600ms,金光粒子穿透 |
| 洗牌 | `shuffle-3d` | F22 進入 | 800ms,cubic-bezier(0.4, 0, 0.2, 1) |
| 切牌 | `cut-deal` | F22 中段 | 600ms,卡牌向上滑動分兩疊 |
| 扇形展開 | `fan-spread` | F22 抽牌前 | 900ms,卡牌展開成 120° 扇形 |
| 翻牌 | `card-flip-720ms` | F22 點選 | 720ms,3D rotateY 180°,系統主題粒子爆破 |
| 爆破粒子 (Tarot) | `gold-sparkles-burst` | 翻牌完成 | 14 顆金粉,半徑 220px,1.2s |
| 爆破粒子 (Pet) | `pink-hearts-paws-burst` | 翻牌完成 | 14 顆粉肉墊愛心,1.2s |
| 爆破粒子 (Oracle) | `white-light-rays-burst` | 翻牌完成 | 14 條白光放射,1.2s |
| Glow | `divine-glow-pulse` | hover/聚焦 | 1.8s ease infinite,香檳金光暈呼吸 |
| Hover | `lift-gold-trace` | 入口卡片 hover | 280ms,translateY(-4px) + 金光軌跡 |
| Transition | `ritual-cross-fade` | 頁面切換 | 320ms,fade + 微微 zoom(0.98→1) |
| Loading | `constellation-rotate` | 等待回應 | 2s linear infinite,12 星座連線繞行 |
| Haptic | `vibrate-pulse` | 翻牌點擊 | navigator.vibrate(60) |
| 打字機 | `typewriter-32ms` | 深度靈性解讀文字 | 32ms/字,游標閃爍 |

### §14.2 動畫優先級
1. **.ritual-cursor** — 自訂游標(永遠最上)
2. **.modal** — 毛玻璃彈窗(z-index 2000)
3. **.toast** — 通知(z-index 1500)
4. **.fab** — 浮動按鈕(z-index 1200)
5. **粒子爆破** — 翻牌時(append to body,auto-remove)
6. **頁面內容** — 主體

---

## §15 Writing Style (文案風格統一)

### §15.1 核心詞彙表

**世界觀必用詞**:
```
儀式
星軌
命運
神諭
深度靈性解讀
守護
陪伴
指引
探索
療癒
神殿
小夢靈性導引
小夢老師
靈魂
星象
命盤
流年
```

**絕對禁用詞**(技術感):
```
AI / Bot / 機器人 / 演算法
模型 / 資料分析 / 智慧系統
推薦引擎 / ChatGPT / OpenAI
功能 / 變現 / 訂閱 / 通知
```

### §15.2 文案情境對照表

| 場景 | ✅ 用 | ❌ 不要用 |
|---|---|---|
| 占卜結果 | 「小夢為您揭曉命運的訊息」 | 「AI 算出來的結果」 |
| 流程引導 | 「接下來,小夢靈性導引會陪伴您」 | 「Bot 將自動為您服務」 |
| 付費引導 | 「解鎖完整深度靈性解讀」 | 「升級 AI 會員」 |
| 分享獎勵 | 「邀請好友,共同踏上靈性之旅」 | 「分享獲得 AI 點數」 |
| 隱私說明 | 「您的資料僅用於個人命盤解讀」 | 「我們的 AI 不會保留您的資料」 |
| Loading | 「小夢正在為您解讀星軌」 | 「AI 正在分析中」 |
| 錯誤訊息 | 「星軌暫時迷霧,請稍候片刻」 | 「系統錯誤 / AI 故障」 |
| 成功訊息 | 「命運之門已為您開啟」 | 「操作成功」 |

---

## §16 UI Component Rules (UI 元件統一規範)

### §16.1 按鈕 (Button)

| 變體 | 用途 | 規格 |
|---|---|---|
| `.btn--primary` | 主要行動(啟動儀式) | 香檳金漸層 + 金光 hover + 神聖幾何內紋 |
| `.btn--secondary` | 次要行動(再抽一張) | 透明 + 香檳金邊框 + 1px 香檳金描邊 |
| `.btn--ghost` | 文字按鈕(查看更多) | 純文字 + 香檳金 hover underline |
| `.btn--danger` | 危險(重置/離開) | 深紫 + 紅金光暈 |
| `.btn--locked` | 鎖定(付費解鎖) | 半透明 + 🔒 圖示 + 香檳金邊框發光 |

**所有按鈕必須**:
- padding ≥ 14px 28px
- border-radius 12px
- 字體 Georgia serif 或中文 sans-serif
- 過渡 280ms ease
- focus-visible 有 2px 香檳金外框

### §16.2 卡片 (Card)

| 變體 | 用途 |
|---|---|
| `.card--ritual` | F22 抽牌卡片(1024×1536 比例) |
| `.card--entry` | 首頁三大入口(毛玻璃 + 香檳金邊框) |
| `.card--market` | 會員方案(深紫 + 香檳金細字) |
| `.card--profile` | 用戶資料表單 |
| `.card--share` | 分享獎勵彈窗 |

**所有卡片必須**:
- 深紫半透明底色 `rgba(38, 22, 64, 0.55)`
- `backdrop-filter: blur(18px) saturate(1.1)`
- 香檳金 1px 邊框 `rgba(245, 211, 139, 0.55)`
- 圓角 18px
- hover 邊框加深 + 金光 box-shadow

### §16.3 Input (表單)

- 必填欄位:右側加發光 ❓ tooltip (`.tip-glyph`)
- 12px 灰藍色隱私小字底部 (`.profile-privacy { color: #8b9bb5; font-size: 12px }`)
- tooltip 樣式:深紫半透明 + 香檳金 1px 邊框 + 動畫 fade-in 180ms

### §16.4 Dialog / Modal

- 毛玻璃 `backdrop-filter: blur(18px) saturate(1.4)`
- 背景遮罩 `rgba(13, 7, 24, 0.78)`
- 進場動畫:scale(0.96) → 1 + opacity 0 → 1,320ms
- 桌面/平板 ≥720px:Modal 彈出
- 手機 <720px:跳轉獨立 HTML(privacy.html / terms.html)

### §16.5 Bottom Sheet (手機版)

- 從底部滑入 `translateY(100%) → 0`
- 300ms cubic-bezier(0.4, 0, 0.2, 1)
- 圓角頂部 24px 24px 0 0
- 點外面或下滑收起

### §16.6 Toast (提示)

- 位置:畫面底部中央(fixed)
- z-index 1500
- 自動消失 3 秒
- 樣式:深紫 + 香檳金邊框 + 微弱光暈
- 三種類型:`toast--success` / `toast--warning` / `toast--error`

### §16.7 Tooltip (問號提示)

- 觸發:hover `.tip-glyph`
- 位置:輸入欄右側 18px 圓球,香檳金邊框,微弱金光 drop-shadow
- 顯示:`data-tooltip` 屬性內容
- 樣式:深紫半透明背景 + 香檳金 1px 邊框 + 260px max-width
- 動畫:fade-in 180ms

### §16.8 Loading

- 中央顯示 12 星座連線 SVG 動畫 `constellation-rotate`
- 文字「小夢正在為您解讀星軌…」
- 全螢幕遮罩 z-index 1800

### §16.9 Hover

- 所有可互動元素 hover 必須有視覺回饋
- 標準:hover 邊框加深 + translateY(-2px) + 金光 box-shadow
- 過渡 280ms ease

### §16.10 Glow

- `.glow-pulse` 類別:1.8s ease infinite,香檳金光暈呼吸
- 用於:鎖定解讀按鈕、靈性積分數字、新訊息紅點

### §16.11 Button (再強調 — 不得每頁自訂)

- 任何新按鈕**必須**沿用 §16.1 五種變體之一
- 不得每頁自訂顏色/形狀
- 違反此條的 PR 將被拒絕

---

## §17 Audio Bible (音效統一)

### §17.1 音效清單

| 觸發 | 音效名 | 規格 |
|---|---|---|
| 首頁 Opening | `temple-door-open.mp3` | 低頻鐘聲 + 緩慢回音,2.4s,單次 |
| Tarot 翻牌 | `tarot-flip-720ms.mp3` | 紙牌翻動 + 鈴鐺,720ms |
| Pet 翻牌 | `pet-flip-soft.mp3` | 輕柔鈴鐺 + 鳥鳴,720ms |
| Oracle 翻牌 | `oracle-flip-chime.mp3` | 風鈴 + 唱誦,900ms |
| 按鈕點擊 | `btn-tap-gold.mp3` | 香檳金短音,80ms |
| 完成 | `ritual-complete.mp3` | 上揚豎琴 + 鈴鐺三連,1.8s |
| 積分獲得 | `coin-sparkle.mp3` | 水晶鈴 + 光粒子音效,600ms |
| 祝福 | `blessing-bell.mp3` | 緩慢鈴鐺 + 風鈴,2s |
| Tarot 環境音 | `tarot-ambient-harp.mp3` | 古典豎琴低頻循環,90s |
| Pet 環境音 | `pet-ambient-piano.mp3` | 輕柔鋼琴 + 鳥鳴,90s |
| Oracle 環境音 | `oracle-ambient-organ.mp3` | 教堂風琴 + 唱誦,90s |
| 錯誤 | `gentle-bell.mp3` | 單聲鐘聲,400ms |
| 載入 | `loading-stardust.mp3` | 微弱光粒子流動,loop |

### §17.2 音量規範
- 環境音:`0.15`
- 翻牌音效:`0.45`
- 按鈕點擊:`0.30`
- 完成/祝福:`0.55`

### §17.3 靜音控制
- 預設使用者可從右上設定 icon 關閉所有音效
- 設定儲存 localStorage `xiaomeng.muted = true/false`

---

## §18 Sacred Flow (神聖使用者旅程)

### §18.1 完整 11 步使用者旅程

```
加入小夢
   ↓
收到祝福
   ↓
小夢靈性導引
   ↓
神殿 Opening (首頁 Hero)
   ↓
選擇命運之門 (三大入口選擇)
   ↓
開始儀式 (F22 進入)
   ↓
抽牌
   ↓
深度靈性解讀
   ↓
今日祝福
   ↓
收藏命運紀錄
   ↓
會員成長
```

### §18.2 每步驟規範

#### 步驟 1:加入小夢
- LINE 官方帳號
- 歡迎詞:小夢老師親自迎接
- 立即收到第一張「今日祝福卡」

#### 步驟 2:收到祝福
- 自動推播首次祝福
- 內容為神諭系統隨機 1 張

#### 步驟 3:小夢靈性導引
- LINE 互動式引導流程
- 詢問使用者當前狀態、想問的問題
- 引導至對應入口
- **絕對不要出現 BOT / AI / 機器人 字眼**

#### 步驟 4:神殿 Opening
- 首頁 Hero 大底圖(神女 + 12 星座 + 神聖幾何)
- 品牌字「小夢老師 · 塔羅命盤療癒室」
- 三大入口卡片顯現
- Loading 動畫:神殿大門開啟

#### 步驟 5:選擇命運之門
- 三大入口:
  - 命運之門 · 塔羅儀式
  - 靈魂之門 · 星軌命盤
  - 豐盛之門 · 今日神諭

#### 步驟 6:開始儀式
- F22 進入(洗牌 → 切牌 → 扇形展開)
- 系統主題套用(牌背 + 環境音)
- 神聖幾何轉場動畫

#### 步驟 7:抽牌
- 720ms 翻牌動畫
- 系統主題粒子爆破
- 翻牌音效

#### 步驟 8:深度靈性解讀
- **正式命名:深度靈性解讀(不是 AI 解牌)**
- 打字機效果 32ms/字
- 配合 Atropos 3D 視差
- 解讀內容由小夢老師專業撰寫

#### 步驟 9:今日祝福
- 翻牌完成後自動推送 1 張神諭 face
- 同時推送到靈性收件匣

#### 步驟 10:收藏命運紀錄
- 自動存入 localStorage
- 可從靈性收件匣查看歷史

#### 步驟 11:會員成長
- 靈性積分累積
- 會員階級晉升(初窺 → 調頻 → 解碼 → 終極)
- 專屬功能解鎖

### §18.3 整體感受

> **整個 UX 必須像完成一場神聖儀式,而不是操作網站。**

每一步都應該讓使用者感受到:
- ⏳ 等待(Loading 不是空轉,而是「小夢正在為您準備」)
- ✨ 揭曉(翻牌是神聖時刻,不是「點按鈕」)
- 🌙 守護(陪伴感,不是工具感)
- 💫 驚喜(祝福推送,不是通知堆疊)

---


---

## §19 Brand Bible (獨立檔案)

> **所有頁面的視覺唯一依據。任何頁面不得自行設計,必須完全對齊本檔案。**
> 版本: v1.0.0 | 對齊 PROJECT_BIBLE v1.0.0 | 生效日: 2026-07-02

詳細內容請參閱獨立檔案:BRAND_BIBLE.md(14.57 KB,15 章節)

### §19.1 Brand Bible 章節速覽

| 章節 | 內容 |
|---|---|
| §1 | 品牌定位 |
| §2 | Logo 使用規範 |
| §3 | 品牌語言 |
| §4 | 品牌世界觀 |
| §5 | 品牌色彩 |
| §6 | 字型 |
| §7 | Icon 規範(§7.5 統一清單) |
| §8 | 按鈕規範(五種變體) |
| §9 | 陰影系統(7 層級) |
| §10 | 金框(4 規格) |
| §11 | 光暈(5 類型 + 動畫) |
| §12 | 粒子(3 系統) |
| §13 | 品牌動畫(15 清單) |
| §14 | 跨頁一致性檢查表(15 項) |
| §15 | 版本歷史 |

### §19.2 與 PROJECT_BIBLE 對應關係

| Brand Bible | PROJECT_BIBLE |
|---|---|
| §5 色彩 | §4 設計原則 |
| §6 字型 | §4 設計原則 |
| §8 按鈕 | §16 UI Component Rules |
| §10 金框 | §16 UI Component Rules |
| §11 光暈 | §16 UI Component Rules |
| §12 粒子 | §14 Motion & Ritual |
| §13 動畫 | §14 Motion & Ritual |
| §7 Icon | §16 UI Component Rules |
| §3 品牌語言 | §15 Writing Style |
| §4 世界觀 | §3 世界觀 |

### §19.3 強制執行

- 所有頁面交付前必須跑過 §14 跨頁一致性檢查表(15 項)
- 違反 Brand Bible 的 PR 將被拒絕
- 任何頁面不得自行設計顏色、字型、按鈕、動畫
- 新增頁面必須先寫進 Brand Bible 再 Coding

---

**Project Bible v1.0.0 — 正式生效**

蝦董 / 龍蝦團隊 / 小夢老師 共同維護

修改需更新版本號(v1.0.1 / v1.1.0 / v2.0.0)