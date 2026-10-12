import { useEffect, useRef, useState } from "react";
import type { MingmingGrowthEvidence } from "../../data/mingmingCase";
import { createContentStrip, type StripCommand } from "./ContentStripEngine";
import type { StripSettings } from "./contentExhibitMotion";
type SceneProps = {
  items: readonly MingmingGrowthEvidence[]; activeId: string; command: StripCommand;
  onSelect: (id: string) => void; onOpen: (id: string) => void;
  onFallbackChange: (fallback: boolean) => void;
  reducedMotion: boolean; visible: boolean; settings: StripSettings; autoScroll?: boolean;
};
export function ContentExhibitScene({ items, activeId, command, onSelect, onOpen, onFallbackChange, reducedMotion, visible, settings, autoScroll = false }: SceneProps) {
  const canvas = useRef<HTMLCanvasElement>(null), engine = useRef<ReturnType<typeof createContentStrip>>(null);
  const live = useRef({ onSelect, onOpen, onFallbackChange, reducedMotion, visible, command, activeId, autoScroll });
  live.current = { onSelect, onOpen, onFallbackChange, reducedMotion, visible, command, activeId, autoScroll };
  const [status, setStatus] = useState<"loading" | "ready" | "fallback">("loading"), [message, setMessage] = useState("");
  useEffect(() => {
    if (!canvas.current || !items.length) return;
    const instance = createContentStrip(canvas.current, items, settings, {
      onSelect: index => live.current.onSelect(items[index].id),
      onOpen: index => live.current.onOpen(items[index].id),
      onStatus: (next, text) => { setStatus(next); setMessage(text ?? ""); live.current.onFallbackChange(next === "fallback"); },
    }, Math.max(0, items.findIndex(item => item.id === live.current.activeId)));
    engine.current = instance;
    instance?.update({ visible: live.current.visible, reduced: live.current.reducedMotion, autoScroll: live.current.autoScroll }); instance?.command(live.current.command);
    return () => { instance?.dispose(); engine.current = null; };
  }, [items, settings]);
  useEffect(() => { engine.current?.update({ visible, reduced: reducedMotion, autoScroll }); }, [visible, reducedMotion, autoScroll]);
  useEffect(() => { engine.current?.command(command); }, [command]);
  return <div className="mm-content-exhibit__scene" style={{ background: settings.background }}>
    <canvas ref={canvas} className="mm-content-exhibit__canvas" hidden={status === "fallback"}
      tabIndex={status === "ready" ? 0 : -1} role="group"
      aria-label={`弧面截图浏览带，共${items.length}张。左右拖动或使用方向键浏览，按回车查看当前完整截图。`} />
    {status === "loading" && <p className="mm-content-exhibit__loading" role="status">正在准备截图…</p>}
    {status === "fallback" && <div className="mm-content-exhibit__fallback">
      <p role="status">{message}</p>
      <div className="mm-content-exhibit__flat-strip">{items.map(item => <button key={item.id} type="button"
        aria-label={`查看${item.title}完整截图`} onClick={() => onOpen(item.id)}>
        <img src={item.src} alt={item.alt} width={item.width} height={item.height} draggable={false} />
      </button>)}</div>
    </div>}
  </div>;
}
