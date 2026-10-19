// Logic and source contracts only. Real browser switching is reported separately.
import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";
import postcss from "postcss";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = file => readFile(path.join(root, file), "utf8");
const modelCode = ts.transpileModule(await read("src/motion/motionModel.ts"), {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
}).outputText;
const { resolveMotionPreference, normalizeMotionChoice, readMotionChoice, saveMotionChoice, MOTION_STORAGE_KEY } =
  await import(`data:text/javascript;base64,${Buffer.from(modelCode).toString("base64")}`);

let stateCases = 0;
for (const choice of ["system", "full", "reduced"]) {
  for (const system of [false, true]) {
    for (const query of [false, true]) {
      const result = resolveMotionPreference(choice, system, query);
      assert.equal(result.reduced, query || choice === "reduced" || (choice === "system" && system));
      assert.equal(result.source, query ? "link" : choice === "system" ? "system" : "visitor");
      stateCases++;
    }
  }
}
for (const invalid of [null, undefined, "", "reduce", "FULL", "bad", {}, 1]) {
  assert.equal(normalizeMotionChoice(invalid), "system");
}
const values = new Map();
const storage = {
  getItem: key => values.get(key) ?? null,
  setItem: (key, value) => values.set(key, value),
  removeItem: key => values.delete(key),
};
assert.equal(readMotionChoice(storage), "system");
for (const choice of ["full", "reduced", "system"]) {
  assert.equal(saveMotionChoice(storage, choice), true);
  assert.equal(readMotionChoice(storage), choice, "Refresh must preserve the chosen mode");
}
assert.ok(!values.has(MOTION_STORAGE_KEY), "Following the OS removes the override");
const denied = () => { throw new Error("Denied"); };
assert.equal(readMotionChoice({ getItem: denied }), "system");
for (const choice of ["full", "reduced", "system"]) {
  assert.equal(saveMotionChoice({ setItem: denied, removeItem: denied }, choice), false);
}

async function files(directory) {
  const entries = await readdir(path.join(root, directory), { withFileTypes: true });
  return (await Promise.all(entries.map(entry => entry.isDirectory() ? files(`${directory}/${entry.name}`) : `${directory}/${entry.name}`))).flat();
}
let nativeQueries = 0, cssFallbackRules = 0, explicitRules = 0;
for (const file of await files("src")) {
  if (/\.(ts|tsx)$/.test(file)) {
    const source = await read(file);
    assert.ok(!/\buseReducedMotion\b/.test(source), `${file}: independent Framer preference bypasses the provider`);
    if (source.includes("prefers-reduced-motion")) {
      assert.ok(["src/motion/MotionPreference.tsx", "src/entry-prerender.tsx"].includes(file), `${file}: extra native preference reader`);
      nativeQueries++;
    }
  }
  if (!file.endsWith(".css")) continue;
  postcss.parse(await read(file)).walkRules(rule => {
    let native = false;
    for (let parent = rule.parent; parent; parent = parent.parent) {
      if (parent.type === "atrule" && parent.params?.includes("prefers-reduced-motion")) native = true;
    }
    if (native) {
      for (const selector of postcss.list.comma(rule.selector)) {
        if (!selector.includes('html:not([data-motion])') && !selector.includes('html:where(:not([data-motion]))')) {
          // Throw a plain error: PostCSS otherwise attaches the whole CSS AST.
          throw new Error(`${file}: native CSS overrides explicit full motion: ${selector}`);
        }
      }
      cssFallbackRules++;
    }
    if (rule.selector.includes('html[data-motion="reduce"]') || rule.selector.includes('html:where([data-motion="reduce"])')) explicitRules++;
  });
}
assert.equal(nativeQueries, 2, "Only provider and pre-hydration bootstrap read the OS preference");
assert.ok(cssFallbackRules > 30 && explicitRules === cssFallbackRules, "Every native CSS fallback needs an explicit simplified counterpart");
const provider = await read("src/motion/MotionPreference.tsx");
assert.match(provider, /reducedMotion=\{reduced \? "always" : "never"\}/);
assert.match(provider, /removeEventListener\("change", sync\)/);
assert.match(provider, /removeEventListener\("storage", onStorage\)/);
assert.match(provider, /search\.delete\("motion"\)/);
assert.match(provider, /motionPreferenceOnly: true/);
assert.match(await read("src/routing.tsx"), /navigationType === "REPLACE" && location\.state\?\.motionPreferenceOnly/);
const scenes = await read("src/components/cases/HengqianScrollScene.tsx");
assert.equal((scenes.match(/if \(short\)/g) ?? []).length, 2);
assert.equal((scenes.match(/\[compact, reduce, short\]/g) ?? []).length, 2);
assert.equal((scenes.match(/media\.revert\(\); context\.revert\(\)/g) ?? []).length, 2);
assert.match(scenes, /if \(reduce \|\| !root\.current\) return/);
console.log(`PASS: ${stateCases} preference combinations; invalid input; persistence/reset/storage denial; ${cssFallbackRules} paired CSS rules; centralized readers; Framer configuration; URL handling; listener and GSAP cleanup contracts.`);
