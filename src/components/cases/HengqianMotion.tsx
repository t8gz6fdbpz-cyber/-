import { Children, createContext, isValidElement, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { MotionConfig, motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

const editorialEase = [0.22, 1, 0.36, 1] as const;
const MotionPreference = createContext({ reduce: false, compact: false, short: false });

export function HengqianMotionProvider({ children }: { children: ReactNode }) {
  const systemReduce = useReducedMotion();
  // A bookmarkable static reading mode also makes the same reduced branch testable.
  const override = typeof window !== "undefined" && new URLSearchParams(window.location.search).get("motion") === "reduce";
  const [compact, setCompact] = useState(() => typeof window !== "undefined" && window.matchMedia("(max-width: 820px)").matches);
  const [short, setShort] = useState(() => typeof window !== "undefined" && window.matchMedia("(max-height: 699px)").matches);
  useEffect(() => {
    const query = window.matchMedia("(max-width: 820px)");
    const update = () => setCompact(query.matches);
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  useEffect(() => {
    const query = window.matchMedia("(max-height: 699px)");
    const update = () => setShort(query.matches);
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  return <MotionPreference.Provider value={{ reduce: !!systemReduce || override, compact, short }}>
    <MotionConfig reducedMotion={override ? "always" : "user"}>{children}</MotionConfig>
  </MotionPreference.Provider>;
}

export const useHengqianMotion = () => useContext(MotionPreference);

export function useHengqianEntrance() {
  const { reduce, compact } = useHengqianMotion();
  return (delay = 0) => ({
    initial: reduce ? false as const : { y: compact ? 6 : 16, opacity: 0.9 },
    animate: { y: 0, opacity: 1 },
    transition: { duration: reduce ? 0 : compact ? 0.4 : 0.72, delay: reduce ? 0 : compact ? delay / 2 : delay, ease: editorialEase },
  });
}

export function HengqianChapterHeader({ children }: { children: ReactNode }) {
  const { reduce, compact } = useHengqianMotion();
  const pieces = {
    resting: { y: reduce ? 0 : "105%", opacity: 1 },
    reading: { y: 0, opacity: 1, transition: { duration: reduce ? 0 : compact ? 0.65 : 0.95, ease: editorialEase } },
  };
  return <motion.header className="hq-chapter-header" initial="resting" whileInView="reading"
    viewport={{ once: true, amount: 0.2, margin: "0px 0px 70px 0px" }}
    variants={{ reading: { transition: { staggerChildren: reduce ? 0 : compact ? 0.05 : 0.14 } } }}>
    {Children.map(children, child => {
      if (!isValidElement<{ id?: string; className?: string; children?: ReactNode }>(child)) return child;
      if (child.type === "h2") return <h2 id={child.props.id} className="hq-heading-mask"><motion.span variants={pieces}>{child.props.children}</motion.span></h2>;
      return <motion.div className={child.props.className} initial={reduce ? false : { opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.1 }} transition={{ duration: reduce ? 0 : 0.8, delay: reduce ? 0 : 0.24, ease: editorialEase }}>{child.props.children}</motion.div>;
    })}
  </motion.header>;
}

export function HengqianEditorialBlock({ children }: { children: ReactNode }) {
  const { reduce, compact } = useHengqianMotion();
  return <motion.div className="hq-copy" initial={reduce ? false : { opacity: 1, y: compact ? 3 : 8 }}
    whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.15, margin: "0px 0px 70px 0px" }}
    transition={{ duration: reduce ? 0 : compact ? 0.35 : 0.65, delay: reduce || compact ? 0 : 0.12, ease: editorialEase }}>{children}</motion.div>;
}

// Adapted from Aceternity Parallax Scroll's useScroll/useTransform pattern.
// https://ui.aceternity.com/components/parallax-scroll
// Observe document scroll; keep ordinary flow and reserve image dimensions.
export function HengqianPhotoSurface({ children, archive = false, hero = false }: { children: ReactNode; archive?: boolean; hero?: boolean }) {
  const { reduce, compact } = useHengqianMotion();
  if (reduce || archive) return <div className="hq-photo-surface"><div className="hq-photo-motion">{children}</div></div>;
  if (hero) return <motion.div className="hq-photo-surface" initial={{ clipPath: "inset(0 22% 0 22%)" }} animate={{ clipPath: "inset(0 0% 0 0%)" }} transition={{ duration: compact ? 1 : 1.3, ease: editorialEase }}><div className="hq-photo-motion">{children}</div></motion.div>;
  return <MovingPhotoSurface>{children}</MovingPhotoSurface>;
}

function MovingPhotoSurface({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "-8%"]);
  const scale = 1.18;
  return <motion.div className="hq-photo-surface" ref={ref} initial="covered" whileInView="revealed"
    viewport={{ once: true, amount: 0.15, margin: "0px 0px 70px 0px" }}>
    <motion.div className="hq-photo-reveal" variants={{ covered: { clipPath: "inset(0 0 100% 0)" }, revealed: { clipPath: "inset(0 0 0% 0)" } }}
      transition={{ duration: 0.85, delay: 0.12, ease: editorialEase }}>
      <motion.div className="hq-photo-motion" style={{ y, scale }}>{children}</motion.div>
    </motion.div>
  </motion.div>;
}
