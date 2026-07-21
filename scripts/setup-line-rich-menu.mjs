import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const rootDir = process.cwd();

function loadEnvFile() {
  const envPath = join(rootDir, ".env");
  if (!existsSync(envPath)) return;

  const envText = readFileSync(envPath, "utf8");
  envText.split(/\r?\n/).forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) return;
    const index = trimmed.indexOf("=");
    if (index === -1) return;
    const key = trimmed.slice(0, index).trim();
    const value = trimmed.slice(index + 1).trim().replace(/^["']|["']$/g, "");
    if (!process.env[key]) process.env[key] = value;
  });
}

async function lineRequest(path, options = {}) {
  const token = process.env.LINE_CHANNEL_ACCESS_TOKEN;
  if (!token) throw new Error("Missing LINE_CHANNEL_ACCESS_TOKEN in .env");
  const baseUrl = options.dataApi ? "https://api-data.line.me" : "https://api.line.me";
  const { dataApi, ...fetchOptions } = options;

  const response = await fetch(`${baseUrl}${path}`, {
    ...fetchOptions,
    headers: {
      authorization: `Bearer ${token}`,
      ...(fetchOptions.headers || {}),
    },
  });

  const text = await response.text();
  let payload = {};
  if (text) {
    try {
      payload = JSON.parse(text);
    } catch {
      payload = { raw: text };
    }
  }

  if (!response.ok) {
    throw new Error(`LINE API failed ${response.status}: ${JSON.stringify(payload)}`);
  }

  return payload;
}

loadEnvFile();

const liffId = process.env.LIFF_ID || "";
if (!liffId || liffId.includes("你的") || liffId === "YOUR_LIFF_ID") {
  throw new Error("Set a real LIFF_ID in .env before running rich-menu:setup");
}

const configPath = existsSync(join(rootDir, "line/rich-menu.json"))
  ? join(rootDir, "line/rich-menu.json")
  : join(rootDir, "line-rich-menu-config.json");

const rawConfig = readFileSync(configPath, "utf8").replaceAll("${LIFF_ID}", liffId);
const richMenuConfig = JSON.parse(rawConfig);

const imageCandidates = [
  join(rootDir, "assets", "rich-menu-v5.png"),
  join(rootDir, "assets", "rich-menu-v4.png"),
  join(rootDir, "assets", "rich-menu-xiaomeng.png"),
];
const imagePath = imageCandidates.find((p) => existsSync(p));
if (!imagePath) {
  throw new Error("Missing rich menu image. Run: npm run rich-menu:image (or add assets/rich-menu-v5.png)");
}

const created = await lineRequest("/v2/bot/richmenu", {
  method: "POST",
  headers: { "content-type": "application/json" },
  body: JSON.stringify(richMenuConfig),
});

await lineRequest(`/v2/bot/richmenu/${created.richMenuId}/content`, {
  method: "POST",
  dataApi: true,
  headers: { "content-type": "image/png" },
  body: readFileSync(imagePath),
});

await lineRequest(`/v2/bot/user/all/richmenu/${created.richMenuId}`, {
  method: "POST",
});

console.log(`Rich menu created and set as default: ${created.richMenuId}`);
console.log(`Config: ${configPath}`);
console.log(`Image: ${imagePath}`);
console.log(`LIFF links use LIFF_ID=${liffId}`);
