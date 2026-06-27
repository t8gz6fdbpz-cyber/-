import { AnimatedText } from "../ui/AnimatedText";
import { ContactButton } from "../ui/ContactButton";
import { FadeIn } from "../ui/FadeIn";
import { aboutCopy, contactHref } from "../../utils/portfolioData";

const aboutParagraphs = [
  aboutCopy,
  "My work sits between content strategy, IP growth, business observation, and AI-assisted creation. I care about turning scattered experience into repeatable systems that can support real people, real teams, and real outcomes.",
];

const aboutHighlights = [
  "Content Strategy",
  "IP Growth",
  "AI Creation",
  "Long-term Iteration",
];

export function AboutSection() {
  return (
    <section
      id="about"
      className="relative flex min-h-[150vh] scroll-mt-8 justify-center overflow-hidden px-5 pb-36 pt-20 sm:px-8 sm:pb-40 md:px-10 md:pb-44 md:pt-24"
    >
      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-center">
        <FadeIn delay={0} y={40}>
          <div>
            <p className="mb-5 text-center text-xs uppercase tracking-[0.32em] text-[#D7E2EA]/40">
              03 / Self Introduction
            </p>
            <h2 className="hero-heading text-center text-[clamp(3rem,12vw,160px)] font-black uppercase leading-none tracking-tight">
              自我介绍
            </h2>
          </div>
        </FadeIn>

        <div className="mt-24 flex w-full max-w-3xl flex-col items-center sm:mt-28 md:mt-32">
          <div className="flex flex-col items-center gap-9 sm:gap-10 md:gap-11">
            {aboutParagraphs.map((paragraph) => (
              <AnimatedText key={paragraph} text={paragraph} />
            ))}
          </div>

          <FadeIn
            delay={0.05}
            y={30}
            className="mt-12 flex flex-wrap justify-center gap-3 sm:mt-14 md:mt-16"
          >
            {aboutHighlights.map((highlight) => (
              <span
                key={highlight}
                className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-[10px] font-medium uppercase tracking-[0.24em] text-[#D7E2EA]/60 sm:px-5 sm:text-xs"
              >
                {highlight}
              </span>
            ))}
          </FadeIn>

          <FadeIn delay={0.1} y={30} className="mt-14 md:mt-16">
            <ContactButton href={contactHref} />
          </FadeIn>

          <div aria-hidden="true" className="h-20 w-full sm:h-24 md:h-20" />
        </div>
      </div>
    </section>
  );
}
