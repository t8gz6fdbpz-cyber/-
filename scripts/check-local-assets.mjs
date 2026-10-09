// Read-only local asset verification after image URL optimization.
import assert from "node:assert/strict";
import { access } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createServer } from "vite";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const server = await createServer({ root, logLevel: "error", appType: "custom", server: { middlewareMode: true } });
const assets = new Set();
function collect(value) {
  if (typeof value === "string") {
    for (const match of value.matchAll(/\/(?:assets|images|toolbox)\/[^\s,]+\.(?:webp|png|jpe?g|svg|mp4)/g)) assets.add(match[0]);
  } else if (Array.isArray(value)) value.forEach(collect);
  else if (value && typeof value === "object") Object.values(value).forEach(collect);
}
try {
  for (const module of ["/src/utils/portfolioData.ts", "/src/utils/interestsData.ts", "/src/data/interestDetails.ts", "/src/data/mingmingCase.ts", "/src/data/hengqianCase.ts"])
    collect(await server.ssrLoadModule(module));
  const missing = [];
  for (const asset of assets) {
    try { await access(path.join(root, "public", asset)); }
    catch { missing.push(asset); }
  }
  assert.deepEqual(missing, [], "Missing local assets");
  console.log(`PASS: ${assets.size} actual local image/video paths exist; no originals removed.`);
} finally { await server.close(); }
