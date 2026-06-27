import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useRef } from "react";

function RevealCharacter({
  char,
  index,
  total,
  progress,
}: {
  char: string;
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const start = (index / total) * 0.64;
  const end = Math.min(start + 0.18, 0.82);
  const opacity = useTransform(progress, [start, end], [0.2, 1]);
  const value = char === " " ? "\u00A0" : char;

  return (
    <span aria-hidden="true" className="relative inline-block">
      <span className="invisible">{value}</span>
      <motion.span
        className="absolute left-0 top-0"
        data-animated-char={index}
        style={{ opacity }}
      >
        {value}
      </motion.span>
    </span>
  );
}

type AnimatedTextProps = {
  text: string;
};

export function AnimatedText({ text }: AnimatedTextProps) {
  const ref = useRef<HTMLParagraphElement | null>(null);
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.92", "end 0.45"],
  });
  const characters = Array.from(text);

  return (
    <p
      ref={ref}
      aria-label={text}
      className="max-w-[760px] text-center text-[clamp(1rem,2vw,1.35rem)] font-medium leading-[1.9] text-[#D7E2EA]"
    >
      {shouldReduceMotion
        ? text
        : characters.map((char, index) => {
            return (
              <RevealCharacter
                key={`${char}-${index}`}
                char={char}
                index={index}
                total={characters.length}
                progress={scrollYProgress}
              />
            );
          })}
    </p>
  );
}
