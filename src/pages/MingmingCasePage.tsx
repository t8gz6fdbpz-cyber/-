import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from "framer-motion";
import type { MotionStyle, MotionValue } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { AccountOrbit } from "../components/ui/AccountOrbit";
import { ViewportImage } from "../components/ui/ViewportImage";
import { TrainingDepthGallery } from "../components/ui/TrainingDepthGallery";
import { ContentExhibit } from "../components/ui/ContentExhibit";
import { MingmingMediaFrame } from "../components/cases/mingming/MingmingMediaFrame";
import { chapterProgress, processFocusPose, readingProgress } from "../components/cases/mingming/blockMotion";
import { accountGrowthResults, aigcMethod, automationEvidence, contentPerformanceResults, heroContent, incubationResults, ipMethod, performanceMedia, trainingGallery, videoCases, type MingmingVideo } from "../data/mingmingCase";
import { DetailBackLink, PortfolioLink } from "../routing";
import { useNearbyImageLoading } from "../hooks/useNearbyImageLoading";
import "../styles/mingming-hierarchy.css";
import "../styles/mingming-editorial.css";
import "../styles/mingming-focal.css";
import "../styles/mingming-motion.css";
import "../styles/mingming-block-motion.css";
import "../styles/mingming-transitions.css";

function ResponsibilityScope({ project }: { project: "film" | "ip" }) {
  const reduced = useReducedMotion();
  const target = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target, offset: ["start .9", "start .5"] });
  const scopeLine = useTransform(scrollYProgress, value => readingProgress(value));
  const scopeY = useTransform(scopeLine, p => (1 - p) * 48);
  const film = project === "film";
  const duties = film ? [
    ["内容决策", "内容策略 · 文案 · 编导"],
    ["素材制作", "AIGC 画面生成 · 素材统筹"],
    ["完整交付", "剪辑 · 成片交付"],
  ] : [
    ["账号与内容", "账号定位 · 策划 · 拍摄剪辑"],
    ["运营与增长", "持续发布 · 投流 · 数据复盘"],
    ["培训与复制", "组织训练营 · 沉淀培训流程"],
  ];
  return <section ref={target} className="mm-role-scope" aria-label={film ? "招商影片中的个人职责" : "全民IP中的个人职责"}>
    <motion.i className="mm-block-rule" aria-hidden="true" style={reduced ? undefined : { scaleX: scopeLine }} />
    <motion.div style={reduced ? undefined : { y: scopeY }}><h3>{film ? "我主导影片的完整制作" : "我负责账号与内容的持续运营"}</h3>
    <dl>{duties.map(([title, detail]) => <div key={title}>
      <dt>{title}</dt>
      <dd>{detail}</dd>
    </div>)}</dl></motion.div>
  </section>;
}

function VideoResult({ video, index, nextProgress }: { video: MingmingVideo; index: number; nextProgress: MotionValue<number> }) {
  const reduced = useReducedMotion();
  const target = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target, offset: ["start .85", "start .25"] });
  const frameScale = useTransform(scrollYProgress, [0, .75, 1], [.2, 1, 1]);
  const notes = useRef<HTMLDivElement>(null);
  const { scrollYProgress: notesProgress } = useScroll({ target: notes, offset: ["start .92", "start .55"] });
  const notesLine = useTransform(notesProgress, value => readingProgress(value));
  const notesExit = useTransform(nextProgress, p => index === 1 ? -48 * readingProgress(p) : 0);
  return <article ref={target} className="mm-editorial-film mm-focal-film" id={"mm-video-" + video.id}>
    <header><h3>{video.title}</h3><p>{index === 0 ? "甲乙方沟通 · 喜剧叙事" : "城市摇滚 · 青年梦想"}<span>完整成片 / 0{index + 1}</span></p></header>
    <MingmingMediaFrame><motion.i className="mm-focal-film-rule" aria-hidden="true" style={reduced ? undefined : { scaleX: frameScale }} /><video controls playsInline preload="metadata" src={video.videoSrc} poster={video.poster} aria-label={video.title + "视频播放器"} /></MingmingMediaFrame>
    <div ref={notes}><motion.div className="mm-focal-film-notes" style={reduced ? undefined : { y: notesExit }}>
      <motion.i className="mm-block-rule" aria-hidden="true" style={reduced ? undefined : { scaleX: notesLine }} />
      <h4>{index === 0 ? <>用人物关系，<br />承载招商信息。</> : <>从摇滚文化，<br />走进门店故事。</>}</h4>
      <dl><div><dt>我的创意选择</dt><dd>{video.creativeStrategy}</dd></div><div><dt>业务目标</dt><dd>{video.businessGoal}</dd></div></dl>
    </motion.div></div>
  </article>;
}
const productionPhases = [
  { title: "写成故事", output: "区域语境与人物叙事", steps: aigcMethod.steps.slice(0, 3) },
  { title: "生成画面", output: "符合故事的镜头素材", steps: aigcMethod.steps.slice(3, 5) },
  { title: "剪辑成片", output: "可用于招商的完整影片", steps: aigcMethod.steps.slice(5) },
];

function ProductionPhase({ phase, index }: { phase: typeof productionPhases[number]; index: number }) {
  const reduced = useReducedMotion();
  const target = useRef<HTMLLIElement>(null);
  const { scrollYProgress } = useScroll({ target, offset: ["start .85", "end .45"] });
  const lineScale = useTransform(scrollYProgress, value => readingProgress(value, 0, .85));
  const actionTone = useTransform(scrollYProgress, [0, .35, 1], ["#e8dfcc", "#f2c15b", "#f2c15b"]);
  const actionProgress = useTransform(scrollYProgress, value => readingProgress(value, 0, .75));
  return <li ref={target} className="mm-focal-phase">
    <div className="mm-focal-phase-track"><span>0{index + 1}</span><motion.i aria-hidden="true" style={reduced ? undefined : { scaleY: lineScale }} /></div>
    <div><motion.header className="mm-phase-action" style={{ "--mm-action-progress": reduced ? 1 : actionProgress } as MotionStyle}><motion.h4 style={reduced ? undefined : { color: actionTone }}>{phase.title}</motion.h4><p>{phase.output}</p></motion.header><dl>{phase.steps.map(step => <div key={step.title}><dt>{step.title}</dt><dd>{step.summary}</dd></div>)}</dl></div>
  </li>;
}

function ProcessFocus({ phase, index, progress }: { phase: typeof productionPhases[number]; index: number; progress: MotionValue<number> }) {
  const y = useTransform(progress, p => processFocusPose(p, index).y);
  const opacity = useTransform(progress, p => processFocusPose(p, index).opacity);
  return <motion.div style={{ y, opacity }}><strong>{phase.title}</strong></motion.div>;
}

function ProductionProcess({ nextProgress, entrance, target }: { nextProgress: MotionValue<number>; entrance: MotionValue<number>; target: React.RefObject<HTMLElement> }) {
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target, offset: ["start .2", "end .45"] });
  const arrival = useTransform(entrance, p => readingProgress(p, 0, .92));
  const exit = useTransform(nextProgress, p => readingProgress(p, 0, .9));
  return <section ref={target} className="mm-editorial-process mm-focal-process" id="mm-production-process" aria-labelledby="mm-production-title">
    <motion.header className="mm-process-identity" style={{ "--mm-arrival": reduced ? 1 : arrival, "--mm-exit": reduced ? 0 : exit } as MotionStyle}>
      {!reduced && <div className="mm-process-focus" aria-hidden="true">{productionPhases.map((phase, index) => <ProcessFocus key={phase.title} phase={phase} index={index} progress={scrollYProgress} />)}</div>}
      <h3 id="mm-production-title">一支影片，三段制作。</h3><p>{aigcMethod.processSummary}</p><a href="#mm-video-zhejiang">回看完整作品<ArrowRight size={16} aria-hidden="true" /></a></motion.header>
    <ol aria-label="三段制作中的六个关键动作">{productionPhases.map((phase, index) => <ProductionPhase key={phase.title} phase={phase} index={index} />)}</ol>
  </section>;
}

function AutomationMethod({ nextProgress }: { nextProgress: MotionValue<number> }) {
  const reduced = useReducedMotion();
  const target = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target, offset: ["start .85", "start .2"] });
  const lineScale = useTransform(scrollYProgress, [0, .8, 1], [.1, 1, 1]);
  const arrival = useTransform(scrollYProgress, value => readingProgress(value, 0, .94));
  const exit = useTransform(nextProgress, value => readingProgress(value, 0, .95));
  return <figure ref={target} className="mm-focal-automation">
    <motion.i aria-hidden="true" style={reduced ? undefined : { scaleX: lineScale }} />
    <motion.figcaption className="mm-config-caption" style={{ "--mm-exit": reduced ? 0 : exit } as MotionStyle}><h4>企业号扫码<br />流程配置</h4><p>{automationEvidence.caption}</p><a href={automationEvidence.src} target="_blank" rel="noreferrer">查看完整配置截图<ArrowRight size={16} aria-hidden="true" /></a></motion.figcaption>
    <motion.div className="mm-config-evidence" style={{ "--mm-arrival": reduced ? 1 : arrival, "--mm-exit": reduced ? 0 : exit } as MotionStyle}><a href={automationEvidence.src} target="_blank" rel="noreferrer" aria-label="查看企业号扫码流程完整配置截图"><ViewportImage src={automationEvidence.src} alt={automationEvidence.alt} width={1920} height={1029} loading="lazy" /></a><p>{automationEvidence.limit}</p></motion.div>
  </figure>;
}

function OperationStage({ stage, index }: { stage: string; index: number }) {
  const reduced = useReducedMotion();
  const target = useRef<HTMLLIElement>(null);
  const { scrollYProgress } = useScroll({ target, offset: ["start .9", "start .45"] });
  const stageLine = useTransform(scrollYProgress, value => readingProgress(value, 0, .6));
  const evidenceProgress = useTransform(scrollYProgress, value => readingProgress(value, .15, .94));
  const actionProgress = useTransform(scrollYProgress, value => readingProgress(value, 0, .9));
  const focuses = ["方向", "验证", "承接"];
  return <li ref={target}>
    <motion.i className="mm-block-rule" aria-hidden="true" style={reduced ? undefined : { scaleX: stageLine }} />
    <motion.div className="mm-focal-operation-focus" style={{ "--mm-arrival": reduced ? 1 : actionProgress } as MotionStyle}><span>0{index + 1}</span><h4>{focuses[index]}</h4><p>{stage}</p></motion.div>
    <dl>{ipMethod.operations.slice(index * 2, index * 2 + 2).map(step => <div key={step.title}><dt>{step.title}</dt><dd>{step.summary}</dd></div>)}</dl>
    <motion.div className="mm-focal-operation-evidence" style={{ "--mm-evidence-progress": reduced ? 1 : evidenceProgress } as MotionStyle}>{index < 2 ? <><p>{index === 0 ? "账号主页记录公开规模与定位；任职期间净增需另行核对。" : "内容截图记录单条表现，为选题和内容复盘提供依据。"}</p><a href={index === 0 ? "#mm-ip" : "#mm-content-exhibit-title"}>{index === 0 ? "回看账号主页" : "回看内容表现"}<ArrowRight size={16} aria-hidden="true" /></a></> : <><ul>{performanceMedia.map(media => <li key={media.id}><ViewportImage src={media.src} alt={media.alt} width={media.width} height={media.height} loading="lazy" /><div><strong>{media.title}</strong><p>{media.caption}</p></div></li>)}</ul><p className="mm-focal-source-note">工具标识说明工作链路；无独立投放效果统计。</p></>}</motion.div>
  </li>;
}

function OperationsMethod({ nextProgress }: { nextProgress: MotionValue<number> }) {
  const reduced = useReducedMotion();
  const target = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target, offset: ["start .9", "start .25"] });
  const arrival = useTransform(scrollYProgress, p => readingProgress(p, 0, .95));
  return <section ref={target} className="mm-editorial-operations mm-focal-operations" aria-labelledby="mm-operations-title">
    <motion.header className="mm-operations-identity" style={{ "--mm-arrival": reduced ? 1 : arrival } as MotionStyle}><h3 id="mm-operations-title">让有效内容，<br />进入运营链路。</h3><p>先确定表达方向，再用发布与复盘找到有效内容，最后放大并承接线索。每段方法都对应它支持的材料。</p></motion.header>
    <ol className="mm-focal-operation-chain">{ipMethod.operationStages.map((stage, index) => <OperationStage key={stage} stage={stage} index={index} />)}</ol>
    <AutomationMethod nextProgress={nextProgress} />
  </section>;
}

function TrainingMethod({ progress }: { progress: MotionValue<number> }) {
  const reduced = useReducedMotion();
  const curriculum = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: curriculum, offset: ["start .85", "end .55"] });
  const pathProgress = useTransform(scrollYProgress, value => readingProgress(value, 0, .85));
  const arrival = useTransform(progress, value => readingProgress(value, 0, .94));
  const courses = useTransform(progress, value => readingProgress(value, .2, 1));
  return <div className="mm-focal-training-method">
    <motion.header className="mm-training-identity" style={{ "--mm-arrival": reduced ? 1 : arrival } as MotionStyle}><h3>从账号定位，<br />教到转化承接。</h3><p><strong>10 场线下训练营</strong>我组织并沉淀培训流程</p></motion.header>
    <div ref={curriculum}><motion.div className="mm-focal-curriculum" style={{ "--mm-path-progress": reduced ? 1 : pathProgress, "--mm-arrival": reduced ? 1 : courses } as MotionStyle}><i aria-hidden="true" /><ol>{ipMethod.trainingStages.map((stage, index) => <li key={stage.title}><span>0{index + 1}</span><h4>{stage.title}</h4><p>{stage.details.split("、").map((phrase, phraseIndex, phrases) => <span key={phrase}>{phrase}{phraseIndex < phrases.length - 1 ? "、" : ""}</span>)}</p></li>)}</ol></motion.div></div>
    <p className="mm-focal-training-summary">{ipMethod.trainingSummary}</p>
  </div>;
}

function ChapterTransition({ target, progress }: { target: React.RefObject<HTMLElement>; progress: MotionValue<number> }) {
  const reduced = useReducedMotion();
  const arrival = useTransform(progress, p => readingProgress(p, 0, .95));
  const result = useTransform(progress, p => readingProgress(p, .5, 1));
  const bridge = useTransform(progress, p => readingProgress(p, .65, 1));
  const context = useTransform(progress, p => readingProgress(p, .4, 1));
  const linkScale = bridge;
  return <section ref={target} id="mm-ip-overview" className="mm-editorial-ip-overview mm-focal-results" aria-labelledby="mm-ip-title">
    <div className="mm-shell">
      <motion.header className="mm-focal-results-heading mm-arrival-heading" style={{ "--mm-arrival": reduced ? 1 : arrival } as MotionStyle}><span aria-label="项目 B">B</span><h2 id="mm-ip-title">全民 IP 孵化</h2><p>让员工从账号起步，<br />走向持续运营。</p></motion.header>
      <div className="mm-focal-result-composition">
        <motion.dl className="mm-focal-result-primary" style={{ "--mm-result-arrival": reduced ? 1 : result } as MotionStyle}><dt>20<span>+</span></dt><dd><strong><small>个</small>万粉达人</strong><p>我直接负责或主导孵化</p></dd></motion.dl>
        <motion.div className="mm-focal-result-bridge" style={{ "--mm-arrival": reduced ? 1 : bridge } as MotionStyle}><motion.i aria-hidden="true" style={reduced ? undefined : { scaleX: linkScale }} /><dl><dt>1<small>个月</small></dt><dd><strong>最快 0 → 1 万粉</strong><p>增长路径最快验证周期</p></dd></dl></motion.div>
      </div>
      <motion.div className="mm-focal-result-context" style={{ "--mm-arrival": reduced ? 1 : context } as MotionStyle}>
        <dl><dt>300<span>+</span></dt><dd><strong>员工账号管理</strong><p>华南区域持续运营范围</p></dd></dl>
        <dl><dt>1 万<span>+</span></dt><dd><strong>年度总留资</strong><p>整体业务口径 · 年份未标注</p></dd></dl>
        <dl><dt>10<small>场</small></dt><dd><strong>线下训练营</strong><p>我组织并沉淀培训流程</p></dd></dl>
      </motion.div>
      <div className="mm-focal-result-evidence"><p>{incubationResults.evidenceSummary}</p><p>主页粉丝数为截图时点的公开规模，不代表任职期间净增；年度留资为整体业务结果，不单独归因于某项投放。</p><a href="#mm-ip">向下看账号与内容证据<ArrowRight size={16} aria-hidden="true" /></a></div>
      <ResponsibilityScope project="ip" />
    </div>
  </section>;
}

function FocalHero({ nextProgress }: { nextProgress: MotionValue<number> }) {
  const reduced = useReducedMotion();
  const portraitY = useTransform(nextProgress, p => -112 * readingProgress(p, 0, .95));
  const identityY = useTransform(nextProgress, p => -72 * readingProgress(p, 0, .95));
  return <header id="mm-overview" className="mm-hero mm-focal-hero">
    <div className="mm-shell">
      <DetailBackLink fallback="/#case-studies" className="mm-back-link"><ArrowLeft aria-hidden="true" />返回重点经历</DetailBackLink>
      <div className="mm-focal-hero-composition">
        <motion.div className="mm-focal-hero-identity" style={reduced ? undefined : { y: identityY }}><div className="mm-hero-identity-entry">
          <h1 aria-label="鸣鸣很忙">{["鸣鸣", "很忙"].map(line => <span key={line}><i>{line}</i></span>)}</h1>
          <p>区域招商内容 × 员工 IP 孵化</p>
        </div></motion.div>
        <motion.figure className="mm-focal-hero-brand" style={reduced ? undefined : { y: portraitY }}>
          <img src="/assets/cases/mingming/brand/dual-mascots-transparent.png" alt="鸣鸣很忙双人物品牌形象" width={505} height={393} />
          <figcaption>两部区域招商影片<br />一套员工 IP 孵化方法</figcaption>
        </motion.figure>
      </div>
      <div className="mm-focal-hero-role"><p>鸣鸣很忙集团<span>赵一鸣商业有限公司</span></p><dl><div><dt>岗位</dt><dd>{heroContent.role}</dd></div><div><dt>区域</dt><dd>{heroContent.region}</dd></div><div><dt>任职</dt><dd>{heroContent.tenure}</dd></div></dl></div>
      <nav className="mm-editorial-projects" aria-label="本案例的两个项目">{heroContent.projects.map((project, index) => <a key={project.index} href={index === 0 ? "#mm-aigc" : "#mm-ip-overview"}><span>{project.index}</span><div><h2>{project.title}</h2><p>{index === 0 ? "浙江 × 石家庄 · 从创意到成片" : "账号增长 · 内容表现 · 运营与培训"}</p></div><ArrowRight aria-hidden="true" /></a>)}</nav>
    </div>
  </header>;
}

function RailSegment({ target, label }: { target: React.RefObject<HTMLElement>; label: string }) {
  const [length, setLength] = useState(1);
  const progress = useMotionValue(0);
  const { scrollY } = useScroll();
  const syncProgress = useCallback(() => {
    const element = target.current;
    const scroller = document.scrollingElement;
    if (!element || !scroller) return;
    const rect = element.getBoundingClientRect();
    progress.set(chapterProgress(window.scrollY, rect.top + window.scrollY, rect.height, scroller.scrollHeight, window.innerHeight));
  }, [progress, target]);
  useMotionValueEvent(scrollY, "change", syncProgress);
  useEffect(() => {
    const element = target.current;
    if (!element) return;
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        setLength(Math.max(1, element.getBoundingClientRect().height));
        syncProgress();
      });
    };
    const observer = new ResizeObserver(update);
    observer.observe(element);
    observer.observe(document.documentElement);
    observer.observe(document.body);
    window.addEventListener("resize", update);
    document.addEventListener("load", update, true);
    document.fonts.addEventListener("loadingdone", update);
    update();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("resize", update);
      document.removeEventListener("load", update, true);
      document.fonts.removeEventListener("loadingdone", update);
    };
  }, [syncProgress, target]);
  const labelOpacity = useTransform(progress, p => p > 0 && p < 1 ? 1 : 0);
  const labelTop = useTransform(progress, p => `${p * 100}%`);
  return <div className="mm-rail-segment" data-rail-label={label} style={{ flexGrow: length }}><motion.i style={{ scaleY: progress }} /><motion.span style={{ opacity: labelOpacity, top: labelTop }}>{label}</motion.span></div>;
}


export function MingmingCasePage() {
  useNearbyImageLoading("wujiahao", ".mingming-case");
  const aigcRef = useRef<HTMLElement>(null);
  const ipRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const operationTrainingRef = useRef<HTMLDivElement>(null);
  const summaryRef = useRef<HTMLElement>(null);
  const resultsRef = useRef<HTMLElement>(null);
  const productionRef = useRef<HTMLElement>(null);
  const trainingRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const { scrollYProgress: resultsProgress } = useScroll({ target: resultsRef, offset: ["start .93", "start .25"] });
  const { scrollYProgress: productionEntrance } = useScroll({ target: productionRef, offset: ["start .9", "start .3"] });
  const { scrollYProgress: trainingEntrance } = useScroll({ target: trainingRef, offset: ["start .9", "start .25"] });
  const { scrollYProgress: contentProgress } = useScroll({ target: aigcRef, offset: ["start end", "start start"] });
  const { scrollYProgress: orbitProgress } = useScroll({ target: ipRef, offset: ["start start", "end end"] });
  const railOpacity = useTransform(contentProgress, [0, .7, 1], [0, 0, 1]);
  const { scrollYProgress: closingProgress } = useScroll({ target: summaryRef, offset: ["start .95", "end end"] });
  const closingLine = useTransform(closingProgress, value => readingProgress(value));
  const closingArrival = useTransform(closingProgress, p => readingProgress(p, 0, .65));
  const nextArrival = useTransform(closingProgress, p => readingProgress(p, .6, 1));
  const filmArrival = useTransform(contentProgress, p => readingProgress(p, 0, .85));
  useEffect(() => {
    document.documentElement.classList.add("mm-route-active");
    document.body.classList.add("mm-route-active");
    return () => { document.documentElement.classList.remove("mm-route-active"); document.body.classList.remove("mm-route-active"); };
  }, []);

  return <article className="mingming-case mm-transitions">
    <motion.div className="mm-scroll-progress" style={reducedMotion ? undefined : { opacity: railOpacity }} aria-hidden="true">
      <RailSegment target={aigcRef} label="AIGC" />
      <RailSegment target={ipRef} label="全民 IP" />
      <RailSegment target={contentRef} label="内容表现" />
      <RailSegment target={operationTrainingRef} label="运营与培训" />
      <RailSegment target={summaryRef} label="经历总结" />
    </motion.div>

    <FocalHero nextProgress={contentProgress} />

    <main>
      <section ref={aigcRef} id="mm-aigc" className="mm-section mm-aigc" aria-labelledby="mm-aigc-title">
        <div className="mm-shell">
          <motion.header className="mm-focal-film-chapter mm-arrival-heading" style={{ "--mm-arrival": reducedMotion ? 1 : filmArrival } as MotionStyle}><div><span aria-label="项目 A">A</span><h2 id="mm-aigc-title">AIGC 区域招商影片</h2></div><p>浙江 × 石家庄<br />两种叙事入口，两部完整交付。</p></motion.header>
          <ResponsibilityScope project="film" />
          <div className="mm-editorial-films">{videoCases.map((video, index) => <VideoResult key={video.id} video={video} index={index} nextProgress={productionEntrance} />)}</div>
          <ProductionProcess nextProgress={resultsProgress} entrance={productionEntrance} target={productionRef} />
        </div>
      </section>

      <ChapterTransition target={resultsRef} progress={resultsProgress} />
      <section id="mm-ip" className="mm-section mm-ip" aria-labelledby="mm-ip-title">
        <div ref={ipRef}><AccountOrbit items={accountGrowthResults} /></div>
        <div className={"mm-shell mm-ip-details" + (reducedMotion ? "" : " mm-content-handoff")}>
          <div ref={contentRef}><ContentExhibit items={contentPerformanceResults} autoScroll entryProgress={orbitProgress} /></div>
          <div ref={operationTrainingRef}>
            <OperationsMethod nextProgress={trainingEntrance} />
            <div ref={trainingRef} className="mm-training">
              <TrainingMethod progress={trainingEntrance} />
              <div className="mm-evidence-heading"><div><span>现场记录 / 10</span><h3>培训在现场发生</h3></div></div>
              <TrainingDepthGallery items={trainingGallery} />
            </div>
          </div>
        </div>
      </section>
    </main>

    <footer ref={summaryRef} id="mm-summary" className="mm-editorial-closing" aria-labelledby="mm-summary-title">
      <div className="mm-shell"><motion.i className="mm-block-rule mm-closing-rule" aria-hidden="true" style={reducedMotion ? undefined : { scaleX: closingLine }} /><motion.div className="mm-closing-conclusion" style={{ "--mm-arrival": reducedMotion ? 1 : closingArrival } as MotionStyle}><h2 id="mm-summary-title">能交付影片，<br /><em>也能搭建运营方法。</em></h2>
        <div className="mm-editorial-takeaways"><p><strong>完整交付</strong>把策略、故事和 AIGC 制作串起来，让区域招商需求成为可以播放的作品。</p><p><strong>持续运行</strong>把账号运营、内容复盘和线下培训串起来，让单点经验成为员工可以执行的方法。</p></div>
        </motion.div><motion.div className="mm-next-arrival" style={{ "--mm-arrival": reducedMotion ? 1 : nextArrival } as MotionStyle}><PortfolioLink className="mm-editorial-next" to="/cases/hengqian"><span>继续阅读 · 下一个案例</span><strong>镜前时代</strong><ArrowRight aria-hidden="true" /></PortfolioLink></motion.div>
        <nav className="mm-editorial-footer-links" aria-label="案例后续操作"><DetailBackLink fallback="/#case-studies"><ArrowLeft size={17} aria-hidden="true" />返回重点经历</DetailBackLink><PortfolioLink to="/#contact">联系我<ArrowRight size={17} aria-hidden="true" /></PortfolioLink></nav>
      </div>
    </footer>
  </article>;
}
