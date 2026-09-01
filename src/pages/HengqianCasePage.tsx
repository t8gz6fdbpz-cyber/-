import { ArrowDown, ArrowLeft, ArrowRight, Play } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { useState, type ReactNode } from "react";

import { Carousel, FadeContent } from "../components/ui/ReactBitsEvidence";
import {
  aiEvidence,
  aiProduction,
  douyinEvidence,
  photography,
  productionFlow,
  responsibilities,
  wechatEvidence,
  xiaohongshuEvidence,
  type HengqianMedia,
} from "../data/hengqianCase";
import { DetailBackLink, PortfolioLink } from "../routing";

const productionPhases = ["定位与脚本", "采集与生成", "剪辑与分发", "赛马与迭代"].map(
  (title, index) => ({ title, steps: productionFlow.slice(index * 2, index * 2 + 2) }),
);

function EvidenceImage({
  item,
  eager = false,
  cover = false,
  className = "",
}: {
  item: HengqianMedia;
  eager?: boolean;
  cover?: boolean;
  className?: string;
}) {
  const ratio = item.width / item.height;
  const format = ratio >= 2.4 ? "ultra-wide" : ratio >= 1.15 ? "landscape" : "portrait";

  return (
    <figure className={`hq-evidence is-${format}${cover ? " is-cover" : ""} ${className}`.trim()}>
      <span
        className="hq-evidence-frame"
        style={cover ? undefined : { aspectRatio: `${item.width} / ${item.height}` }}
      >
        <img
          src={item.src}
          alt={item.alt}
          width={item.width}
          height={item.height}
          loading={eager ? "eager" : "lazy"}
          decoding="async"
          draggable="false"
        />
      </span>
    </figure>
  );
}

function SectionTitle({
  number,
  title,
  subtitle,
  children,
}: {
  number: string;
  title: string;
  subtitle: ReactNode;
  children: ReactNode;
}) {
  return (
    <header className="hq-section-title">
      <span>{number}</span>
      <div>
        <h2>{title}</h2>
        <p>{subtitle}</p>
      </div>
      <p>{children}</p>
    </header>
  );
}

function VideoPlaceholder({ label, src }: { label: string; src?: string }) {
  return (
    <div className="hq-video-wrap">
      <video
        controls
        playsInline
        preload="metadata"
        aria-label={label}
        src={src}
        style={src ? undefined : { display: "none" }}
      />
      <div className="hq-video-poster" aria-hidden="true">
        <Play />
        <span>{label}</span>
        <small>建议 MP4 / H.264 · 1080×1920</small>
      </div>
    </div>
  );
}

function PlatformCarousel({
  items,
  label,
  columns,
}: {
  items: HengqianMedia[];
  label: string;
  columns: number;
}) {
  return (
    <Carousel
      items={items}
      label={`${label}成果截图`}
      statusLabel={label}
      desktopPageSize={columns}
      desktopColumns={columns}
      mobilePageSize={2}
      phonePageSize={1}
      className="hq-media-carousel"
      renderItem={(item) => <EvidenceImage key={item.id} item={item} />}
    />
  );
}

export function HengqianCasePage() {
  const [platform, setPlatform] = useState<"wechat" | "xiaohongshu">("wechat");
  const reduceMotion = useReducedMotion();

  return (
    <article className="hengqian-case">
      <section className="hq-hero" aria-labelledby="hengqian-title">
        <div className="hq-shell">
          <DetailBackLink fallback="/#case-studies" className="hq-back">
            <ArrowLeft aria-hidden="true" />
            返回重点经历
          </DetailBackLink>

          <div className="hq-hero-grid">
            <motion.div
              className="hq-hero-copy"
              initial={reduceMotion ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="hq-case-label">CASE 02 / 02 <span>短视频编导 / IP制作人</span></p>
              <h1 id="hengqian-title">镜前时代</h1>
              <h2>独立完成“雅姐”IP 从真人内容、AI数字人生产到全平台分发与线索转化。</h2>
              <p>围绕女性创业与女性独立视角建立内容定位，通过视频号、小红书等平台获取目标客户，并承接至大健康知识付费产品。</p>
              <a href="#hq-ai" className="hq-anchor">查看生产系统<ArrowDown aria-hidden="true" /></a>
            </motion.div>

            <div className="hq-hero-visual">
              <EvidenceImage item={photography[0]} eager cover className="is-feature" />
              <span>真人拍摄 × 数字人采集</span>
            </div>
          </div>

          <dl className="hq-hero-results">
            <div><dt>1</dt><dd>人独立运营全平台</dd></div>
            <div><dt>958,610</dt><dd>代表性内容播放</dd></div>
            <div className="is-commercial"><dt>400+</dt><dd>单条视频最高留资</dd></div>
          </dl>
        </div>
      </section>

      <section id="hq-ai" className="hq-section">
        <div className="hq-shell">
          <SectionTitle
            number="01"
            title="AI数字人内容系统"
            subtitle={<>一个人完成从真实人物采集到全平台<span className="hq-no-break">内容赛马</span></>}
          >
            我负责定位、脚本、现场编导、数字人生成、剪辑、发布与数据复盘，把 AI 作为雅姐 IP 的稳定生产模式，而不是抽象概念。
          </SectionTitle>

          <div className="hq-keywords" aria-label="核心职责">
            {responsibilities.map((item) => <span key={item}>{item}</span>)}
          </div>

          <div className="hq-ai-production">
            <EvidenceImage item={aiProduction[0]} cover />
            <EvidenceImage item={aiProduction[1]} cover />
          </div>
          <div className="hq-ai-flow">
            <ol className="hq-flow" aria-label="AI数字人内容生产链">
              {productionPhases.map((phase, index) => (
                <li key={phase.title}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <strong>{phase.title}</strong>
                  <ul>
                    {phase.steps.map((step) => <li key={step}>{step}</li>)}
                  </ul>
                </li>
              ))}
            </ol>
            <p className="hq-race-note">同一选题或方向制作不同版本，在不同平台测试，比较播放、完播、互动、涨粉和留资，淘汰低表现版本，再复制高表现结构。</p>
          </div>

          <dl className="hq-metrics">
            <div><dt>2,922,509</dt><dd>代表内容播放量</dd></div>
            <div><dt>43.78%</dt><dd>完播率</dd></div>
            <div><dt>69.82 秒</dt><dd>平均播放时长</dd></div>
            <div><dt>75.69%</dt><dd>3秒以上播放率</dd></div>
          </dl>
          <p className="hq-data-note">代表性内容数据 / 以项目截图为准</p>

          <div className="hq-evidence-block">
            <div className="hq-block-heading">
              <h3>AI数字人内容证据</h3>
              <p>另一代表内容约 198.4k 播放、12.7k 点赞、1.6k 评论、1.1k 分享。</p>
            </div>
            <PlatformCarousel items={aiEvidence} label="AI数字人" columns={3} />
          </div>

          <div className="hq-video-feature">
            <VideoPlaceholder label="待替换：雅姐AI数字人代表成片" />
            <div className="hq-video-feature-copy">
              <span>代表成片位置</span>
              <h3>从真人采集到全平台赛马</h3>
              <p>真人素材采集 → AI数字人生成 → 多版本剪辑 → 全平台赛马</p>
              <div className="hq-video-proof" aria-label="AI数字人成片关联成果">
                <span>2,922,509 播放</span>
                <span>43.78% 完播率</span>
                <span>69.82 秒平均播放</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="hq-live-ip" className="hq-section">
        <div className="hq-shell">
          <SectionTitle number="02" title="真人大型IP制作" subtitle="从女性商业内容到大健康用户转化">
            “雅姐”以女性创业、女性独立、女性成长和商业认知为内容切口，获取目标用户，再通过后端产品与私域完成大健康知识付费转化。
          </SectionTitle>

          <div className="hq-photo-story">
            <EvidenceImage item={photography[1]} cover className="is-feature" />
            <EvidenceImage item={photography[0]} cover />
            <EvidenceImage item={photography[2]} cover className="is-portrait" />
          </div>

          <div className="hq-live-body">
            <div className="hq-live-copy">
              <h3>单人独立运营全平台</h3>
              <p>我负责 IP 定位、选题、脚本、短视频编导、拍摄统筹、现场执行、剪辑包装、视频号与小红书运营、数据复盘、线索获取及后端转化配合。</p>
            </div>
            <dl className="hq-metrics">
              <div><dt>958,610</dt><dd>视频号代表视频播放</dd></div>
              <div><dt>13,753</dt><dd>代表视频新增关注</dd></div>
              <div className="is-commercial"><dt>400+</dt><dd>单条视频最高留资</dd></div>
            </dl>
          </div>

          <div className="hq-platforms">
            <div className="hq-tabs" role="tablist" aria-label="真人IP平台成果">
              <button type="button" role="tab" id="hq-tab-wechat" aria-selected={platform === "wechat"} aria-controls="hq-tabpanel-wechat" onClick={() => setPlatform("wechat")}>视频号 <span>8</span></button>
              <button type="button" role="tab" id="hq-tab-xhs" aria-selected={platform === "xiaohongshu"} aria-controls="hq-tabpanel-xhs" onClick={() => setPlatform("xiaohongshu")}>小红书 <span>4</span></button>
            </div>

            <div className="hq-platform-panels">
              <FadeContent active={platform === "wechat"} id="hq-panel-wechat">
                <div id="hq-tabpanel-wechat" role="tabpanel" aria-labelledby="hq-tab-wechat">
                  <div className="hq-platform-summary">
                    <h3>视频号</h3>
                    <p>截图时关注人数 16,314。代表视频 958,610 播放、11,258 点赞、15,966 评论，并新增关注 13,753；另一公开界面显示约 95.8 万播放及万级互动。</p>
                  </div>
                  <PlatformCarousel items={wechatEvidence} label="视频号" columns={4} />
                </div>
              </FadeContent>

              <FadeContent active={platform === "xiaohongshu"} id="hq-panel-xhs">
                <div id="hq-tabpanel-xhs" role="tabpanel" aria-labelledby="hq-tab-xhs">
                  <div className="hq-platform-summary">
                    <h3>小红书</h3>
                    <p>截图时粉丝 3,989，获赞与收藏 1.5 万；代表笔记 8 万浏览、互动 3,979、单篇涨粉 1,313，公开数据超过大多数同类笔记。</p>
                  </div>
                  <PlatformCarousel items={xiaohongshuEvidence} label="小红书" columns={4} />
                </div>
              </FadeContent>
            </div>
          </div>

          <div className="hq-video-feature">
            <VideoPlaceholder label="待替换：雅姐真人IP代表成片" />
            <div className="hq-video-feature-copy">
              <span>代表成片位置</span>
              <h3>内容获取用户，后端承接转化</h3>
              <p>女性创业与女性独立视角 → 获取目标客户 → 承接大健康知识付费转化</p>
              <div className="hq-video-proof" aria-label="真人IP成片关联成果">
                <span>958,610 播放</span>
                <span>13,753 新增关注</span>
                <span>400+ 单条最高留资</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="hq-support" className="hq-section hq-support-section">
        <div className="hq-shell">
          <SectionTitle number="03" title="协助大型IP制作" subtitle="在成熟IP项目中完成短视频内容协作">
            我协助大型 IP 的短视频内容制作，并参与编导或制作环节；本节仅作为补充能力证明，不将账号全部成绩归因为个人。
          </SectionTitle>
          <p className="hq-pending">[待补：该项目中负责的具体编导、脚本、拍摄或剪辑分工]</p>
          <div className="hq-support-media">
            {douyinEvidence.map((item) => <EvidenceImage key={item.id} item={item} />)}
          </div>
        </div>
      </section>

      <footer className="hq-next">
        <div className="hq-shell">
          <div>
            <span>项目总结</span>
            <h2>我能把定位、生产、分发、复盘与线索转化，独立落到同一个 IP 上。</h2>
          </div>
          <nav aria-label="案例后续操作">
            <DetailBackLink fallback="/#case-studies"><ArrowLeft aria-hidden="true" />返回重点经历</DetailBackLink>
            <PortfolioLink to="/cases/mingming">查看上一个案例<ArrowRight aria-hidden="true" /></PortfolioLink>
          </nav>
        </div>
      </footer>
    </article>
  );
}
