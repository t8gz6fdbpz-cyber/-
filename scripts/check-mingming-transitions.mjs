import fs from 'node:fs';
import vm from 'node:vm';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import ts from 'typescript';

const root = 'artifacts/mingming-transition-motion/';
const source = fs.readFileSync('src/components/cases/mingming/blockMotion.ts', 'utf8');
const sandbox = { exports: {} };
vm.runInNewContext(ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText, sandbox);
const { processFocusPose, readingProgress, chapterProgress } = sandbox.exports;
for (let i = 0; i <= 1000; i++) {
  const p = i / 1000;
  const poses = [0, 1, 2].map(index => processFocusPose(p, index));
  assert(Math.abs(poses.reduce((sum, pose) => sum + pose.opacity, 0) - 1) < 1e-10, 'focus remains present throughout handover');
  poses.forEach(pose => assert(pose.opacity >= 0 && pose.opacity <= 1 && Math.abs(pose.y) <= 96));
  const visible = poses.filter(pose => pose.opacity > .05);
  if (visible.length === 2) assert(Math.abs(visible[1].y - visible[0].y) >= 96 - 1e-10, '77px headings cannot overlap during handover');
}
assert.equal(processFocusPose(.15, 0).opacity, 1);
assert.equal(processFocusPose(.5, 1).opacity, 1);
assert.equal(processFocusPose(.9, 2).opacity, 1);
assert.equal(readingProgress(.95, 0, .94), 1, 'media reading plateau');
assert.equal(chapterProgress(12828, 12740, 808, 13548, 720), 1, 'physical-bottom rail fix retained');

const manifest = JSON.parse(fs.readFileSync(root + 'baseline.json', 'utf8').replace(/^\uFEFF/, ''));
const edited = new Set(['src/pages/MingmingCasePage.tsx', 'src/components/cases/mingming/MingmingMediaFrame.tsx', 'src/components/cases/mingming/blockMotion.ts']);
const unchanged = manifest.filter(item => !edited.has(item.path)).map(item => {
  assert.equal(crypto.createHash('sha256').update(fs.readFileSync(item.path)).digest('hex').toUpperCase(), item.sha256, item.path);
  return item.path;
});
const before = fs.readFileSync(root + 'baseline/src/pages/MingmingCasePage.tsx', 'utf8');
const after = fs.readFileSync('src/pages/MingmingCasePage.tsx', 'utf8');
const lockedTags = text => text.match(/<(?:AccountOrbit|ContentExhibit|TrainingDepthGallery)\b[^>]*\/>/g);
assert.deepEqual(lockedTags(after), lockedTags(before), 'approved scene props, order, autoplay and handoff retained');
const rail = text => text.slice(text.indexOf('function RailSegment'), text.indexOf('export function MingmingCasePage')).replace(/\s+/g, ' ');
assert.equal(rail(after), rail(before), 'accepted rail logic and appearance retained');
assert(!after.includes('--step') && after.includes('stage.details.split("、")'), 'aligned curriculum and complete semantic phrases retained');
assert(!after.includes('TextReveal') && !after.includes('useSpring'), 'no batch letter reveal or lagging scroll spring');
const result = { passed: true, focusStatesChecked: 1001, stableHolds: [.15,.5,.9], unchangedFiles: unchanged, lockedScenePropsAndRail: 'identical to pre-revision baseline', browserValidation: 'recorded separately in browser-validation.json' };
fs.writeFileSync(root + 'source-validation.json', JSON.stringify(result, null, 2));
console.log(`PASS: focus handover/holds/non-overlap, media hold plateau, accepted rail fix, ${unchanged.length} unchanged baseline files, approved scene integration.`);
