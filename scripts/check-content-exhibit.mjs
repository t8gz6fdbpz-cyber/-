import { readFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
import ts from 'typescript';
import vm from 'node:vm';
const source = await readFile(new URL('../src/components/ui/contentExhibitMotion.ts', import.meta.url), 'utf8');
const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ES2022 } }).outputText;
const { advanceMotion, nearestPhase, normalizeMotion, projectSurface, stripGeometry, visiblePanels, hitPanel, wrap, defaultStripSettings: settings } =
  await import('data:text/javascript;base64,' + Buffer.from(code).toString('base64'));

// Native portrait geometry, both edge slivers and close gaps, throughout the loop.
for (const [width, height] of [[346,366],[1025,576],[1440,640]]) {
  const g = stripGeometry(width,height,Array(9).fill(1206/2622),settings);
  assert(Math.abs(g.widths[0]*width/(2*g.halfHeight*height)-1206/2622)<1e-10);
  assert(Math.abs(g.step-g.widths[0]-settings.gap)<1e-10);
  for(let phase=-18;phase<=18;phase+=.05) {
    const panels = visiblePanels(phase,9,g);
    let visible=0;
    for(const p of panels) {
      const l=projectSurface(p.center-p.width/2,0,g.bend,settings.perspective).x;
      const r=projectSurface(p.center+p.width/2,0,g.bend,settings.perspective).x;
      if(r<=-1||l>=1) continue;
      visible++;
      const x=projectSurface(p.center,0,g.bend,settings.perspective).x;
      assert.equal(hitPanel(x,0,panels,g.bend,settings.perspective)?.index,p.index,'actual projected position must pick the same original');
      for(let segment=0;segment<=48;segment++) {
        const q=projectSurface(p.center+(segment/48-.5)*p.width,p.halfHeight,g.bend,settings.perspective);
        if(Math.abs(q.x)<=1) assert(q.y<1,'complete screenshot must fit inside viewport height');
      }
      assert.equal(p.index,wrap(p.copy,9));
    }
    assert(visible>=(width<650?3:5),'loop must not expose large empty areas');
  }
  // Same image: centre flatter, opposing edge slopes at left and right.
  const heights = [-1,0,1].map(offset=>{
    const c=offset*g.step;
    return [-.5,0,.5].map(part=>projectSurface(c+part*g.widths[0],g.halfHeight,g.bend,settings.perspective).y);
  });
  assert(heights[0][0]>heights[0][2]); assert(heights[2][2]>heights[2][0]);
  assert(heights[0][1]>heights[1][1] && heights[2][1]>heights[1][1]);
  assert.equal(hitPanel(0,.99,visiblePanels(0,9,g),g.bend,settings.perspective),null);
}
for(const count of [1,5,9,14]) {
  const g=stripGeometry(1025,576,Array(count).fill(.46),settings);
  for(const phase of [-100.4,-.1,0,8.7,600.3]) {
    for(const p of visiblePanels(phase,count,g)) assert.equal(p.index,wrap(p.copy,count));
    const normalized=normalizeMotion({phase,target:phase+1,velocity:4,dragging:false},count);
    assert.equal(wrap(Math.round(normalized.phase),count),wrap(Math.round(phase),count));
    assert(Math.abs(normalized.target-normalized.phase-1)<1e-9);
  }
}
// Match approved demo exactly, including its per-frame integration, not the discarded CSS approximation.
for(const fps of [30,60,120]) {
  let s={phase:0,target:0,velocity:8,dragging:false};
  let demo={...s};
  for(let i=0;i<fps*5;i++) {
    const dt=1/fps;
    demo.target+=demo.velocity*dt; demo.velocity*=Math.exp(-dt/.42);
    if(Math.abs(demo.velocity)<.003) demo.velocity=0;
    demo.phase+=(demo.target-demo.phase)*(1-Math.exp(-dt/.065));
    if(Math.abs(demo.target-demo.phase)<.0002) demo.phase=demo.target;
    s=advanceMotion(s,dt,false,.42);
    assert.deepEqual(s,demo);
  }
  assert.equal(s.velocity,0);assert(s.phase>3.3&&s.phase<3.6);
  const idle={phase:2,target:2,velocity:0,dragging:false};assert.deepEqual(advanceMotion(idle,1/fps,false),idle);
}
const reduced=advanceMotion({phase:3,target:7,velocity:12,dragging:false},1/60,true);
assert.equal(reduced.phase,7);assert.equal(reduced.velocity,0);
assert.equal(nearestPhase(8.95,0,9),9);assert.equal(nearestPhase(.05,8,9),-1);
// Engine lifecycle/input tests with deterministic DOM/WebGL doubles. Browser visuals
// and real mouse dragging are verified separately; these exercise touch/visibility
// events without pretending an emulated mouse is a physical touch device.
const engineSource = await readFile(new URL('../src/components/ui/ContentStripEngine.ts', import.meta.url), 'utf8');
const engineCode = ts.transpileModule(engineSource.replace(/import\.meta\.env/g, '({DEV:true})'), {compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText;
const listeners = new Map(), documentListeners = new Map(), frames = new Map(), images = [], created = [], deleted = [];
let now = 0, frameId = 0, resizeDisconnected = false;
const add = (map,key,value) => map.set(key,value), remove = (map,key,value) => {assert.equal(map.get(key),value);map.delete(key);};
const gl = { MAX_TEXTURE_SIZE:1, COMPILE_STATUS:2, LINK_STATUS:3,
  getParameter:()=>2048, getShaderParameter:()=>true, getProgramParameter:()=>true,isContextLost:()=>false };
for(const name of ['Shader','Texture','Program','Buffer']) {
  gl['create'+name]=()=>{const object={name,index:created.length};created.push(object);return object;};
  gl['delete'+name]=object=>deleted.push(object);
}
for(const name of ['shaderSource','compileShader','viewport','clearColor','clear','useProgram','uniform1f','uniform2f','bindTexture','drawArrays','attachShader','linkProgram','bindBuffer','bufferData','enableVertexAttribArray','vertexAttribPointer','uniform1i','pixelStorei','texImage2D','texParameteri']) gl[name]=()=>{};
gl.getUniformLocation=()=>({});gl.getAttribLocation=()=>0;
const captures = new Set();
const canvas = { dataset:{}, getContext:()=>gl, width:0,height:0,
  getBoundingClientRect:()=>({left:0,top:0,width:331,height:366}),focus:()=>{},
  setPointerCapture:id=>captures.add(id),hasPointerCapture:id=>captures.has(id),releasePointerCapture:id=>captures.delete(id),
  addEventListener:(key,value)=>add(listeners,key,value),removeEventListener:(key,value)=>remove(listeners,key,value) };
const document = {hidden:false,addEventListener:(key,value)=>add(documentListeners,key,value),removeEventListener:(key,value)=>remove(documentListeners,key,value),
  createElement:()=>({width:0,height:0,getContext:()=>({drawImage:()=>{}})})};
const context = {exports:{},require:()=>({advanceMotion,hitPanel,nearestPhase,normalizeMotion,projectSurface,stripGeometry,visiblePanels,wrap}),
  document,devicePixelRatio:1,performance:{now:()=>now},Float32Array,
  requestAnimationFrame:callback=>{frames.set(++frameId,callback);return frameId;},cancelAnimationFrame:id=>frames.delete(id),
  ResizeObserver:class {observe(){} disconnect(){resizeDisconnected=true;}},
  Image:class {naturalWidth=1206;naturalHeight=2622;constructor(){images.push(this);}}};
vm.runInNewContext(engineCode,context);
let opened = [], selected = [], status;
const engine = context.exports.createContentStrip(canvas,Array(9).fill({src:'fixture.webp',width:1206,height:2622}),settings,
  {onSelect:index=>selected.push(index),onOpen:index=>opened.push(index),onStatus:value=>status=value});
engine.update({visible:true,reduced:false});images.forEach(image=>image.onload());assert.equal(status,'ready');
function tick(count=1){for(let i=0;i<count;i++){now+=16.67;const pending=[...frames.values()];frames.clear();pending.forEach(callback=>callback(now));}}
function input(type,x,y,pointerType='touch'){now+=20;listeners.get(type)({type,clientX:x,clientY:y,pointerId:1,pointerType,button:0});}
tick(2);assert.equal(frames.size,0,'idle must not run a perpetual render loop');
input('pointerdown',260,183);input('pointermove',150,183);tick(2);input('pointerup',150,183);
assert.equal(opened.length,0,'drag must not open a screenshot');assert(Number(canvas.dataset.velocity)>0);tick(20);
const coastPhase=Number(canvas.dataset.phase);assert(coastPhase>0);
input('pointerdown',160,183);tick();assert.equal(Number(canvas.dataset.velocity),0);assert.equal(canvas.dataset.phase,canvas.dataset.target);
input('pointermove',260,183);tick();input('pointerup',260,183);assert(Number(canvas.dataset.velocity)<0);tick();
document.hidden=true;documentListeners.get('visibilitychange')();assert.equal(frames.size,0);assert.equal(captures.size,0);assert.equal(Number(canvas.dataset.velocity),0);
const hiddenDraws=canvas.dataset.draws;tick(30);assert.equal(canvas.dataset.draws,hiddenDraws);
document.hidden=false;documentListeners.get('visibilitychange')();tick(2);
engine.update({visible:false,reduced:false});const offscreenDraws=canvas.dataset.draws;tick(30);assert.equal(canvas.dataset.draws,offscreenDraws);
engine.update({visible:true,reduced:true});tick(2);
input('pointerdown',260,183);input('pointermove',150,183);input('pointercancel',150,183);tick(2);
assert.equal(opened.length,0,'cancelled touch must not open a screenshot');assert.equal(captures.size,0);
engine.command({revision:1,index:0});tick(2);
input('pointerdown',165,183);input('pointermove',168,185);input('pointerup',168,185);assert.equal(opened.at(-1),0,'sub-6px tap opens the projected original');
const openCount=opened.length;
input('pointerdown',160,183);input('pointermove',163,230);input('pointerup',163,230);assert.equal(opened.length,openCount,'vertical touch must remain page scrolling');assert.equal(captures.size,0);
input('pointerdown',260,183);input('pointermove',140,183);input('pointerup',140,183);tick(2);
assert.equal(Number(canvas.dataset.velocity),0);assert.equal(canvas.dataset.phase,canvas.dataset.target);
const reducedPhase=canvas.dataset.phase;tick(60);assert.equal(canvas.dataset.phase,reducedPhase);assert.equal(frames.size,0);
// Autoplay is an opt-in phase drift: projection/data stay unchanged and every
// input takes over immediately. Exercise a wrap and all pause paths in real time.
engine.update({visible:true,reduced:false,autoScroll:true});
engine.command({revision:2,index:8});tick(280);
const autoStart=Number(canvas.dataset.phase);tick(120);
assert(Number(canvas.dataset.phase)>autoStart+.25,'autoplay must visibly move left');
assert.equal(canvas.dataset.autoActive,'true');
const targetGap=Math.abs(Number(canvas.dataset.target)-Number(canvas.dataset.phase));assert(targetGap<.0002);
tick(500);assert(selected.includes(0),'the ninth panel must wrap to the first actual item');
engine.command({revision:3,direction:-1});tick(100);
const manualPhase=canvas.dataset.phase;tick(100);assert.equal(canvas.dataset.phase,manualPhase,'manual selection must have a stable reading hold');
assert.equal(canvas.dataset.autoRate,'0.00000');tick(180);assert(Number(canvas.dataset.phase)!==Number(manualPhase));
engine.update({visible:false,reduced:false,autoScroll:true});const autoPaused=canvas.dataset.phase;tick(180);assert.equal(canvas.dataset.phase,autoPaused);assert.equal(frames.size,0);
engine.update({visible:true,reduced:false,autoScroll:true});tick(60);assert(Number(canvas.dataset.phase)>Number(autoPaused));
document.hidden=true;documentListeners.get('visibilitychange')();const tabPaused=canvas.dataset.phase;tick(180);assert.equal(canvas.dataset.phase,tabPaused);assert.equal(frames.size,0);
document.hidden=false;documentListeners.get('visibilitychange')();tick(60);assert(Number(canvas.dataset.phase)>Number(tabPaused));
engine.update({visible:true,reduced:true,autoScroll:true});const accessiblePhase=canvas.dataset.phase;tick(120);assert.equal(canvas.dataset.phase,accessiblePhase);assert.equal(frames.size,0);
engine.command({revision:4,direction:1});tick(2);assert.notEqual(canvas.dataset.phase,accessiblePhase,'manual controls must work with reduced motion');
engine.dispose();assert.equal(listeners.size,0);assert.equal(documentListeners.size,0);assert(resizeDisconnected);assert.equal(frames.size,0);
assert.equal(created.length,deleted.length,'all owned WebGL resources must be deleted');assert(created.every(object=>deleted.includes(object)));
assert(images.every(image=>image.onload===null&&image.onerror===null));

// Production still renders/autoplays, but never serializes detailed frame probes.
const productionCode = ts.transpileModule(engineSource.replace(/import\.meta\.env/g,
  '({DEV:false,VITE_PERFORMANCE_AUDIT:"false"})'), {compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText;
const productionContext = {...context, exports:{}};
vm.runInNewContext(productionCode, productionContext);
canvas.dataset = {};
document.hidden = false;
const productionImageStart = images.length;
const productionEngine = productionContext.exports.createContentStrip(canvas,
  Array(9).fill({src:'fixture.webp',width:1206,height:2622}),settings,
  {onSelect:()=>{},onOpen:()=>{},onStatus:()=>{}});
productionEngine.update({visible:true,reduced:false,autoScroll:true});
images.slice(productionImageStart).forEach(image=>image.onload());
tick(120);
assert.equal(canvas.dataset.renderer, 'webgl');
for (const key of ['panels','phase','target','draws','autoRate']) assert.equal(canvas.dataset[key], undefined, 'no production frame diagnostics: ' + key);
productionEngine.dispose();
assert.equal(frames.size, 0);
assert.equal(listeners.size, 0);
console.log('PASS: projection, ratios, dense loops, picking, live curvature, exact demo inertia, mouse/touch branches, idle/reduced motion, hidden/offscreen pause and WebGL/listener cleanup.');
