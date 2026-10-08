import { motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Fragment, useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from "react";

const easeOutQuint = [0.22, 1, 0.36, 1] as const;

function useCarouselViewport() {
  const compactQuery = "(max-width: 820px)";
  const phoneQuery = "(max-width: 560px)";
  const [viewport, setViewport] = useState<"desktop" | "tablet" | "phone">(() => {
    if (typeof window === "undefined") return "desktop";
    if (window.matchMedia(phoneQuery).matches) return "phone";
    return window.matchMedia(compactQuery).matches ? "tablet" : "desktop";
  });

  useEffect(() => {
    const compactMedia = window.matchMedia(compactQuery);
    const phoneMedia = window.matchMedia(phoneQuery);
    const update = () => setViewport(
      phoneMedia.matches ? "phone" : compactMedia.matches ? "tablet" : "desktop",
    );
    update();
    compactMedia.addEventListener("change", update);
    phoneMedia.addEventListener("change", update);
    return () => {
      compactMedia.removeEventListener("change", update);
      phoneMedia.removeEventListener("change", update);
    };
  }, []);

  return viewport;
}

type CarouselProps<T extends { id: string }> = {
  items: T[];
  label: string;
  statusLabel: string;
  desktopPageSize: number;
  desktopColumns: number;
  mobilePageSize?: number;
  phonePageSize?: number;
  renderItem: (item: T, index: number) => ReactNode;
  className?: string;
};

export function Carousel<T extends { id: string }>({
  items,
  label,
  statusLabel,
  desktopPageSize,
  desktopColumns,
  mobilePageSize = 2,
  phonePageSize,
  renderItem,
  className = "",
}: CarouselProps<T>) {
  const viewport = useCarouselViewport();
  const reduceMotion = useReducedMotion();
  const pageSize = viewport === "desktop"
    ? desktopPageSize
    : viewport === "phone"
      ? (phonePageSize ?? mobilePageSize)
      : mobilePageSize;
  const columns = viewport === "desktop" ? desktopColumns : Math.min(2, pageSize);
  const [page, setPage] = useState(0);
  const pointerStart = useRef<number | null>(null);
  const suppressClick = useRef(false);
  const pages = useMemo(() => {
    const result: T[][] = [];
    for (let index = 0; index < items.length; index += pageSize) {
      result.push(items.slice(index, index + pageSize));
    }
    return result;
  }, [items, pageSize]);

  useEffect(() => setPage(0), [pageSize, items]);

  const move = (direction: -1 | 1) => {
    setPage((current) => Math.min(Math.max(current + direction, 0), pages.length - 1));
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      move(-1);
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      move(1);
    }
  };

  return (
    <div
      className={`mm-carousel ${className}`.trim()}
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onClickCapture={(event) => {
        if (!suppressClick.current) return;
        event.preventDefault();
        event.stopPropagation();
        suppressClick.current = false;
      }}
      data-carousel={statusLabel}
    >
      <div className="mm-carousel-viewport">
        <motion.div
          className="mm-carousel-track"
          animate={{ x: `-${page * 100}%` }}
          transition={reduceMotion ? { duration: 0 } : { duration: 0.38, ease: easeOutQuint }}
          onPointerDown={(event) => {
            pointerStart.current = event.clientX;
            event.currentTarget.setPointerCapture(event.pointerId);
          }}
          onPointerMove={(event) => {
            if (pointerStart.current === null) return;
            const distance = event.clientX - pointerStart.current;
            if (Math.abs(distance) < 48) return;
            pointerStart.current = null;
            suppressClick.current = true;
            move(distance < 0 ? 1 : -1);
          }}
          onPointerUp={(event) => {
            if (pointerStart.current === null) return;
            const distance = event.clientX - pointerStart.current;
            pointerStart.current = null;
            if (Math.abs(distance) < 48) return;
            suppressClick.current = true;
            move(distance < 0 ? 1 : -1);
          }}
          onPointerCancel={() => {
            pointerStart.current = null;
          }}
        >
          {pages.map((itemsOnPage, pageIndex) => (
            <div
              key={`${statusLabel}-${pageIndex}`}
              className="mm-carousel-page"
              role="group"
              aria-roledescription="slide"
              aria-label={`${pageIndex + 1} / ${pages.length}`}
              aria-hidden={pageIndex !== page}
              {...(pageIndex !== page ? ({ inert: "" } as Record<string, string>) : {})}
            >
              <div
                className="mm-carousel-grid"
                style={{ "--mm-carousel-columns": columns } as CSSProperties}
              >
                {itemsOnPage.map((item, itemIndex) => <Fragment key={item.id}>{renderItem(item, pageIndex * pageSize + itemIndex)}</Fragment>)}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
      <div className="mm-carousel-controls">
        <button type="button" onClick={() => move(-1)} disabled={page === 0} aria-label={`${label}上一页`}>
          <ChevronLeft aria-hidden="true" />
          <span>上一页</span>
        </button>
        <p aria-live="polite">{statusLabel} {page + 1} / {pages.length}</p>
        <button type="button" onClick={() => move(1)} disabled={page === pages.length - 1} aria-label={`${label}下一页`}>
          <span>下一页</span>
          <ChevronRight aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

export function FadeContent({ active, children, id }: { active: boolean; children: ReactNode; id: string }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      id={id}
      className="mm-fade-content"
      aria-hidden={!active}
      {...(!active ? ({ inert: "" } as Record<string, string>) : {})}
      initial={false}
      animate={{ opacity: active ? 1 : 0, x: active || reduceMotion ? 0 : 12 }}
      transition={reduceMotion ? { duration: 0 } : { duration: 0.24, ease: easeOutQuint }}
      style={{ pointerEvents: active ? "auto" : "none", visibility: active ? "visible" : "hidden" }}
    >
      {children}
    </motion.div>
  );
}
