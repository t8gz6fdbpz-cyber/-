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
  const start = index / total;
  const end = Math.min(start + 0.22, 1);
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
    offset: ["start 0.8", "end 0.2"],
  });
  const characters = Array.from(text);
  const tokens = text.split(/(\s+)/);
  let characterIndex = 0;

  return (
    <p
      ref={ref}
      aria-label={text}
      className="max-w-[560px] text-center text-[clamp(1rem,2vw,1.35rem)] font-medium leading-relaxed text-[#D7E2EA]"
    >
      {shouldReduceMotion
        ? text
        : tokens.map((token, tokenIndex) => {
            if (/^\s+$/.test(token)) {
              characterIndex += token.length;
              return (
                <span aria-hidden="true" key={`space-${tokenIndex}`}>
                  {token}
                </span>
              );
            }

            return (
              <span
                aria-hidden="true"
                className="inline-block whitespace-nowrap"
                key={`${token}-${tokenIndex}`}
              >
                {Array.from(token).map((char) => {
                  const index = characterIndex;
                  characterIndex += 1;

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
              </span>
            );
          })}
    </p>
  );
}
