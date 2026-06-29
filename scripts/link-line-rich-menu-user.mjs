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

  const response = await fetch(`https://api.line.me${path}`, {
    ...options,
    headers: {
      authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    },
  });
  const text = await response.text();
  const payload = text ? JSON.parse(text) : {};
  if (!response.ok) throw new Error(`LINE API failed ${response.status}: ${text}`);
  return payload;
}

loadEnvFile();

const userId = process.argv[2];
const richMenuId = process.argv[3];

if (!userId || !richMenuId) {
  throw new Error("Usage: node scripts/link-line-rich-menu-user.mjs <LINE_USER_ID> <RICH_MENU_ID>");
}

await lineRequest(`/v2/bot/user/${encodeURIComponent(userId)}/richmenu/${encodeURIComponent(richMenuId)}`, {
  method: "POST",
});

const linked = await lineRequest(`/v2/bot/user/${encodeURIComponent(userId)}/richmenu`);
console.log(JSON.stringify({ ok: true, userId, linked }, null, 2));
