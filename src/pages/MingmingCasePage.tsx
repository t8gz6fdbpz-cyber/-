import { ArrowLeft, ArrowRight } from "lucide-react";
import { type ReactNode } from "react";

import {
  agentAutomation,
  agentCapabilities,
  agentDevelopment,
  agentOverview,
  agentWorkflow,
  accountGrowthFlow,
  accountGrowthResults,
  accountGrowthSummary,
  companyProfile,
  contentPerformanceResults,
  heroContent,
  incubationMetrics,
  incubationOverview,
  incubationStages,
  performanceMedia,
  personalResults,
  reviewWorkflow,
  trainingGallery,
  trainingSummary,
  videoCases,
  videoOverview,
  type MingmingEvidence,
  type MingmingMedia,
  type MingmingVideo,
} from "../data/mingmingCase";
import { EvidenceFoldDeck, type EvidenceFoldDeckItem } from "../components/ui/EvidenceFoldDeck";
import { Carousel } from "../components/ui/ReactBitsEvidence";
import { DetailBackLink, PortfolioLink } from "../routing";

function SectionHeading({ index, eyebrow, title, summary }: {
  index: string;
  eyebrow: string;
  title: ReactNode;
  summary: string;
}) {
  return (
    <header className="mm-section-heading">
      <span>{index}</span>
      <div>
        <p>{eyebrow}</p>
        <h2>{title}</h2>
      </div>
      <p>{summary}</p>
    </header>
  );
}

function MediaCard({ media }: {
  media: MingmingMedia;
}) {
  if (!media.src) return null;

  return (
    <figure className="mm-media-card">
      <div className="mm-media-visual">
        <img
          src={media.src}
          alt={media.alt}
          width={media.width}
          height={media.height}
          loading="lazy"
          decoding="async"
          draggable="false"
        />
      </div>
      <figcaption>
        <strong>{media.title}</strong>
        <span>{media.caption}</span>
      </figcaption>
    </figure>
  );
}

function EvidenceCard({ media, showCaption = media.group === "training" }: {
  media: MingmingEvidence;
  showCaption?: boolean;
}) {
  const isLandscape = media.group === "training" || media.group === "automation" || media.group === "development";

  return (
    <figure
      className={`mm-evidence-card${isLandscape ? " is-landscape" : " is-portrait"}`}
      data-evidence-id={media.id}
    >
      <span className="mm-media-frame">
        <img
          src={media.src}
          alt={media.alt}
          width={media.width}
          height={media.height}
          loading="lazy"
          decoding="async"
          draggable="false"
        />
      </span>
      {showCaption && (
        <figcaption className="mm-evidence-caption">
          <strong>{media.title}</strong>
          <span>{media.caption}</span>
        </figcaption>
      )}
    </figure>
  );
}

function VideoStory({ video, index }: { video: MingmingVideo; index: number }) {
  const projectDetails = [
    ["项目背景", video.context],
    ["叙事策略", video.strategy],
    ["我的职责", video.responsibility],
    ["最终交付", video.delivery],
  ] as const;

  return (
    <article className={`mm-video-story${index % 2 ? " is-reversed" : ""}`}>
      <div className="mm-video-copy">
        <p className="mm-kicker">{video.label}</p>
        <h3>{video.title}</h3>
        <dl className="mm-video-details">
          {projectDetails.map(([label, content]) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>{content}</dd>
            </div>
          ))}
        </dl>
      </div>
      <figure className="mm-video-column">
        <div className="mm-video-frame">
          {video.videoSrc ? (
            <video controls playsInline preload="metadata" src={video.videoSrc} poster={video.poster} aria-label={`${video.title}视频播放器`} />
          ) : (
            <img src={video.poster} alt={video.alt} width={video.width} height={video.height} loading={index === 0 ? "eager" : "lazy"} decoding="async" />
          )}
        </div>
      </figure>
    </article>
  );
}

function AgentProject({ media, eyebrow, title, summary, tags, reverse = false }: {
  media: MingmingEvidence;
  eyebrow: string;
  title: string;
  summary: string;
  tags: readonly string[];
  reverse?: boolean;
}) {
  return (
    <article className={`mm-agent-project${reverse ? " is-reversed" : ""}`}>
      <div className="mm-agent-project-copy">
        <p>{eyebrow}</p>
        <h3>{title}</h3>
        <p>{summary}</p>
        <ul>{tags.map((tag) => <li key={tag}>{tag}</li>)}</ul>
      </div>
      <EvidenceCard media={media} />
    </article>
  );
}

const growthEvidenceDecks: readonly EvidenceFoldDeckItem[] = [
  {
    id: "account-growth-results",
    indexLabel: "01",
    title: "账号增长成绩",
    countLabel: "17个不同账号",
    description: "17个不同账号的主页与粉丝成绩，证明账号定位、内容节奏和持续运营最终沉淀为稳定增长。",
    items: accountGrowthResults,
  },
  {
    id: "content-performance-results",
    indexLabel: "02",
    title: "内容表现成绩",
    countLabel: "9项代表性成果",
    description: "9项单条视频与公开内容表现，证明选题、拍摄和表达如何转化为具体传播结果。",
    items: contentPerformanceResults,
  },
] as const;

export function MingmingCasePage() {
  return (
    <article className="mingming-case">
      <section className="mm-hero" aria-labelledby="mingming-title">
        <div className="mm-hero-inner">
          <DetailBackLink fallback="/#case-studies" className="mm-back-link">
            <ArrowLeft aria-hidden="true" />
            返回重点经历
          </DetailBackLink>
          <div className="mm-hero-content">
            <p className="mm-hero-label">{heroContent.label}</p>
            <div className="mm-hero-company-intro">
              <h1 id="mingming-title">{heroContent.title}</h1>
              <p className="mm-hero-company-statement">{companyProfile.statement}</p>
              <div className="mm-hero-scale" aria-label="公司规模">
                <strong>{companyProfile.scale}</strong>
                <span>{companyProfile.scaleLabel}</span>
              </div>
              <p className="mm-hero-source">
                <a href={companyProfile.sourceUrl} target="_blank" rel="noreferrer">{companyProfile.sourceLabel}</a>
                <span>{companyProfile.sourceNote}</span>
              </p>
            </div>
            <div className="mm-hero-role-summary">
              <p className="mm-hero-role-label">MY ROLE &amp; SCOPE</p>
              <p className="mm-hero-identity">{heroContent.role}｜{heroContent.region}｜{heroContent.tenure}</p>
              <p className="mm-hero-subtitle">{heroContent.positioning}</p>
            </div>
            <dl className="mm-hero-results" aria-label="我直接负责或主导的量化成绩">
              {personalResults.map((result) => (
                <div key={result.label}>
                  <dt>{result.value}</dt>
                  <dd>
                    <strong>{result.label}</strong>
                    <span>{result.detail}</span>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <section id="mm-ai-video" className="mm-section mm-section-dark mm-video-section">
        <div className="mm-section-inner">
          <SectionHeading
            index="01"
            eyebrow={videoOverview.eyebrow}
            title={videoOverview.title}
            summary={videoOverview.background}
          />
          <div className="mm-video-brief">
            <span>我的完整链路</span>
            <p>{videoOverview.contribution}</p>
          </div>
          <div className="mm-video-list">
            {videoCases.map((video, index) => <VideoStory key={video.id} video={video} index={index} />)}
          </div>
        </div>
      </section>

      <section id="mm-ip-incubation" className="mm-section mm-section-light">
        <div className="mm-section-inner">
          <SectionHeading
            index="02"
            eyebrow="PEOPLE-POWERED IP"
            title={<span className="mm-section-title"><span>全民IP</span><span>孵化项目</span></span>}
            summary={incubationOverview.summary}
          />
          <dl className="mm-result-strip">
            {incubationMetrics.map((metric) => (
              <div key={metric.label}><dt>{metric.value}</dt><dd>{metric.label}</dd></div>
            ))}
          </dl>
          <div className="mm-ip-method" aria-label="IP孵化业务能力">
            {incubationOverview.capabilities.map((item, index) => (
              <div key={item.title}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{item.title}</strong>
                <p>{item.summary}</p>
              </div>
            ))}
          </div>

          <section className="mm-subsection" aria-labelledby="mm-douyin-heading">
            <div className="mm-subheading mm-subheading-split">
              <h3 id="mm-douyin-heading">账号增长</h3>
              <p>{incubationOverview.accountSummary}</p>
            </div>
            <ol className="mm-account-growth-flow" aria-label="账号增长完整链路">
              {accountGrowthFlow.map((stage, index) => (
                <li key={stage.title}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <strong>{stage.title}</strong>
                  <p>{stage.summary}</p>
                </li>
              ))}
            </ol>
            <dl className="mm-growth-summary" aria-label="账号增长核心成绩">
              {accountGrowthSummary.map((result) => (
                <div key={result.label}>
                  <dt>{result.value}</dt>
                  <dd>{result.label}</dd>
                </div>
              ))}
            </dl>
            <EvidenceFoldDeck decks={growthEvidenceDecks} defaultDeckId="account-growth-results" />
          </section>

          <section className="mm-subsection mm-performance" aria-labelledby="mm-performance-heading">
            <div className="mm-subheading mm-subheading-split">
              <h3 id="mm-performance-heading">直播与投放复盘</h3>
              <p>{reviewWorkflow.summary}</p>
            </div>
            <dl className="mm-review-metrics" aria-label="直播与投放复盘结果">
              {reviewWorkflow.metrics.map((metric) => (
                <div key={metric.label}>
                  <dt>{metric.value}</dt>
                  <dd>{metric.label}</dd>
                </div>
              ))}
            </dl>
            <div className="mm-performance-grid mm-performance-real">
              {performanceMedia.map((media) => <MediaCard key={media.id} media={media} />)}
            </div>
            <ol className="mm-review-loop">
              {reviewWorkflow.steps.map((step, index) => (
                <li key={step.title}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <strong>{step.title}</strong>
                  <p>{step.summary}</p>
                </li>
              ))}
            </ol>
          </section>

          <section className="mm-subsection" aria-labelledby="mm-training-heading">
            <div className="mm-subheading mm-subheading-split">
              <h3 id="mm-training-heading">培训与SOP：0→10k</h3>
              <p>{trainingSummary}</p>
            </div>
            <ol className="mm-training-path" aria-label="培训孵化四阶段">
              {incubationStages.map((stage, index) => (
                <li key={stage.title}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <strong>{stage.title}</strong>
                  <p>{stage.details}</p>
                </li>
              ))}
            </ol>
            <div className="mm-training-records">
              <div className="mm-evidence-heading">
                <h4>训练营记录</h4>
                <p>10场现场记录；拖动、滑动或使用方向键浏览。</p>
              </div>
              <Carousel
                items={trainingGallery}
                label="训练营记录"
                statusLabel="训练营"
                desktopPageSize={5}
                desktopColumns={5}
                renderItem={(media) => <EvidenceCard key={media.id} media={media} />}
              />
            </div>
          </section>

        </div>
      </section>

      <section id="mm-agent-development" className="mm-section mm-section-dark mm-agent-section">
        <div className="mm-section-inner">
          <SectionHeading
            index="03"
            eyebrow="HUMAN × AGENT"
            title={(
              <span className="mm-agent-title">
                <span>AI AGENT</span>
                <span>协作开发</span>
              </span>
            )}
            summary={agentOverview.summary}
          />

          <div className="mm-agent-projects">
            <AgentProject media={agentDevelopment} {...agentOverview.development} />
            <ol className="mm-agent-flow" aria-label="AI协作开发路径">
              {agentWorkflow.map((step, index) => (
                <li key={step}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <p>{step}</p>
                  {index < agentWorkflow.length - 1 && <ArrowRight aria-hidden="true" />}
                </li>
              ))}
            </ol>
            <AgentProject media={agentAutomation} {...agentOverview.automation} reverse />
          </div>

          <div className="mm-agent-capability-block">
            <div className="mm-agent-block-heading">
              <span>PROVEN CAPABILITIES</span>
              <h3>AI能力矩阵</h3>
              <p>只呈现当前项目代码、浏览器验收或真实工作流可以证明的能力。</p>
            </div>
            <ul className="mm-agent-capabilities">
              {agentCapabilities.map((capability, index) => (
                <li key={capability}><span>{String(index + 1).padStart(2, "0")}</span>{capability}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <footer className="mm-closing">
        <div className="mm-closing-inner">
          <p>从内容生产到IP增长，再到AI Agent协作开发，我把想法组织成可以交付、复盘和继续增长的项目。</p>
          <nav aria-label="案例后续操作">
            <DetailBackLink fallback="/#case-studies"><ArrowLeft aria-hidden="true" />返回重点经历</DetailBackLink>
            <PortfolioLink to="/cases/hengqian">查看下一个案例<ArrowRight aria-hidden="true" /></PortfolioLink>
            <PortfolioLink to="/#contact">联系我<ArrowRight aria-hidden="true" /></PortfolioLink>
          </nav>
        </div>
      </footer>
    </article>
  );
}
