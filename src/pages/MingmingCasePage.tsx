import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowLeft, ArrowRight, BookOpen, ChevronRight, Clapperboard, ClipboardList, Layers, MapPin, Sparkles } from "lucide-react";

import { AccountOrbit } from "../components/ui/AccountOrbit";
import { ViewportImage } from "../components/ui/ViewportImage";
import { TrainingDepthGallery } from "../components/ui/TrainingDepthGallery";
import { ContentExhibit } from "../components/ui/ContentExhibit";
import {
  accountGrowthResults,
  aigcMethod,
  contentPerformanceResults,
  heroContent,
  incubationResults,
  ipMethod,
  performanceMedia,
  summaryContent,
  trainingGallery,
  videoCases,
  videoOverview,
  type MingmingMedia,
  type MingmingVideo,
} from "../data/mingmingCase";
import { DetailBackLink, PortfolioLink } from "../routing";

const productionIcons = [ClipboardList, MapPin, BookOpen, Sparkles, Layers, Clapperboard] as const;

function OpeningSequence() {
  const reducedMotion = useReducedMotion();
  const [phase, setPhase] = useState<"opening" | "revealing" | "done">("opening");

  useEffect(() => {
    if (reducedMotion) return;
    // 开屏按时间播放一次，不随滚动反复覆盖正文；离开页面时清理计时器。
    const revealTimer = window.setTimeout(() => setPhase("revealing"), 1600);
    const finishTimer = window.setTimeout(() => setPhase("done"), 2300);
    return () => {
      window.clearTimeout(revealTimer);
      window.clearTimeout(finishTimer);
    };
  }, [reducedMotion]);

  if (reducedMotion || phase === "done") return null;
  return <motion.div className="mm-preloader" aria-hidden="true"
    initial={{ y: "0%" }} animate={{ y: phase === "revealing" ? "-100%" : "0%" }}
    transition={{ duration: .65, ease: [.76, 0, .24, 1] }}>
    <div className="mm-loader-name">{Array.from("鸣鸣很忙").map((letter, index) =>
      <span key={index}><i style={{ animationDelay: `${index * .14}s` }}>{letter}</i></span>
    )}</div>
  </motion.div>;
}

function LayeredText({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLSpanElement>(null);
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start .94", "start .7"] });
  const y = useTransform(scrollYProgress, [0, 1], ["24%", "0%"]);
  const opacity = useTransform(scrollYProgress, [0, 1], [.45, 1]);
  return <span ref={ref} className="mm-text-mask"><motion.span style={reducedMotion ? undefined : { y, opacity }}>{children}</motion.span></span>;
}

function SectionIntro({ title, id }: { title: string; id: string }) {
  return <header className="mm-section-intro"><h2 id={id}><LayeredText>{title}</LayeredText></h2></header>;
}

function VideoResult({ video }: { video: MingmingVideo }) {
  return (
    <article className="mm-video-result" id={`mm-video-${video.id}`}>
      <div className="mm-video-copy">
        <h3>{video.title}</h3>
        <dl className="mm-video-details">
          <div><dt>业务目标</dt><dd>{video.businessGoal}</dd></div>
          <div><dt>区域洞察</dt><dd>{video.regionalInsight}</dd></div>
          <div><dt>创意策略</dt><dd>{video.creativeStrategy}</dd></div>
          <div><dt>我的职责</dt><dd>{video.responsibility}</dd></div>
        </dl>
      </div>
      <div className="mm-video-frame">
        <video controls playsInline preload="metadata" src={video.videoSrc} poster={video.poster} aria-label={`${video.title}视频播放器`} />
      </div>
    </article>
  );
}

function EvidenceImage({ media, className = "" }: { media: MingmingMedia; className?: string }) {
  if (!media.src) return null;
  return (
    <figure className={`mm-evidence-image ${className}`} data-evidence-id={media.id}>
      <div className="mm-evidence-image-frame"><ViewportImage src={media.src} alt={media.alt} loading="lazy" draggable={false} width={media.width} height={media.height} /></div>
      <figcaption><strong>{media.title}</strong><span>{media.caption}</span></figcaption>
    </figure>
  );
}

function ChapterTransition() {
  const ref = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const [radius, setRadius] = useState(1);
  useEffect(() => {
    const update = () => setRadius(Math.max(window.innerWidth, window.innerHeight) * 1.15);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start .7", "end end"] });
  const reveal = useTransform(scrollYProgress, value => {
    const t = Math.min(1, Math.max(0, (value - .05) / .8));
    return t * t * (3 - 2 * t);
  });
  // 大面积底色只做合成层缩放；文字独立裁切，揭幕完成后移除裁切。
  const clipPath = useTransform(reveal, value => value >= .999 ? "none" : `circle(${value * radius}px at 50% 100%)`);
  const content = (decorative = false) => <div className="mm-transition-content mm-shell" aria-hidden={decorative || undefined}>
    <div className="mm-transition-intro"><h2 id={decorative ? undefined : "mm-ip-title"}>全民 IP<br />孵化</h2><p>{incubationResults.summary}</p></div>
    <dl className="mm-impact-grid" aria-label={decorative ? undefined : "全民 IP 核心业务成果"}>{incubationResults.metrics.map(metric => <div key={metric.label}><dt>{metric.value}</dt><dd><strong>{metric.label}</strong><span>{metric.detail}</span></dd></div>)}</dl>
  </div>;
  if (reducedMotion) return <section className="mm-transition-reduced" aria-labelledby="mm-ip-title">{content()}</section>;
  return (
    <section ref={ref} className="mm-transition" aria-labelledby="mm-ip-title">
      <div className="mm-transition-stage">
        <motion.div className="mm-transition-circle" style={{ scale: reveal }} aria-hidden="true" />
        {content()}
        <motion.div className="mm-transition-gold" style={{ clipPath }} aria-hidden="true">{content(true)}</motion.div>
      </div>
    </section>
  );
}

function RailSegment({ target, label }: { target: React.RefObject<HTMLElement>; label: string }) {
  const [length, setLength] = useState(1);
  useEffect(() => {
    const element = target.current;
    if (!element) return;
    const update = () => setLength(element.getBoundingClientRect().height);
    const observer = new ResizeObserver(update);
    observer.observe(element); update();
    return () => observer.disconnect();
  }, [target]);
  const { scrollYProgress } = useScroll({ target, offset: ["start start", "end start"] });
  const labelOpacity = useTransform(scrollYProgress, p => p > 0 && p < 1 ? 1 : 0);
  const labelTop = useTransform(scrollYProgress, p => `${p * 100}%`);
  return <div className="mm-rail-segment" style={{ flexGrow: length }}><motion.i style={{ scaleY: scrollYProgress }} /><motion.span style={{ opacity: labelOpacity, top: labelTop }}>{label}</motion.span></div>;
}

export function MingmingCasePage() {
  const aigcRef = useRef<HTMLElement>(null);
  const ipRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const operationRef = useRef<HTMLDivElement>(null);
  const trainingRef = useRef<HTMLDivElement>(null);
  const operationTrainingRef = useRef<HTMLDivElement>(null);
  const summaryRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  // 首屏保持正常文档滚动；进度线只跟随下一章进入，不控制首屏可见度。
  const { scrollYProgress: contentProgress } = useScroll({ target: aigcRef, offset: ["start end", "start start"] });
  const railOpacity = useTransform(contentProgress, [0, .7, 1], [0, 0, 1]);

  useEffect(() => {
    document.documentElement.classList.add("mm-route-active");
    document.body.classList.add("mm-route-active");
    return () => {
      document.documentElement.classList.remove("mm-route-active");
      document.body.classList.remove("mm-route-active");
    };
  }, []);

  return (
    <article className="mingming-case">
      <OpeningSequence />
      <motion.div className="mm-scroll-progress" style={reducedMotion ? undefined : { opacity: railOpacity }} aria-hidden="true">
        <RailSegment target={aigcRef} label="AIGC" />
        <RailSegment target={ipRef} label="全民 IP" />
        <RailSegment target={contentRef} label="内容表现" />
        <RailSegment target={operationTrainingRef} label="运营与培训" />
        <RailSegment target={summaryRef} label="经历总结" />
      </motion.div>

      <header id="mm-overview" className="mm-hero">
        <div className="mm-shell">
          <DetailBackLink fallback="/#case-studies" className="mm-back-link"><ArrowLeft aria-hidden="true" />返回重点经历</DetailBackLink>
          <div className="mm-cover-meta"><p>职业经历 / CASE STUDY</p><span>创意生产 · 内容运营 · 业务增长</span></div>
          <div className="mm-hero-main">
            <div className="mm-hero-title">
              <p className="mm-index">鸣鸣很忙集团 · 华南区域</p>
              <h1 className="mm-hero-name" aria-label="鸣鸣很忙">{Array.from("鸣鸣很忙").map((letter, index) => <span className="mm-name-char" key={index}><i style={{ animationDelay: `${index * .09}s` }}>{letter}</i></span>)}</h1>
              <p className="mm-hero-tagline">让内容成为<br />增长的起点<span>。</span></p>
              <p className="mm-hero-introduction">主导 AIGC 招商影片与全民 IP 孵化，连接创意生产、账号运营和线下培训。</p>
            </div>
            <div className="mm-hero-aside">
              <div className="mm-company-details">
                <p className="mm-company-name"><span>鸣鸣很忙集团</span><span>赵一鸣商业有限公司</span></p>
                <dl className="mm-role-details"><div><dt>岗位</dt><dd>{heroContent.role}</dd></div><div><dt>负责区域</dt><dd>{heroContent.region}</dd></div><div className="mm-tenure-detail"><dt>任职时间</dt><dd>{heroContent.tenure}</dd></div></dl>
              </div>
            </div>
          </div>
          <div className="mm-hero-bottom">
            <p className="mm-cover-project-label">核心项目<span>SELECTED WORK</span></p>
            <div className="mm-cover-project"><span>AIGC 内容生产</span><h2>区域招商影片</h2><p>浙江 × 石家庄 · 从创意到完整成片</p></div>
            <div className="mm-cover-project"><span>账号与内容增长</span><h2>全民 IP 孵化</h2><p>账号运营 · 投流复盘 · 线下培训</p></div>
          </div>
        </div>
      </header>

      <main>
        <section ref={aigcRef} id="mm-aigc" className="mm-section mm-aigc" aria-labelledby="mm-aigc-title">
          <div className="mm-shell">
            <SectionIntro id="mm-aigc-title" title={videoOverview.title} />
            <dl className="mm-film-facts" aria-label="AIGC 招商影片项目摘要">
              {videoOverview.facts.map((fact) => <div key={fact.label}><dt>{fact.value}</dt><dd>{fact.label}</dd></div>)}
            </dl>
            <div className="mm-video-list">{videoCases.map((video) => <VideoResult key={video.id} video={video} />)}</div>

            <div className="mm-aigc-method" id="mm-production-process" aria-labelledby="mm-production-title">
              <header className="mm-process-heading">
                <h3 id="mm-production-title"><LayeredText>我的制作流程</LayeredText></h3>
                <p>{aigcMethod.processSummary}</p>
              </header>
              <ol className="mm-process-steps" aria-label="招商影片的六步制作流程">
                {aigcMethod.steps.map((step, index) => {
                  const Icon = productionIcons[index];
                  return <li className="mm-process-card" key={step.title} tabIndex={0}>
                    <p className="mm-process-number"><span>{String(index + 1).padStart(2, "0")}</span><span aria-hidden="true">·</span><span>{step.phase}</span></p>
                    <div className="mm-process-icon"><Icon size={26} strokeWidth={1.5} aria-hidden="true" /></div>
                    <h4>{step.title}</h4>
                    <p className="mm-process-description">{step.summary}</p>
                    {index < aigcMethod.steps.length - 1 && <ChevronRight className="mm-process-connector" size={24} strokeWidth={1.5} aria-hidden="true" />}
                  </li>;
                })}
              </ol>
            </div>
          </div>
        </section>

        <ChapterTransition />

        <section id="mm-ip" className="mm-section mm-ip" aria-labelledby="mm-ip-title">
          <div ref={ipRef}>
          <AccountOrbit items={accountGrowthResults} />
          </div>

          <div className="mm-shell mm-ip-details">
            <div ref={contentRef}>
            <ContentExhibit items={contentPerformanceResults} />
            </div>

            <div ref={operationTrainingRef}>
            <div ref={operationRef} className="mm-ip-method">
              <div className="mm-subhead"><span>运营与投放</span><h3><LayeredText>{ipMethod.title}</LayeredText></h3></div>
              <p className="mm-method-lead">{ipMethod.scopeSummary}</p>
              <ol className="mm-growth-stages">
                {ipMethod.operationStages.map((stage, index) => <li key={stage}><span>0{index + 1}</span><h4>{stage}</h4><dl>{ipMethod.operations.slice(index * 2, index * 2 + 2).map((step) => <div key={step.title}><dt>{step.title}</dt><dd>{step.summary}</dd></div>)}</dl></li>)}
              </ol>
              <div className="mm-evidence-heading"><div><span>运营证据 / 03</span><h3>从内容表现到投流复盘</h3></div><p>{ipMethod.operationsSummary}</p></div>
              <div className="mm-performance-grid">{performanceMedia.map((media) => <EvidenceImage key={media.id} media={media} />)}</div>
            </div>

            <div ref={trainingRef} className="mm-training">
              <div className="mm-subhead"><span>培训孵化</span><h3><LayeredText>10 场线下达人训练营</LayeredText></h3></div>
              <p className="mm-method-lead">{ipMethod.trainingSummary}</p>
              <ol className="mm-training-path">{ipMethod.trainingStages.map((stage, index) => <li key={stage.title}><span>0{index + 1}</span><h4>{stage.title}</h4><p>{stage.details}</p></li>)}</ol>
              <div className="mm-evidence-heading"><div><span>现场记录 / 10</span><h3>培训在现场发生</h3></div></div>
          <TrainingDepthGallery items={trainingGallery} />
            </div>
            </div>
          </div>
        </section>
      </main>

      <footer ref={summaryRef} id="mm-summary" className="mm-closing" aria-labelledby="mm-summary-title">
        <div className="mm-shell">
          <p className="mm-index">经历总结 / WHAT I BUILT</p>
          <h2 id="mm-summary-title"><LayeredText>我交付的不只是内容，</LayeredText><br /><em><LayeredText>也是一套可以持续运行的增长方法。</LayeredText></em></h2>
          <p className="mm-closing-statement">{summaryContent.statement}</p>
          <div className="mm-summary-abilities">{summaryContent.abilities.map((ability, index) => <div key={ability.title}><span>0{index + 1}</span><h3>{ability.title}</h3><p>{ability.summary}</p></div>)}</div>
          <nav aria-label="案例后续操作"><DetailBackLink fallback="/#case-studies"><ArrowLeft aria-hidden="true" />返回重点经历</DetailBackLink><PortfolioLink to="/cases/hengqian">查看下一个案例<ArrowRight aria-hidden="true" /></PortfolioLink><PortfolioLink to="/#contact">联系我<ArrowRight aria-hidden="true" /></PortfolioLink></nav>
        </div>
      </footer>
    </article>
  );
}
