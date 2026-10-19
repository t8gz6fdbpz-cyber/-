const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const ts = require('typescript');
const THREE = require('three');
const root = path.resolve(__dirname, '..');
function load(relative) {
  const source = fs.readFileSync(path.join(root, relative), 'utf8');
  const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
  const loaded = { exports: {} };
  new Function('exports', 'require', 'module', compiled)(loaded.exports, require, loaded);
  return loaded.exports;
}
const { createToolTapGesture } = load('src/components/sections/toolTapGesture.ts');
const pointer = (id=1, x=100, y=100, isPrimary=true) => ({pointerId:id,clientX:x,clientY:y,isPrimary,button:0});
const tap = createToolTapGesture();
tap.down(pointer(), 'premiere'); tap.up(pointer(1,104,105));
assert.equal(tap.consume('premiere',false),true,'Small finger jitter should still tap');
assert.equal(tap.consume('premiere',false),false,'One activation per gesture');
tap.down(pointer(), 'premiere'); tap.move(pointer(1,100,0)); tap.move(pointer()); tap.up(pointer());
assert.equal(tap.consume('premiere',false),false,'Drag then return must not open');
tap.down(pointer(), 'premiere'); tap.cancelPointer(pointer()); tap.up(pointer());
assert.equal(tap.consume('premiere',false),false,'Cancelled pointer must not open');
tap.down(pointer(), 'premiere'); tap.down(pointer(2,120,120,false),null); tap.up(pointer(2)); tap.up(pointer());
assert.equal(tap.consume('premiere',false),false,'Second finger outside icon cancels gesture');
tap.down(pointer(), 'chatgpt'); tap.up(pointer());
assert.equal(tap.consume('premiere',false),false,'Another target cannot consume a tap');
tap.down(pointer(), 'premiere'); tap.reset(); tap.up(pointer());
assert.equal(tap.consume('premiere',false),false,'Blur/unmount resets pending activation');
assert.equal(tap.consume('premiere',true),true,'Native keyboard click remains available');
const { galaxyProjection, galaxyCameraZoom } = load('src/components/sections/toolGalaxyGeometry.ts');
const scene = fs.readFileSync(path.join(root,'src/components/sections/ToolGalaxy3D.tsx'),'utf8');
const literal = scene.match(/const layoutPresets:[\s\S]*?= (\[[\s\S]*?\n\]);/)[1];
const presets = vm.runInNewContext(literal,{THREE});
const tools = presets.map(p=>({orbitRadius:p.radius,orbitRadiusX:p.radiusX,orbitVerticalRatio:p.verticalRatio,orbitTilt:p.tilt,orbitCenter:p.center}));
const sizes = [[273,420],[273,473.6],[328,426.88],[343,473.6],[343,540],[383,540],[612,420],[440,580],[1100,680],[328,280]];
let samples=0;
for(const [width,height] of sizes) {
  const spread=galaxyProjection(tools,width,height), zoom=galaxyCameraZoom(width);
  // Independently project dense points, including the largest icon/hover and 76px target.
  const extent=Math.max(38,(width<520?.88:.72)*zoom*1.08*(Math.cos(.035)+Math.sin(.035))/2);
  for(const t of tools) for(let i=0;i<=7200;i++) {
    const a=i*Math.PI*2/7200;
    const point=new THREE.Vector3(Math.cos(a)*t.orbitRadiusX,Math.sin(a)*t.orbitRadius*t.orbitVerticalRatio,Math.sin(a)*t.orbitRadius*.11);
    point.applyEuler(new THREE.Euler(...t.orbitTilt.map(THREE.MathUtils.degToRad)));
    const x=width/2+(point.x*spread.x+t.orbitCenter[0])*zoom;
    const y=height/2-(point.y*spread.y+t.orbitCenter[1])*zoom;
    assert.ok(x-extent>=0 && x+extent<=width && y-extent>=0 && y+extent<=height,`Clipped orbit: ${width}×${height} phase ${i}`);
    samples++;
  }
}
console.log(`PASS: tap/jitter/drag/cancel/multitouch/wrong-target/blur/keyboard; ${sizes.length} galaxy sizes, ${samples} independent projections across full revolutions.`);
