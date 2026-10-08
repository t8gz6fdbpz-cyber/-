import { ArrowDown, ArrowLeft, ArrowRight, Play } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { useState, type ReactNode } from "react";

import { Carousel, FadeContent } from "../components/ui/ReactBitsEvidence";
import {
  accountMatrix,
  aiEvidence,
  aiProduction,
  douyinEvidence,
  independentResponsibilities,
  photography,
  productionFlow,
  wechatEvidence,
  xiaohongshuEvidence,
  type HengqianMedia,
} from "../data/hengqianCase";
import { DetailBackLink, PortfolioLink } from "../routing";
import { contactHref } from "../utils/portfolioData";

type ArchiveItem = {
  number: string;
  type: string;
  title: string;
  description: string;
  result: string;
  href: string;
  item: HengqianMedia;
  className?: string;
};

const archiveItems: ArchiveItem[] = [
  { number: "01", type: "AI 数字人 / 成果", title: "数字人代表内容", description: "用一次真人采集延展多个内容版本，持续测试可复制的高表现结构。", result: "2,922,509 播放", href: "#hq-ai-system", item: aiEvidence[0], className: "is-tall" },
  { number: "02", type: "真人 IP / 制作", title: "真人内容主拍摄", description: "从目标用户、脚本到现场编导，让内容定位落到可发布的短视频。", result: "958,610 代表播放", href: "#hq-video-channel", item: photography[0], className: "is-wide" },
  { number: "03", type: "AI 矩阵 / 生产", title: "真人采集与生成", description: "先准备稳定真人素材，再以 AI 降低矩阵账号的持续生产成本。", result: "43.78% 完播率", href: "#hq-ai-system", item: aiProduction[0] },
  { number: "04", type: "视频号 / 增长", title: "主阵地增长证据", description: "围绕视频号持续分发与复盘，把内容表现连接到关注增长和留资。", result: "13,753 新增关注", href: "#hq-video-channel", item: wechatEvidence[1], className: "is-tall" },
  { number: "05", type: "11 账号 / 矩阵", title: "多平台内容分发", description: "以视频号为主阵地，将内容同步到抖音、小红书与快手完成测试和覆盖。", result: "400+ 单条最高留资", href: "#hq-video-channel", item: xiaohongshuEvidence[0] },
  { number: "06", type: "现场执行 / 采集", title: "可复用的真人素材", description: "统筹提词、灯光与人物状态，为数字人和真人内容提供同一套生产基础。", result: "独立完成全链路", href: "#hq-responsibility", item: aiProduction[1] },
];

const systemSteps = [
  ["目标客户", "明确目标用户与内容切口"],
  ["内容定位", "形成账号方向、选题与脚本"],
  ["AI矩阵生产", "扩展数字人与多版本内容"],
  ["多平台分发", "以视频号为主，覆盖 11 个账号"],
  ["数据赛马", "对比播放、完播、互动与留资"],
  ["线索获取", "复制高表现结构并配合转化"],
] as const;

const aiSteps = [
  { number: "01", title: "真人采集与内容定位", body: "完成目标客户分析、账号定位、脚本与现场编导；一次稳定采集，为后续多个版本留出空间。" },
  { number: "02", title: "AI数字人与矩阵生产", body: "以真人素材生成不同内容版本，并批量组织选题、文案、画面和剪辑版本，降低持续生产成本。" },
  { number: "03", title: "发布、赛马与复制", body: "在多账号、多平台比较播放、完播、互动与留资，淘汰低表现版本，再复制高表现内容结构。" },
] as const;

function EvidenceImage({ item, eager = false, cover = false, className = "", caption }: { item: HengqianMedia; eager?: boolean; cover?: boolean; className?: string; caption?: ReactNode }) {
  const ratio = item.width / item.height;
  const format = ratio >= 2.4 ? "ultra-wide" : ratio >= 1.15 ? "landscape" : "portrait";
  return (
    <figure className={`hq-evidence is-${format}${cover ? " is-cover" : ""} ${className}`.trim()}>
      <span className="hq-evidence-frame" style={cover ? undefined : { aspectRatio: `${item.width} / ${item.height}` }}>
        <img src={item.src} alt={item.alt} width={item.width} height={item.height} loading={eager ? "eager" : "lazy"} decoding="async" draggable="false" />
      </span>
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  );
}

function VideoPlaceholder({ label, src }: { label: string; src?: string }) {
  return (
    <div className="hq-video-wrap hq-archive-video">
      <video controls playsInline preload="metadata" aria-label={label} src={src} style={src ? undefined : { display: "none" }} />
      <div className="hq-video-poster" aria-hidden="true"><Play /><span>{label}</span><small>代表成片位置 · 建议 MP4 / H.264 · 1080×1920</small></div>
    </div>
  );
}

function PlatformCarousel({ items, label, columns }: { items: HengqianMedia[]; label: string; columns: number }) {
  return <Carousel items={items} label={`${label}成果截图`} statusLabel={label} desktopPageSize={columns} desktopColumns={columns} mobilePageSize={2} phonePageSize={1} className="hq-media-carousel" renderItem={(item) => <EvidenceImage key={item.id} item={item} />} />;
}

function ArchiveCard({ item }: { item: ArchiveItem }) {
  return (
    <a href={item.href} className={`hq-archive-card ${item.className ?? ""}`.trim()}>
      <EvidenceImage item={item.item} cover className="hq-archive-card-image" />
      <div className="hq-archive-card-copy">
        <p><span>{item.number}</span>{item.type}</p><h3>{item.title}</h3><span className="hq-archive-card-description">{item.description}</span>
        <strong>{item.result}<ArrowRight aria-hidden="true" /></strong>
      </div>
    </a>
  );
}

export function HengqianCasePage() {
  const [platform, setPlatform] = useState<"wechat" | "xiaohongshu">("wechat");
  const reduceMotion = useReducedMotion();
  return (
    <article className="hengqian-case">
      <section className="hq-hero hq-archive-hero" aria-labelledby="hengqian-title">
        <div className="hq-shell">
          <DetailBackLink fallback="/#case-studies" className="hq-back"><ArrowLeft aria-hidden="true" />返回重点经历</DetailBackLink>
          <div className="hq-archive-hero-grid">
            <motion.div className="hq-archive-hero-copy" initial={reduceMotion ? false : { opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduceMotion ? 0 : 0.48, ease: [0.22, 1, 0.36, 1] }}>
              <p className="hq-case-label">CASE 02 <span>/ 内容与增长</span></p><h1 id="hengqian-title">镜前时代</h1>
              <p className="hq-archive-lead">2个月独立搭建11个账号的短视频增长矩阵，以视频号为主，通过AI数字人、批量内容生产和数据赛马持续获取目标客户。</p>
              <ul className="hq-archive-tags" aria-label="项目核心能力"><li>内容策略</li><li>IP制作</li><li>AI矩阵</li><li>平台增长</li></ul>
              <a href="#hq-showcase" className="hq-anchor">查看项目一览<ArrowDown aria-hidden="true" /></a>
            </motion.div>
            <div className="hq-archive-hero-visual">
              <EvidenceImage item={photography[0]} eager cover className="is-feature" />
              <div className="hq-archive-hero-meta" aria-label="项目档案">
                <span>项目类型<strong>内容与增长</strong></span><span>项目周期<strong>2个月</strong></span><span>账号规模<strong>11个账号</strong></span><span>核心平台<strong>视频号</strong></span><span className="is-wide">AI作用<strong>数字人 / 矩阵生产 / 内容赛马</strong></span>
              </div>
            </div>
          </div>
          <dl className="hq-hero-results hq-archive-results" aria-label="核心增长结果"><div><dt>2,922,509</dt><dd>AI数字人代表内容播放</dd></div><div><dt>958,610</dt><dd>视频号代表视频播放</dd></div><div className="is-commercial"><dt>400+</dt><dd>单条视频最高留资</dd></div></dl>
        </div>
      </section>

      <section id="hq-showcase" className="hq-section hq-archive-showcase" aria-labelledby="hq-showcase-title"><div className="hq-shell">
        <header className="hq-archive-heading"><span>PROJECT INDEX / 06</span><div><h2 id="hq-showcase-title">项目一览</h2><p>先看我做了什么、解决了什么，以及每一项如何连接增长结果。</p></div></header>
        <div className="hq-archive-grid">{archiveItems.map((item) => <ArchiveCard key={item.number} item={item} />)}</div>
      </div></section>

      <section className="hq-section hq-growth-system" aria-labelledby="hq-growth-system-title"><div className="hq-shell">
        <header className="hq-archive-heading"><span>GROWTH SYSTEM</span><div><h2 id="hq-growth-system-title">内容生产如何变成增长</h2><p>AI不是装饰性标签，而是把内容生产、测试与线索获取连接起来的中间机制。</p></div></header>
        <ol className="hq-growth-flow" aria-label="增长系统流程">{systemSteps.map(([title, description], index) => <li key={title}><span>{String(index + 1).padStart(2, "0")}</span><strong>{title}</strong><p>{description}</p></li>)}</ol>
      </div></section>

      <section id="hq-ai-system" className="hq-section hq-ai-system" aria-labelledby="hq-ai-title"><div className="hq-shell">
        <header className="hq-archive-heading hq-archive-heading-split"><span>01 / AI GROWTH SYSTEM</span><div><h2 id="hq-ai-title">AI降低生产与测试成本</h2><p>一次真人采集支持多个内容版本；AI持续生产并加速赛马，让高表现内容能被更快发现、复制到更多账号与平台。</p></div></header>
        <div className="hq-ai-steps">{aiSteps.map((step) => <section key={step.number}><span>{step.number}</span><h3>{step.title}</h3><p>{step.body}</p></section>)}</div>
        <div className="hq-ai-evidence-primary">
          <EvidenceImage item={aiProduction[0]} cover caption={<>真人绿幕采集：为后续不同内容版本准备稳定、可复用的素材。</>} />
          <div className="hq-ai-evidence-copy"><p className="hq-archive-eyebrow">REPRESENTATIVE RESULT</p><h3>AI数字人不是替代内容判断，而是让同一个内容方向可以被更快、更低成本地验证。</h3><dl className="hq-ai-metrics"><div><dt>2,922,509</dt><dd>代表内容播放</dd></div><div><dt>43.78%</dt><dd>完播率</dd></div><div><dt>69.82 秒</dt><dd>平均播放时长</dd></div></dl><p>我比较播放、完播、互动和留资；低表现版本停止投入，高表现结构再被复制到其他账号和平台。</p></div>
          <VideoPlaceholder label="雅姐 AI数字人代表成片（待替换）" />
        </div>
        <details className="hq-disclosure"><summary>查看完整内容赛马记录 <span>AI数字人版本与数据截图</span></summary><div className="hq-disclosure-body"><p>以下真实截图记录不同内容版本的播放、留存和互动表现，用于同方向内容的筛选与迭代。</p><PlatformCarousel items={aiEvidence} label="AI数字人" columns={3} /></div></details>
      </div></section>

      <section id="hq-video-channel" className="hq-section hq-channel-system" aria-labelledby="hq-channel-title"><div className="hq-shell">
        <header className="hq-archive-heading hq-archive-heading-split"><span>02 / DISTRIBUTION &amp; LEADS</span><div><h2 id="hq-channel-title">视频号主阵地，矩阵补充覆盖</h2><p>视频号承担主要增长与线索获取；抖音、小红书、快手共同承接分发、测试与额外覆盖，但不与主阵地混为同等权重。</p></div></header>
        <div className="hq-channel-layout"><section className="hq-channel-primary" aria-labelledby="hq-channel-primary-title"><p className="hq-archive-eyebrow">PRIMARY PLATFORM / 视频号 5个账号</p><h3 id="hq-channel-primary-title">代表内容带来播放、关注与留资，而不是止步于曝光。</h3><dl className="hq-channel-metrics"><div><dt>958,610</dt><dd>代表视频播放</dd></div><div><dt>13,753</dt><dd>新增关注</dd></div><div className="is-commercial"><dt>400+</dt><dd>单条最高留资</dd></div></dl></section><aside className="hq-account-matrix" aria-label="11个账号的平台矩阵"><p>ACCOUNT MATRIX / 11</p>{accountMatrix.map((item) => <div key={item.platform} className={item.role === "主阵地" ? "is-primary" : ""}><span>{item.platform}</span><strong>{item.count} 个</strong><em>{item.role}</em></div>)}</aside></div>
        <div className="hq-channel-proof-grid"><EvidenceImage item={wechatEvidence[0]} caption={<>公开内容界面：约95.8万播放与万级互动。</>} /><EvidenceImage item={wechatEvidence[1]} caption={<>代表视频数据：958,610 播放、13,753 新增关注。</>} /><VideoPlaceholder label="雅姐真人 IP 代表成片（待替换）" /></div>
        <details className="hq-disclosure"><summary>查看 11 个账号的矩阵证据 <span>视频号与小红书的真实账号、内容与增长截图</span></summary><div className="hq-disclosure-body"><p>视频号是主阵地；以下公开记录同时保留小红书内容表现，作为多平台分发与矩阵运营的真实证据。</p><div className="hq-disclosure-split"><div><h3>视频号</h3><PlatformCarousel items={wechatEvidence} label="视频号" columns={4} /></div><div><h3>小红书</h3><PlatformCarousel items={xiaohongshuEvidence} label="小红书" columns={4} /></div></div></div></details>
        <details className="hq-disclosure"><summary>查看平台增长截图 <span>保留原有平台切换与轮播查看</span></summary><div className="hq-disclosure-body"><div className="hq-tabs" role="tablist" aria-label="平台增长截图"><button type="button" role="tab" id="hq-tab-wechat" aria-selected={platform === "wechat"} aria-controls="hq-tabpanel-wechat" onClick={() => setPlatform("wechat")}>视频号 <span>8</span></button><button type="button" role="tab" id="hq-tab-xhs" aria-selected={platform === "xiaohongshu"} aria-controls="hq-tabpanel-xhs" onClick={() => setPlatform("xiaohongshu")}>小红书 <span>4</span></button></div><div className="hq-platform-panels"><FadeContent active={platform === "wechat"} id="hq-panel-wechat"><div id="hq-tabpanel-wechat" role="tabpanel" aria-labelledby="hq-tab-wechat"><div className="hq-platform-summary"><h3>视频号</h3><p>截图时关注人数 16,314。代表视频 958,610 播放、11,258 点赞、15,966 评论，并新增关注 13,753。</p></div><PlatformCarousel items={wechatEvidence} label="视频号" columns={4} /></div></FadeContent><FadeContent active={platform === "xiaohongshu"} id="hq-panel-xhs"><div id="hq-tabpanel-xhs" role="tabpanel" aria-labelledby="hq-tab-xhs"><div className="hq-platform-summary"><h3>小红书</h3><p>截图时粉丝 3,989，获赞与收藏 1.5 万；代表笔记 8 万浏览、互动 3,979、单篇涨粉 1,313。</p></div><PlatformCarousel items={xiaohongshuEvidence} label="小红书" columns={4} /></div></FadeContent></div></div></details>
      </div></section>

      <section id="hq-responsibility" className="hq-section hq-responsibility" aria-labelledby="hq-responsibility-title"><div className="hq-shell">
        <header className="hq-archive-heading hq-archive-heading-split"><span>03 / INDEPENDENT SCOPE</span><div><h2 id="hq-responsibility-title">独立负责全链路</h2><p>从目标客户到后端转化配合，我把内容判断、生产机制、账号运营与增长复盘放在同一个运营闭环里完成。</p></div></header>
        <ul className="hq-responsibility-list" aria-label="独立负责的工作环节">{independentResponsibilities.map((responsibility, index) => <li key={responsibility}><span>{String(index + 1).padStart(2, "0")}</span>{responsibility}</li>)}</ul>
        <div className="hq-production-stills" aria-label="真人拍摄与现场编导证据"><EvidenceImage item={photography[1]} cover caption={<>真人 IP 主拍摄现场：统筹布光、机位、提词与人物状态。</>} /><EvidenceImage item={photography[2]} cover className="is-portrait" caption={<>竖幅现场记录：人物状态与拍摄环境。</>} /></div>
        <details className="hq-disclosure"><summary>查看培训与 SOP <span>运营流程搭建范围</span></summary><div className="hq-disclosure-body hq-sop-copy"><p>我负责将定位、选题、脚本、真人采集、AI生成、多平台分发、数据复盘和内容赛马整理为可持续执行的运营流程，并承担培训与 SOP 搭建。此处不补造未提供的内部培训截图。</p><ol>{productionFlow.map((item) => <li key={item}>{item}</li>)}</ol></div></details>
        <details className="hq-disclosure"><summary>查看协作项目补充证据 <span>保留原有大型 IP 制作协作截图</span></summary><div className="hq-disclosure-body"><p>以下为成熟 IP 项目的内容制作协作记录，仅作为补充能力证明，不将账号全部成绩归为个人独立主导。</p><div className="hq-support-media">{douyinEvidence.map((item) => <EvidenceImage key={item.id} item={item} />)}</div></div></details>
      </div></section>

      <footer className="hq-next hq-archive-next"><div className="hq-shell"><div><span>项目总结</span><h2>我把目标客户、内容生产、AI矩阵、平台分发、数据赛马和线索获取连接成一套可持续运行的增长系统。</h2></div><nav aria-label="案例后续操作"><DetailBackLink fallback="/#case-studies"><ArrowLeft aria-hidden="true" />返回重点经历</DetailBackLink><PortfolioLink to="/cases/wujiahao">查看另一个案例<ArrowRight aria-hidden="true" /></PortfolioLink><a href={contactHref}>联系我<ArrowRight aria-hidden="true" /></a></nav></div></footer>
    </article>
  );
}
