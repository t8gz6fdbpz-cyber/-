import { FadeIn } from "../ui/FadeIn";
import { ContactButton } from "../ui/ContactButton";
import { contactHref, navItems } from "../../utils/portfolioData";

export function HeroSection() {
  return (
    <section
      aria-label="01 Hero"
      className="relative flex min-h-screen flex-col overflow-hidden"
    >
      <FadeIn as="nav" delay={0} y={-20} className="relative z-30">
        <div className="flex items-center justify-between gap-4 px-6 pt-6 text-sm font-medium uppercase tracking-wider text-[#D7E2EA] md:px-10 md:pt-8 md:text-lg lg:text-[1.4rem]">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={(event) => {
                const target = document.querySelector(item.href);
                if (!target) return;

                event.preventDefault();
                const root = document.documentElement;
                root.style.scrollBehavior = "auto";
                target.scrollIntoView({ block: "start" });
                window.history.replaceState(null, "", item.href);
                window.requestAnimationFrame(() => {
                  root.style.removeProperty("scroll-behavior");
                });
              }}
              className="transition-opacity duration-200 hover:opacity-70 focus-visible:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#D7E2EA]"
            >
              {item.label}
            </a>
          ))}
        </div>
      </FadeIn>

      <div className="relative z-20 flex flex-1 items-start px-6 pb-48 pt-16 sm:px-8 sm:pb-52 sm:pt-20 md:px-10 md:pb-24 md:pt-24 lg:pt-28">
        <div className="w-full max-w-[760px]">
          <FadeIn delay={0.15} y={40}>
            <p className="hero-heading mb-4 text-[clamp(1.15rem,2.4vw,2.3rem)] font-bold leading-none tracking-[-0.02em] md:mb-6">
              嗨，我是
            </p>
            <h1 className="hero-heading text-[clamp(4.5rem,12vw,10.5rem)] font-black leading-[0.86] tracking-[-0.065em]">
              吴嘉豪
            </h1>
          </FadeIn>

          <FadeIn delay={0.3} y={24}>
            <p className="mt-6 text-sm font-medium tracking-[0.12em] text-[#D7E2EA] sm:text-base md:mt-8 md:text-xl">
              内容策略｜IP孵化｜AI创作
            </p>
          </FadeIn>

          <FadeIn delay={0.45} y={20} className="mt-8 md:mt-10">
            <ContactButton href={contactHref} />
          </FadeIn>
        </div>
      </div>

    </section>
  );
}
