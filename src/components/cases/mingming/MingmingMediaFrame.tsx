import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { animate, motion, useMotionValue, useReducedMotion, useScroll, useTransform } from "framer-motion";
import type { MotionStyle } from "framer-motion";
import { readingProgress } from "./blockMotion";

/**
 * Aceternity ContainerScroll's perspective frame, adapted to the existing
 * media slot. The untransformed wrapper measures native window scrolling.
 * Native media stays intact: no crop, autoplay, extra scroll track or new runtime.
 */
export function MingmingMediaFrame({ children }: { children: ReactNode }) {
  const target = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target, offset: ["start .82", "start .16"] });
  const progress = useTransform(scrollYProgress, value => readingProgress(value, 0, .94));
  const [lockedAt, setLockedAt] = useState<number | null>(null);
  const heldProgress = useMotionValue(1);
  const settling = useRef<ReturnType<typeof animate> | null>(null);
  useEffect(() => () => settling.current?.stop(), []);
  // Freeze at the current geometry so an interaction never moves its target.
  const holdMedia = () => {
    if (lockedAt !== null) return;
    heldProgress.set(progress.get());
    setLockedAt(progress.get());
  };
  // Flatten after a completed gesture; the controls remain still during it.
  const settleMedia = () => {
    holdMedia();
    settling.current?.stop();
    settling.current = animate(heldProgress, 1, { duration: reduced ? 0 : .28, ease: [.16, 1, .3, 1] });
  };
  return <div ref={target} className="mm-media-arrival" data-media-held={lockedAt !== null}>
    <motion.div className="mm-editorial-player mm-media-frame"
      style={{ "--mm-frame-progress": reduced ? 1 : (lockedAt === null ? progress : heldProgress) } as MotionStyle}
      onFocusCapture={holdMedia} onPointerDownCapture={holdMedia}
      onPointerUpCapture={settleMedia} onKeyUpCapture={settleMedia} onPlayCapture={settleMedia}>
      {children}
    </motion.div>
  </div>;
}
