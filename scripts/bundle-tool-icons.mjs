// Prints the generated lazy-loaded icon map. Regenerate when tool icons change.
// Uses Sharp from the local installation, or SHARP_MODULE_PATH. No runtime dep.
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { readFile } from "node:fs/promises";
const sharp = (await import(process.env.SHARP_MODULE_PATH
  ? pathToFileURL(process.env.SHARP_MODULE_PATH).href : "sharp")).default;
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const files = {
  chatgpt: "chatgpt.svg", claude: "claude.webp", codex: "codex.webp",
  jimeng: "jimeng.webp", capcut: "capcut.webp", premiere: "premiere.webp",
  photoshop: "photoshop.webp", canva: "canva.svg", douyin: "douyin.webp",
  "wechat-channels": "wechat-channels.webp", xiaohongshu: "xiaohongshu.webp",
  tiktok: "tiktok.svg",
};
const icons = {};
for (const [id, file] of Object.entries(files)) {
  const source = path.join(root, "public/toolbox", file);
  const svg = file.endsWith(".svg");
  const buffer = svg ? await readFile(source)
    : await sharp(source).resize(192, 192, { fit: "inside", withoutEnlargement: true })
      .webp({ quality: 88 }).toBuffer();
  // Fragment keeps the existing texture renderer's per-tool visual treatment.
  icons[id] = `data:${svg ? "image/svg+xml" : "image/webp"};base64,${buffer.toString("base64")}#${id}`;
}
console.log(JSON.stringify(icons, null, 2));
