import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";

import { heroPortrait } from "../../utils/portfolioData";

export const formatDate = (date: Date) =>
  new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "Asia/Shanghai",
  }).format(date);

export const formatTime = (date: Date) => {
  const time = new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
    timeZone: "Asia/Shanghai",
  }).format(date);
  const hour = Number(time.slice(0, 2));

  return `${time}${hour >= 12 ? "pm" : "am"}`;
};

export function HeroSection({ initialTimestamp }: { initialTimestamp?: number }) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const shouldReduceMotion = useReducedMotion();
  const [now, setNow] = useState(() => new Date(initialTimestamp ?? Date.now()));
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  // Track native scroll directly so motion stops as soon as scrolling stops.
  // Move the entire portrait panel upward while keeping its image crop fixed.
  // The text panel gets only a small downward offset to limit visual motion.
  const leftY = useTransform(scrollYProgress, [0, 1], ["0vh", "5vh"]);
  const rightY = useTransform(scrollYProgress, [0, 1], ["0vh", "-50vh"]);

  useEffect(() => {
    let timer: number;
    const updateNow = () => {
      setNow(new Date());
      timer = window.setTimeout(updateNow, 60_000 - (Date.now() % 60_000) + 50);
    };

    updateNow();
    return () => window.clearTimeout(timer);
  }, []);

  const meta = useMemo(
    () => ["广州市·番禺区", formatDate(now), formatTime(now)],
    [now],
  );

  return (
    <section
      ref={sectionRef}
      aria-label="01 Hero"
      className="relative isolate min-h-screen overflow-hidden"
      style={{ minHeight: "100vh" }}
    >
      <div className="hero-cover-grid">
        <motion.div className="hero-cover-left" style={{ y: shouldReduceMotion ? 0 : leftY }}>
          <div className="hero-cover-title-wrap">
            <h1
              className="hero-cover-title notranslate"
              translate="no"
            >
              <span>WU</span>
              <span>JIAHAO</span>
            </h1>
            <div className="hero-cover-copy">
              <p className="hero-cover-role">吴嘉豪-AIGC内容制作</p>
              <p className="hero-cover-tagline">
                具备IP孵化与商业内容运营背景的AIGC视频制作人
              </p>
            </div>
          </div>

          <div
            className="hero-cover-meta notranslate"
            translate="no"
          >
            {meta.map((item) => (
              <p key={item}>{item}</p>
            ))}
          </div>
        </motion.div>

        <motion.div className="hero-cover-right" style={{ y: shouldReduceMotion ? 0 : rightY }}>
          <motion.img
            src={heroPortrait}
            alt="吴嘉豪身着深色西装的正面肖像"
            width={1400}
            height={1042}
            loading="eager"
            fetchPriority="high"
            decoding="async"
            className="hero-cover-image"
            style={{
              scale: 1.36,
            }}
          />
        </motion.div>
      </div>
    </section>
  );
}
