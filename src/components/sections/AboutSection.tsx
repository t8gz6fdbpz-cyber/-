import { AnimatedText } from "../ui/AnimatedText";
import { ContactButton } from "../ui/ContactButton";
import { FadeIn } from "../ui/FadeIn";
import { contactHref } from "../../utils/portfolioData";

const aboutParagraphs = [
  "目前任职于鸣鸣很忙集团，负责 IP 运营、内容策划及账号增长，参与 IP 矩阵搭建、达人孵化、直播运营、短视频策划及数据复盘，具备从内容创意到增长运营的全流程实践经验。",
  "我关注内容、商业与用户增长，善于通过数据分析、持续复盘与迭代优化，不断提升内容质量，并将实践经验沉淀为可复制的方法，让内容真正服务于业务增长。",
  "工作之外，我持续学习商业、心理学与 AI，不断拓宽自己的认知边界。我相信，优秀的内容不仅能够吸引用户，更能够创造价值、推动增长，并帮助团队解决真实的问题。",
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
            <p className="mb-5 text-center text-xs uppercase tracking-[0.32em] text-[var(--color-text-soft)]">
              03 / Self Introduction
            </p>
            <h2 className="hero-heading text-center text-[clamp(3rem,12vw,160px)] font-black uppercase leading-none tracking-tight">
              自我介绍
            </h2>
          </div>
        </FadeIn>

        <div className="mt-24 flex w-full max-w-[800px] flex-col items-center sm:mt-28 md:mt-32">
          <div className="flex flex-col items-center gap-8 sm:gap-10 md:gap-12">
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
                className="about-highlight-pill rounded-full px-4 py-2 text-[10px] font-bold uppercase tracking-[0.24em] sm:px-5 sm:text-xs"
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
