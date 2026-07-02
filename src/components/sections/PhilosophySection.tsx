import { FadeIn } from "../ui/FadeIn";

const principles = [
  ["01", "Long-term thinking", "Choose systems that improve with time."],
  ["02", "Personal growth", "Treat every project as a new operating layer."],
  ["03", "Value creation", "Make useful outcomes visible and repeatable."],
  ["04", "Continuous iteration", "Observe, learn, rebuild, and compound."],
];

export function PhilosophySection() {
  return (
    <section
      id="philosophy"
      className="bg-[var(--color-bg)] px-5 py-24 sm:px-8 md:px-10 md:py-40"
    >
      <div className="mx-auto max-w-7xl">
        <FadeIn>
          <p className="mb-5 text-xs uppercase tracking-[0.32em] text-[var(--color-text-muted)]">
            Philosophy
          </p>
          <h2 className="hero-heading max-w-5xl text-[clamp(3.5rem,11vw,150px)] font-black uppercase leading-[0.86] tracking-tight">
            Build For The Long Run
          </h2>
        </FadeIn>

        <div className="mt-20">
          {principles.map(([number, title, copy], index) => (
            <FadeIn key={number} delay={index * 0.08}>
              <article className="group grid gap-5 py-8 md:grid-cols-[100px_1fr_1fr] md:items-center md:py-11">
                <span className="text-sm tracking-[0.25em] text-[var(--color-on-dark-soft)]">
                  {number}
                </span>
                <h3 className="text-2xl font-semibold uppercase tracking-[0.08em] text-[var(--color-on-dark)] transition-transform duration-500 group-hover:translate-x-3 md:text-4xl">
                  {title}
                </h3>
                <p className="max-w-lg font-light leading-relaxed text-[var(--color-on-dark-muted)]">
                  {copy}
                </p>
              </article>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
