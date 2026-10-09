// Run with Node and Sharp installed, or set SHARP_MODULE_PATH to its module path.
// Crops exactly the area shown by object-fit: cover / object-position: center 18%.
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { stat } from "node:fs/promises";

const sharp = (await import(process.env.SHARP_MODULE_PATH
  ? pathToFileURL(process.env.SHARP_MODULE_PATH).href
  : "sharp")).default;
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
let originalBytes = 0;
let thumbnailBytes = 0;

for (let index = 1; index <= 16; index += 1) {
  const base = path.join(root, "public/assets", `daren-gallery-${String(index).padStart(2, "0")}`);
  const source = `${base}.jpg`;
  const { width, height } = await sharp(source).metadata();
  const targetRatio = 432 / 282;
  const cropWidth = Math.min(width, Math.floor(height * targetRatio));
  const cropHeight = Math.min(height, Math.floor(width / targetRatio));
  const crop = {
    width: cropWidth,
    height: cropHeight,
    left: Math.floor((width - cropWidth) / 2),
    top: Math.floor((height - cropHeight) * 0.18),
  };
  originalBytes += (await stat(source)).size;
  for (const targetWidth of [432, 864]) {
    const result = await sharp(source).extract(crop)
      .resize(targetWidth, Math.round(targetWidth / targetRatio))
      .webp({ quality: 78, effort: 5 })
      .toFile(`${base}.thumb-${targetWidth}.webp`);
    if (targetWidth === 864) thumbnailBytes += result.size;
  }
}
console.log(JSON.stringify({ originalBytes, desktopThumbnailBytes: thumbnailBytes,
  savingPercent: Math.round((1 - thumbnailBytes / originalBytes) * 100) }));
