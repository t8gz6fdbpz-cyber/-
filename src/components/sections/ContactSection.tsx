import { ArrowUpRight } from "lucide-react";

import { ContactButton } from "../ui/ContactButton";
import { FadeIn } from "../ui/FadeIn";
import { Magnet } from "../ui/Magnet";
import { contactChannels, contactHref } from "../../utils/portfolioData";

export function ContactSection() {
  return (
    <section
      id="contact"
      className="relative overflow-hidden rounded-t-[40px] bg-[#111827] px-5 py-24 sm:rounded-t-[50px] sm:px-8 md:rounded-t-[60px] md:px-10 md:py-36"
    >
      <div className="contact-glow pointer-events-none absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-[rgba(7,6,4,0.12)] blur-[120px]" />
      <div className="relative z-10 mx-auto max-w-7xl">
        <FadeIn>
          <p className="mb-5 text-center text-xs uppercase tracking-[0.32em] text-white/45">
            07 / Contact
          </p>
          <h2 className="hero-heading text-center text-[clamp(3.6rem,12vw,160px)] font-black uppercase leading-[0.86] tracking-tight">
            Let&apos;s Build
          </h2>
          <p className="mx-auto mt-7 max-w-xl text-center font-light leading-relaxed text-white/48">
            Placeholder invitation for conversations about content systems,
            personal growth, business experiments, and AI creation.
          </p>
        </FadeIn>

        <div className="mx-auto mt-16 max-w-4xl divide-y divide-white/10 border-y border-white/10">
          {contactChannels.map((channel, index) => (
            <FadeIn key={channel.label} delay={index * 0.06}>
              <a
                href={channel.href}
                className="group flex items-center justify-between gap-6 py-6"
              >
                <div>
                  <p className="text-xs uppercase tracking-[0.25em] text-white/35">
                    {channel.label}
                  </p>
                  <p className="mt-2 text-xl font-medium text-white md:text-3xl">
                    {channel.value}
                  </p>
                </div>
                <ArrowUpRight className="h-6 w-6 text-white/45 transition-transform duration-400 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-white" />
              </a>
            </FadeIn>
          ))}
        </div>

        <FadeIn className="mt-16 flex justify-center" delay={0.15}>
          <Magnet padding={100} strength={4}>
            <ContactButton href={contactHref} label="Start A Conversation" />
          </Magnet>
        </FadeIn>
      </div>
    </section>
  );
}
