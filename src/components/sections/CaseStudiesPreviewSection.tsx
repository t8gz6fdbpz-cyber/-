import { PortfolioLink } from "../../routing";
import { caseStudies } from "../../utils/caseStudies";
import { FadeIn } from "../ui/FadeIn";
import "./CaseStudiesPreviewSection.css";

const companyDetails = {
  wujiahao: {
    introduction: "旗下拥有零食很忙、赵一鸣零食两大品牌，构建覆盖全国的量贩零食门店网络。",
    role: "抖音制作人",
  },
  hengqian: {
    introduction: "IP 孵化与内容制作，涵盖真人短视频、AI 数字人与多平台内容运营。",
    role: "短视频编导 / IP制作人 / AI数字人内容运营",
  },
};

export function CaseStudiesPreviewSection() {
  return (
    <section
      id="case-studies"
      className="experience-preview"
    >
      <div className="experience-preview-inner">
        <FadeIn>
          <div className="experience-preview-heading">
            <h2>重点经历</h2>
            <span>
              不把履历摊平成长篇说明，只留下两个最能说明我工作方式的项目入口。
            </span>
          </div>
        </FadeIn>

        <div className="experience-card-grid">
          {caseStudies.map((item, index) => (
            <FadeIn key={item.slug} className="experience-card-slot" delay={index * 0.08} y={12}>
              <PortfolioLink
                className="experience-card"
                to={`/cases/${item.slug}`}
                aria-label={`查看${item.title}工作经历`}
              >
                <h3 className="experience-company-name">{item.title}</h3>
                <p className="experience-company-intro">{companyDetails[item.slug].introduction}</p>
                <p className="experience-company-role">{companyDetails[item.slug].role}</p>
              </PortfolioLink>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
