const fs = require("node:fs");
const path = require("node:path");
const ts = require("typescript");
const assert = require("node:assert/strict");
const compiled = ts.transpileModule(fs.readFileSync(path.join(__dirname, "../src/components/ui/accountOrbitMotion.ts"), "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
const loaded = { exports: {} };
new Function("exports", "require", "module", compiled)(loaded.exports, require, loaded);
const { orbitPose, orbitPhrase, orbitWord, orbitProjectedBounds, orbitCapacity, ORBIT_STAGGER, ORBIT_REFERENCE_CAPACITY } = loaded.exports;
const viewports = [{ width: 1280, height: 720 }, { width: 1432, height: 768 }, { width: 1920, height: 1080 },
  { width: 1024, height: 768 }, { width: 800, height: 600 }, { width: 390, height: 844 }, { width: 375, height: 667 }];

// 独立复述实际参考站 index.js:getPos，不调用实现的中间变量，避免测试和实现同时偏离原站。
function referencePose(t, { width, height }) {
  const depth = width <= 768 ? 180 : 500, tilt = width <= 768 ? 80 : 180;
  let x, y, z, rotation;
  if (t <= .12) { x = -width * .85 * (1 - t / .12); y = tilt; z = depth * t / .12; rotation = 0; }
  else if (t <= .88) {
    const p = (t - .12) / .76, angle = Math.PI / 2 - p * 2 * Math.PI;
    x = Math.cos(angle) * width * .34; z = Math.sin(angle) * depth; y = z / depth * tilt; rotation = p * 360;
  } else { const p = (t - .88) / .12; x = width * .85 * p; y = tilt; z = depth * (1 - p); rotation = 360; }
  const opacity = t <= 0 || t >= 1 ? 0 : t < .06 ? t / .06 : t > .94 ? (1 - t) / .06 : 1;
  return { x, y, z, rotation, opacity, zIndex: Math.round(z + 600) };
}

assert.equal(ORBIT_STAGGER, .09, "错峰必须与原站一致，不能把环廊稀释成两张图");
assert.equal(ORBIT_REFERENCE_CAPACITY, 8, "仅保留一个与原站一致的 8 张环廊");
const totalRange = 1 + ORBIT_STAGGER * 7;
assert.equal(totalRange, 1.63);
const seen = new Set();
let maximumActive = 0;
for (const viewport of viewports) {
  const count = orbitCapacity(viewport), range = 1 + ORBIT_STAGGER * (count - 1);
  assert.equal(count, viewport.width <= 768 ? 4 : 8);
  for (let step = 0; step <= 4000; step++) {
    const t = step / 4000, actual = orbitPose(t, viewport), expected = referencePose(t, viewport);
    for (const key of Object.keys(expected)) assert.ok(Math.abs(actual[key] - expected[key]) < 1e-8, `原站轨迹不一致：${viewport.width}, ${t}, ${key}`);
    let active = 0;
    for (let index = 0; index < count; index++) {
      const local = t * range - index * ORBIT_STAGGER;
      const bounds = orbitProjectedBounds(local, viewport);
      if (bounds.opacity > 0) active++;
      if (bounds.opacity > .99 && bounds.left >= 0 && bounds.right <= viewport.width && bounds.top >= 0 && bounds.bottom <= viewport.height) seen.add(`${viewport.width}:${index}`);
    }
    maximumActive = Math.max(maximumActive, active);
    assert.ok(active <= 8, "不能把全部截图挤进同一轮");
  }
  for (const t of [.12, .31, .69, .88]) {
    const before = orbitPose(t - 1e-7, viewport), after = orbitPose(t + 1e-7, viewport);
    for (const key of ["x", "y", "z", "rotation"]) assert.ok(Math.abs(before[key] - after[key]) < .01, `连接不连续：${key}`);
  }
}
assert.equal(seen.size, 48, "桌面 8 张、手机 4 张，每个精选账号均应能完整显示");
assert.equal(maximumActive, 8, "第一轮必须保留原站完整 8 张环廊");
assert.equal(orbitPhrase(.5).opacity, 1);
assert.equal(orbitPhrase(.5).y, 0);
assert.equal(orbitPhrase(.25).y, 100);
assert.equal(orbitPhrase(.75).y, -100);
assert.equal(orbitWord(.5, 8, 9).blur, 0);
console.log("PASS: 7 种尺寸 × 4001 个轨迹点与原站一致；仅一个环廊（桌面 8 张 / 手机 4 张），精选账号均完整展示，分段连接通过。");
