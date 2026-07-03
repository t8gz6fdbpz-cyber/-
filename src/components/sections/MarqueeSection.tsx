import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from "framer-motion";
import {
  useEffect,
  memo,
  useRef,
  useState,
  type RefObject,
} from "react";

import { useMarqueeOffset } from "../../hooks/useMarqueeOffset";
import {
  marqueeAccounts,
  repeatedMarqueeRowOne,
  repeatedMarqueeRowTwo,
  type MarqueeAccount,
} from "../../utils/portfolioData";

function MarqueeRow({
  direction,
  accounts,
  rowRef,
  x,
}: {
  direction: "left" | "right";
  accounts: MarqueeAccount[];
  rowRef: RefObject<HTMLDivElement>;
  x: MotionValue<number>;
}) {
  return (
    <motion.div
      ref={rowRef}
      className="marquee-row-track flex gap-8"
      data-marquee-row={direction}
      transformTemplate={({ x }) => `translate3d(${x ?? 0}, 0, 0)`}
      style={{
        x,
        willChange: "transform",
      }}
    >
      {accounts.map((account, index) => (
        <MemoizedMarqueeImage
          key={`${account.image}-${index}`}
          account={account}
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

function MarqueeImage({ account }: { account: MarqueeAccount }) {
  const cardRef = useRef<HTMLDivElement | null>(null);

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
      className="marquee-card-shell h-[282px] w-[432px] shrink-0 overflow-visible p-1.5"
      data-followers={account.followers}
      data-likes={account.likes}
      data-src={account.image}
    >
      <div
        ref={cardRef}
        className="marquee-card"
        onPointerMove={handlePointerMove}
        onPointerLeave={resetTilt}
      >
        <img
          src={account.image}
          alt={`Douyin account card, ${account.followers} followers, ${account.likes} likes`}
          width={432}
          height={282}
          loading="lazy"
          decoding="async"
          draggable={false}
          className="marquee-card-image h-full w-full object-cover object-[center_18%]"
        />
      </div>
    </div>
  );
}

const MemoizedMarqueeImage = memo(MarqueeImage);

const prewarmedImages = new Set<string>();

export function MarqueeSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const rowOneRef = useRef<HTMLDivElement | null>(null);
  const rowTwoRef = useRef<HTMLDivElement | null>(null);
  const [rowWidths, setRowWidths] = useState({ one: 0, two: 0 });
  const progress = useMarqueeOffset(sectionRef);
  const shouldReduceMotion = useReducedMotion();
  const idleOffset = useMotionValue(0);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) {
      return;
    }

    const preloadObserver = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          return;
        }

        marqueeAccounts.forEach(({ image }) => {
          if (prewarmedImages.has(image)) {
            return;
          }

          prewarmedImages.add(image);
          const img = new Image();
          img.decoding = "async";
          img.src = image;
          void img.decode?.().catch(() => undefined);
        });
        preloadObserver.disconnect();
      },
      { rootMargin: "1400px 0px" },
    );

    preloadObserver.observe(section);
    return () => preloadObserver.disconnect();
  }, []);

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

  const rowOneScrollX = useTransform(
    progress,
    [0, 1],
    [0, -rowWidths.one * 0.72],
  );
  const rowTwoScrollX = useTransform(
    progress,
    [0, 1],
    [0, rowWidths.two * 0.72],
  );
  const rowOneX = useTransform(() =>
    wrapSequence(rowOneScrollX.get() + idleOffset.get(), rowWidths.one),
  );
  const rowTwoX = useTransform(() =>
    wrapSequence(rowTwoScrollX.get() - idleOffset.get(), rowWidths.two),
  );
  const canvasScale = useTransform(
    progress,
    [0, 0.2, 0.82, 1],
    [0.97, 1, 1, 0.985],
  );
  const canvasY = useTransform(
    progress,
    [0, 0.82, 1],
    ["7vh", "-2vh", "-5vh"],
  );

  return (
    <section
      ref={sectionRef}
      aria-label="02 Showcase"
      className="relative h-[calc(100vh+480px)] bg-[#0C0C0C] md:h-[calc(100vh+640px)]"
    >
      <div
        className="sticky top-0 flex h-screen items-center overflow-hidden"
        data-marquee-sticky
      >
        <motion.div
          className="flex w-full flex-col gap-8"
          data-marquee-canvas
          style={{
            scale: shouldReduceMotion ? 1 : canvasScale,
            y: shouldReduceMotion ? 0 : canvasY,
            willChange: "transform",
          }}
        >
          <MarqueeRow
            direction="right"
            accounts={repeatedMarqueeRowOne}
            rowRef={rowOneRef}
            x={rowOneX}
          />
          <MarqueeRow
            direction="left"
            accounts={repeatedMarqueeRowTwo}
            rowRef={rowTwoRef}
            x={rowTwoX}
          />
        </motion.div>
      </div>
    </section>
  );
}
