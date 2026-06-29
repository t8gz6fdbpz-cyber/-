import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const metadata = [
  "广州 / 长沙",
  "2026 PORTFOLIO",
  "CONTENT STRATEGY · IP GROWTH · AI CREATION",
];

const ease = [0.25, 0.1, 0.25, 1] as const;

export function HeroSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "-3%"]);

  return (
    <section
      ref={sectionRef}
      aria-label="01 Hero"
      className="relative isolate min-h-screen overflow-hidden bg-[#0C0C0C]"
      style={{ minHeight: "100vh" }}
    >
      <div className="hero-cover-grid">
        <motion.nav
          aria-label="Hero navigation"
          className="hero-cover-nav"
          initial={shouldReduceMotion ? false : { opacity: 0, y: -18 }}
          animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease }}
        >
          <a href="#about">简介</a>
          <a href="#growth-systems">工作经历</a>
          <a href="#skills">技能</a>
          <a href="#contact">联系我</a>
        </motion.nav>

        <motion.a
          href="#"
          aria-label="Jack Wu"
          className="hero-cover-logo"
          initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
          animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ delay: 0.08, duration: 0.75, ease }}
        >
          JW
        </motion.a>

        <motion.div
          className="hero-cover-copy"
          style={{
            y: shouldReduceMotion ? "0%" : textY,
          }}
        >
          <motion.p
            className="hero-cover-kicker"
            initial={shouldReduceMotion ? false : { opacity: 0, y: 26 }}
            animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ delay: 0.08, duration: 0.78, ease }}
          >
            JACK WU / CONTENT GROWTH PORTFOLIO
          </motion.p>
          <motion.h1
            className="hero-heading hero-cover-title"
            initial={shouldReduceMotion ? false : { opacity: 0, y: 34 }}
            animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ delay: 0.22, duration: 0.9, ease }}
          >
            <span className="hero-cover-title-line hero-cover-title-line-short">
              JACK
            </span>
            <span className="hero-cover-title-line hero-cover-title-line-long">
              WU
            </span>
          </motion.h1>
        </motion.div>

        <motion.p
          className="hero-cover-intro"
          initial={shouldReduceMotion ? false : { opacity: 0, y: 22 }}
          animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ delay: 0.32, duration: 0.8, ease }}
        >
          内容、商业与 AI 之间的持续实践者，关注 IP 增长、内容策略与可复制的方法系统。
        </motion.p>

        <motion.div
          className="hero-cover-actions"
          initial={shouldReduceMotion ? false : { opacity: 0, y: 22 }}
          animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ delay: 0.42, duration: 0.8, ease }}
        >
          <a href="#projects" className="hero-cover-primary-link">
            查看作品
          </a>
          <a href="#contact" className="hero-cover-contact-link">
            Contact Me ↗
          </a>
        </motion.div>

        <motion.div
          className="hero-cover-meta"
          initial={shouldReduceMotion ? false : { opacity: 0, y: 22 }}
          animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ delay: 0.52, duration: 0.8, ease }}
        >
          {metadata.map((item) => (
            <p key={item}>{item}</p>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
