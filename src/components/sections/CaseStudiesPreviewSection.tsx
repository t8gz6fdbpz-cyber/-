import { ArrowUpRight } from "lucide-react";

import { PortfolioLink } from "../../routing";
import { caseStudies } from "../../utils/caseStudies";
import { FadeIn } from "../ui/FadeIn";

const caseVisuals = {
  wujiahao: {
    label: "Local Life Engine",
    metric: "达人 / 直播 / 投流",
    points: ["IP孵化", "直播运营", "AI提效"],
  },
  hengqian: {
    label: "AI Persona Lab",
    metric: "IP / 数字人 / 内容流",
    points: ["人设定位", "平台内容", "数字人实验"],
  },
};

export function CaseStudiesPreviewSection() {
  return (
    <section
      id="case-studies"
      className="case-preview-section scroll-mt-8 px-5 py-24 sm:px-8 md:px-10 md:py-36"
    >
      <div className="mx-auto max-w-7xl">
        <FadeIn>
          <div className="case-preview-heading">
            <p>经历</p>
            <h2>重点经历</h2>
            <span>
              不把履历摊平成长篇说明，只留下两个最能说明我工作方式的项目入口。
            </span>
          </div>
        </FadeIn>

        <div className="case-preview-grid">
          {caseStudies.map((item, index) => (
            <FadeIn key={item.slug} delay={index * 0.08}>
              <PortfolioLink
                className="case-preview-card"
                to={`/cases/${item.slug}`}
                data-index={String(index + 1).padStart(2, "0")}
              >
                <div className="case-preview-card-content">
                  <div className="case-preview-card-top">
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <small>精选经历</small>
                  </div>
                  <div className="case-preview-card-main">
                    <h3>{item.title}</h3>
                    <p>{item.subtitle}</p>
                    <span>{item.summary}</span>
                  </div>
                  <div className="case-preview-keywords">
                    {item.keywords.map((keyword) => (
                      <em key={keyword}>{keyword}</em>
                    ))}
                  </div>
                  <strong>
                    查看经历
                    <ArrowUpRight aria-hidden="true" />
                  </strong>
                </div>

                <div className="case-preview-visual" aria-hidden="true">
                  <div className="case-visual-window">
                    <div className="case-visual-window-head">
                      <span>{caseVisuals[item.slug].label}</span>
                      <i />
                    </div>
                    <div className="case-visual-number">
                      {String(index + 1).padStart(2, "0")}
                    </div>
                    <p>{caseVisuals[item.slug].metric}</p>
                    <div className="case-visual-flow">
                      {caseVisuals[item.slug].points.map((point) => (
                        <span key={point}>{point}</span>
                      ))}
                    </div>
                    <div className="case-visual-bars">
                      <i />
                      <i />
                      <i />
                    </div>
                  </div>
                </div>
              </PortfolioLink>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
