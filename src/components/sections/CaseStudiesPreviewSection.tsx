import { PortfolioLink } from "../../routing";
import { caseStudies } from "../../utils/caseStudies";
import { FadeIn } from "../ui/FadeIn";
import { ViewportImage } from "../ui/ViewportImage";
import "./CaseStudiesPreviewSection.css";

const companyDetails = {
  wujiahao: {
    introduction: "旗下拥有零食很忙、赵一鸣零食两大品牌，构建覆盖全国的量贩零食门店网络。",
    department: "招商新媒体部门",
    role: "抖音制作人",
    tenure: "2025年3月-2026年9月",
    artwork: {
      src: "/assets/mingming-brand-mascots.webp",
      alt: "鸣鸣很忙旗下零食很忙与赵一鸣零食的品牌吉祥物",
      width: 562,
      height: 874,
    },
  },
  hengqian: {
    introduction: "IP 孵化与内容制作，涵盖真人短视频、AI 数字人与多平台内容运营。",
    department: "",
    role: "IP运营",
    tenure: "2024年4月-2025年2月",
    artwork: {
      src: "/assets/hengqian-filming-card.webp",
      alt: "镜前时代拍摄现场，摄影机、三脚架与灯光设备",
      width: 900,
      height: 1200,
    },
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
            <div className="experience-preview-heading-description">
              <p>从IP孵化与内容运营，到品牌短视频策划与AI影像创作，我始终在探索创意、技术与商业价值的结合。</p>
              <p>两段职业经历，让我逐步建立起从内容策略、创意策划到实际落地的完整能力。</p>
            </div>
          </div>
        </FadeIn>

        <div className="experience-card-grid">
          {caseStudies.map((item, index) => (
            <FadeIn key={item.slug} className="experience-card-slot" delay={index * 0.08} y={12}>
              <PortfolioLink
                className={`experience-card experience-card--image${item.slug === "hengqian" ? " experience-card--photo" : ""}`}
                to={`/cases/${item.slug}`}
                aria-label={`查看${item.title}工作经历`}
              >
                <ViewportImage
                  className="experience-card-artwork"
                  {...companyDetails[item.slug].artwork}
                  draggable={false}
                />
                <h3 className="experience-company-name">{item.title}</h3>
                <p className="experience-company-intro">{companyDetails[item.slug].introduction}</p>
                <div className="experience-company-role">
                  {companyDetails[item.slug].department && <span className="experience-company-department">{companyDetails[item.slug].department}</span>}
                  <strong>{companyDetails[item.slug].role}</strong>
                  <span className="experience-company-tenure">{companyDetails[item.slug].tenure}</span>
                </div>
              </PortfolioLink>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
