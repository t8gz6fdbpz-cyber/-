// Build regression guards. No browser or network automation, no dependencies.
import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const html = await readFile(path.join(root, "dist/index.html"), "utf8");
const text = html.replace(/<[^>]*>/g, "");
assert.match(html, /data-prerendered="home"/);
for (const content of ["WUJIAHAO", "关于我", "重点经历", "工具星系", "我的兴趣爱好", "可以从这里找到我"]) {
  assert.ok(text.includes(content), `Missing prerendered content: ${content}`);
}
assert.equal((html.match(/data-animated-char=/g) ?? []).length, 206);
assert.equal((html.match(/class="marquee-card-shell /g) ?? []).length, 32);
assert.ok(!html.includes("interests-showcase-watermarks"));
for (const route of ["/cases/wujiahao", "/cases/hengqian", "/interests/sports", "/interests/travel", "/interests/singing", "/interests/reading"]) {
  assert.ok(html.includes(`href="${route}"`), `Missing entry: ${route}`);
}

const bootstrap = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(match => match[1]).find(script => script.includes("prerenderTime"));
assert.ok(bootstrap, "Missing pre-hydration clock and route guard");
function runBootstrap(pathname, reduced, hash = "") {
  const fields = [{}, {}, {}];
  const links = ["/", "/#interests"].map(href => ({
    href, current: href === "/" ? "page" : undefined,
    getAttribute() { return this.href; },
    setAttribute(name, value) { assert.equal(name, "aria-current"); this.current = value; },
    removeAttribute() { this.current = undefined; },
  }));
  const element = {
    dataset: {}, cleared: false, removed: false,
    replaceChildren() { this.cleared = true; },
    removeAttribute(name) { assert.equal(name, "data-prerendered"); this.removed = true; },
    querySelectorAll(selector) {
      if (selector === "#floating-logo-nav-panel a") return links;
      assert.equal(selector, ".hero-cover-meta p"); return fields;
    },
  };
  vm.runInNewContext(bootstrap, {
    document: { getElementById: () => element }, location: { pathname, hash },
    matchMedia: () => ({ matches: reduced }), Date,
  });
  return { element, fields, links };
}
const home = runBootstrap("/", false);
assert.ok(!home.element.cleared);
assert.ok(Math.abs(Number(home.element.dataset.prerenderTime) - Date.now()) < 1000);
assert.ok(home.fields[1].textContent && home.fields[2].textContent);
assert.equal(home.links[0].current, "page");
const anchored = runBootstrap("/", false, "#interests");
assert.equal(anchored.links[0].current, undefined);
assert.equal(anchored.links[1].current, "page");
for (const [pathname, reduced] of [["/cases/wujiahao", false], ["/interests/reading", false], ["/", true]]) {
  const result = runBootstrap(pathname, reduced);
  assert.ok(result.element.cleared && result.element.removed, "Client-render fallback must not hydrate unrelated markup");
}
for (const filename of await readdir(path.join(root, "dist/assets"))) {
  assert.ok(!filename.includes("performanceAudit"), "Audit recorder leaked into production assets");
  if (!filename.endsWith(".js")) continue;
  const source = await readFile(path.join(root, "dist/assets", filename), "utf8");
  assert.ok(!source.includes("__portfolioFrameAudit"), "Frame probe leaked into production JS");
}
console.log("PASS: static homepage, 206 characters, 32 gallery cards, all entries, live clock, direct routes, reduced-motion fallback, clean production bundle.");
