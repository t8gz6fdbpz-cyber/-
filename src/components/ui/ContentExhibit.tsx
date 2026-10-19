import { useSiteReducedMotion } from "../../motion/MotionPreference";
import { Component, lazy, Suspense, useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { useInView, useMotionValue, useMotionValueEvent,  type MotionValue } from "framer-motion";
import { ArrowLeft, ArrowRight, Expand, X } from "lucide-react";
import type { MingmingGrowthEvidence } from "../../data/mingmingCase";
import { defaultStripSettings, type StripSettings } from "./contentExhibitMotion";
import type { StripCommand } from "./ContentStripEngine";
import "./ContentExhibit.css";

const ContentExhibitScene = lazy(() => import("./ContentExhibitScene").then(module => ({ default: module.ContentExhibitScene })));

class ExhibitModuleBoundary extends Component<{ children: ReactNode; onFailure: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onFailure(); }
  render() {
    if (!this.state.failed) return this.props.children;
    return <div className="mm-content-exhibit__module-fallback">
      <p>素材带暂时加载失败，仍可使用左右按钮和“查看完整截图”。</p>
      <button type="button" className="mm-content-exhibit__open" onClick={() => window.location.reload()}>刷新重试</button>
    </div>;
  }
}

export function ContentExhibit({ items, stripSettings, autoScroll = false, entryProgress }: {
  items: readonly MingmingGrowthEvidence[]; stripSettings?: Partial<StripSettings>;
  autoScroll?: boolean; entryProgress?: MotionValue<number>;
}) {
  const reducedMotion = useSiteReducedMotion();
  const settings = useMemo(() => ({ ...defaultStripSettings, ...stripSettings }), [stripSettings]);
  const immediateEntry = useMotionValue(1);
  const entry = entryProgress ?? immediateEntry;
  const exhibitRef = useRef<HTMLElement>(null);
  const [entryReady, setEntryReady] = useState(entry.get() >= .995);
  useMotionValueEvent(entry, "change", value => {
    exhibitRef.current?.style.setProperty("--mm-handoff-progress", String(value));
    setEntryReady(value >= .995);
  });
  const stageRef = useRef<HTMLDivElement>(null);
  const stageNearby = useInView(stageRef, { margin: "600px", once: true });
  const stageVisible = useInView(stageRef);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const openedAtId = useRef("");
  const [activeId, setActiveId] = useState(items[0]?.id ?? "");
  const [opened, setOpened] = useState(false);
  const [fallback, setFallback] = useState(false);
  const [command, setCommand] = useState<StripCommand>({ revision: 0 });
  const active = Math.max(0, items.findIndex(item => item.id === activeId));
  const current = items[active];
  const progress = String(active + 1).padStart(2, "0") + " / " + String(items.length).padStart(2, "0");

  useEffect(() => {
    if (!opened || !dialogRef.current) return;
    const dialog = dialogRef.current;
    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    dialog.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus({ preventScroll: true });
    };
  }, [opened]);

  function move(direction: number) {
    if (!items.length) return;
    if (opened || fallback) setActiveId(items[(active + direction + items.length) % items.length].id);
    else setCommand(previous => ({ revision: previous.revision + 1, direction }));
  }
  function select(index: number) {
    if (fallback) setActiveId(items[index].id);
    else setCommand(previous => ({ revision: previous.revision + 1, index }));
  }
  function openImage(id = current.id) { openedAtId.current = current.id; setActiveId(id); setOpened(true); }
  function closeImage() {
    setOpened(false);
    // Preserve the fractional autoplay phase unless the viewer selected another work.
    if (!autoScroll || current.id !== openedAtId.current) select(active);
  }

  if (!current) return null;

  return (
    <section ref={exhibitRef} id="mm-content-exhibit" className="mm-content-exhibit" aria-labelledby="mm-content-exhibit-title"
      style={{ "--mm-handoff-progress": entry.get() } as CSSProperties}
      onKeyDown={event => {
        if (opened || event.defaultPrevented) return;
        if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
          event.preventDefault(); move(event.key === "ArrowLeft" ? -1 : 1);
        } else if (event.key === "Home" || event.key === "End") {
          event.preventDefault(); select(event.key === "Home" ? 0 : items.length - 1);
        } else if (event.key === "Enter" && event.target instanceof HTMLCanvasElement) {
          event.preventDefault(); openImage();
        }
      }}>
      <header className="mm-content-exhibit__heading">
        <h3 id="mm-content-exhibit-title">内容表现成果</h3>
        <div className="mm-content-exhibit__navigation">
          <span className="mm-content-exhibit__count" aria-live="polite" aria-label={"当前第" + (active + 1) + "张，共" + items.length + "张"}>{progress}</span>
          <button type="button" aria-label="上一件内容作品" disabled={items.length < 2} onClick={() => move(-1)}><ArrowLeft size={18} aria-hidden="true" /></button>
          <button type="button" aria-label="下一件内容作品" disabled={items.length < 2} onClick={() => move(1)}><ArrowRight size={18} aria-hidden="true" /></button>
        </div>
      </header>

      <div className="mm-content-exhibit__stage" ref={stageRef} role="region"
        aria-label="弧面图片浏览带。左右拖动浏览，左右方向键选择作品，点击图片可查看完整截图。" tabIndex={0}>
        {stageNearby && <ExhibitModuleBoundary onFailure={() => setFallback(true)}><Suspense fallback={<div className="mm-content-exhibit__loading" role="status">正在布置作品空间…</div>}>
          <ContentExhibitScene items={items} activeId={current.id} command={command} onSelect={setActiveId}
            onOpen={openImage} onFallbackChange={setFallback} reducedMotion={Boolean(reducedMotion)} settings={settings}
            visible={stageVisible && !opened} autoScroll={autoScroll && (Boolean(reducedMotion) || entryReady)} />
        </Suspense></ExhibitModuleBoundary>}
      </div>


      <div className="mm-content-exhibit__details">
        <div className="mm-content-exhibit__copy">
          <button type="button" className="mm-content-exhibit__open" onClick={() => openImage()}>
            查看完整截图<Expand size={17} strokeWidth={1.5} aria-hidden="true" />
          </button>
        </div>
        <p className="mm-content-exhibit__stage-hint">{reducedMotion ? "左右切换 · 点击查看原图" : "左右拖动 · 点击查看原图"}</p>
      </div>

      <dialog ref={dialogRef} className="mm-content-exhibit__lightbox" aria-label={current.title + "完整截图"}
        onCancel={event => { event.preventDefault(); closeImage(); }} onClose={() => { if (opened) closeImage(); }}
        onClick={event => { if (event.target === event.currentTarget) closeImage(); }}
        onKeyDown={event => {
          if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
            event.preventDefault(); event.stopPropagation(); move(event.key === "ArrowLeft" ? -1 : 1);
          }
        }}>
        {opened && <div className="mm-content-exhibit__lightbox-inner">
          <div className="mm-content-exhibit__lightbox-toolbar">
            <div className="mm-content-exhibit__navigation">
              <button type="button" aria-label="查看上一张完整截图" onClick={() => move(-1)}><ArrowLeft size={20} aria-hidden="true" /></button>
              <button type="button" aria-label="查看下一张完整截图" onClick={() => move(1)}><ArrowRight size={20} aria-hidden="true" /></button>
            </div>
            <button type="button" className="mm-content-exhibit__close" aria-label="关闭完整截图" autoFocus onClick={closeImage}><X size={24} aria-hidden="true" /></button>
          </div>
          <img src={current.originalSrc ?? current.src} alt={current.alt} width={current.width} height={current.height} />
          <div className="mm-content-exhibit__lightbox-caption"><span>{current.title}</span><a href={current.originalSrc ?? current.src} target="_blank" rel="noreferrer">打开原图</a><span>{progress}</span></div>
        </div>}
      </dialog>
    </section>
  );
}
