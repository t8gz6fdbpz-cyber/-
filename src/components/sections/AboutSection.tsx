import { AnimatedText } from "../ui/AnimatedText";
import { FadeIn } from "../ui/FadeIn";

const aboutParagraphs = [
  "我是有IP孵化与商业运营背景的AIGC视频制作人。",
  "我热爱影像创作与视听表达，从受众兴趣和商业目标出发，判断内容方向，让画面、故事与传播之间形成清晰联系。",
  "我熟悉平台流量与获客转化，也关注AI如何提升视频创作和制作效率。对我来说，好的内容都需要兼顾画面表现力、受众感受和实际的商业目标。",
  "我喜欢探索AI工具与工作流，在脚本、分镜、画面生成和后期制作之间找连接点，把创作中积累的经验整理成可以反复使用的方法。",
];

const aboutHighlights = [
  "AIGC制作",
  "AI 工作流",
  "内容运营",
  "IP 孵化",
  "直播运营",
  "平台增长",
  "复盘迭代",
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
            <h2 className="hero-heading text-center text-[clamp(3.4rem,10vw,6rem)] font-black leading-[0.94] tracking-normal">
              关于我
            </h2>
          </div>
        </FadeIn>

        <div className="mt-20 flex w-full max-w-4xl flex-col items-center gap-8 text-center sm:gap-10">
          <div className="flex w-full flex-col items-center gap-8 sm:gap-10">
            {aboutParagraphs.map((paragraph) => (
              <AnimatedText key={paragraph} text={paragraph} />
            ))}

            <FadeIn
              delay={0.05}
              y={30}
              className="flex justify-center flex-wrap gap-3 pt-4"
            >
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
        </div>
      </div>
    </section>
  );
}
