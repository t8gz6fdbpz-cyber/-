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
  const introY = useTransform(scrollYProgress, [0, 1], ["0%", "-2%"]);
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "5%"]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);

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
            aria-label="吴嘉豪"
            className="hero-cover-logo"
            initial={shouldReduceMotion ? false : { opacity: 0, y: 26 }}
            animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease }}
          >
            吴
          </motion.a>

          <div className="hero-cover-stamps" aria-hidden="true">
            <span>2026-06-29 / 吴嘉豪 / mmhm</span>
            <span>2026-06-29 / 吴嘉豪 / mmhm</span>
            <span>2026-06-29 / 吴嘉豪 / mmhm</span>
            <span>2026-06-29 / 吴嘉豪 / mmhm</span>
          </div>

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
              <span>吴</span>
              <span>嘉豪</span>
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
            内容策略、IP 增长与 AI 创作实践，把商业目标转化为可复制的内容系统。
          </motion.p>

          <motion.div
            className="hero-cover-meta"
            initial={shouldReduceMotion ? false : { opacity: 0, y: 22 }}
            animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ delay: 0.42, duration: 0.8, ease }}
          >
            <p>
              广州 / 长沙
            </p>
            <p>
              2026年6月29日
            </p>
            <p>
              凌晨4:49
            </p>
          </motion.div>
        </div>

        <div className="hero-cover-right">
          <motion.img
            src="/assets/hero-portrait-crop.png"
            alt="吴嘉豪个人照片"
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
            aria-label="联系吴嘉豪"
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
