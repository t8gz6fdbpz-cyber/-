import { Component, lazy, Suspense, useEffect, useRef, useState, type ReactNode } from "react";
import { useInView, useReducedMotion, useScroll, useSpring } from "framer-motion";
import { ArrowLeft, ArrowRight, Expand, X } from "lucide-react";
import type { MingmingGrowthEvidence } from "../../data/mingmingCase";
import { ViewportImage } from "./ViewportImage";
import "./ContentExhibit.css";

const ContentExhibitScene = lazy(() => import("./ContentExhibitScene").then(module => ({ default: module.ContentExhibitScene })));

class ExhibitModuleBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() {
    if (!this.state.failed) return this.props.children;
    return <div className="mm-content-exhibit__module-fallback">
      <p>3D 展区暂时加载失败，仍可通过下方索引查看全部作品。</p>
      <button type="button" className="mm-content-exhibit__open" onClick={() => window.location.reload()}>刷新重试</button>
    </div>;
  }
}

export function ContentExhibit({ items }: { items: readonly MingmingGrowthEvidence[] }) {
  const reducedMotion = Boolean(useReducedMotion());
  const sectionRef = useRef<HTMLElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const stageNearby = useInView(sectionRef, { margin: "600px", once: true });
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  const progress = useSpring(scrollYProgress, { stiffness: 150, damping: 30, mass: .7, restDelta: .00005 });
  const [activeId, setActiveId] = useState(items[0]?.id ?? "");
  const [opened, setOpened] = useState(false);
  const active = Math.max(0, items.findIndex(item => item.id === activeId));
  const current = items[active];
  const count = String(active + 1).padStart(2, "0") + " / " + String(items.length).padStart(2, "0");

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
    if (items.length) setActiveId(items[(active + direction + items.length) % items.length].id);
  }

  function openItem(id: string) {
    setActiveId(id);
    setOpened(true);
  }

  if (!current) return null;

  return <section ref={sectionRef} id="mm-content-exhibit" className="mm-content-exhibit"
    data-reduced-motion={reducedMotion} aria-labelledby="mm-content-exhibit-title">
    <div className={reducedMotion ? "mm-content-exhibit__static" : "mm-content-exhibit__viewport"}>
      <header className="mm-content-exhibit__heading">
        <h3 id="mm-content-exhibit-title">内容表现成果</h3>
      </header>

      {reducedMotion ? <div className="mm-content-exhibit__static-grid">
        {items.map(item => <button type="button" key={item.id} aria-label={"查看" + item.title + "原图"} onClick={() => openItem(item.id)}>
          <ViewportImage src={item.src} alt={item.alt} width={item.width} height={item.height} />
        </button>)}
      </div> : <>
        <div className="mm-content-exhibit__stage" role="region" aria-label="随页面滚动绕行的三维成果图片，点击作品查看原图">
          {stageNearby && <ExhibitModuleBoundary><Suspense fallback={<div className="mm-content-exhibit__loading" role="status">正在加载作品…</div>}>
            <ContentExhibitScene items={items} activeId={current.id} onSelect={setActiveId}
              onOpen={() => setOpened(true)} progress={progress} reducedMotion={false} />
          </Suspense></ExhibitModuleBoundary>}
        </div>
        <div className="mm-content-exhibit__controls">
          <p className="mm-content-exhibit__stage-hint">向下滚动浏览 · 点击查看原图</p>
          <button type="button" className="mm-content-exhibit__open" onClick={() => setOpened(true)}>
            查看完整截图<Expand size={17} strokeWidth={1.5} aria-hidden="true" />
          </button>
        </div>
      </>}
    </div>

    {!reducedMotion && <div className="mm-content-exhibit__index-tray">
      <div className="mm-content-exhibit__index" aria-label="全部成果原图索引">
        {items.map((item, index) => <button key={item.id} type="button" aria-label={"查看" + item.title + "原图"}
          onClick={() => openItem(item.id)}>
          <ViewportImage src={item.src} alt="" width={item.width} height={item.height} draggable={false} />
          <span>{String(index + 1).padStart(2, "0")}</span>
        </button>)}
      </div>
    </div>}

    <dialog ref={dialogRef} className="mm-content-exhibit__lightbox" aria-label={current.title + "完整截图"}
      onCancel={event => { event.preventDefault(); setOpened(false); }} onClose={() => setOpened(false)}
      onKeyDown={event => {
        if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
          event.preventDefault(); move(event.key === "ArrowLeft" ? -1 : 1);
        }
      }}
      onClick={event => { if (event.target === event.currentTarget) setOpened(false); }}>
      {opened && <div className="mm-content-exhibit__lightbox-inner">
        <button type="button" className="mm-content-exhibit__close" aria-label="关闭完整截图" autoFocus onClick={() => setOpened(false)}><X size={24} aria-hidden="true" /></button>
        <img src={current.src} alt={current.alt} width={current.width} height={current.height} />
        <div className="mm-content-exhibit__lightbox-caption">
          <span>{current.title}</span>
          <div className="mm-content-exhibit__navigation">
            <span className="mm-content-exhibit__count" aria-live="polite">{count}</span>
            <button type="button" aria-label="上一件内容作品" disabled={items.length < 2} onClick={() => move(-1)}><ArrowLeft size={20} aria-hidden="true" /></button>
            <button type="button" aria-label="下一件内容作品" disabled={items.length < 2} onClick={() => move(1)}><ArrowRight size={20} aria-hidden="true" /></button>
          </div>
        </div>
      </div>}
    </dialog>
  </section>;
}
