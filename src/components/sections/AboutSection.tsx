import { AnimatedText } from "../ui/AnimatedText";
import { ContactButton } from "../ui/ContactButton";
import { FadeIn } from "../ui/FadeIn";
import { aboutCopy, contactHref } from "../../utils/portfolioData";

export function AboutSection() {
  return (
    <section
      id="about"
      className="relative flex min-h-screen scroll-mt-8 items-center justify-center overflow-hidden px-5 py-20 sm:px-8 md:px-10"
    >
      <div className="relative z-10 flex flex-col items-center gap-10 sm:gap-14 md:gap-16">
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

        <div className="flex flex-col items-center gap-16 sm:gap-20 md:gap-24">
          <AnimatedText text={aboutCopy} />
          <ContactButton href={contactHref} />
        </div>
      </div>
    </section>
  );
}
