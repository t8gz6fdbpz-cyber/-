import {
  ArrowRight,
  BarChart3,
  BrainCircuit,
  Radio,
  Sparkles,
  Users,
} from "lucide-react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { useRef } from "react";

import { FadeIn } from "../ui/FadeIn";
import {
  growthMetrics,
  ipShowcaseItems,
  liveReviewSteps,
  mirrorCases,
  trainingSteps,
} from "../../utils/portfolioData";

const overviewCards = [
  {
    eyebrow: "Chapter A / Company Overview",
    company: "鸣鸣很忙集团",
    role: "PLACEHOLDER ROLE",
    period: "20XX — 20XX",
    copy: "Placeholder introduction for the company context, role scope, business challenge, and the growth systems built during this chapter.",
  },
  {
    eyebrow: "Chapter A / Operating Scope",
    company: "Growth Architecture",
    role: "CONTENT × IP × TRAINING × LIVE",
    period: "SYSTEM MAP",
    copy: "Placeholder summary connecting creator discovery, training, content operations, paid growth, and live-stream review into one repeatable system.",
  },
];

function SectionIntro({
  eyebrow,
  title,
  copy,
}: {
  eyebrow: string;
  title: string;
  copy?: string;
}) {
  return (
    <FadeIn className="mb-12 md:mb-16" y={36}>
      <p className="mb-4 text-xs uppercase tracking-[0.3em] text-[#D7E2EA]/50">
        {eyebrow}
      </p>
      <h3 className="hero-heading max-w-5xl text-[clamp(2.7rem,8vw,108px)] font-black uppercase leading-[0.88] tracking-tight">
        {title}
      </h3>
      {copy ? (
        <p className="mt-7 max-w-2xl text-base font-light leading-relaxed text-[#D7E2EA]/55 md:text-lg">
          {copy}
        </p>
      ) : null}
    </FadeIn>
  );
}

function OverviewCard({
  card,
  index,
}: {
  card: (typeof overviewCards)[number];
  index: number;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "end 0.25"],
  });
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.94]);
  const rotateX = useTransform(scrollYProgress, [0, 1], [0, -2]);

  return (
    <div ref={ref} className="relative h-[85vh]">
      <motion.article
        className="growth-overview-card sticky top-24 flex min-h-[64vh] flex-col justify-between overflow-hidden rounded-[36px] border border-white/[0.14] bg-[#102a40] p-7 md:top-32 md:min-h-[68vh] md:rounded-[56px] md:p-12"
        style={{
          scale: shouldReduceMotion ? 1 : scale,
          rotateX: shouldReduceMotion ? 0 : rotateX,
          transformOrigin: "top center",
          zIndex: index + 1,
        }}
      >
        <div className="relative z-10 flex items-start justify-between gap-8">
          <p className="text-xs uppercase tracking-[0.28em] text-[#D7E2EA]/60">
            {card.eyebrow}
          </p>
          <span className="text-[clamp(4rem,12vw,150px)] font-black leading-none text-[#D7E2EA]/20">
            0{index + 1}
          </span>
        </div>

        <div className="relative z-10 grid gap-8 md:grid-cols-[1fr_0.72fr] md:items-end">
          <div>
            <p className="mb-5 text-sm uppercase tracking-[0.24em] text-cyan-200/65">
              {card.period}
            </p>
            <h4 className="text-[clamp(2.5rem,7vw,92px)] font-black uppercase leading-[0.9] tracking-tight text-white">
              {card.company}
            </h4>
          </div>
          <div className="space-y-5">
            <p className="text-lg font-medium uppercase tracking-[0.16em] text-[#D7E2EA]">
              {card.role}
            </p>
            <p className="font-light leading-relaxed text-[#D7E2EA]/58">
              {card.copy}
            </p>
          </div>
        </div>
      </motion.article>
    </div>
  );
}

function IpMarqueeWall() {
  const repeatedItems = [...ipShowcaseItems, ...ipShowcaseItems];
  const reversedItems = [...repeatedItems].reverse();

  const renderRow = (
    items: typeof repeatedItems,
    direction: "forward" | "reverse",
  ) => (
    <div className="overflow-hidden py-3">
      <div className={`system-marquee-track system-marquee-${direction}`}>
        {items.map((item, index) => (
          <article
            key={`${direction}-${item.label}-${index}`}
            className="system-marquee-card group"
          >
            <img src={item.image} alt="" loading="lazy" />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent p-5 pt-16">
              <p className="text-sm uppercase tracking-[0.2em] text-white">
                {item.label}
              </p>
              <p className="mt-2 text-xs text-white/50">
                Placeholder account / video / creator data
              </p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );

  return (
    <div className="rounded-[36px] border border-white/10 bg-white/[0.025] py-7 md:rounded-[48px] md:py-10">
      {renderRow(repeatedItems, "forward")}
      {renderRow(reversedItems, "reverse")}
    </div>
  );
}

function TrainingTimeline() {
  return (
    <div className="relative mx-auto max-w-5xl">
      <div className="absolute bottom-0 left-[21px] top-0 w-px bg-gradient-to-b from-cyan-300/60 via-violet-400/40 to-transparent md:left-1/2" />
      {trainingSteps.map((step, index) => (
        <FadeIn
          key={step.number}
          delay={index * 0.08}
          x={index % 2 === 0 ? -36 : 36}
          y={0}
          className={`relative mb-10 flex md:w-1/2 ${
            index % 2 === 0
              ? "md:mr-auto md:justify-end md:pr-14"
              : "md:ml-auto md:pl-14"
          }`}
        >
          <span className="absolute left-[15px] top-8 h-3.5 w-3.5 rounded-full border-2 border-cyan-200 bg-[#0C0C0C] md:left-auto md:right-[-7px]">
            {index % 2 !== 0 ? (
              <span className="absolute hidden md:block md:left-[-1px] md:top-[-2px] md:h-3.5 md:w-3.5 md:rounded-full md:border-2 md:border-violet-300 md:bg-[#0C0C0C]" />
            ) : null}
          </span>
          <article className="ml-12 w-full rounded-[28px] border border-white/10 bg-white/[0.035] p-6 md:ml-0 md:p-8">
            <span className="text-xs tracking-[0.28em] text-[#D7E2EA]/35">
              STEP {step.number}
            </span>
            <h4 className="mt-3 text-2xl font-semibold text-white">
              {step.title}
            </h4>
            <p className="mt-3 font-light leading-relaxed text-[#D7E2EA]/50">
              {step.copy}
            </p>
          </article>
        </FadeIn>
      ))}
    </div>
  );
}

function MetricsBento() {
  const icons = [BarChart3, Radio, Users, BrainCircuit, Sparkles];

  return (
    <div className="grid auto-rows-[210px] gap-4 md:grid-cols-6">
      {growthMetrics.map((metric, index) => {
        const Icon = icons[index];
        const sizeClass =
          index === 0
            ? "md:col-span-4 md:row-span-2"
            : index === 4
              ? "md:col-span-4"
              : "md:col-span-2";

        return (
          <FadeIn key={metric.label} delay={index * 0.07} className={sizeClass}>
            <article className="bento-metric-card group flex h-full flex-col justify-between overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.04] p-7">
              <div className="flex items-center justify-between">
                <Icon className="h-6 w-6 text-cyan-200/70" />
                <span className="text-xs uppercase tracking-[0.2em] text-white/30">
                  Placeholder
                </span>
              </div>
              <div>
                <p className="text-[clamp(2.5rem,7vw,88px)] font-black leading-none text-white">
                  {metric.value}
                </p>
                <div className="mt-4 flex items-end justify-between gap-4">
                  <h4 className="text-lg uppercase tracking-[0.18em]">
                    {metric.label}
                  </h4>
                  <p className="text-right text-xs text-white/40">
                    {metric.note}
                  </p>
                </div>
              </div>
            </article>
          </FadeIn>
        );
      })}
    </div>
  );
}

function LiveReviewStory() {
  const ref = useRef<HTMLElement | null>(null);
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 70,
    damping: 24,
    mass: 0.55,
  });
  const x = useTransform(
    smoothProgress,
    [0, 1],
    ["0vw", `-${(liveReviewSteps.length - 1) * 74}vw`],
  );

  return (
    <section ref={ref} className="relative h-[320vh]">
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <motion.div
          className="flex gap-6 px-[8vw]"
          style={{ x: shouldReduceMotion ? 0 : x }}
        >
          {liveReviewSteps.map((step, index) => (
            <article
              key={step.number}
              className="live-story-card relative flex h-[62vh] w-[76vw] shrink-0 flex-col justify-between overflow-hidden rounded-[36px] border border-white/10 bg-[#111827] p-7 md:w-[70vw] md:rounded-[52px] md:p-12"
            >
              <div className="flex items-start justify-between">
                <span className="text-xs uppercase tracking-[0.28em] text-white/45">
                  Live Review / {step.number}
                </span>
                <span className="text-[clamp(4rem,12vw,150px)] font-black leading-none text-white/[0.06]">
                  {step.number}
                </span>
              </div>
              <div className="max-w-3xl">
                <p className="mb-5 text-sm uppercase tracking-[0.25em] text-violet-300/65">
                  {index === liveReviewSteps.length - 1
                    ? "Outcome"
                    : "Iteration"}
                </p>
                <h4 className="text-[clamp(3rem,9vw,118px)] font-black leading-[0.88] text-white">
                  {step.title}
                </h4>
                <p className="mt-6 max-w-lg text-base font-light leading-relaxed text-white/45 md:text-lg">
                  {step.copy}
                </p>
              </div>
            </article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function MirrorChapter() {
  return (
    <div className="pt-20 md:pt-32">
      <SectionIntro
        eyebrow="Chapter B / 镜前时代"
        title="A Different Rhythm"
        copy="Placeholder chapter framing for a second company experience, presented with a more editorial and directional visual rhythm."
      />

      <FadeIn>
        <article className="grid overflow-hidden rounded-[38px] border border-white/10 bg-[#D7E2EA] text-[#0C0C0C] md:grid-cols-[0.9fr_1.1fr] md:rounded-[56px]">
          <div className="flex min-h-[420px] flex-col justify-between p-8 md:p-12">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-[0.28em] opacity-50">
                B1 / Company Overview
              </span>
              <ArrowRight className="h-6 w-6" />
            </div>
            <div>
              <p className="mb-5 text-sm uppercase tracking-[0.2em] opacity-50">
                PLACEHOLDER ROLE / 20XX — 20XX
              </p>
              <h4 className="text-[clamp(3rem,8vw,96px)] font-black uppercase leading-[0.88]">
                镜前时代
              </h4>
              <p className="mt-6 max-w-xl font-light leading-relaxed opacity-60">
                Placeholder overview describing the company, the role, and the
                context for this phase of personal and professional growth.
              </p>
            </div>
          </div>
          <div className="min-h-[360px] overflow-hidden">
            <img
              src={mirrorCases[0].image}
              alt=""
              loading="lazy"
              className="h-full w-full object-cover"
            />
          </div>
        </article>
      </FadeIn>

      <div className="mt-24">
        <SectionIntro eyebrow="Project Cases" title="Selected Experiments" />
        <div className="hide-scrollbar flex snap-x gap-5 overflow-x-auto pb-8">
          {mirrorCases.map((item, index) => (
            <motion.article
              key={item.number}
              className="group relative h-[470px] w-[82vw] max-w-[620px] shrink-0 snap-center overflow-hidden rounded-[34px] border border-white/10 md:w-[52vw]"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: index * 0.06 }}
              whileHover={{ y: -8 }}
            >
              <img
                src={item.image}
                alt=""
                loading="lazy"
                className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.035] group-hover:brightness-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/5 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-7">
                <div>
                  <span className="text-xs tracking-[0.25em] text-white/45">
                    CASE {item.number}
                  </span>
                  <h4 className="mt-2 text-3xl font-semibold text-white">
                    {item.title}
                  </h4>
                </div>
                <ArrowRight className="h-6 w-6 text-white" />
              </div>
            </motion.article>
          ))}
        </div>
      </div>

      <div className="py-28 md:py-40">
        <SectionIntro eyebrow="Key Learnings" title="What Stayed With Me" />
        <div className="divide-y divide-white/10 border-y border-white/10">
          {["内容是入口", "运营是放大器", "增长是结果"].map(
            (statement, index) => (
              <FadeIn key={statement} delay={index * 0.08} x={-30} y={0}>
                <p className="py-8 text-[clamp(2.6rem,9vw,126px)] font-black leading-none text-white transition-colors duration-500 hover:text-cyan-200 md:py-12">
                  {statement}
                </p>
              </FadeIn>
            ),
          )}
        </div>
      </div>
    </div>
  );
}

export function GrowthSystemsSection() {
  return (
    <section
      id="growth-systems"
      className="relative scroll-mt-8 overflow-clip bg-[#0C0C0C] px-5 pb-24 pt-20 sm:px-8 md:px-10 md:pb-36 md:pt-32"
    >
      <div className="mx-auto max-w-7xl">
        <FadeIn y={44}>
          <p className="mb-5 text-center text-xs uppercase tracking-[0.34em] text-[#D7E2EA]/45">
            Career Architecture
          </p>
          <h2 className="hero-heading mb-20 text-center text-[clamp(3rem,12vw,160px)] font-black uppercase leading-[0.86] tracking-tight">
            Growth Systems
          </h2>
        </FadeIn>

        <SectionIntro
          eyebrow="Chapter A / 鸣鸣很忙集团"
          title="Systems That Compound"
          copy="Placeholder chapter introduction describing the context, responsibilities, and systems explored in this company experience."
        />

        <div className="project-stack relative isolate mb-28">
          {overviewCards.map((card, index) => (
            <OverviewCard key={card.company} card={card} index={index} />
          ))}
        </div>

        <div className="mb-32">
          <SectionIntro eyebrow="IP孵化体系" title="Creator Matrix" />
          <IpMarqueeWall />
        </div>

        <div className="mb-32">
          <SectionIntro eyebrow="培训体系" title="From Signal To Growth" />
          <TrainingTimeline />
        </div>

        <div className="mb-32">
          <SectionIntro eyebrow="投流体系" title="Growth Dashboard" />
          <MetricsBento />
        </div>
      </div>

      <div className="mt-20">
        <div className="mx-auto max-w-7xl px-0">
          <SectionIntro
            eyebrow="Live Review System"
            title="直播复盘体系"
          />
        </div>
        <LiveReviewStory />
      </div>

      <div className="mx-auto max-w-7xl">
        <MirrorChapter />
      </div>
    </section>
  );
}
