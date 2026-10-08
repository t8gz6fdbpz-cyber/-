import { ArrowLeft } from "lucide-react";

import { DetailBackLink } from "../routing";
import { getCaseStudy } from "../utils/caseStudies";
import { MingmingCasePage } from "./MingmingCasePage";
import { HengqianCasePage } from "./HengqianCasePage";

export function CaseStudyPage({ slug }: { slug: string }) {
  if (slug === "wujiahao") {
    return <MingmingCasePage />;
  }

  if (slug === "hengqian") {
    return <HengqianCasePage />;
  }

  const study = getCaseStudy(slug);

  if (!study) {
    return (
      <section className="portfolio-page-shell">
        <div className="portfolio-page-header">
          <DetailBackLink
            fallback="/#case-studies"
            className="portfolio-back-link"
          >
            <ArrowLeft aria-hidden="true" />
            返回
          </DetailBackLink>
          <h1>Case not found</h1>
          <p>这个重点经历还没有建立。</p>
        </div>
      </section>
    );
  }

  return (
    <section className="case-study-page portfolio-page-shell">
      <div className="portfolio-page-header">
        <DetailBackLink
          fallback="/#case-studies"
          className="portfolio-back-link"
        >
          <ArrowLeft aria-hidden="true" />
          返回
        </DetailBackLink>
        <div>
          <p>重点经历</p>
          <h1>{study.title}</h1>
          <span>{study.subtitle}</span>
        </div>
        <p>{study.summary}</p>
      </div>

      <div className="case-skeleton-layout">
        <section className="case-skeleton-panel">
          <h2>模块列表</h2>
          <div className="case-module-chip-list">
            {study.modules.map((module) => (
              <span key={module}>{module}</span>
            ))}
          </div>
        </section>

        <section className="case-skeleton-panel">
          <h2>作品占位区</h2>
          <div className="case-placeholder-grid">
            <div>作品截图</div>
            <div>视频片段</div>
            <div>复盘记录</div>
          </div>
          <p className="case-later-note">这里先保留结构，后续补充真实作品、数据和过程说明。</p>
        </section>
      </div>
    </section>
  );
}
