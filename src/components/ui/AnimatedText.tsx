import { scroll, useReducedMotion } from "framer-motion";
import { useEffect, useRef } from "react";

/** Same character markup, offsets and opacity curve; one nearby subscription. */
export function AnimatedText({ text }: { text: string }) {
  const ref = useRef<HTMLParagraphElement | null>(null);
  const shouldReduceMotion = useReducedMotion();
  const characters = Array.from(text);

  useEffect(() => {
    const paragraph = ref.current;
    if (!paragraph || shouldReduceMotion) return;
    const spans = Array.from(paragraph.querySelectorAll<HTMLElement>("[data-animated-char]"));
    const ranges = spans.map((_, index) => {
      const start = index / spans.length * .64;
      return { start, length: Math.min(start + .18, .82) - start };
    });
    const renderProgress = (progress: number) => {
      spans.forEach((span, index) => {
        const range = ranges[index];
        const value = .2 + Math.min(1, Math.max(0, (progress - range.start) / range.length)) * .8;
        const opacity = String(value);
        if (span.style.opacity !== opacity) span.style.opacity = opacity;
      });
    };
    let unsubscribe: (() => void) | undefined;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        unsubscribe ??= scroll(renderProgress, {
          target: paragraph,
          offset: ["start 0.92", "end 0.45"],
        });
      } else {
        unsubscribe?.();
        unsubscribe = undefined;
        renderProgress(entry.boundingClientRect.bottom < 0 ? 1 : 0);
      }
    }, { rootMargin: "300px 0px" });
    observer.observe(paragraph);
    return () => { observer.disconnect(); unsubscribe?.(); };
  }, [shouldReduceMotion, text]);

  return (
    <p
      ref={ref}
      aria-label={text}
      className="animated-text-copy max-w-[760px] text-center text-[clamp(1rem,2vw,1.35rem)] font-medium leading-[1.9]"
    >
      {shouldReduceMotion ? text : characters.map((char, index) => {
        const value = char === " " ? "\u00A0" : char;
        return (
          <span key={`${char}-${index}`} aria-hidden="true" className="relative inline-block">
            <span className="invisible">{value}</span>
            <span className="absolute left-0 top-0" data-animated-char={index} style={{ opacity: .2 }}>
              {value}
            </span>
          </span>
        );
      })}
    </p>
  );
}
