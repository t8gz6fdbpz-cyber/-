import { ArrowLeft } from "lucide-react";

import { MarqueeSection } from "../components/sections/MarqueeSection";

export function WorksPage() {
  return (
    <>
      <section className="works-page-intro portfolio-page-shell">
        <div className="portfolio-page-header">
          <a href="/" className="portfolio-back-link">
            <ArrowLeft aria-hidden="true" />
            返回首页
          </a>
          <div>
            <p>作品</p>
            <h1>作品长廊</h1>
            <span>项目、视觉、内容和实验的归档入口。</span>
          </div>
          <p>
            保留原来的动态作品长廊。这个页面先作为作品入口，不展开复杂项目说明。
          </p>
        </div>
      </section>
      <MarqueeSection />
    </>
  );
}
