import { Mail } from "lucide-react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";

const ease = [0.25, 0.1, 0.25, 1] as const;

const formatDate = (date: Date) =>
  new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "Asia/Shanghai",
  })
    .format(date)
    .toUpperCase();

const formatTime = (date: Date) =>
  new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Shanghai",
  }).format(date);

export function HeroSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const shouldReduceMotion = useReducedMotion();
  const [now, setNow] = useState(() => new Date());
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const titleY = useTransform(scrollYProgress, [0, 1], ["0%", "-9%"]);
  const introY = useTransform(scrollYProgress, [0, 1], ["0%", "-12%"]);
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "3%"]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1.36, 1.42]);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000 * 30);
    return () => window.clearInterval(timer);
  }, []);

  const meta = useMemo(
    () => ["GUANGZHOU, CHINA", formatDate(now), formatTime(now)],
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
        <div className="hero-cover-left">
          <motion.a
            href="#"
            aria-label="Jack Wu"
            className="hero-cover-logo notranslate"
            translate="no"
            initial={shouldReduceMotion ? false : { opacity: 0 }}
            animate={shouldReduceMotion ? undefined : { opacity: 1 }}
            transition={{ duration: 0.75, ease }}
          >
            <span>JW</span>
          </motion.a>

          <motion.div
            className="hero-cover-title-wrap"
            style={{
              y: shouldReduceMotion ? "0%" : titleY,
            }}
          >
            <motion.h1
              className="hero-cover-title notranslate"
              translate="no"
              initial={shouldReduceMotion ? false : { opacity: 0, y: 34 }}
              animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
              transition={{ delay: 0.12, duration: 0.95, ease }}
            >
              <span>WU</span>
              <span>JIAHAO</span>
            </motion.h1>
          </motion.div>

          <motion.p
            className="hero-cover-intro"
            style={{
              y: shouldReduceMotion ? "0%" : introY,
            }}
            initial={shouldReduceMotion ? false : { opacity: 0, y: 22 }}
            animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ delay: 0.24, duration: 0.82, ease }}
          >
            Building content systems where business, AI, and creator growth
            become repeatable practice.
          </motion.p>

          <motion.div
            className="hero-cover-meta notranslate"
            translate="no"
            initial={shouldReduceMotion ? false : { opacity: 0, y: 22 }}
            animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ delay: 0.42, duration: 0.8, ease }}
          >
            {meta.map((item) => (
              <p key={item}>{item}</p>
            ))}
          </motion.div>
        </div>

        <div className="hero-cover-right">
          <motion.img
            src="/assets/hero-portrait.png"
            alt="Jack Wu portrait"
            className="hero-cover-image"
            style={{
              y: shouldReduceMotion ? "0%" : imageY,
              scale: shouldReduceMotion ? 1 : imageScale,
            }}
            initial={shouldReduceMotion ? false : { opacity: 0 }}
            animate={shouldReduceMotion ? undefined : { opacity: 1 }}
            transition={{ delay: 0.08, duration: 1.05, ease }}
          />
          <motion.a
            href="#contact"
            aria-label="Contact Jack Wu"
            className="hero-cover-email"
            initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.86 }}
            animate={shouldReduceMotion ? undefined : { opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.75, ease }}
          >
            <Mail className="h-8 w-8" strokeWidth={2.6} />
          </motion.a>
        </div>
      </div>
    </section>
  );
}
