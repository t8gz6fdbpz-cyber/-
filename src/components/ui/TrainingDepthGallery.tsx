import { useEffect, useLayoutEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { MingmingMedia } from "../../data/mingmingCase";
import DepthCarousel, { type DepthCarouselHandle } from "./depth-carousel/DepthCarousel";
import "./TrainingDepthGallery.css";

export function TrainingDepthGallery({ items }: { items: readonly MingmingMedia[] }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<DepthCarouselHandle>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [active, setActive] = useState(0);
  const [opened, setOpened] = useState(false);
  const [size, setSize] = useState({ width: 240, spread: 24 });
  const slides = useMemo(() => items.map(item => ({ image: item.src ?? "", alt: item.alt })), [items]);
  const current = items[active];
  const progress = `${String(active + 1).padStart(2, "0")} / ${String(items.length).padStart(2, "0")}`;

  useLayoutEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const measure = () => {
      const available = host.getBoundingClientRect().width;
      const compact = available < 600;
      const width = Math.round(Math.min(880, available * (compact ? .83 : .76), compact ? 880 : window.innerHeight));
      setSize({ width, spread: Math.round(width * (compact ? .12 : .19)) });
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(host);
    window.addEventListener("resize", measure);
    return () => { observer.disconnect(); window.removeEventListener("resize", measure); };
  }, []);

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

  if (!current) return null;

  return (
    <div ref={hostRef} className="mm-training-depth" style={{
      "--training-stage-height": `${size.width * .75 + 24}px`,
      "--training-card-width": `${size.width}px`,
    } as CSSProperties} onKeyDown={e => {
      if (e.defaultPrevented || opened) return;
      if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
        e.preventDefault();
        if (e.key === "ArrowLeft") carouselRef.current?.previous();
        else carouselRef.current?.next();
      }
    }}>
      <DepthCarousel
        ref={carouselRef}
        items={slides}
        cardWidth={size.width}
        cardHeight={size.width * .75}
        spread={size.spread}
        depth={78}
        tilt={7}
        perspective={1200}
        visibleCards={4}
        falloff={.1}
        blur={0}
        radius={2}
        tint="#0b0a08"
        duration={520}
        autoplay={false}
        loop
        showControls={false}
        showIndicators={false}
        ariaLabel="训练营景深相册，左右方向键切换照片"
        onChange={setActive}
        onOpen={() => setOpened(true)}
      />
      <div className="mm-training-depth__footer">
        <div className="mm-training-depth__caption" aria-live="polite" aria-atomic="true">
          <h4>{current.title}</h4>
          <p>{current.caption}</p>
        </div>
        <div className="mm-training-depth__navigation">
          <span className="mm-training-depth__progress" aria-label={`第 ${active + 1} 张，共 ${items.length} 张`}>{progress}</span>
          <button type="button" aria-label="上一张训练营照片" onClick={() => carouselRef.current?.previous()}><ChevronLeft size={20} aria-hidden="true" /></button>
          <button type="button" aria-label="下一张训练营照片" onClick={() => carouselRef.current?.next()}><ChevronRight size={20} aria-hidden="true" /></button>
        </div>
      </div>
      <dialog ref={dialogRef} className="mm-training-lightbox" aria-label={`${current.title}大图`} onCancel={e => { e.preventDefault(); setOpened(false); }} onClose={() => setOpened(false)} onClick={e => { if (e.target === e.currentTarget) setOpened(false); }}>
        <div className="mm-training-lightbox__content">
          <button type="button" className="mm-training-lightbox__close" aria-label="关闭大图" autoFocus onClick={() => setOpened(false)}><X size={24} aria-hidden="true" /></button>
          <img src={current.src} alt={current.alt} width={current.width} height={current.height} />
          <div className="mm-training-lightbox__caption"><span>{current.title}</span><span>{progress}</span></div>
        </div>
      </dialog>
    </div>
  );
}
