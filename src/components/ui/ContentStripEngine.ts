import { advanceMotion, hitPanel, nearestPhase, normalizeMotion, projectSurface, stripGeometry,
  visiblePanels, wrap, type StripMotion, type StripSettings } from "./contentExhibitMotion";
type Source = { src: string; width: number; height: number };
type Callbacks = { onSelect: (index: number) => void; onOpen: (index: number) => void;
  onStatus: (status: "ready" | "fallback", message?: string) => void };
export type StripCommand = { revision: number; direction?: number; index?: number };

/** Port of the approved WebGL demo. React owns only the surrounding interface. */
export function createContentStrip(canvas: HTMLCanvasElement, sources: readonly Source[],
  settings: StripSettings, callbacks: Callbacks, initialIndex = 0) {
  const gl = canvas.getContext("webgl", { alpha: true, antialias: true, premultipliedAlpha: false });
  if (!gl) { callbacks.onStatus("fallback", "当前浏览器不支持 WebGL，可左右浏览平面截图。"); return null; }
  const state: StripMotion = { phase: initialIndex, target: initialIndex, velocity: 0, dragging: false };
  let disposed = false, failed = false, ready = false, visible = false, reduced = false, frame = 0, last = 0;
  let autoScroll = false, autoRate = 0, manualUntil = 0;
  let width = 1, height = 1, reported = initialIndex, lastCommand = 0;
  const aspects = sources.map(item => item.width / item.height);
  let geometry = stripGeometry(width, height, aspects, settings), panels = visiblePanels(state.phase, sources.length, geometry);
  let pointer: { id: number; x: number; y: number; last: number; time: number; moved: boolean; vertical: boolean } | null = null;
  const shaders: WebGLShader[] = [], textures: WebGLTexture[] = [], images: HTMLImageElement[] = [];
  let program: WebGLProgram | null = null, buffer: WebGLBuffer | null = null;
  const segments = 48, locations: Record<string, WebGLUniformLocation | null> = {};
  // Detailed frame snapshots are for local acceptance only, never production.
  const diagnostics = import.meta.env.DEV;
  function publishMotion() {
    if (!diagnostics) return;
    canvas.dataset.phase = state.phase.toFixed(5); canvas.dataset.target = state.target.toFixed(5);
    canvas.dataset.velocity = state.velocity.toFixed(5); canvas.dataset.dragging = String(state.dragging);
    canvas.dataset.reducedMotion = String(reduced);
    canvas.dataset.autoScroll = String(autoScroll);
    canvas.dataset.autoRate = autoRate.toFixed(5);
    canvas.dataset.autoActive = String(autoRate > 0 && visible && !document.hidden && !reduced);
  }
  function manualTakeover() { autoRate = 0; manualUntil = performance.now() + 4500; }
  function cancelPointer() {
    const held = pointer; pointer = null; state.dragging = false;
    if (held && canvas.hasPointerCapture(held.id)) canvas.releasePointerCapture(held.id);
  }
  function stop() { cancelAnimationFrame(frame); frame = 0; last = 0; canvas.dataset.animating = "false"; }
  function wake() {
    if (!disposed && ready && visible && !document.hidden && !frame) { last = 0; frame = requestAnimationFrame(tick); }
  }
  function fail(message: string) { failed = true; ready = false; stop(); callbacks.onStatus("fallback", message); }
  function compile(type: number, source: string) {
    const shader = gl!.createShader(type); if (!shader) throw new Error("无法创建着色器");
    shaders.push(shader); gl!.shaderSource(shader, source); gl!.compileShader(shader);
    if (!gl!.getShaderParameter(shader, gl!.COMPILE_STATUS)) throw new Error(gl!.getShaderInfoLog(shader) ?? "着色器错误");
    return shader;
  }
  function draw() {
    if (!ready || disposed || !program || document.hidden || !visible) return;
    const bend = reduced ? 0 : geometry.bend;
    gl!.viewport(0, 0, canvas.width, canvas.height); gl!.clearColor(0, 0, 0, 0); gl!.clear(gl!.COLOR_BUFFER_BIT);
    gl!.useProgram(program); gl!.uniform1f(locations.uHalfHeight, geometry.halfHeight);
    gl!.uniform1f(locations.uBend, bend); gl!.uniform1f(locations.uDistance, settings.perspective);
    panels = visiblePanels(state.phase, sources.length, geometry);
    for (const panel of panels) {
      const panelAspect = panel.width * width / (2 * panel.halfHeight * height), ratio = panelAspect / aspects[panel.index];
      // Contain, unlike the demo's cover crop. Keep the complete portrait screenshot.
      gl!.uniform2f(locations.uFit, Math.max(ratio, 1), Math.max(1 / ratio, 1));
      gl!.uniform1f(locations.uCenter, panel.center); gl!.uniform1f(locations.uWidth, panel.width);
      gl!.bindTexture(gl!.TEXTURE_2D, textures[panel.index]); gl!.drawArrays(gl!.TRIANGLES, 0, segments * 6);
    }
    const index = wrap(Math.round(state.phase), sources.length);
    if (reported !== index) { reported = index; callbacks.onSelect(index); }
    // No per-frame JSON projection or DOM writes in the shipped renderer.
    if (!diagnostics) return;
    publishMotion(); canvas.dataset.activeIndex = String(index);
    canvas.dataset.panels = JSON.stringify(panels.map(panel => {
      const left = projectSurface(panel.center - panel.width / 2, panel.halfHeight, bend, settings.perspective);
      const center = projectSurface(panel.center, panel.halfHeight, bend, settings.perspective);
      const right = projectSurface(panel.center + panel.width / 2, panel.halfHeight, bend, settings.perspective);
      return { index: panel.index, copy: panel.copy, left: left.x, center: center.x, right: right.x,
        topLeft: left.y, topCenter: center.y, topRight: right.y };
    }));
    canvas.dataset.draws = String(Number(canvas.dataset.draws ?? 0) + 1);
  }
  function tick(now: number) {
    frame = 0;
    if (disposed || !ready || !visible || document.hidden) { stop(); return; }
    const dt = Math.min(.05, (now - (last || now - 16.67)) / 1000); last = now;
    Object.assign(state, advanceMotion(state, dt, reduced, settings.inertia));
    // Move the existing curved surface's phase, retaining its projection and inertia.
    // Positive phase moves every panel left. Equal deltas prevent a target snap.
    const canAuto = autoScroll && !reduced && !pointer && now >= manualUntil
      && Math.abs(state.velocity) < .01 && Math.abs(state.target - state.phase) < .003;
    autoRate += ((canAuto ? .16 : 0) - autoRate) * (1 - Math.exp(-dt / .35));
    if (autoRate < .00001) autoRate = 0;
    state.phase += autoRate * dt; state.target += autoRate * dt;
    Object.assign(state, normalizeMotion(state, sources.length)); draw();
    if ((autoScroll && !reduced) || (!reduced && state.dragging) || state.velocity || Math.abs(state.target - state.phase) > .0002) {
      canvas.dataset.animating = "true"; frame = requestAnimationFrame(tick);
    } else { canvas.dataset.animating = "false"; last = 0; }
  }
  function resize() {
    const rect = canvas.getBoundingClientRect(); width = Math.max(1, rect.width); height = Math.max(1, rect.height);
    const dpr = Math.min(devicePixelRatio || 1, 1.75); canvas.width = Math.round(width * dpr); canvas.height = Math.round(height * dpr);
    geometry = stripGeometry(width, height, aspects, settings); draw(); wake();
  }
  function down(event: PointerEvent) {
    if (!ready || pointer || (event.pointerType === "mouse" && event.button !== 0)) return;
    // Immediate takeover of the displayed position, not the previous inertial target.
    manualTakeover(); stop(); state.target = state.phase; state.velocity = 0; state.dragging = event.pointerType === "mouse";
    pointer = { id: event.pointerId, x: event.clientX, y: event.clientY, last: event.clientX,
      time: performance.now(), moved: false, vertical: false };
    canvas.focus({ preventScroll: true }); canvas.setPointerCapture(event.pointerId); wake();
  }
  function move(event: PointerEvent) {
    if (!pointer || pointer.id !== event.pointerId || pointer.vertical) return;
    const dx = event.clientX - pointer.x, dy = event.clientY - pointer.y;
    if (!pointer.moved) {
      if (Math.hypot(dx, dy) <= 6) return;
      if (event.pointerType !== "mouse" && Math.abs(dy) > Math.abs(dx)) {
        pointer.vertical = true; state.dragging = false; state.velocity = 0;
        if (canvas.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId);
        return;
      }
      pointer.moved = state.dragging = true; canvas.dataset.dragging = "true";
    }
    const now = performance.now(), dt = Math.max(.008, (now - pointer.time) / 1000);
    const delta = (pointer.last - event.clientX) / (width * geometry.step / 2);
    state.target += delta; state.velocity = reduced ? 0 : state.velocity * .35 + Math.max(-9, Math.min(9, delta / dt)) * .65;
    pointer.last = event.clientX; pointer.time = now;
    if (reduced) { state.phase = state.target; draw(); } else wake();
  }
  function finish(event: PointerEvent) {
    if (!pointer || pointer.id !== event.pointerId) return;
    manualTakeover();
    const clicked = event.type === "pointerup" && !pointer.moved && !pointer.vertical;
    if (event.type !== "pointerup" || performance.now() - pointer.time > 110 || pointer.vertical || reduced) state.velocity = 0;
    pointer = null; state.dragging = false; canvas.dataset.dragging = "false";
    if (canvas.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId);
    if (clicked) {
      const rect = canvas.getBoundingClientRect();
      const hit = hitPanel((event.clientX - rect.left) / width * 2 - 1,
        1 - (event.clientY - rect.top) / height * 2, panels, reduced ? 0 : geometry.bend, settings.perspective);
      if (hit) { state.velocity = 0; state.target = state.phase; callbacks.onOpen(hit.index); }
    }
    wake();
  }
  function visibility() {
    canvas.dataset.hidden = String(document.hidden);
    if (document.hidden) { autoRate = 0; state.velocity = 0; state.target = state.phase; cancelPointer(); stop(); publishMotion(); }
    else wake();
  }
  const lost = (event: Event) => { event.preventDefault(); fail("图形上下文中断，可继续使用平面截图浏览。"); };
  const observer = new ResizeObserver(resize);
  try {
    program = gl.createProgram(); if (!program) throw new Error("无法创建图形程序");
    const vertex = compile(gl.VERTEX_SHADER, `attribute vec2 aPosition; varying vec2 vUv;
      uniform float uCenter,uWidth,uHalfHeight,uBend,uDistance;
      void main(){float s=uCenter+aPosition.x*uWidth;float r=1.0/max(uBend,0.0001);float theta=s/r;
        float x=r*sin(theta);float depth=2.0*r*pow(sin(theta*0.5),2.0);
        float perspective=max(0.28,1.0-depth/uDistance);
        gl_Position=vec4(x,aPosition.y*uHalfHeight,0.0,perspective);vUv=vec2(aPosition.x+0.5,aPosition.y*0.5+0.5);}`);
    const fragment = compile(gl.FRAGMENT_SHADER, `precision mediump float; varying vec2 vUv;
      uniform sampler2D uTexture;uniform vec2 uFit;
      void main(){vec2 uv=(vUv-0.5)*uFit+0.5;if(uv.x<0.0||uv.x>1.0||uv.y<0.0||uv.y>1.0){discard;}
        gl_FragColor=texture2D(uTexture,uv);}`);
    gl.attachShader(program, vertex); gl.attachShader(program, fragment); gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program) ?? "图形链接失败");
    gl.useProgram(program);
    for (const name of ["uCenter", "uWidth", "uHalfHeight", "uBend", "uDistance", "uTexture", "uFit"]) locations[name] = gl.getUniformLocation(program, name);
    const vertices: number[] = [];
    for (let i = 0; i < segments; i++) { const a = i / segments - .5, b = (i + 1) / segments - .5; vertices.push(a, -1, b, -1, a, 1, a, 1, b, -1, b, 1); }
    buffer = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buffer); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    const attribute = gl.getAttribLocation(program, "aPosition"); gl.enableVertexAttribArray(attribute);
    gl.vertexAttribPointer(attribute, 2, gl.FLOAT, false, 0, 0); gl.uniform1i(locations.uTexture, 0);
    sources.forEach((source, index) => {
      const image = new Image(); image.crossOrigin = "anonymous"; images.push(image);
      image.onload = () => {
        if (disposed || failed || gl.isContextLost()) return;
        try {
          aspects[index] = image.naturalWidth / image.naturalHeight;
          const texture = gl.createTexture(); if (!texture) throw new Error("无法创建纹理");
          textures[index] = texture; gl.bindTexture(gl.TEXTURE_2D, texture); gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
          // Preview GPU upload is bounded. The lightbox retains the unchanged original source.
          const limit = Math.min(1536, gl.getParameter(gl.MAX_TEXTURE_SIZE) as number), scale = Math.min(1, limit / Math.max(image.naturalWidth, image.naturalHeight));
          if (scale < 1) {
            const upload = document.createElement("canvas"); upload.width = Math.round(image.naturalWidth * scale); upload.height = Math.round(image.naturalHeight * scale);
            const context = upload.getContext("2d"); if (!context) throw new Error("无法准备纹理");
            context.drawImage(image, 0, 0, upload.width, upload.height); gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, upload);
          } else gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
          canvas.dataset.loaded = String(textures.filter(Boolean).length);
          if (textures.filter(Boolean).length === sources.length) { ready = true; canvas.dataset.renderer = "webgl"; callbacks.onStatus("ready"); resize(); }
        } catch { fail("预览纹理加载失败，可继续浏览平面截图。"); }
      };
      image.onerror = () => { if (!disposed) fail("部分截图未加载，可使用平面浏览或查看原图。"); };
      image.src = source.src;
    });
  } catch { fail("图形初始化失败，可继续浏览平面截图。"); }
  observer.observe(canvas);
  canvas.addEventListener("pointerdown", down); canvas.addEventListener("pointermove", move); canvas.addEventListener("pointerup", finish);
  canvas.addEventListener("pointercancel", finish); canvas.addEventListener("lostpointercapture", finish); canvas.addEventListener("webglcontextlost", lost);
  document.addEventListener("visibilitychange", visibility);
  return {
    update(next: { visible: boolean; reduced: boolean; autoScroll?: boolean }) {
      reduced = next.reduced; visible = next.visible; autoScroll = Boolean(next.autoScroll);
      if (reduced || !autoScroll) autoRate = 0;
      if (!visible) {
        autoRate = 0; state.velocity = 0; state.target = state.phase; cancelPointer(); stop(); publishMotion();
      } else { if (reduced) { state.velocity = 0; state.phase = state.target; } draw(); wake(); }
      canvas.dataset.visible = String(visible); canvas.dataset.hidden = String(document.hidden);
    },
    command(command: StripCommand) {
      if (command.revision <= lastCommand) return;
      lastCommand = command.revision; manualTakeover(); state.velocity = 0;
      if (command.index !== undefined) state.target = nearestPhase(state.phase, command.index, sources.length);
      else state.target = (autoScroll ? Math.round(state.phase) : state.target) + (command.direction ?? 0);
      if (reduced) { state.phase = state.target; draw(); } wake();
    },
    dispose() {
      disposed = true; stop(); observer.disconnect();
      cancelPointer();
      canvas.removeEventListener("pointerdown", down); canvas.removeEventListener("pointermove", move); canvas.removeEventListener("pointerup", finish);
      canvas.removeEventListener("pointercancel", finish); canvas.removeEventListener("lostpointercapture", finish); canvas.removeEventListener("webglcontextlost", lost);
      document.removeEventListener("visibilitychange", visibility);
      images.forEach(image => { image.onload = null; image.onerror = null; }); textures.forEach(texture => gl.deleteTexture(texture)); shaders.forEach(shader => gl.deleteShader(shader));
      // Delete owned resources, but don't lose the canvas context: React StrictMode
      // may immediately create a fresh instance on this same canvas.
      if (buffer) gl.deleteBuffer(buffer); if (program) gl.deleteProgram(program);
    },
  };
}
