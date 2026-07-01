// scripts/compress-rich-menu.mjs
// 用 sharp 把 Rich Menu 圖壓縮到 2500×1686 + 1MB 內
import sharp from "sharp";
import { existsSync, statSync } from "node:fs";
import { join } from "node:path";

const rootDir = process.cwd();
const inputPath = process.argv[2] || join(rootDir, "..", ".openclaw", "media", "tool-image-generation", "richmenu-v2-D-portrait-hero---2872d657-eff5-412e-9424-e061975b603e.png");
const outputPath = join(rootDir, "assets", "rich-menu-xiaomeng.png");

if (!existsSync(inputPath)) {
  console.error(`Input not found: ${inputPath}`);
  process.exit(1);
}

await sharp(inputPath)
  .resize(2500, 1686, { fit: "cover", position: "center" })
  .png({ quality: 50, compressionLevel: 9, palette: true, effort: 10, colours: 64 })
  .toFile(outputPath);

const size = statSync(outputPath).size;
console.log(`Compressed: ${outputPath} (${(size / 1024).toFixed(1)} KB)`);
if (size > 1024 * 1024) {
  console.error("Still > 1MB, try lower quality");
  process.exit(1);
}
