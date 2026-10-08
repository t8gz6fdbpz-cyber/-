import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";

const formatDate = (date: Date) =>
  new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "Asia/Shanghai",
  }).format(date);

const formatTime = (date: Date) => {
  const time = new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
    timeZone: "Asia/Shanghai",
  }).format(date);
  const hour = Number(time.slice(0, 2));

  return `${time}${hour >= 12 ? "pm" : "am"}`;
};

export function HeroSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const shouldReduceMotion = useReducedMotion();
  const [now, setNow] = useState(() => new Date());
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  // Smooth the element motion, not the document scroll, so native input stays responsive.
  const progress = useSpring(scrollYProgress, {
    stiffness: 110,
    damping: 22,
    mass: 0.65,
    restDelta: 0.0001,
  });
  // One split-cover handoff: typography exits first, while the portrait lingers.
  // Keep children together and the portrait crop fixed throughout the sequence.
  const leftY = useTransform(progress, [0, 0.12, 0.68, 1], ["0vh", "-3vh", "-32vh", "-42vh"]);
  const rightY = useTransform(progress, [0, 0.16, 0.72, 1], ["0vh", "0vh", "12vh", "16vh"]);

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
          </div>

          <p className="hero-cover-intro">
            Building content systems where business, AI, and creator growth
            become repeatable practice.
          </p>

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
            src="/assets/hero-portrait.png"
            alt="Jack Wu portrait"
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
