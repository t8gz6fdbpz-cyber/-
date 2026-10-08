// Build a local, opt-in production audit. Normal npm run build omits all probes.
import path from "node:path";
import { fileURLToPath } from "node:url";
import { readFile, writeFile } from "node:fs/promises";
import { build } from "vite";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = process.argv[2];
if (!outDir || !path.isAbsolute(outDir)) throw new Error("Pass an explicit absolute audit output directory.");
process.env.VITE_PERFORMANCE_AUDIT = "true";
await build({ root, build: { outDir, emptyOutDir: false } });
const index = path.join(outDir, "index.html");
const earlyProbe = `<script>
if (new URLSearchParams(location.search).has('perf-audit')) {
  const nativeFrame = window.requestAnimationFrame.bind(window);
  const audit = window.__portfolioFrameAudit = {active:false,count:0,costs:[],nativeFrame};
  window.requestAnimationFrame = callback => nativeFrame(time => {
    if (!audit.active) { callback(time); return; }
    const start = performance.now(); callback(time);
    audit.costs.push(performance.now() - start); audit.count++;
  });
}
</script>`;
await writeFile(index, (await readFile(index, "utf8")).replace("<head>", `<head>${earlyProbe}`));
