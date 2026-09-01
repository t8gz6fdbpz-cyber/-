import { ArrowLeft } from "lucide-react";

import { PortfolioLink } from "../routing";

export function NotFoundPage() {
  return (
    <section className="portfolio-page-shell">
      <div className="portfolio-page-header">
        <PortfolioLink to="/" className="portfolio-back-link">
          <ArrowLeft aria-hidden="true" />
          返回首页
        </PortfolioLink>
        <div>
          <p>404</p>
          <h1>页面不存在</h1>
          <span>这个地址没有对应的作品集页面。</span>
        </div>
      </div>
    </section>
  );
}
