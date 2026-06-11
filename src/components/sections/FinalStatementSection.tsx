import { motion, useReducedMotion } from "framer-motion";

export function FinalStatementSection() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      aria-label="08 Final Statement"
      className="relative z-20 -mt-[100px] flex min-h-screen items-center justify-center overflow-hidden rounded-t-[64px] bg-[#0C0C0C] px-5 py-20 text-center shadow-[0_-28px_80px_rgba(0,0,0,0.34)] sm:rounded-t-[72px] md:rounded-t-[80px]"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(118,33,176,0.14),transparent_55%)]" />
      <motion.div
        className="relative z-10"
        initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.92 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{
          duration: shouldReduceMotion ? 0 : 1.1,
          ease: [0.2, 0.8, 0.2, 1],
        }}
      >
        <p className="mb-8 text-xs uppercase tracking-[0.32em] text-white/35">
          08 / Keep Becoming
        </p>
        <h2 className="hero-heading text-[clamp(3.5rem,11vw,150px)] font-black uppercase leading-[0.88] tracking-tight">
          Thanks for watching
        </h2>
      </motion.div>
    </section>
  );
}
