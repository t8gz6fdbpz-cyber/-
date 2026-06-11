import {
  motion,
  useReducedMotion,
  type HTMLMotionProps,
  type Transition,
} from "framer-motion";
import { type ElementType, type ReactNode, useMemo } from "react";

type FadeInProps = Omit<HTMLMotionProps<"div">, "children"> & {
  as?: ElementType;
  children: ReactNode;
  delay?: number;
  duration?: number;
  x?: number;
  y?: number;
};

const easing: Transition["ease"] = [0.25, 0.1, 0.25, 1];

export function FadeIn({
  as = "div",
  children,
  delay = 0,
  duration = 0.7,
  x = 0,
  y = 30,
  ...rest
}: FadeInProps) {
  const shouldReduceMotion = useReducedMotion();
  const MotionComponent = useMemo(
    () => motion.create(as as ElementType),
    [as],
  );

  return (
    <MotionComponent
      initial={
        shouldReduceMotion ? { opacity: 1 } : { opacity: 0, x, y }
      }
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "50px", amount: 0 }}
      transition={
        shouldReduceMotion
          ? { duration: 0 }
          : { delay, duration, ease: easing }
      }
      {...rest}
    >
      {children}
    </MotionComponent>
  );
}
