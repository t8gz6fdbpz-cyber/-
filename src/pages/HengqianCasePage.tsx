import { ArrowDown, ArrowLeft, ArrowRight } from "lucide-react";
import { LayoutGroup, motion } from "framer-motion";
import { useState, type ReactNode } from "react";
import { ViewportImage } from "../components/ui/ViewportImage";
import { allEvidence, aiEvidence, douyinEvidence, evidenceGroups, photography, projectResults, wechatEvidence, xiaohongshuEvidence, type HengqianMedia } from "../data/hengqianCase";
import { OriginalImageViewerProvider, useOriginalImages } from "../components/ui/OriginalImageViewer";
import { DetailBackLink, PortfolioLink } from "../routing";
import { contactHref } from "../utils/portfolioData";
import { HengqianChapterHeader, HengqianEditorialBlock, HengqianMotionProvider, HengqianPhotoSurface, useHengqianEntrance, useHengqianMotion } from "../components/cases/HengqianMotion";
import { HengqianAIShowcase, HengqianHeroScene, HengqianProductionScene } from "../components/cases/HengqianScrollScene";

import { Carousel } from "../components/ui/ReactBitsEvidence";
import { useNearbyImageLoading } from "../hooks/useNearbyImageLoading";
import "../styles/hengqian-case.css";

function EvidenceFigure({ item, photo = false, hero = false, caption, className = "", collection = allEvidence }: {
  item: HengqianMedia; photo?: boolean; hero?: boolean; caption?: ReactNode; className?: string; collection?: readonly HengqianMedia[];
}) {
  const open = useOriginalImages();
  const view = () => open(collection.map(media => ({ id: media.id, src: media.originalSrc, alt: media.alt, label: `${media.platform} · ${media.evidence}`, width: media.width, height: media.height })), collection.findIndex(media => media.id === item.id));
  const image = <ViewportImage src={hero ? "/assets/cases/hengqian/photography/photo-02.hero.webp" : item.previewSrc}
    srcSet={hero ? `${item.previewSrc} 1100w, /assets/cases/hengqian/photography/photo-02.hero.webp 1800w` : undefined}
    sizes={hero ? "(max-width: 820px) 100vw, 60vw" : undefined} alt={item.alt} width={item.width} height={item.height}
    loading={hero ? "eager" : "lazy"} {...(hero ? { fetchpriority: "high" } : {})} draggable="false" />;
  return <figure data-media-id={item.id} className={`hq-figure ${photo ? "hq-photo" : "hq-data"} ${className}`}>
    <button type="button" className="hq-image-frame" aria-label={`查看原图：${item.alt}`} onClick={view}>{photo ? <HengqianPhotoSurface hero={hero}>{image}</HengqianPhotoSurface> : image}</button>
    <figcaption>{caption ?? <><strong>{item.platform} · {item.evidence}</strong><span>{item.note}</span></>}<button type="button" className="hq-original-link" onClick={view}>查看原图</button></figcaption>
  </figure>;
}
function LeadResult({ value, scope, compact = false }: { value: string; scope: string; compact?: boolean }) {
  return <div className={`hq-lead-result ${compact ? "hq-lead-compact" : ""}`}>
    <p className="hq-result-scope">{scope}</p><p className="hq-lead-unit"><span className="hq-lead-label">留资</span><strong>{value}</strong><span className="hq-lead-measure">条</span></p>
  </div>;
}
function Metrics({ items }: { items: readonly (readonly [string, string])[] }) {
  return <dl className="hq-metrics">{items.map(([value, label]) => <div key={label}><dt>{value}</dt><dd>{label}</dd></div>)}</dl>;
}
const aiFlow = ["人物与内容定位", "真人绿幕采集", "数字人内容生产", "矩阵发布", "数据复盘", "迭代与复制"];
const workingStages = [
  { title: "先确定内容方向", body: "围绕目标人群梳理人物定位，将选题拆成可拍摄的文案与脚本。真人 IP 与数字人内容各自匹配表达方式。", scope: "内容定位 / 选题 / 文案" },
  { title: "把判断落到现场", body: "参与真人拍摄、现场编导与绿幕素材采集，衔接剪辑包装和数字人内容生产，让定位落实为可发布的内容。", scope: "拍摄 / 编导 / 制作" },
  { title: "用发布结果迭代", body: "结合播放、完播、互动与关注记录调整后续内容；在成熟 IP 项目中，协助文案、剪辑、投放执行和运营流程优化。", scope: "内容复盘 / 投放协作" },
];
export function HengqianCasePage() {
  useNearbyImageLoading("hengqian", ".hengqian-case");
  return <HengqianMotionProvider><OriginalImageViewerProvider><HengqianCaseContent /></OriginalImageViewerProvider></HengqianMotionProvider>;
}
function HengqianCaseContent() {
  const { reduce: reduceMotion } = useHengqianMotion();
  const entrance = useHengqianEntrance();
  const [groupIndex, setGroupIndex] = useState(0);
  const group = evidenceGroups[groupIndex];
  const selectTab = (index: number, focus = false) => { setGroupIndex(index); if (focus) document.getElementById(`hq-evidence-tab-${index}`)?.focus(); };
  return <article className="hengqian-case" data-motion={reduceMotion ? "reduce" : "full"}>
    <HengqianHeroScene><div className="hq-shell">
      <div className="hq-topbar"><DetailBackLink fallback="/#case-studies" className="hq-back"><ArrowLeft aria-hidden="true" />返回重点经历</DetailBackLink><motion.a className="hq-text-link hq-hero-read" href="#hq-overview" {...entrance(0.7)}>阅读项目<ArrowDown aria-hidden="true" /></motion.a></div>
      <div className="hq-hero-visual">
        <div className="hq-hero-drift"><EvidenceFigure item={photography[1]} photo hero className="hq-hero-photo" caption={<><span>孟樊雅 / 雅姐 · 真人拍摄</span><span>人物、机位与布光共同进入画面</span></>} /></div>
        <div className="hq-hero-shade" aria-hidden="true" />
        <div className="hq-hero-heading">
          <h1 id="hengqian-title" aria-label="镜前时代">{"镜前时代".split("").map((char,index)=><span className="hq-hero-char-mask" key={char} aria-hidden="true"><motion.span initial={reduceMotion ? false : { y: "110%" }} animate={{ y: 0 }} transition={{ duration: reduceMotion ? 0 : 0.95, delay: reduceMotion ? 0 : 0.15 + index * 0.07, ease: [0.22,1,0.36,1] }}>{char}</motion.span></span>)}</h1>
          <motion.p className="hq-hero-subtitle" initial={reduceMotion ? false : { opacity: 0, y: 35 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduceMotion ? 0 : 0.9, delay: reduceMotion ? 0 : 0.4 }}>从商业 IP 到 AI 矩阵的<br />内容增长实践</motion.p>
        </div>
      </div>
      <div className="hq-hero-support"><div><motion.p className="hq-hero-intro" {...entrance(0.6)}>将<strong>人物定位、内容制作与平台运营</strong>连接起来，让持续的内容带来留资。</motion.p></div><motion.dl className="hq-role" {...entrance(0.65)}><div><dt>我的工作</dt><dd>内容策划、拍摄编导与 AI 内容运营；成熟 IP 项目参与运营和投放协作。</dd></div></motion.dl></div>
    </div></HengqianHeroScene>
    <section id="hq-overview" className="hq-overview hq-shell" aria-labelledby="hq-overview-title">
      <div className="hq-overview-heading"><h2 id="hq-overview-title">三个项目，一段增长实践。</h2><p>起号、矩阵生产与成熟 IP 协助，各有职责边界。</p></div>
      <div className="hq-project-index">{projectResults.map(project => <a href={`#${project.id}`} key={project.id}><span>{project.project}</span><h3>{project.title}<ArrowDown aria-hidden="true" /></h3><LeadResult value={project.value} scope={project.label} compact /><small>{project.note}</small></a>)}</div>
    </section>
    <section id="hq-commercial" className="hq-section hq-commercial" aria-labelledby="hq-commercial-title"><div className="hq-shell">
      <HengqianChapterHeader><h2 id="hq-commercial-title"><span className="hq-project-number">01 商业 IP</span>孟樊雅 / 雅姐<br />从零起号，持续运营</h2><div><p>孟樊雅 / 雅姐</p><p>在公司已有 IP 经验之上，启动新的定位与内容方向，完成从零起号，并逐步建立持续运营方式。</p></div></HengqianChapterHeader>
      <div className="hq-commercial-intro"><EvidenceFigure item={photography[2]} photo caption={<>孟樊雅商业 IP · 室外拍摄环境与灯光设备。</>} /><HengqianEditorialBlock><LeadResult value="600+" scope="商业 IP · 月均" /><p className="hq-eyebrow">我的工作</p><h3>把人物定位，变成观众愿意看的内容。</h3><p>我参与<strong>内容定位、选题文案与真人拍摄编导</strong>，衔接发布复盘，把面向目标人群的表达落实为具体短视频。</p><p>视频号与小红书属于同一个孟樊雅项目，分别展示平台成果。项目已完成从零起号，并建立持续运营方式。</p><p className="hq-source">成果来源：项目复盘记录。月均与单条内容留资分别统计，不相加。</p></HengqianEditorialBlock></div>
      <div id="hq-wechat" className="hq-platform-story"><div className="hq-platform-proof"><EvidenceFigure item={wechatEvidence[0]} /><EvidenceFigure item={wechatEvidence[1]} /></div><HengqianEditorialBlock><p className="hq-eyebrow">01 / 孟樊雅 · 视频号</p><h3>视频号：人物表达，连接内容与留资。</h3><LeadResult value="1400+" scope="视频号 · 代表内容" /><Metrics items={[["958,610", "代表视频播放"], ["13,753", "新增关注"]]} /><p>围绕女性成长的代表内容，平台截图记录了播放和新增关注。文案与内容方向结合人物表达，形成能被用户识别的 IP 形象。</p><p className="hq-source">留资来源：项目复盘记录；平台截图支持播放与新增关注指标。</p></HengqianEditorialBlock></div>
      <div id="hq-xhs" className="hq-platform-story hq-xhs-story"><HengqianEditorialBlock><p className="hq-eyebrow">01 / 孟樊雅 · 小红书</p><h3>同一人物，不同平台的表达。</h3><LeadResult value="300+" scope="小红书 · 代表内容" /><p>将真人 IP 内容延展到笔记场景，结合平台反馈观察内容互动和关注增长。</p><Metrics items={[["8 万", "代表笔记浏览"], ["3,979", "互动"], ["1,313", "笔记涨粉"]]} /><p className="hq-source">留资来源：项目复盘记录。不同平台与统计范围分别展示。</p></HengqianEditorialBlock><EvidenceFigure item={xiaohongshuEvidence[1]} caption={<>代表笔记完整数据：浏览、互动与笔记涨粉。</>} /></div>
    </div></section>
    <section id="hq-ai" aria-labelledby="hq-ai-title">
      <HengqianProductionScene />
      <div className="hq-ai" data-logo-surface="green"><HengqianAIShowcase />
      <div id="hq-ai-data" className="hq-section hq-shell hq-ai-reading">
      <div className="hq-ai-production"><div><p className="hq-eyebrow">02 / 数字人 · 项目背景</p><h3>数字人 / AI 矩阵打法</h3><p>单一 IP 的生产成本较高。项目筛选符合目标人群需求的人物形象，以真人采集为基础，组织数字人内容与矩阵发布，让内容生产能够反复迭代和复制。</p></div><HengqianEditorialBlock><h3>一次真实采集，延展后续内容。</h3><p>人物表达和脚本仍需要内容判断。绿幕录制为数字人内容准备基础素材，AI 支持批量生产与多版本组织，我参与<strong>绿幕采集、数字人制作与内容运营</strong>。</p><LeadResult value="400+" scope="数字人矩阵 · 月均" /><p className="hq-source">来源：项目复盘记录。运营打法已跑通，并建立可批量复制的架构。</p></HengqianEditorialBlock></div>
      <ol className="hq-ai-flow" aria-label="数字人生产与迭代流程">{aiFlow.map((step, index) => <li key={step}><span>{String(index + 1).padStart(2, "0")}</span>{step}{index < aiFlow.length - 1 && <ArrowRight aria-hidden="true" />}</li>)}</ol>
      <div className="hq-ai-result"><HengqianEditorialBlock><h3>代表内容的播放与留存</h3><Metrics items={[["2,922,509", "代表内容播放"], ["43.78%", "完播率"], ["69.82", "平均播放时长（秒）"]]} /><p>发布后观察播放、完播和互动，调整下一轮内容。截图记录实际表现；其他素材按独立记录归档，供进一步阅读。</p><p>这段实践将内容制作延展为可重复执行的矩阵生产方法，保留真人素材与内容判断作为基础。</p></HengqianEditorialBlock><EvidenceFigure item={aiEvidence[0]} /></div>
    </div></div></section>
    <section id="hq-collaboration" className="hq-section hq-collaboration" data-logo-surface="paper" aria-labelledby="hq-collaboration-title"><div className="hq-shell">
      <HengqianChapterHeader><h2 id="hq-collaboration-title"><span className="hq-project-number">03 商业 IP 协助</span>王延芝<br />协助运营与投放优化</h2><div><p>王延芝 / 团队协作</p><p>在已经建立影响力、并取得投放成效的 IP 中，我的工作是协助团队优化内容和投放执行。</p></div></HengqianChapterHeader>
      <div className="hq-collaboration-grid"><HengqianEditorialBlock><LeadResult value="80+" scope="团队项目成果 · 日均" /><p className="hq-eyebrow">我的工作 · 协助</p><h3>在成熟体系里，做好具体的优化。</h3><ul className="hq-work-list"><li>优化<strong>文案表达与视频剪辑思路</strong>。</li><li>执行<strong>巨量本地推投放</strong>，与平台客服沟通内容违规问题。</li><li>协助运营团队改进工作流程。</li></ul><p className="hq-roi"><strong>20%</strong><span>投产比提升</span></p><p className="hq-source">来源：成熟 IP 项目复盘记录。属于团队项目成果；旁侧账号资料记录历史状态。</p></HengqianEditorialBlock><EvidenceFigure item={douyinEvidence[0]} caption={<>成熟 IP 账号资料：用于说明协作项目背景。</>} /></div>
    </div></section>
    <section id="hq-method" className="hq-section hq-method" aria-labelledby="hq-method-title"><div className="hq-shell">
      <HengqianChapterHeader><h2 id="hq-method-title">我的工作，<br />落在每一次具体执行里。</h2><div><p>从内容判断到现场制作，再到运营复盘。三个项目中的职责各有边界，形成相互衔接的实践经验。</p></div></HengqianChapterHeader>
      <div className="hq-method-grid"><ol className="hq-method-list">{workingStages.map(stage => <motion.li key={stage.title} initial={reduceMotion ? false : { y: 40, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true, amount: 0.15 }} transition={{ duration: reduceMotion ? 0 : 0.8, ease: [0.22,1,0.36,1] }}><h3>{stage.title}</h3><p>{stage.body}</p><span>{stage.scope}</span></motion.li>)}</ol></div>
    </div></section>
    <section id="hq-evidence" className="hq-section hq-library" aria-labelledby="hq-evidence-title"><div className="hq-shell">
      <header className="hq-library-header"><h2 id="hq-evidence-title">证据与现场</h2><p>补充记录按项目与平台归档。正文与此处使用不同素材。</p></header>
      <LayoutGroup id="hengqian-evidence-tabs"><div className="hq-evidence-tabs" role="tablist" aria-label="证据分类">{evidenceGroups.map((candidate, index) => <button key={candidate.id} type="button" role="tab" id={`hq-evidence-tab-${index}`} aria-selected={groupIndex === index} aria-controls="hq-evidence-panel" tabIndex={groupIndex === index ? 0 : -1} onClick={() => selectTab(index)} onKeyDown={event => {
        let next: number | undefined;
        if (event.key === "ArrowRight") next = (index + 1) % evidenceGroups.length;
        if (event.key === "ArrowLeft") next = (index - 1 + evidenceGroups.length) % evidenceGroups.length;
        if (event.key === "Home") next = 0;
        if (event.key === "End") next = evidenceGroups.length - 1;
        if (next !== undefined) { event.preventDefault(); selectTab(next, true); }
      }}>{candidate.label}{groupIndex === index && <motion.span aria-hidden="true" className="hq-tab-indicator" layoutId={reduceMotion ? undefined : "selected"} transition={{ duration: reduceMotion ? 0 : 0.32, ease: [0.22, 1, 0.36, 1] }} />}</button>)}</div></LayoutGroup>
      <motion.div key={group.id} id="hq-evidence-panel" role="tabpanel" aria-labelledby={`hq-evidence-tab-${groupIndex}`} tabIndex={0} initial={reduceMotion ? false : { opacity: 0.92 }} animate={{ opacity: 1 }} transition={{ duration: reduceMotion ? 0 : 0.2 }}><p className="hq-library-description">{group.description}</p><Carousel key={group.id} items={group.items} label={`${group.label}证据`} statusLabel={group.label} desktopPageSize={3} desktopColumns={3} mobilePageSize={2} phonePageSize={1} className="hq-evidence-carousel" renderItem={item => <EvidenceFigure item={item} collection={group.items} photo={item.originalSrc.endsWith(".jpg")} />} /></motion.div>
    </div></section>
    <footer className="hq-footer"><div className="hq-shell"><div className="hq-footer-copy"><h2>让内容制作，<br /><span className="case-closing-line">成为持续运营的能力。</span></h2><p>这段经历让我把人物表达、现场制作、AI 内容生产与运营复盘连接起来，也更清楚个人执行与团队协作的边界。</p></div><nav aria-label="案例后续操作"><DetailBackLink fallback="/#case-studies"><ArrowLeft aria-hidden="true" />返回重点经历</DetailBackLink><PortfolioLink to="/cases/wujiahao">查看另一个案例<ArrowRight aria-hidden="true" /></PortfolioLink><a href={contactHref}>联系我<ArrowRight aria-hidden="true" /></a></nav></div></footer>
  </article>;
}
