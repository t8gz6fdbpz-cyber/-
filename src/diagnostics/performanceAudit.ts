/** Opt-in local production-build audit. Stripped from normal deployments. */
declare global {
  interface Window {
    __portfolioFrameAudit?: {
      active: boolean;
      count: number;
      costs: number[];
      nativeFrame: typeof window.requestAnimationFrame;
    };
  }
}
const frameAudit = window.__portfolioFrameAudit;
const nativeFrame = frameAudit?.nativeFrame ?? window.requestAnimationFrame.bind(window);
const samples: number[] = [];
const callbackCosts: number[] = frameAudit?.costs ?? [];
const longTasks: number[] = [];
let recording = false;
let callbackCount = 0;
let previousFrame = 0;
let startedAt = 0;

if (PerformanceObserver.supportedEntryTypes.includes("longtask")) {
  const observer = new PerformanceObserver((list) => {
    if (recording) list.getEntries().forEach((entry) => longTasks.push(entry.duration));
  });
  observer.observe({ type: "longtask", buffered: true });
}

const panel = document.createElement("aside");
panel.setAttribute("aria-label", "本地性能验收");
panel.style.cssText = "position:fixed;right:8px;top:8px;z-index:99999;background:#fff;color:#111;padding:8px;font:12px sans-serif;border:1px solid #111;max-width:260px";
const button = document.createElement("button");
button.textContent = "记录 10 秒性能";
button.style.cssText = "min-height:44px;padding:8px;cursor:pointer";
const output = document.createElement("output");
output.style.cssText = "display:block;white-space:pre-wrap";
panel.append(button, output);
document.body.append(panel);

const percentile = (values: number[], p: number) => {
  const sorted = [...values].sort((a, b) => a - b);
  return Number((sorted[Math.max(0, Math.ceil(sorted.length * p) - 1)] ?? 0).toFixed(2));
};
const measure = (time: number) => {
  if (!recording) return;
  if (previousFrame) samples.push(time - previousFrame);
  previousFrame = time;
  if (time - startedAt < 10_000) { nativeFrame(measure); return; }
  recording = false;
  if (frameAudit) frameAudit.active = false;
  const result = {
    url: location.pathname + location.hash,
    viewport: [innerWidth, innerHeight],
    durationMs: Math.round(time - startedAt),
    applicationFrameCallbacks: frameAudit?.count ?? callbackCount,
    applicationCallbackTotalMs: Number(callbackCosts.reduce((sum, value) => sum + value, 0).toFixed(2)),
    applicationCallbackP95Ms: percentile(callbackCosts, .95),
    frameIntervalP95Ms: percentile(samples, .95),
    framesOver32Ms: samples.filter((value) => value > 32).length,
    longTasks: longTasks.length,
    longTaskTotalMs: Number(longTasks.reduce((sum, value) => sum + value, 0).toFixed(2)),
    domElements: document.querySelectorAll("*").length,
  };
  panel.dataset.results = JSON.stringify(result);
  output.textContent = JSON.stringify(result, null, 2);
  button.disabled = false;
};
button.onclick = () => {
  samples.length = callbackCosts.length = longTasks.length = 0;
  callbackCount = previousFrame = 0;
  startedAt = performance.now();
  recording = true;
  if (frameAudit) { frameAudit.count = 0; frameAudit.active = true; }
  button.disabled = true;
  output.textContent = "正在记录；保持当前视图或按验收步骤滚动。";
  nativeFrame(measure);
};

export {};
