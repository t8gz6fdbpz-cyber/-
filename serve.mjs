import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, extname, join, normalize } from "node:path";

const projectRoot = dirname(fileURLToPath(import.meta.url));
const root = join(projectRoot, "dist");
const port = 4174;

const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".jpg": "image/jpeg",
  ".gif": "image/gif",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
};

const server = createServer(async (req, res) => {
  try {
    const urlPath = new URL(req.url ?? "/", "http://localhost").pathname;
    const safePath = normalize(decodeURIComponent(urlPath)).replace(/^(\.\.[/\\])+/, "");
    const relativePath =
      safePath === "/" || safePath === "\\"
        ? "index.html"
        : safePath.replace(/^[/\\]+/, "");
    let filePath = join(root, relativePath);
    let file;

    try {
      file = await readFile(filePath);
    } catch {
      filePath = join(root, "index.html");
      file = await readFile(filePath);
    }

    const type = mimeTypes[extname(filePath)] ?? "application/octet-stream";
    res.writeHead(200, { "Content-Type": type });
    res.end(file);
  } catch (error) {
    console.error(error);
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Not found");
  }
});

server.listen(port, "127.0.0.1", () => {
  console.log(`Portfolio preview running at http://127.0.0.1:${port}`);
});
