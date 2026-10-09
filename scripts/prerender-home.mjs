// Build-time HTML only: no server, runtime dependency, or hosting change.
import path from "node:path";
import { fileURLToPath } from "node:url";
import { readFile, writeFile } from "node:fs/promises";
import { createServer } from "vite";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.resolve(process.argv[2] ?? path.join(root, "dist"));
process.env.NODE_ENV = "production";
const server = await createServer({
  root, mode: "production", logLevel: "error", appType: "custom",
  ssr: {
    noExternal: ["react-router-dom", "react-router"],
    resolve: { conditions: ["module-sync", "node", "import"] },
  },
  server: { middlewareMode: true },
});
try {
  const { renderHome, clockBootstrap } = await server.ssrLoadModule("/src/entry-prerender.tsx");
  const timestamp = Date.now();
  const index = path.join(outDir, "index.html");
  const html = await readFile(index, "utf8");
  if (!html.includes('<div id="root"></div>')) throw new Error("Unexpected HTML root; refusing to replace content.");
  const markup = renderHome(timestamp);
  if (!markup.includes("hero-cover-image") || !markup.includes("我的兴趣爱好")) throw new Error("Incomplete prerender.");
  await writeFile(index, html.replace('<div id="root"></div>',
    `<div id="root" data-prerendered="home" data-prerender-time="${timestamp}">${markup}</div>${clockBootstrap()}`));
  console.log(`Prerendered the existing homepage (${markup.length} characters).`);
} finally { await server.close(); }
