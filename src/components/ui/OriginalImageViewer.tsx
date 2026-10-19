import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import "./OriginalImageViewer.css";

export interface OriginalImage {
  id: string;
  src: string;
  alt: string;
  label: string;
  width?: number;
  height?: number;
}
const ViewerContext = createContext<(items: readonly OriginalImage[], index: number) => void>(() => {});
export const useOriginalImages = () => useContext(ViewerContext);

/** Native modal semantics, shared by evidence and account archives. The original
 * file remains available in its own tab for browser zoom at full resolution. */
export function OriginalImageViewerProvider({ children }: { children: ReactNode }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const focusRef = useRef<HTMLElement | null>(null);
  const swipeRef = useRef<{ x: number; y: number } | null>(null);
  const [selection, setSelection] = useState<{ items: readonly OriginalImage[]; index: number } | null>(null);
  const opened = selection !== null;
  const open = useCallback((items: readonly OriginalImage[], index: number) => {
    if (!items.length) return;
    focusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setSelection({ items, index: Math.max(0, Math.min(items.length - 1, index)) });
  }, []);
  const close = () => setSelection(null);
  const move = (direction: number) => setSelection(current => current && ({
    ...current, index: (current.index + direction + current.items.length) % current.items.length,
  }));

  useEffect(() => {
    if (!opened || !dialogRef.current) return;
    const dialog = dialogRef.current;
    const previousOverflow = document.body.style.overflow;
    dialog.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
      if (focusRef.current?.isConnected) focusRef.current.focus({ preventScroll: true });
    };
  }, [opened]);
  const current = selection?.items[selection.index];
  return <ViewerContext.Provider value={open}>{children}
    <dialog ref={dialogRef} className="original-viewer" aria-label="清晰原图浏览"
      onCancel={event => { event.preventDefault(); close(); }}
      onClose={close} onKeyDown={event => {
        if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
          event.preventDefault(); event.stopPropagation(); move(event.key === "ArrowLeft" ? -1 : 1);
        }
      }} onClick={event => { if (event.target === event.currentTarget) close(); }}>
      {selection && current && <div className="original-viewer__inner">
        <div className="original-viewer__toolbar">
          <div><button type="button" aria-label="上一张原图" disabled={selection.items.length < 2} onClick={() => move(-1)}><ArrowLeft aria-hidden="true" /></button>
            <button type="button" aria-label="下一张原图" disabled={selection.items.length < 2} onClick={() => move(1)}><ArrowRight aria-hidden="true" /></button></div>
          <button type="button" aria-label="关闭原图" autoFocus onClick={close}><X aria-hidden="true" /></button>
        </div>
        <div className="original-viewer__image" onPointerDown={event => {
          swipeRef.current = event.pointerType === "touch" ? { x: event.clientX, y: event.clientY } : null;
        }} onPointerCancel={() => { swipeRef.current = null; }} onPointerUp={event => {
          const start = swipeRef.current; swipeRef.current = null;
          if (!start) return;
          const dx = event.clientX - start.x, dy = event.clientY - start.y;
          if (Math.abs(dx) > 44 && Math.abs(dx) > Math.abs(dy) * 1.5) move(dx < 0 ? 1 : -1);
        }}>
          <img key={current.id} data-original-id={current.id} src={current.src} alt={current.alt} width={current.width} height={current.height} draggable={false} />
        </div>
        <div className="original-viewer__caption"><span>{current.label}</span>
          <span aria-live="polite">{String(selection.index + 1).padStart(2, "0")} / {String(selection.items.length).padStart(2, "0")}</span>
          <a href={current.src} target="_blank" rel="noreferrer">打开原图（可放大）</a>
        </div>
      </div>}
    </dialog>
  </ViewerContext.Provider>;
}
