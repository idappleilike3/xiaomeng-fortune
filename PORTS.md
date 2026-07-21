# 本機埠號約定（勿互搶）

| 專案 | 埠號 | 說明 |
|------|------|------|
| **xiaomeng-fortune（小夢神殿）** | **3000**（固定） | 主站 + 手勢 demo；cloudflared 也指到此埠 |
| haizaima（還在嗎） | 3001+ | 勿佔 3000 |
| emotion-bridge / stock / 其他 | 3001+ | 勿佔 3000 |

## 規則

1. 啟動小夢前，確認 `localhost:3000` 回的是「小夢老師」標題，不是 Next.js / 其他站。
2. 其他專案開發請設 `PORT=3001`（或更高），不要搶 3000。
3. 同一時刻只開一條指到 3000 的 Cloudflare quick tunnel，避免舊網址與新網址混淆。

## 為什麼手機連結常常「突然打不開」？

**不是跟網路上別人搶線。** 常見原因只有兩種：

1. **臨時隧道會失效**  
   `*.trycloudflare.com`（Cloudflare quick tunnel）每次重開都會換成**新的隨機網址**。  
   電腦休眠、關終端機、關掉 cloudflared、重開 tunnel → 舊連結立刻失效。  
   **解法：** 預覽期間保持電腦醒著、不要關 cloudflared 視窗；或改用固定方案（見下）。

2. **本機埠被別的程式佔走**  
   股票站 / emotion-bridge 等若也跑在 3000，看起來就像「小夢掛了」。  
   **解法：** 小夢固定 3000；其他一律 3001+。

### 較長久的選項

| 方式 | 說明 |
|------|------|
| 保持本機 + tunnel 開著 | 最快，但網址仍會變、電腦不能睡 |
| [Render 正式站](https://xiaomeng-fortune.onrender.com/) | 固定網址；可能是較舊的部署 |
| Named Cloudflare Tunnel / ngrok 付費 | 固定自訂網址，適合長期分享 |

## 本站常用路徑（同一 origin，互不覆蓋）

- `/` — 主站首頁
- `/gesture-particle-demo.html` — 手勢粒子
- `/gesture-crystal-demo.html` — 手勢水晶
- `/mobile.html` — 手機入口導覽
