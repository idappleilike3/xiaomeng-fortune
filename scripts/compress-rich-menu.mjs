// scripts/compress-rich-menu.mjs
// Compress a rich-menu PNG to 2500×1686 and under LINE's 1MB limit.
import sharp from "sharp";
import { existsSync, statSync } from "node:fs";
import { join } from "node:path";

const rootDir = process.cwd();
const inputPath = process.argv[2] || join(rootDir, "assets", "rich-menu-v5.png");
const outputPath = process.argv[3] || inputPath;

if (!existsSync(inputPath)) {
  console.error(`Input not found: ${inputPath}`);
  process.exit(1);
}

let colours = 96;
let lastSize = Infinity;
for (let attempt = 0; attempt < 6; attempt++) {
  await sharp(inputPath)
    .resize(2500, 1686, { fit: "cover", position: "center" })
    .png({ compressionLevel: 9, palette: true, effort: 10, colours })
    .toFile(outputPath === inputPath ? outputPath + ".tmp.png" : outputPath);

  const out = outputPath === inputPath ? outputPath + ".tmp.png" : outputPath;
  lastSize = statSync(out).size;
  if (lastSize <= 1024 * 1024) {
    if (outputPath === inputPath) {
      const { renameSync, unlinkSync } = await import("node:fs");
      try {
        unlinkSync(outputPath);
      } catch {}
      renameSync(out, outputPath);
    }
    console.log(`Compressed: ${outputPath} (${(lastSize / 1024).toFixed(1)} KB, colours=${colours})`);
    process.exit(0);
  }
  colours = Math.max(16, Math.floor(colours * 0.7));
  console.warn(`Still ${(lastSize / 1024 / 1024).toFixed(2)} MB — retry colours=${colours}`);
}

console.error(`Failed to get under 1MB (last ${(lastSize / 1024 / 1024).toFixed(2)} MB)`);
process.exit(1);
