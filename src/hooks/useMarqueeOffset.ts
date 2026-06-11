import { useScroll, useSpring } from "framer-motion";
import { type RefObject } from "react";

export function useMarqueeOffset(sectionRef: RefObject<HTMLElement>) {
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  return useSpring(scrollYProgress, {
    stiffness: 72,
    damping: 24,
    mass: 0.42,
    restDelta: 0.001,
  });
}
