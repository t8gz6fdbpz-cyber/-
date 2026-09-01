import { ArrowLeft, ArrowUpRight } from "lucide-react";

import { DetailBackLink, PortfolioLink } from "../routing";
import { getInterest } from "../utils/interestsData";

export function InterestPage({ slug }: { slug: string }) {
  const interest = getInterest(slug);

  if (!interest) {
    return (
      <section className="portfolio-page-shell">
        <div className="portfolio-page-header">
          <DetailBackLink
            fallback="/#interests"
            className="portfolio-back-link"
          >
            <ArrowLeft aria-hidden="true" />
            返回
          </DetailBackLink>
          <h1>Interest not found</h1>
          <p>这个兴趣页面还没有建立。</p>
        </div>
      </section>
    );
  }

  return (
    <section className="interest-detail-page portfolio-page-shell">
      <div className="interest-detail-layout">
        <div className="interest-detail-copy">
          <DetailBackLink
            fallback="/#interests"
            className="portfolio-back-link"
          >
            <ArrowLeft aria-hidden="true" />
            返回
          </DetailBackLink>
          <p className="interest-detail-kicker">
            {interest.number} / {interest.category}
          </p>
          <h1>{interest.title}</h1>
          <p>{interest.description}</p>
          <span>{interest.detail}</span>
          <PortfolioLink to="/#contact" className="interest-detail-contact">
            和我聊聊
            <ArrowUpRight aria-hidden="true" />
          </PortfolioLink>
        </div>

        <figure className="interest-detail-media">
          <img src={interest.image} alt={interest.imageAlt} />
        </figure>
      </div>
    </section>
  );
}
