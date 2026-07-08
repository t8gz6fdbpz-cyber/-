import { AnimatedText } from "../ui/AnimatedText";
import { ContactButton } from "../ui/ContactButton";
import { FadeIn } from "../ui/FadeIn";
import { contactHref } from "../../utils/portfolioData";

const aboutParagraphs = [
  "我是做内容运营、IP孵化、直播运营和 AI 应用的人。",
  "我擅长把内容、人设、直播、平台运营和 AI 工具串成可执行的增长系统，让创意、数据和转化之间形成稳定循环。",
  "我关注内容如何服务业务增长，也关注 AI 如何提升创作和运营效率。对我来说，内容不是孤立的作品，而是一套可以被观察、复盘和迭代的系统。",
  "我习惯从人设、选题、脚本、拍摄、直播、平台反馈和数据复盘之间找连接点，把看起来零散的动作整理成团队可以继续执行的方法。",
];

const aboutHighlights = [
  "内容运营",
  "IP 孵化",
  "直播运营",
  "平台增长",
  "AI 工作流",
  "复盘迭代",
];

const aboutCapabilities = [
  {
    title: "内容系统",
    text: "从选题、脚本、拍摄到分发，让内容不只好看，也能推动行动。",
  },
  {
    title: "人设与 IP",
    text: "把人的优势、表达方式和平台语境合在一起，形成稳定识别度。",
  },
  {
    title: "AI 应用",
    text: "用 AI 做资料整理、脚本生成、视觉探索、自动化和网页原型搭建。",
  },
];

export function AboutSection() {
  return (
    <section
      id="about"
      className="about-section-rich relative flex min-h-[120vh] scroll-mt-8 justify-center overflow-hidden px-5 py-24 sm:px-8 md:px-10 md:py-32"
    >
      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-center">
        <FadeIn delay={0} y={40}>
          <div>
            <p className="mb-5 text-center text-xs font-bold text-[var(--color-text-soft)]">
              自我介绍
            </p>
            <h2 className="hero-heading text-center text-[clamp(3.4rem,10vw,6rem)] font-black leading-[0.94] tracking-normal">
              关于我
            </h2>
          </div>
        </FadeIn>

        <div className="mt-20 grid w-full gap-14 lg:grid-cols-[minmax(0,0.95fr)_minmax(320px,0.55fr)] lg:items-start">
          <div className="flex flex-col gap-8 sm:gap-10">
            {aboutParagraphs.map((paragraph) => (
              <AnimatedText key={paragraph} text={paragraph} />
            ))}

            <FadeIn delay={0.05} y={30} className="flex flex-wrap gap-3 pt-4">
              {aboutHighlights.map((highlight) => (
                <span
                  key={highlight}
                  className="about-highlight-pill rounded-full px-4 py-2 text-[10px] font-bold sm:px-5 sm:text-xs"
                >
                  {highlight}
                </span>
              ))}
            </FadeIn>
          </div>

          <FadeIn delay={0.08} y={36} className="about-capability-panel">
            <p>我通常这样把事情做成</p>
            <div>
              {aboutCapabilities.map((item) => (
                <article key={item.title}>
                  <h3>{item.title}</h3>
                  <span>{item.text}</span>
                </article>
              ))}
            </div>
            <ContactButton href={contactHref} label="联系我" />
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
