import { FadeIn } from "../ui/FadeIn";
import { ContactButton } from "../ui/ContactButton";
import { Magnet } from "../ui/Magnet";
import { contactHref, heroPortrait, navItems } from "../../utils/portfolioData";

export function HeroSection() {
  return (
    <section
      aria-label="01 Hero"
      className="relative flex h-screen flex-col overflow-x-clip"
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

      <div className="mt-6 overflow-hidden sm:mt-4 md:-mt-5">
        <FadeIn delay={0.15} y={40}>
          <h1 className="hero-heading w-full whitespace-nowrap text-[14vw] font-black uppercase leading-none tracking-tight sm:text-[15vw] md:text-[16vw] lg:text-[17.5vw]">
            Hi, i&apos;m jack
          </h1>
        </FadeIn>
      </div>

      <div className="pointer-events-none absolute left-1/2 top-1/2 z-10 w-[280px] -translate-x-1/2 -translate-y-1/2 sm:bottom-0 sm:top-auto sm:w-[360px] sm:translate-y-0 md:w-[440px] lg:w-[520px]">
        <FadeIn delay={0.6} y={30}>
          <Magnet className="pointer-events-auto">
            <img
              src={heroPortrait}
              alt="Jack portrait"
              draggable={false}
              className="w-full drop-shadow-[0_28px_60px_rgba(0,0,0,0.45)]"
            />
          </Magnet>
        </FadeIn>
      </div>

      <div className="relative z-20 mt-auto flex w-full items-end justify-between gap-6 px-6 pb-7 sm:pb-8 md:px-10 md:pb-10">
        <FadeIn delay={0.35} y={20}>
          <p className="max-w-[160px] text-[clamp(0.75rem,1.4vw,1.5rem)] font-light uppercase leading-snug tracking-[0.18em] text-[#D7E2EA] sm:max-w-[220px] md:max-w-[260px]">
            Content Strategy / IP Growth / AI Creation
          </p>
        </FadeIn>

        <FadeIn delay={0.5} y={20}>
          <ContactButton href={contactHref} />
        </FadeIn>
      </div>
    </section>
  );
}
