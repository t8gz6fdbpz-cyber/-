import { Mail } from "lucide-react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const ease = [0.25, 0.1, 0.25, 1] as const;

export function HeroSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const titleY = useTransform(scrollYProgress, [0, 1], ["0%", "-4%"]);
  const introY = useTransform(scrollYProgress, [0, 1], ["0%", "-7%"]);
  const metaY = useTransform(scrollYProgress, [0, 1], ["0%", "3%"]);
  const imageY = useTransform(scrollYProgress, [0, 1], ["-1.5%", "5.5%"]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1.025, 1.09]);

  return (
    <section
      ref={sectionRef}
      aria-label="01 Hero"
      className="relative isolate min-h-screen overflow-hidden bg-[#0C0C0C]"
      style={{ minHeight: "100vh" }}
    >
      <div className="hero-cover-grid">
        <div className="hero-cover-left">
          <motion.a
            href="#"
            aria-label="Jack Wu"
            className="hero-cover-logo"
            initial={shouldReduceMotion ? false : { opacity: 0, y: 26 }}
            animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease }}
          >
            JW
          </motion.a>

          <motion.div
            className="hero-cover-title-wrap"
            style={{
              y: shouldReduceMotion ? "0%" : titleY,
            }}
          >
            <motion.h1
              className="hero-cover-title"
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
            内容、商业与 AI 之间的持续实践者，关注 IP 增长、内容策略与可复制的方法系统。
          </motion.p>

          <motion.div
            className="hero-cover-meta"
            style={{
              y: shouldReduceMotion ? "0%" : metaY,
            }}
            initial={shouldReduceMotion ? false : { opacity: 0, y: 22 }}
            animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ delay: 0.42, duration: 0.8, ease }}
          >
            <p>
              GUANGZHOU /
              <br />
              CHANGSHA
            </p>
            <p>
              2026
              <br />
              PORTFOLIO
            </p>
            <p>
              CONTENT STRATEGY
              <br />
              IP GROWTH
              <br />
              AI CREATION
            </p>
          </motion.div>
        </div>

        <div className="hero-cover-right">
          <motion.img
            src="/assets/hero-portrait-crop.png"
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
          <div aria-hidden="true" className="hero-cover-image-overlay" />
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
