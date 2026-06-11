import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from "framer-motion";
import {
  useEffect,
  useRef,
  useState,
  type RefObject,
} from "react";

import { useMarqueeOffset } from "../../hooks/useMarqueeOffset";
import {
  repeatedMarqueeRowOne,
  repeatedMarqueeRowTwo,
} from "../../utils/portfolioData";

function MarqueeRow({
  direction,
  images,
  rowRef,
  x,
}: {
  direction: "left" | "right";
  images: string[];
  rowRef: RefObject<HTMLDivElement>;
  x: MotionValue<number>;
}) {
  return (
    <motion.div
      ref={rowRef}
      className="flex gap-8"
      data-marquee-row={direction}
      style={{
        x,
        willChange: "transform",
      }}
    >
      {images.map((image, index) => (
        <MarqueeImage
          key={`${image}-${index}`}
          src={image}
        />
      ))}
    </motion.div>
  );
}

function wrapSequence(value: number, width: number) {
  if (width <= 0) {
    return value;
  }

  return ((value % width) + width) % width - width;
}

function MarqueeImage({ src }: { src: string }) {
  const shellRef = useRef<HTMLDivElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const node = shellRef.current;
    if (!node) {
      return;
    }

    const loadObserver = new IntersectionObserver(
      ([entry]) => {
        setShouldLoad(entry.isIntersecting);
      },
      { rootMargin: "40px 80px" },
    );
    const thresholds = Array.from({ length: 21 }, (_, index) => index / 20);
    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        const visibility = Math.min(entry.intersectionRatio / 0.72, 1);
        node.style.setProperty(
          "--card-opacity",
          `${0.42 + visibility * 0.58}`,
        );
        node.style.setProperty(
          "--card-scale",
          `${0.88 + visibility * 0.12}`,
        );
        node.style.setProperty(
          "--card-blur",
          entry.isIntersecting ? `${(1 - visibility) * 5}px` : "0px",
        );
        node.style.setProperty(
          "--card-depth",
          `${-32 + visibility * 32}px`,
        );
      },
      {
        threshold: thresholds,
      },
    );

    loadObserver.observe(node);
    visibilityObserver.observe(node);

    return () => {
      loadObserver.disconnect();
      visibilityObserver.disconnect();
    };
  }, []);

  const handlePointerMove = (
    event: React.PointerEvent<HTMLDivElement>,
  ) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const card = cardRef.current;
    if (!card) {
      return;
    }

    const bounds = card.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;

    card.dataset.hovered = "true";
    card.style.setProperty("--tilt-x", `${-y * 7}deg`);
    card.style.setProperty("--tilt-y", `${x * 9}deg`);
  };

  const resetTilt = () => {
    const card = cardRef.current;
    card?.removeAttribute("data-hovered");
    card?.style.setProperty("--tilt-x", "0deg");
    card?.style.setProperty("--tilt-y", "0deg");
  };

  return (
    <div
      ref={shellRef}
      className="marquee-card-shell h-[282px] w-[432px] shrink-0 overflow-visible p-1.5"
    >
      <div
        ref={cardRef}
        className="marquee-card"
        onPointerMove={handlePointerMove}
        onPointerLeave={resetTilt}
      >
        {shouldLoad ? (
          <img
            src={src}
            alt=""
            loading="lazy"
            decoding="async"
            draggable={false}
            className="marquee-card-image h-full w-full object-cover object-[center_18%]"
          />
        ) : null}
      </div>
    </div>
  );
}

export function MarqueeSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const rowOneRef = useRef<HTMLDivElement | null>(null);
  const rowTwoRef = useRef<HTMLDivElement | null>(null);
  const [rowWidths, setRowWidths] = useState({ one: 0, two: 0 });
  const progress = useMarqueeOffset(sectionRef);
  const shouldReduceMotion = useReducedMotion();
  const idleOffset = useMotionValue(0);

  useAnimationFrame((_, delta) => {
    if (shouldReduceMotion || rowWidths.one === 0 || rowWidths.two === 0) {
      return;
    }

    const nextOffset = idleOffset.get() + (delta / 1000) * 6;
    idleOffset.set(nextOffset);
  });

  useEffect(() => {
    const getSequenceWidth = (row: HTMLDivElement | null) => {
      if (!row) {
        return 0;
      }

      const sequenceLength = row.children.length / 3;
      const nextSequence = row.children.item(sequenceLength) as
        | HTMLElement
        | null;

      return nextSequence?.offsetLeft ?? row.scrollWidth / 3;
    };

    const measureRows = () => {
      setRowWidths({
        one: getSequenceWidth(rowOneRef.current),
        two: getSequenceWidth(rowTwoRef.current),
      });
    };

    measureRows();
    window.addEventListener("resize", measureRows);
    return () => window.removeEventListener("resize", measureRows);
  }, []);

  useMotionValueEvent(progress, "change", (value) => {
    sectionRef.current?.setAttribute(
      "data-marquee-progress",
      value.toFixed(3),
    );
  });

  const rowOneScrollX = useTransform(
    progress,
    [0, 1],
    [-rowWidths.one * 0.92, -rowWidths.one * 0.08],
  );
  const rowTwoScrollX = useTransform(
    progress,
    [0, 1],
    [-rowWidths.two * 0.08, -rowWidths.two * 0.92],
  );
  const rowOneX = useTransform(() =>
    wrapSequence(rowOneScrollX.get() + idleOffset.get(), rowWidths.one),
  );
  const rowTwoX = useTransform(() =>
    wrapSequence(rowTwoScrollX.get() - idleOffset.get(), rowWidths.two),
  );
  const canvasOpacity = useTransform(
    progress,
    [0, 0.16, 0.72, 1],
    [0.72, 1, 1, 0],
  );
  const canvasScale = useTransform(
    progress,
    [0, 0.2, 0.72, 1],
    [0.97, 1, 1, 0.965],
  );
  const canvasY = useTransform(
    progress,
    [0, 0.72, 1],
    ["7vh", "-2vh", "-14vh"],
  );

  return (
    <section
      ref={sectionRef}
      aria-label="02 Showcase"
      className="relative h-[calc(220vh+180px)] bg-[#0C0C0C] pb-[180px]"
      data-marquee-progress="0.000"
    >
      <div
        className="sticky top-0 flex h-screen items-center overflow-hidden"
        data-marquee-sticky
      >
        <motion.div
          className="flex w-full flex-col gap-8"
          data-marquee-canvas
          style={{
            opacity: shouldReduceMotion ? 1 : canvasOpacity,
            scale: shouldReduceMotion ? 1 : canvasScale,
            y: shouldReduceMotion ? 0 : canvasY,
            willChange: "transform, opacity",
          }}
        >
          <MarqueeRow
            direction="right"
            images={repeatedMarqueeRowOne}
            rowRef={rowOneRef}
            x={rowOneX}
          />
          <MarqueeRow
            direction="left"
            images={repeatedMarqueeRowTwo}
            rowRef={rowTwoRef}
            x={rowTwoX}
          />
        </motion.div>
      </div>
    </section>
  );
}
