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

### §8.3 三大分類(對應「神聖探索儀式」儀式選擇畫面)

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
| 洗牌 | `shuffle-3d` | 神聖探索儀式 進入 | 800ms,cubic-bezier(0.4, 0, 0.2, 1) |
| 切牌 | `cut-deal` | 神聖探索儀式 中段 | 600ms,卡牌向上滑動分兩疊 |
| 扇形展開 | `fan-spread` | 神聖探索儀式 抽牌前 | 900ms,卡牌展開成 120° 扇形 |
| 翻牌 | `card-flip-720ms` | 神聖探索儀式 點選 | 720ms,3D rotateY 180°,系統主題粒子爆破 |
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
| `.card--ritual` | 神聖探索儀式 抽牌卡片(1024×1536 比例) |
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

## §18 Sacred Flow v2.0 — 神聖探索儀式 Sacred Stage(神聖占卜大舞台)

> **神聖探索儀式 是所有占卜系統共用的核心互動舞台。**
> 使用者不是「點擊一張牌」,而是「完成一場命運儀式」。
> 整個 神聖探索儀式 不可跳步,必須依序走完 11 步。

### §18.1 核心理念

`
使用者: 點擊一張牌 ❌
使用者: 完成一場命運儀式 ✅
`

- 精品品牌 / 電影級互動體驗
- 所有動畫:流暢 / 優雅 / 神秘感
- 禁止廉價 / 快速 / 生硬動畫
- 60FPS · Ease In Out · 不卡頓

### §18.2 完整 11 步 Sacred Stage 流程(不可跳步)

`
① Stage Opening(舞台開啟)
    ↓
② 背景音樂淡入
    ↓
③ Shuffle(洗牌)
    ↓
④ Cut(切牌)
    ↓
⑤ Fan Spread(展牌)
    ↓
⑥ 使用者選牌
    ↓
⑦ 其他牌卡淡出
    ↓
⑧ 主牌放大翻面(720ms)
    ↓
⑨ 深度靈性解讀(打字機 + 段落漸入)
    ↓
⑩ 儲存命運紀錄
    ↓
⑪ 今日祝福(收尾儀式)
`

### §18.3 展牌規則

**禁止**:
- ❌ 橫向 Carousel
- ❌ 左右滑動卡片
- ❌ 任意點擊翻面(必須完成前置步驟才可選牌)

**必須**:
- ✅ 圓弧扇形 Fan Spread
- ✅ 牌卡自然重疊
- ✅ 桌面占卜儀式感
- ✅ 最多顯示 22 張牌(大阿爾克那)
- ✅ 預設角度範圍 -50° ~ +50°(中牌朝上)

### §18.4 選牌動畫(步驟 ⑥)

使用者點擊牌卡:

`
立即反應:
  主牌: scale 1 → 1.2 (300ms)
  其他牌:
    opacity: 100% → 20% (400ms)
    transform: translateY(0 → -20px) 微微後退
  背景:
    filter: blur(0 → 8px) (500ms)
    聚焦中央牌
  其他牌卡:
    pointer-events: none (禁用)
`

### §18.5 翻牌動畫(步驟 ⑧)

`
主牌翻面:
  transform: rotateY(0 → 180deg)
  duration: 800~1200ms(採 1000ms)
  easing: cubic-bezier(0.4, 0, 0.2, 1)

翻面期間:
  + Gold Glow(香檳金 box-shadow 0 → 60px)
  + Light Sweep(白光從左掃到右)
  + Particle(系統主題粒子爆破)

完成後:
  牌面停留中央
  不可立即縮小
  等待使用者閱讀
`

### §18.6 深度靈性解讀(步驟 ⑨)

**禁止**: ❌ 一次全部文字跳出
**必須**: ✅ 打字機效果(32ms/字)+ Paragraph Fade + Section Reveal

**閱讀順序**: ① 核心訊息 → ② 現況解析 → ③ 建議方向 → ④ 今日祝福
每段: Fade Up + opacity 0→1 + translateY(20px→0) + 600ms

### §18.7 三大系統差異化

#### ① 命運塔羅(Tarot)
`
世界觀:   歐洲神殿
色彩:     深紫 · 黑金 · 香檳金
牌背:     巴洛克金箔 + 亞洲神女插畫
專屬音效: 羊皮紙 / 洗牌聲 / 水晶共鳴
翻牌特效: Gold Sparkles · Golden Light · Particle(金色)
`

#### ② 毛孩心語(Pet Divination)
`
世界觀:   森林 · 療癒神殿
色彩:     奶油暖色 · 粉橘金
牌背:     肉球 · 星軌 · 貓咪 · 狗狗
專屬音效: 八音盒 / 貓呼嚕 / 鈴鐺 / 森林微風
翻牌特效: 粉色光點 · 肉球粒子 · 愛心光暈
`

#### ③ 今日神諭(Oracle)
`
世界觀:   宇宙 · 星雲 · 月亮 · 神聖幾何
色彩:     黑金 · 太陽圖騰 · 白色光環
專屬音效: Singing Bowl / Ambient Wind / 宇宙低頻
翻牌特效: White Rays · Holy Light · White Spark
`

### §18.8 音效規範(完整 Audio Bible)

每一步皆有專屬音效 — 9 個共用 + 3 系統專屬 = **12 個音效**:

| # | 音效名 | 觸發時機 | 檔名 | 音量 |
|---|---|---|---|---|
| 1 | Opening | 進入 神聖探索儀式 舞台 | f22-opening.mp3 | 0.4 |
| 2 | Shuffle | 開始洗牌 | f22-shuffle.mp3 | 0.5 |
| 3 | Cut | 切牌瞬間 | f22-cut.mp3 | 0.5 |
| 4 | Fan | 展牌扇形 | f22-fan.mp3 | 0.5 |
| 5 | Hover | 滑鼠懸停牌卡 | f22-hover.mp3 | 0.25 |
| 6 | Select | 點擊選牌 | f22-select.mp3 | 0.6 |
| 7 | Flip | 翻牌動畫 | f22-flip.mp3 | 0.6 |
| 8 | Complete | 解讀完成 | f22-complete.mp3 | 0.5 |
| 9 | Blessing | 今日祝福 | f22-blessing.mp3 | 0.5 |
| 10 | Tarot BGM | Tarot 系統 BGM | bgm-tarot.mp3 | 0.3 |
| 11 | Pet BGM | Pet 系統 BGM | bgm-pet.mp3 | 0.3 |
| 12 | Oracle BGM | Oracle 系統 BGM | bgm-oracle.mp3 | 0.3 |

#### 音量規範
- BGM:0.3(最輕)/ 主音效:0.4-0.6 / Hover 音效:0.25

#### 靜音控制
- localStorage xm_audio_muted = true/false
- UI 控制:右上方 🔊/🔇 切換
- 跨 session 持久化

### §18.9 動畫規範(Motion Bible)

#### 統一動畫風格
`
easing: cubic-bezier(0.4, 0, 0.2, 1)
duration: 300-1200ms
fps: 60
`

#### 8 動畫類型(全部以 BRAND_BIBLE §13 為唯一依據)

| 類型 | 動畫名 |
|---|---|
| Fade | ritual-fade-in / ritual-fade-out |
| Scale | ritual-scale-up / ritual-scale-down |
| Glow | divine-glow-pulse / gentle-glow |
| Floating | card-floating-up |
| Light Sweep | light-sweep-left-to-right |
| Blur | bg-blur-in / bg-blur-out |
| Particle | gold-sparkles-burst / pink-hearts-paws-burst / white-light-rays-burst |
| Transition | ritual-cross-fade |

#### 互動細節
- 桌面 Hover:translateY(-6px) + scale(1.04) + glow 加強,350ms
- 手機 Touch:Touch Ripple 金色光圈 600ms + audio.hover
- 主牌翻牌後:divine-glow-pulse 1.8s 無限循環(呼吸光暈)
- 背景:particle-drift 12s 無限循環(粒子漂浮)

### §18.10 完成儀式(步驟 ⑪)

解讀完成後,**畫面不要直接結束**,必須顯示:

#### 🌙 今日祝福
範例: 「願今晚的答案,成為照亮你下一段旅程的光。」

#### 三個按鈕(BRAND_BIBLE §8.5)
- ✨ 收藏命運紀錄 → 寫入 localStorage + 推播 LINE
- ✨ 分享今日祝福 → 觸發分享 modal(LINE / FB / 複製 / Twitter)
- ✨ 返回神殿首頁 → 回到 index.html

### §18.11 開發原則

> 神聖探索儀式 是整個平台最重要的核心體驗。
> 不要模仿一般塔羅網站。不要模仿一般 AI 網站。
> 使用者應感受到:「我不是在操作一個網站,而是在完成一場屬於自己的神聖儀式。」

### §18.12 神聖探索儀式 v2.0 與 v1.0 差異

| 面向 | v1.0 | v2.0 |
|---|---|---|
| 步驟數 | 7 步 | 11 步 |
| 主題切換 | 無 | 3 系統獨立 |
| 音效 | 3 通用 | 12 專屬 |
| 翻牌 | 720ms 固定 | 1000ms + 主題粒子 |
| 解讀 | 一次性 | 分段打字機 |
| 完成儀式 | 無 | 今日祝福 + 三按鈕 |


### §18.14 神聖探索引擎(神聖探索引擎 · 可重複使用引擎)

> **神聖探索儀式 不是動畫。神聖探索儀式 是引擎。**
> 三大占卜系統、未來新增的任何牌陣,**不需要重寫動畫**,只需提供配置。
> 引擎讀取 config,自動渲染完整 11 步神聖儀式。

#### 核心概念

`
舊架構:
  神聖探索儀式 塔羅(寫死) + 神聖探索儀式 寵物(寫死) + 神聖探索儀式 神諭(寫死) ❌
新架構:
  神聖探索引擎(核心) + spread-themes/{system}.js(配置) ✅
`

#### 引擎位置

`
xiaomeng-fortune/
├── lib/
│   ├── sacred-stage-engine.js   ← 核心引擎(11 步編舞 + 主題切換 + 音效 + 動畫)
│   ├── sacred-stage.css         ← 引擎樣式(主舞台 + 牌卡 + 翻牌 + 粒子)
│   ├── sacred-stage.html        ← 引擎 HTML 模板(11 步容器)
│   └── spread-themes/           ← 配置目錄
│       ├── tarot.js             ← 塔羅配置
│       ├── pet.js               ← 寵物配置
│       ├── oracle.js            ← 神諭配置
│       └── _template.js         ← 新增牌陣範本
`

#### 神聖探索引擎 公開 API

`js
// 啟動一個神聖舞台
const stage = new SacredStage({
  // 必填
  system: 'tarot' | 'pet' | 'oracle' | 'custom',
  spread: 'three-card' | 'celtic-cross' | 'one-card' | string,
  cards: Array<CardData>,         // 牌組資料
  
  // 主題(從 spread-themes/{system}.js 載入)
  theme: {
    name: string,                 // '命運之門'
    background: string,           // 主題背景色
    accentColor: string,          // 點綴色
    cardBack: string,             // 牌背圖 URL
    cardFrameStyle: object,       // 牌框裝飾
  },
  
  // 音效(自動載入系統 BGM + 11 步音效)
  audio: {
    bgm: string,                  // 'bgm-tarot.mp3'
    enabled: boolean,             // 受 xm_audio_muted 控制
    volume: number,               // 預設 0.3
  },
  
  // 翻牌特效(粒子類型)
  effects: {
    particleType: 'gold-sparkles' | 'pink-hearts-paws' | 'white-light-rays' | 'custom',
    particleCount: number,        // 預設 24
    particleLifetime: number,     // ms, 預設 1500
    glowColor: string,            // 粒子發光色
  },
  
  // 深度靈性解讀模板
  readingTemplate: {
    sections: Array<{
      key: 'core' | 'situation' | 'guidance' | 'blessing',
      title: string,              // '核心訊息'
      template: string,           // 模板字串(含 {{card.name}} 等變數)
      duration: number,           // 打字機總時長
    }>,
  },
  
  // 選填
  onComplete: (reading) => {},   // 完成時 callback
  onShare: (card) => {},         // 分享時 callback
  onSave: (record) => {},        // 收藏時 callback
});

stage.start();                    // 開始 11 步
stage.skip();                     // 略過(罕用)
stage.destroy();                  // 銷毀 + 清理
`

#### CardData 結構

`js
{
  id: 'tarot-00',                 // 唯一 ID
  name: '愚者',                   // 顯示名
  nameEn: 'The Fool',             // 英文
  numeral: '0',                   // 數字或羅馬
  image: 'assets/tarot-00-fool.png',
  keywords: ['新開始', '純真', '冒險'],
  reversed: boolean,              // 是否逆位
  customData: object,             // 系統專屬擴充
}
`

#### 5 大主題變數(由引擎統一管理)

| 變數 | 用途 | 預設 |
|---|---|---|
| --sse-bg | 舞台主背景色 | #0d0718 |
| --sse-accent | 主題點綴色 | #f5d38b |
| --sse-particle-color | 粒子主色 | 跟隨 theme |
| --sse-glow | 光暈顏色 | 跟隨 theme |
| --sse-font | 字型 | Georgia, serif |

#### 引擎職責

`
✅ 11 步完整流程編舞
✅ 自動載入系統主題
✅ 自動播放 BGM + 11 步音效
✅ 自動套用粒子特效
✅ 自動呼叫 readingTemplate 生成解讀
✅ 自動寫入 localStorage(命運紀錄)
✅ 自動觸發完成儀式(今日祝福)
✅ 跨裝置同步(若啟用)
`

#### 配置檔職責

`
✅ 定義該系統的世界觀 / 色彩 / 牌背
✅ 定義該系統的 BGM + 11 步音效路徑
✅ 定義該系統的粒子類型
✅ 定義該系統的解讀模板
✅ 定義該系統的完成祝福語
`

#### 新增牌陣流程(未來)

`
1. 複製 lib/spread-themes/_template.js → lib/spread-themes/my-spread.js
2. 修改 5 大區塊:theme / cards / audio / effects / readingTemplate
3. 呼叫:
   new SacredStage({
     system: 'custom',
     spread: 'my-spread',
     ...config
   }).start();
4. 完成。0 行程式碼動畫。
`

#### 禁止事項

- ❌ 不得在配置檔寫 CSS 動畫
- ❌ 不得在配置檔寫 setTimeout 編舞
- ❌ 不得繞過引擎直接操作 DOM
- ❌ 不得複製現有 神聖探索儀式 程式碼「再寫一份」新系統

### §18.15 神聖探索引擎 與現有 神聖探索儀式 關係

- **現有 神聖探索儀式 程式碼(2026-07-01 前的版本)** → **重構** 為 神聖探索引擎
- **§18.14 神聖探索引擎** 是新架構的 SSOT
- **§18.2 11 步流程** 由 神聖探索引擎 執行(不再由各系統各自實作)

### §18.16 神聖探索引擎 對齊關係

| 神聖探索引擎 元素 | 對齊 |
|---|---|
| 11 步編舞 | BRAND_BIBLE §13 15 動畫 |
| 主題切換 | BRAND_BIBLE §5 色彩 + §10 金框 + §11 光暈 |
| 粒子特效 | BRAND_BIBLE §12 3 粒子系統 |
| 音效 | BRAND_BIBLE §17 12 音效 |
| 解讀模板 | §15 Writing Style + §5 命名公約 |
| 完成儀式 | §18.10 今日祝福 + §20 LINE §7 50 積分 |

### §18.17 神聖探索引擎 Refactor 落地 TODO(2026-07-02 04:02 進度)

> **目標**:把 §18.14 規格化為可運行的程式碼,以 **配置驅動** 取代 **寫死 神聖探索儀式**。
> **目前進度**:2.5 小時只建好骨架 + 1 個示範配置(tarot.js)。今晚必須收尾。
> **完成定義**:Tarot / Pet / Oracle 三系統皆可由配置啟動,舊 神聖探索儀式 程式碼全移除,跨裝置 + 完整 11 步流程通過驗證。

#### 階段 A — 補齊檔案骨架(剩 4 個檔案,約 45 分鐘)

| # | 檔案 | 內容 | 預估 | 狀態 |
|---|---|---|---|---|
| 1 | `lib/sacred-stage.html` | 11 步容器模板 `<stage-opening>` / `<stage-shuffle>` / `<stage-fan>` / `<stage-card>` / `<stage-reading>` / `<stage-blessing>` | 15 min | ⏳ |
| 2 | `lib/sacred-stage.css` | 主舞台 + 牌卡 + 翻牌 + 粒子 + 5 CSS 變數(`--sse-bg/--sse-accent/--sse-particle-color/--sse-glow/--sse-font`)+ RWD 380 / 720 / 1200 | 20 min | ⏳ |
| 3 | `lib/spread-themes/_template.js` | 5 區塊範本(theme / cards / audio / effects / readingTemplate)+ JSDoc | 5 min | ⏳ |
| 4 | `lib/sacred-stage-engine.js` 補完 | `start / skip / destroy` 三方法 + event emitter + 11 步 state machine + audio cue 觸發點 | 已完成 | ✅ |

#### 階段 B — 補齊兩個示範配置(約 30 分鐘)

| # | 配置檔 | 必填區塊 | 來源 |
|---|---|---|---|
| 5 | `lib/spread-themes/pet.js` | theme(奶油星空配色)+ 22 pet cards(bat / cat / dog / ...)+ audio(`bgm-pet.mp3`)+ effects(`pink-hearts-paws`)+ readingTemplate(7 情境 × 5 主題) | 從 `lib/divination-system.js` 抽出 |
| 6 | `lib/spread-themes/oracle.js` | theme(黑金神聖幾何)+ 12 oracle cards(今日訊息 / 宇宙提醒 / 心靈祝福 3 模式)+ audio(`bgm-oracle.mp3`)+ effects(`white-light-rays`)+ readingTemplate | 從 `oracle-data.js` 抽出 |

#### 階段 C — 接入 index.html(約 30 分鐘)

```js
// index.html 移除舊 神聖探索儀式 寫死邏輯,改為:
import { SacredStage } from './lib/sacred-stage-engine.js';
import { TAROT_THEME } from './lib/spread-themes/tarot.js';

// 舊入口取代為:
document.querySelector('#start-tarot').onclick = () => {
  new SacredStage({ system: 'tarot', spread: 'three-card', ...TAROT_THEME }).start();
};
```

- [ ] 找出 index.html / script.js 所有寫死的 神聖探索儀式 JS(展牌 / 翻牌 / 牌組生成)
- [ ] 移除並改用 `SacredStage` 啟動
- [ ] `<head>` 加入 `<link rel="stylesheet" href="lib/sacred-stage.css">`
- [ ] `<body>` 底加入 `<script type="module" src="lib/sacred-stage-engine.js">`

#### 階段 D — 驗證(必跑,約 20 分鐘)

| 驗證項 | 工具 | 通過條件 |
|---|---|---|
| 三系統皆可啟動 | 開瀏覽器 console 跑 `new SacredStage({system:'tarot',...}).start()` 等 3 次 | 無紅字錯誤 + 11 步走完 |
| 完整 11 步 | 手動點擊 tarot 起點 → 看到 blessing | 無跳步 |
| 粒子特效 | tarot(金)/ pet(粉)/ oracle(白)各看一次翻牌 | 粒子爆射 + 自動消失 |
| 主題切換 | 切換 hash `#pet` / `#oracle` | 牌背 + 配色 + BGM 跟著換 |
| 跨裝置 | `_sync_devices.html` 380 / 720 / 1200 | 不切邊 + 不卡頓 |
| `_sync_check.py` | 跑一次 | 9 個 breakpoint 全綠 + 神聖探索引擎 檔案計數 ≥ 4 |
| 舊 神聖探索儀式 殘留 | `grep -r "f22-step" --exclude-dir=node_modules .` | 0 筆匹配 |

#### 階段 E — 提交(5 分鐘)

```bash
# Bible v1.6.0 + 實作 commit
git add PROJECT_BIBLE.md          # 本次 §18.17
git add lib/sacred-stage.html \
        lib/sacred-stage.css  \
        lib/sacred-stage-engine.js \
        lib/spread-themes/ \
        index.html script.js   # 移除的舊 神聖探索儀式 區段
git commit -m "[Bible v1.6.0 + sse-impl] §18.17 神聖探索引擎 Refactor 落地 — 三系統配置驅動引擎上線

1. lib/sacred-stage-engine.js + .html + .css 完整 11 步容器
2. lib/spread-themes/{tarot,pet,oracle,_template}.js 三系統範例配置
3. index.html 移除舊 神聖探索儀式 寫死邏輯,改為 SacredStage 啟動
4. _sync_check.py 整合 神聖探索引擎 檔案計數
5. 跨裝置 380/720/1200 驗證通過
"
git push origin main
```

#### 紅線(絕對不做)

- ❌ **不重寫 spec** — §18.14-§18.16 已是 SSOT,有衝突以 spec 為準。
- ❌ **不繞過 神聖探索引擎 直接操作 DOM** — 任何牌卡動畫都得透過 `SacredStage` API。
- ❌ **不在配置檔寫 setTimeout / CSS** — 配置只宣告「我要什麼」,編舞由引擎負責。
- ❌ **不擴張 scope** — 今晚唯一目標是「三系統可由配置驅動」,新牌陣 / 後台 / LINE 整合留到下次。
- ❌ **不 commit 半成品** — 階段 D 驗證沒全綠之前禁止 commit。

#### 給下次 session 的接續 TODO

完成今晚工作後,下個 session 直接:
1. 看 git log 確認 `sse-impl` commit hash
2. 跑 `_sync_devices.html` 截 4 尺寸存檔
3. 後台 admin 加「神聖探索引擎 配置測試器」面板(讀取 `lib/spread-themes/*.js` 列表 + 一鍵預覽)
4. `/api/sse/log-event` 端點 — 紀錄使用者實際跑了哪系統哪牌陣 → analytics
5. mobile touch ripple(現有 hover-only,要補 touchstart)
6. 效能:粒子用 `transform` + `will-change`,主牌 `requestAnimationFrame` 節流

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


---

## §20 LINE System(獨立檔案)

> **LINE 完整規格文件。所有 LINE 對話文字、按鈕、流程圖皆依此檔案為唯一依據。**

詳細內容請參閱獨立檔案:LINE_SYSTEM.md(12.4 KB,14 章節)

### §20.1 LINE System 章節速覽

| 章節 | 內容 |
|---|---|
| §0 | 命名公約(禁用 BOT / AI,統一小夢靈性導引) |
| §1 | LINE 歡迎詞(第一層推播 + 配圖) |
| §2 | 小夢選單(三層導流 LINE → 小夢靈性導引 → 網站) |
| §3 | Rich Menu(6 區配置 + 設計風格) |
| §4 | 小夢靈性導引對話流程(7 段式 + Quick Reply + Flex) |
| §5 | 會員綁定(流程 + 資料儲存 + 解綁) |
| §6 | 首次免費(3 系統 × 1 次 + 7 天) |
| §7 | 50 靈性積分(取得 + 兌換 + 折抵 + 過期) |
| §8 | 分享好友(LINE/FB/複製/Twitter + 反作弊) |
| §9 | 登入流程(LIFF/網頁訪客/管理員 3 種) |
| §10 | 完整使用者旅程(全新 + 回訪 + 對話記錄) |
| §11 | 推播規範(時機 + 禁用時段 + 模板) |
| §12 | 錯誤處理(4 種情境) |
| §13 | 整合檢查表(10 項) |
| §14 | 版本歷史 |

### §20.2 與其他 Bible 對應關係

| LINE System | PROJECT_BIBLE | BRAND_BIBLE |
|---|---|---|
| §0 命名公約 | §5 命名公約 | — |
| §3 Rich Menu 設計 | — | §5 色彩 + §10 金框 + §11 光暈 |
| §4 對話文案 | §15 Writing Style | §3 品牌語言 |
| §7 靈性積分顯示 | §8 商業規則 | §7 Icon |
| §9 登入按鈕 | — | §8 按鈕 |
| §11 推播文案 | §15 Writing Style | §3 品牌語言 |

### §20.3 強制執行

- 所有 LINE 對話文字必須跑過 §13 整合檢查表(10 項)
- 所有 Quick Reply 不超過 6 個按鈕
- 所有推播遵守 §11.2 禁用時段(22:00-08:00)
- 違反命名公約(§0)的 LINE 對話文字 PR 將被拒絕

---


---

## §21 Opening Experience(首頁不是網站,是體驗)

> **首頁不是功能介紹,而是品牌體驗。**

老闆 2026-07-02 03:32 定案:
> 「首頁不是一般網站,而是 Opening Experience。」

### §21.1 八步序列儀式(Opening Sequence)

使用者進入首頁後,以下八步依序發生(每步有時序 + 動畫 + 音效):

| # | 步驟 | 時點 | 動畫 | 音效 |
|---|---|---|---|
| 1 | 黑畫面 | 0ms | 純黑 #000000 | 無 |
| 2 | 北極星出現 | 800ms | 星點淡入 + 緩慢脈動 | stars-whisper.mp3 |
| 3 | 神聖幾何 | 1800ms | 梅塔特隆立方體線稿由星點連成 | geometry-humming.mp3 |
| 4 | 背景甦醒 | 3000ms | 神女大底圖從 0.1 → 1 opacity | goddess-awakening.mp3 |
| 5 | Logo 顯現 | 4500ms | 小夢神殿 標題從下方 fade-up | soft-chime.mp3 |
| 6 | Hero 主副標 | 5500ms | 標題打字機效果 32ms/字 + 副標 fade-in | hero-pulse.mp3 |
| 7 | 三大入口 | 7000ms | 從兩側滑入 + 依序 staggered 100ms | entry-chimes.mp3 |
| 8 | 開始儀式(CTA) | 8500ms | 從中央 scale 0 → 1 + particle burst | ritual-bell.mp3 |

### §21.2 Hero 文案(定稿)

`yaml
主標: 今晚,你想尋找什麼答案?
副標:
  - EN: Every soul has its own constellation.
  - 中: 每一個靈魂,都有屬於自己的星軌。
CTA:  讓小夢陪你翻開命運的第一張牌。
``n
### §21.3 Ritual CTA 按鈕(§8.6 變體)

詳見 BRAND_BIBLE.md §8.6 Ritual CTA Button,核心六特徵:
1. 玻璃質感(backdrop-filter: blur(18px) + rgba 半透明)
2. 香檳金邊框(linear-gradient + mask-composite: exclude)
3. 流光 Hover(gradient sweep animation 1.2s)
4. Glow(box-shadow 內外雙層 + animation divine-glow-pulse 1.8s)
5. Particle Burst(hover 時 gold-sparkles-burst,詳 §12)
6. Hover Floating(transform: translateY(-3px) + 微妙陰影變化)

### §21.4 點擊轉場(按鈕 → 進入 神聖探索儀式)

`yaml
click_action:
  - 卡片從 Hero 區飛向畫面中央(150ms, transform + scale)
  - 同時所有元素 opacity → 0(200ms)
  - 200ms 黑屏過場
  - 進入 神聖探索儀式 系統選擇頁(三大神殿)
`

### §21.5 強制規則

- ❌ 不得用任何傳統 CTA 按鈕樣式(Bootstrap / Material / 純色填充)
- ❌ 不得在 §21.2 主副標出現之前,顯示任何按鈕或入口
- ✅ Hero 文字必須對齊 BRAND_BIBLE §3 品牌語言(小夢 / 靈魂 / 星軌 / 命運之門)
- ✅ 每次進首頁都跑 §21.1 完整 8 步(除非 localStorage 有 session)
- ✅ 必須 audio-visually synced(對齊 §17 Audio Bible + §13 Animation)

### §21.6 對齊關係

| Opening Experience | 對齊 |
|---|---|
| §21.1 八步序列 | BRAND_BIBLE §13 15 動畫 + §17 Audio Bible |
| §21.2 文案 | BRAND_BIBLE §3 品牌語言 + §15 Writing Style |
| §21.3 Ritual CTA | BRAND_BIBLE §8.6 |
| §21.4 點擊轉場 | BRAND_BIBLE §13 typewriter-32ms + §11 divine-glow-pulse |
| §21.5 強制規則 | BRAND_BIBLE §14 跨頁一致性 |


---

## §22 5 Bible 獨立檔案(對齊老闆 7:13 拆分計畫)

> **狀態:** v1.0 已生效(2026-07-02)
> **拆分原因:** 避免單檔過大,方便 Review 與迭代,方便交給開發者。

### §22.1 5 個 Bible 對齊表

| Bible 檔名 | 內容 | 章節 | 行數 |
|---|---|---|---|
| **BUSINESS_BIBLE.md** | 商業模式 / 4 循環 / 收入源 / 商業流程 | §0-§8 | ~200 |
| **UX_BIBLE.md** | 使用者流程 / IA / 12 幕 / 每日回來 | §0-§7 | ~250 |
| **MEMBERSHIP_BIBLE.md** | 會員 3 Tier / SP / 月相 6 級 / 福利 | §0-§10 | ~250 |
| **COMMERCE_BIBLE.md** | 9 SKU / 綠界 / 滿 599 折 50 / 商城 | §0-§10 | ~200 |
| **REFERRAL_BIBLE.md** | 分享裂變 / OG Image / 反作弊 | §0-§11 | ~150 |

### §22.2 5 Bible 對齊 PROJECT_BIBLE

| 5 Bible 章節 | 對齊 PROJECT_BIBLE |
|---|---|
| BUSINESS §0 4 循環 | §1 專案定位 + §8 商業規則 |
| BUSINESS §2 商業流程 | §21 Opening Experience |
| UX §1 12 幕 | §21 Opening Experience + §18 Sacred Flow |
| UX §2 4 層架構 | §6 系統清單 |
| MEMBERSHIP §1 3 Tier | §8 商業規則 |
| MEMBERSHIP §3 SP 系統 | §8 商業規則 |
| MEMBERSHIP §6 月相 6 級 | §6 系統清單 |
| COMMERCE §1 商城 | §8 商業規則 |
| COMMERCE §2 9 SKU | §8 商業規則 |
| COMMERCE §3 滿 599 折 50 | §8 商業規則(老闆硬規則)|
| REFERRAL §1 4 管道 | §8.2 分享獎勵 |
| REFERRAL §3 裂變循環 | §8.2 分享獎勵 |

### §22.3 5 Bible 對齊 8 份舊 DRAFT(已封存)

| 5 Bible | 取代 8 份舊 DRAFT |
|---|---|
| BUSINESS | BUSINESS_ARCHITECTURE_v1.0 + v2.0 + PLATFORM_BIBLE_OVERVIEW_v3.0 |
| UX | HOMEPAGE_3LAYER_UX_v1.0 + HOMEPAGE_HERO_REVIEW_v2.0 + STORYBOARD_v3.0 |
| MEMBERSHIP | SOUL_POINTS_ECOSYSTEM_v1.0(部分) |
| COMMERCE | SOUL_POINTS_ECOSYSTEM_v1.0(部分) |
| REFERRAL | LINE_OFFICIAL_EXPERIENCE_v2.0(部分) |

8 份舊 DRAFT 已移到 `_archive_bibles_2026-07-02/`(永久保留,可查歷史)。

### §22.4 與 BRAND_BIBLE + LINE_SYSTEM 並列

5 Bible + BRAND_BIBLE + LINE_SYSTEM = 7 份獨立規格文件。

| 文件 | 對齊 PROJECT_BIBLE 章節 |
|---|---|
| BRAND_BIBLE.md | §19 |
| LINE_SYSTEM.md | §20 |
| **BUSINESS_BIBLE.md** | **§22.1** |
| **UX_BIBLE.md** | **§22.1** |
| **MEMBERSHIP_BIBLE.md** | **§22.1** |
| **COMMERCE_BIBLE.md** | **§22.1** |
| **REFERRAL_BIBLE.md** | **§22.1** |

### §22.5 修改與迭代

- 任何 5 Bible 修改 → 在該 Bible 內改 → 同步更新本節對齊表
- 任何 v1.x 變更 → Bible 升 v1.x+1
- 不允許「跨 Bible 同步」直接覆蓋,要明確標註來源

---

## §23 截圖驗證流程(對齊老闆 11:54 截圖需求)

> **檔案:** `_SCREENSHOTS_TODO.md`(截圖指南)+ `_SCREENSHOTS_REPORT.md`(報告)
> **規格:** 4 尺寸(380 / 720 / 1200 / 1920)

| 尺寸 | 設備 | 驗證項目 | 狀態 |
|---|---|---|---|
| 380 × 667 | iPhone 直 | Hero 4 入口堆疊 / Topbar 收合 | ⏳ 老闆實機 |
| 720 × 1024 | iPad 直 | Hero + L2 收合 | ⏳ 老闆實機 |
| 1200 × 800 | 筆電 | Hero + L2 + L3 完整 | ⏳ 老闆實機 |
| 1920 × 1080 | 桌機 | Hero + L2 + L3 完整 | ⏳ 老闆實機 |

**自動驗證(已過):** `_sync_check.py` 5/5(commit bf10827 後)。

**老闆截完圖後,**寫 `_SCREENSHOTS_REPORT.md` 對齊驗證結果。

---

---

**Project Bible v1.0.0 — 正式生效**

蝦董 / 龍蝦團隊 / 小夢老師 共同維護

修改需更新版本號(v1.0.1 / v1.1.0 / v2.0.0)
