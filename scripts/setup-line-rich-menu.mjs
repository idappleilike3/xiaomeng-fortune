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

const richMenuConfig = JSON.parse(readFileSync(join(rootDir, "line-rich-menu-config.json"), "utf8"));
const imagePath = join(rootDir, "assets", "rich-menu-xiaomeng.png");

if (!existsSync(imagePath)) {
  throw new Error("Missing assets/rich-menu-xiaomeng.png. Run: npm run rich-menu:image");
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
