import { ArrowLeft, ArrowRight } from "lucide-react";
import { useState, type ReactNode } from "react";

import {
  agentAutomation,
  agentCapabilities,
  agentDevelopment,
  agentOverview,
  agentWorkflow,
  douyinAccounts,
  executiveResults,
  heroContent,
  heroMetrics,
  incubationMetrics,
  incubationOverview,
  incubationStages,
  performanceMedia,
  reviewWorkflow,
  talentResults,
  trainingGallery,
  trainingSummary,
  videoCases,
  videoOverview,
  type MingmingAccount,
  type MingmingEvidence,
  type MingmingMedia,
  type MingmingVideo,
} from "../data/mingmingCase";
import { Carousel, FadeContent } from "../components/ui/ReactBitsEvidence";
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

function AccountCard({ account, eager = false }: {
  account: MingmingAccount;
  eager?: boolean;
}) {
  return (
    <figure className="mm-account-card">
      <div className="mm-account-image">
        <img
          src={account.src}
          alt={account.alt}
          width={account.width}
          height={account.height}
          loading={eager ? "eager" : "lazy"}
          decoding="async"
          draggable="false"
        />
      </div>
      <figcaption>
        <span>粉丝 {account.followersLabel}</span>
      </figcaption>
    </figure>
  );
}

function EvidenceCard({ media }: {
  media: MingmingEvidence;
}) {
  const isLandscape = media.group === "training" || media.group === "automation" || media.group === "development";

  return (
    <figure
      className={`mm-evidence-card${isLandscape ? " is-landscape" : " is-portrait"}`}
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
      {media.group === "training" && (
        <figcaption className="mm-evidence-caption">
          <strong>{media.title}</strong>
        </figcaption>
      )}
    </figure>
  );
}

function VideoStory({ video, index }: { video: MingmingVideo; index: number }) {
  return (
    <article className={`mm-video-story${index % 2 ? " is-reversed" : ""}`}>
      <div className="mm-video-copy">
        <p className="mm-kicker">{video.label}</p>
        <h3>{video.title}</h3>
        <p>{video.intro}</p>
      </div>
      <figure className="mm-video-column">
        <div className="mm-video-frame">
          {video.videoSrc ? (
            <video controls playsInline preload="metadata" src={video.videoSrc} poster={video.poster} aria-label={`${video.title}视频播放器`} />
          ) : (
            <img src={video.poster} alt={video.alt} width={video.width} height={video.height} loading={index === 0 ? "eager" : "lazy"} decoding="async" />
          )}
          <span className="mm-video-badge">{video.caption}</span>
        </div>
      </figure>
      <ul className="mm-video-points">
        {video.insights.map((insight) => <li key={insight}>{insight}</li>)}
      </ul>
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

export function MingmingCasePage() {
  const [evidenceType, setEvidenceType] = useState<"talent" | "executive">("talent");
  const [executiveType, setExecutiveType] = useState<"profile" | "video">("profile");
  const sortedAccounts = [...douyinAccounts].sort((left, right) => {
    if (left.followers === null) return right.followers === null
      ? left.originalIndex - right.originalIndex
      : 1;
    if (right.followers === null) return -1;
    return right.followers - left.followers || left.originalIndex - right.originalIndex;
  });
  const executiveProfiles = executiveResults.filter((media) => media.group === "executive-profile");
  const executiveVideos = executiveResults.filter((media) => media.group === "executive-video");

  return (
    <article className="mingming-case">
      <section className="mm-hero" aria-labelledby="mingming-title">
        <div className="mm-hero-inner">
          <DetailBackLink fallback="/#case-studies" className="mm-back-link">
            <ArrowLeft aria-hidden="true" />
            返回重点经历
          </DetailBackLink>
          <div className="mm-hero-grid">
            <p className="mm-hero-label">{heroContent.label}</p>
            <h1 id="mingming-title">{heroContent.title}</h1>
            <p className="mm-hero-subtitle">{heroContent.positioning}</p>
          </div>
          <dl className="mm-metric-grid">
            {heroMetrics.map((metric) => (
              <div key={metric.label}>
                <dt>{metric.value}</dt>
                <dd>{metric.label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section id="mm-ai-video" className="mm-section mm-section-dark mm-video-section">
        <div className="mm-section-inner">
          <SectionHeading
            index="01"
            eyebrow="AI LONG-FORM VIDEO"
            title="AI长视频项目制作"
            summary={videoOverview}
          />
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
            <div className="mm-account-wall">
              {sortedAccounts.map((account, index) => (
                <AccountCard key={account.id} account={account} eager={index < 6} />
              ))}
            </div>
            <p className="mm-account-conclusion">{incubationOverview.accountConclusion}</p>
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

          <section className="mm-subsection mm-evidence-library" aria-labelledby="mm-evidence-library-heading">
            <div className="mm-subheading mm-subheading-split">
              <h3 id="mm-evidence-library-heading">IP成绩证据库</h3>
              <p>{incubationOverview.evidenceSummary}</p>
            </div>
            <div className="mm-evidence-tabs" role="tablist" aria-label="IP 成绩分类">
              <button
                type="button"
                role="tab"
                id="mm-tab-talent"
                aria-selected={evidenceType === "talent"}
                aria-controls="mm-panel-talent"
                tabIndex={evidenceType === "talent" ? 0 : -1}
                onClick={() => setEvidenceType("talent")}
              >
                普通达人成绩 <span>17</span>
              </button>
              <button
                type="button"
                role="tab"
                id="mm-tab-executive"
                aria-selected={evidenceType === "executive"}
                aria-controls="mm-panel-executive"
                tabIndex={evidenceType === "executive" ? 0 : -1}
                onClick={() => setEvidenceType("executive")}
              >
                高管 IP 成绩 <span>13</span>
              </button>
            </div>

            <div className="mm-evidence-panels">
              <FadeContent active={evidenceType === "talent"} id="mm-panel-talent">
                <div role="tabpanel" aria-labelledby="mm-tab-talent">
                  <div className="mm-evidence-panel-heading">
                    <h4>普通达人成绩</h4>
                    <p>17 张公开账号结果，桌面端分为 9 张与 8 张两页。</p>
                  </div>
                  <Carousel
                    items={talentResults}
                    label="普通达人成绩"
                    statusLabel="普通达人"
                    desktopPageSize={9}
                    desktopColumns={5}
                    renderItem={(media) => <EvidenceCard key={media.id} media={media} />}
                  />
                </div>
              </FadeContent>

              <FadeContent active={evidenceType === "executive"} id="mm-panel-executive">
                <div role="tabpanel" aria-labelledby="mm-tab-executive">
                  <div className="mm-evidence-panel-heading">
                    <h4 id="mm-executive-heading">高管 IP 孵化</h4>
                    <p>聚焦高管定位、内容表达与公开结果证据。</p>
                  </div>
                  <div className="mm-evidence-subtabs" role="tablist" aria-label="高管 IP 成绩分类">
                    <button
                      type="button"
                      role="tab"
                      id="mm-tab-executive-profile"
                      aria-selected={executiveType === "profile"}
                      aria-controls="mm-panel-executive-profile"
                      tabIndex={executiveType === "profile" ? 0 : -1}
                      onClick={() => setExecutiveType("profile")}
                    >
                      账号主页与内容主页 <span>4</span>
                    </button>
                    <button
                      type="button"
                      role="tab"
                      id="mm-tab-executive-video"
                      aria-selected={executiveType === "video"}
                      aria-controls="mm-panel-executive-video"
                      tabIndex={executiveType === "video" ? 0 : -1}
                      onClick={() => setExecutiveType("video")}
                    >
                      单条视频数据 <span>9</span>
                    </button>
                  </div>
                  <div className="mm-executive-panels">
                    <FadeContent active={executiveType === "profile"} id="mm-panel-executive-profile">
                      <div role="tabpanel" aria-labelledby="mm-tab-executive-profile">
                        <Carousel
                          items={executiveProfiles}
                          label="高管账号主页与内容主页"
                          statusLabel="高管主页"
                          desktopPageSize={4}
                          desktopColumns={4}
                          renderItem={(media) => <EvidenceCard key={media.id} media={media} />}
                        />
                      </div>
                    </FadeContent>
                    <FadeContent active={executiveType === "video"} id="mm-panel-executive-video">
                      <div role="tabpanel" aria-labelledby="mm-tab-executive-video">
                        <Carousel
                          items={executiveVideos}
                          label="高管单条视频数据"
                          statusLabel="高管视频数据"
                          desktopPageSize={5}
                          desktopColumns={5}
                          renderItem={(media) => <EvidenceCard key={media.id} media={media} />}
                        />
                      </div>
                    </FadeContent>
                  </div>
                </div>
              </FadeContent>
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
