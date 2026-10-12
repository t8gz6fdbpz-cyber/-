// Non-destructive delivery variants. Originals, aspect ratios and colors stay intact.
// Use the existing bundled Sharp runtime via SHARP_MODULE_PATH; no project dependency.
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { readFile, readdir, stat } from "node:fs/promises";
import assert from "node:assert/strict";

const sharp = (await import(process.env.SHARP_MODULE_PATH
  ? pathToFileURL(process.env.SHARP_MODULE_PATH).href : "sharp")).default;
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const travel = JSON.parse(await readFile(path.join(root, "src/data/travelPhotoSources.json"), "utf8"));
const personal = (await readdir(path.join(root, "public/images/interests/personal")))
  .filter(name => name.endsWith(".webp") && !name.includes(".responsive-"))
  .map(name => ({ src: `/images/interests/personal/${name}` }));
let originalBytes = 0, responsiveBytes = 0, variants = 0;
for (const photo of [...travel, ...personal]) {
  const source = path.join(root, "public", photo.src);
  const { width } = await sharp(source).metadata();
  originalBytes += (await stat(source)).size;
  if (width <= 800) { responsiveBytes += (await stat(source)).size; continue; }
  // 800px supports the current phone gallery at >2x CSS resolution.
  const result = await sharp(source).resize({ width: 800, withoutEnlargement: true })
    .webp({ quality: 92, effort: 6 }).toFile(source.replace(/\.webp$/, ".responsive-800.webp"));
  responsiveBytes += result.size; variants++;
}
const logo = path.join(root, "public/assets/wujiahao-monogram-cutout.png");
const logoOutput = logo.replace(/\.png$/, ".lossless.webp");
await sharp(logo).webp({ lossless: true, effort: 6 }).toFile(logoOutput);
const originalPixels = await sharp(logo).ensureAlpha().raw().toBuffer();
const outputPixels = await sharp(logoOutput).ensureAlpha().raw().toBuffer();
// RGB in fully transparent pixels is immaterial; every visible pixel is exact.
for (let i = 0; i < originalPixels.length; i += 4) {
  assert.equal(outputPixels[i + 3], originalPixels[i + 3]);
  if (!originalPixels[i + 3]) continue;
  for (let channel = 0; channel < 3; channel++) assert.equal(outputPixels[i + channel], originalPixels[i + channel]);
}
console.log(JSON.stringify({ variants, originalBytes, responsiveBytes,
  smallerPhotoSetPercent: Math.round((1 - responsiveBytes / originalBytes) * 100),
  logoOriginalBytes: (await stat(logo)).size, logoLosslessBytes: (await stat(logoOutput)).size,
  logoVisiblePixelsExact: true }));
