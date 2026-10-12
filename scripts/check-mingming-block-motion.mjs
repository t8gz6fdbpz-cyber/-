import fs from 'node:fs';
import vm from 'node:vm';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import ts from 'typescript';

const script = ts.transpileModule(fs.readFileSync('src/components/cases/mingming/blockMotion.ts', 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
const sandbox = { exports: {} };
vm.runInNewContext(script, sandbox);
const { chapterProgress, readingProgress } = sandbox.exports;

// Footer geometry reproducing the physical limit that the old end/start range missed.
const doc = 13548, viewport = 720, maximum = doc - viewport, footerTop = 12740, footerHeight = doc - footerTop;
assert((maximum - footerTop) / footerHeight < .12, 'fixture must reproduce the incomplete old rail');
assert.equal(chapterProgress(maximum, footerTop, footerHeight, doc, viewport), 1);
assert.equal(chapterProgress(footerTop + 44, footerTop, footerHeight, doc, viewport), .5);
assert.equal(chapterProgress(footerTop, footerTop, footerHeight, doc, viewport), 0);

const cases = [
  { title: 'middle chapter', top: 1500, height: 3500, doc: 13548, viewport: 720 },
  { title: 'footer', top: footerTop, height: footerHeight, doc, viewport },
  { title: 'footer shorter than viewport', top: doc - 512, height: 512, doc, viewport },
  { title: '390px phone', top: 14300, height: 770, doc: 15070, viewport: 680 },
  { title: 'negative-margin handoff', top: 8500 - 432, height: 693, doc, viewport },
  { title: 'after image growth and resize', top: 14900, height: 800, doc: 15700, viewport: 900 },
];
for (const item of cases) {
  const limit = item.doc - item.viewport;
  const values = Array.from({ length: 1001 }, (_, i) => chapterProgress(limit * i / 1000, item.top, item.height, item.doc, item.viewport));
  assert.equal(values.at(-1), 1, item.title + ': actual document bottom');
  values.forEach((value, i) => {
    assert(value >= 0 && value <= 1);
    if (i) assert(value >= values[i - 1], item.title + ': monotonic scrolling');
  });
  const backwards = values.slice().reverse();
  backwards.forEach((value, i) => { if (i) assert(value <= backwards[i - 1], item.title + ': reverse scrolling'); });
}
assert.equal(chapterProgress(0, 200, 400, 640, 720), 1, 'a fully visible short document');
assert.equal(chapterProgress(3000, 1500, 3000, doc, viewport), .5, 'middle range retains its original meaning');
assert.equal(readingProgress(0), 0);
for (const value of [.68, .75, .9, 1]) assert.equal(readingProgress(value), 1, 'stable reading plateau');

const root = 'artifacts/mingming-block-motion/';
const manifest = JSON.parse(fs.readFileSync(root + 'baseline.json', 'utf8').replace(/^\uFEFF/, ''));
const edited = new Set(['src/pages/MingmingCasePage.tsx', 'src/styles/mingming-focal.css']);
const unchanged = manifest.filter(item => !edited.has(item.path)).map(item => {
  assert.equal(crypto.createHash('sha256').update(fs.readFileSync(item.path)).digest('hex').toUpperCase(), item.sha256, item.path);
  return item.path;
});
const before = fs.readFileSync(root + 'baseline/src/pages/MingmingCasePage.tsx', 'utf8');
const after = fs.readFileSync('src/pages/MingmingCasePage.tsx', 'utf8');
const railMarkup = source => source.slice(source.indexOf('<motion.div className="mm-scroll-progress"'), source.indexOf('</motion.div>', source.indexOf('<motion.div className="mm-scroll-progress"'))).replace(/\s+/g, ' ');
assert.equal(railMarkup(after), railMarkup(before), 'approved rail outer markup, order and labels');
const lockedUse = source => source.match(/<(?:AccountOrbit|ContentExhibit|TrainingDepthGallery)\b[^>]*\/>/g)?.join(' ');
assert.equal(lockedUse(after), lockedUse(before), 'orbit, curved strip, training gallery, handoff and autoplay integration');
assert(!after.includes('--step'), 'removed the artificial curriculum staircase');
assert(!after.includes('TextReveal'));
const result = { passed: true, railCases: cases.map(item => item.title), physicalBottomProgress: 1, middleRangeProgress: .5, readingStableFrom: .68, unchangedFiles: unchanged, lockedUseAndRailMarkupIdentical: true, browserValidation: 'superseded by artifacts/mingming-transition-motion/browser-validation.json' };
fs.writeFileSync(root + 'source-validation.json', JSON.stringify(result, null, 2));
console.log('PASS: physical-bottom rail, reverse/phone/resize/short-page/handoff ranges, stable reading plateau, '+unchanged.length+' unchanged files and locked scene integration.');
