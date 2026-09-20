import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";

export type EvidenceFoldItem = {
  id: string;
  src: string;
  alt: string;
  title: string;
  caption: string;
  width: number;
  height: number;
};

export type EvidenceFoldDeckItem = {
  id: string;
  indexLabel: string;
  title: string;
  countLabel: string;
  description: string;
  items: readonly EvidenceFoldItem[];
};

type EvidenceFoldDeckProps = {
  decks: readonly EvidenceFoldDeckItem[];
  defaultDeckId: string;
};

export function EvidenceFoldDeck({ decks, defaultDeckId }: EvidenceFoldDeckProps) {
  const prefersReducedMotion = useReducedMotion();
  const forceReducedMotionForQa = import.meta.env.DEV
    && new URLSearchParams(window.location.search).get("motion") === "reduce";
  const shouldReduceMotion = Boolean(prefersReducedMotion || forceReducedMotionForQa);
  const [activeDeckId, setActiveDeckId] = useState<string | null>(defaultDeckId);
  const [activeIndexes, setActiveIndexes] = useState<Record<string, number>>(() => (
    Object.fromEntries(decks.map((deck) => [deck.id, 0]))
  ));
  const [direction, setDirection] = useState<1 | -1>(1);
  const swipeStartX = useRef<number | null>(null);

  const activeDeck = useMemo(
    () => decks.find((deck) => deck.id === activeDeckId) ?? null,
    [activeDeckId, decks],
  );
  const activeIndex = activeDeck ? activeIndexes[activeDeck.id] ?? 0 : 0;
  const activeItem = activeDeck?.items[activeIndex];

  useEffect(() => {
    if (!activeDeck || activeDeck.items.length < 2) return;

    const adjacentIndexes = [
      (activeIndex - 1 + activeDeck.items.length) % activeDeck.items.length,
      (activeIndex + 1) % activeDeck.items.length,
    ];

    adjacentIndexes.forEach((index) => {
      const image = new Image();
      image.src = activeDeck.items[index].src;
    });
  }, [activeDeck, activeIndex]);

  function showDeck(deckId: string) {
    setActiveDeckId((current) => current === deckId ? null : deckId);
  }

  function showRelativeItem(step: 1 | -1) {
    if (!activeDeck) return;
    setDirection(step);
    setActiveIndexes((current) => ({
      ...current,
      [activeDeck.id]: (current[activeDeck.id] + step + activeDeck.items.length) % activeDeck.items.length,
    }));
  }

  function handlePanelKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      showRelativeItem(-1);
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      showRelativeItem(1);
    }
  }

  function handlePointerDown(event: PointerEvent<HTMLElement>) {
    if (!event.isPrimary || (event.target as Element).closest("button")) return;
    swipeStartX.current = event.clientX;
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function handlePointerUp(event: PointerEvent<HTMLElement>) {
    if (swipeStartX.current === null) return;
    const distance = event.clientX - swipeStartX.current;
    swipeStartX.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    if (Math.abs(distance) < 48) return;
    showRelativeItem(distance > 0 ? -1 : 1);
  }

  function handlePointerCancel(event: PointerEvent<HTMLElement>) {
    swipeStartX.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }

  const previousItem = activeDeck
    ? activeDeck.items[(activeIndex - 1 + activeDeck.items.length) % activeDeck.items.length]
    : null;
  const nextItem = activeDeck
    ? activeDeck.items[(activeIndex + 1) % activeDeck.items.length]
    : null;

  return (
    <div className="mm-fold-system" data-reduced-motion={shouldReduceMotion ? "true" : undefined}>
      <div className="mm-fold-covers" aria-label="账号增长成果分类">
        {decks.map((deck) => {
          const isExpanded = activeDeckId === deck.id;
          const coverItem = deck.items[0];

          return (
            <button
              key={deck.id}
              id={`${deck.id}-toggle`}
              type="button"
              className={`mm-fold-cover${isExpanded ? " is-active" : ""}`}
              aria-expanded={isExpanded}
              aria-controls={`${deck.id}-panel`}
              onClick={() => showDeck(deck.id)}
            >
              <span className="mm-fold-cover-copy">
                <span className="mm-fold-cover-index">{deck.indexLabel}</span>
                <strong>{deck.title}</strong>
                <span>{deck.countLabel}</span>
                <small>{deck.description}</small>
              </span>
              <span className="mm-fold-cover-image" aria-hidden="true">
                <img
                  src={coverItem.src}
                  alt=""
                  width={coverItem.width}
                  height={coverItem.height}
                  loading={deck.id === defaultDeckId ? "eager" : "lazy"}
                  decoding="async"
                />
              </span>
              <ChevronDown aria-hidden="true" />
            </button>
          );
        })}
      </div>

      <AnimatePresence initial={false} mode="wait">
        {activeDeck && activeItem && (
          <motion.section
            key={activeDeck.id}
            id={`${activeDeck.id}-panel`}
            className="mm-fold-panel"
            aria-labelledby={`${activeDeck.id}-toggle`}
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: shouldReduceMotion ? 0 : -10 }}
            transition={{ duration: shouldReduceMotion ? 0.16 : 0.46, ease: [0.22, 1, 0.36, 1] }}
            onKeyDown={handlePanelKeyDown}
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerCancel}
          >
            <p className="mm-sr-only" aria-live="polite" aria-atomic="true">
              {activeDeck.title}，第{activeIndex + 1}张，共{activeDeck.items.length}张
            </p>

            <div className="mm-fold-stage">
              {previousItem && (
                <figure className="mm-fold-preview is-previous" aria-hidden="true">
                  <img src={previousItem.src} alt="" width={previousItem.width} height={previousItem.height} decoding="async" />
                </figure>
              )}
              {nextItem && (
                <figure className="mm-fold-preview is-next" aria-hidden="true">
                  <img src={nextItem.src} alt="" width={nextItem.width} height={nextItem.height} decoding="async" />
                </figure>
              )}

              <AnimatePresence initial={false} mode="wait" custom={direction}>
                <motion.figure
                  key={activeItem.id}
                  className="mm-fold-current"
                  data-evidence-id={activeItem.id}
                  custom={direction}
                  initial={{
                    opacity: 0,
                    x: shouldReduceMotion ? 0 : direction * 28,
                    rotateY: shouldReduceMotion ? 0 : direction * 14,
                  }}
                  animate={{ opacity: 1, x: 0, rotateY: 0 }}
                  exit={{
                    opacity: 0,
                    x: shouldReduceMotion ? 0 : direction * -22,
                    rotateY: shouldReduceMotion ? 0 : direction * -10,
                  }}
                  transition={{ duration: shouldReduceMotion ? 0.16 : 0.48, ease: [0.22, 1, 0.36, 1] }}
                  style={{ transformOrigin: direction > 0 ? "left center" : "right center" }}
                >
                  <span className="mm-fold-main-frame">
                    <img
                      src={activeItem.src}
                      alt={activeItem.alt}
                      width={activeItem.width}
                      height={activeItem.height}
                      loading={activeIndex === 0 ? "eager" : "lazy"}
                      decoding="async"
                      draggable="false"
                    />
                  </span>
                  <figcaption>
                    <strong>{activeItem.title}</strong>
                    <span>{activeItem.caption}</span>
                  </figcaption>
                </motion.figure>
              </AnimatePresence>
            </div>

            <div className="mm-fold-controls">
              <button type="button" onClick={() => showRelativeItem(-1)} aria-label={`${activeDeck.title}上一张`}>
                <ChevronLeft aria-hidden="true" />
                <span>上一张</span>
              </button>
              <p aria-hidden="true">
                <strong>{String(activeIndex + 1).padStart(2, "0")}</strong>
                <span>/ {String(activeDeck.items.length).padStart(2, "0")}</span>
              </p>
              <button type="button" onClick={() => showRelativeItem(1)} aria-label={`${activeDeck.title}下一张`}>
                <span>下一张</span>
                <ChevronRight aria-hidden="true" />
              </button>
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
}
