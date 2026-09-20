import { ArrowDown, ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";

import { DetailBackLink, PortfolioLink } from "../../routing";

const chapters = [
  ["sports", "运动"],
  ["travel", "旅行"],
  ["singing", "唱歌"],
  ["reading", "读书"],
] as const;

export function InterestPageFrame({
  active,
  children,
}: {
  active: (typeof chapters)[number][0];
  children: ReactNode;
}) {
  const activeIndex = chapters.findIndex(([slug]) => slug === active);
  const nextChapter = chapters[activeIndex + 1];
  const showClosingFooter = active === "reading";

  return (
    <section className={`life-page life-page--${active}`}>
      <header className="life-chrome">
        <DetailBackLink fallback="/#interests" className="life-back-link">
          <ArrowLeft aria-hidden="true" />
          返回兴趣
        </DetailBackLink>
        <nav className="life-chapter-nav" aria-label="兴趣章节">
          {chapters.map(([slug, label], index) => (
            <PortfolioLink
              key={slug}
              to={`/interests/${slug}`}
              aria-current={active === slug ? "page" : undefined}
            >
              <span>{String(index + 1).padStart(2, "0")}</span>
              {label}
            </PortfolioLink>
          ))}
        </nav>
      </header>
      {children}
      {showClosingFooter ? (
        <footer className="life-footer">
          <span>PERSONAL NOTES</span>
          <DetailBackLink fallback="/#interests">返回首页兴趣区</DetailBackLink>
        </footer>
      ) : null}
      {nextChapter ? (
        <aside
          className="life-next-chapter"
          aria-label={`下一章：${nextChapter[1]}`}
          data-interest-bottom-focus
          tabIndex={-1}
        >
          <div>
            <span>下一章</span>
            <small>已到页尾，继续向下滑动即可进入</small>
          </div>
          <PortfolioLink to={`/interests/${nextChapter[0]}`}>
            <span>{String(activeIndex + 2).padStart(2, "0")}</span>
            <strong>{nextChapter[1]}</strong>
            <ArrowDown aria-hidden="true" />
          </PortfolioLink>
        </aside>
      ) : null}
    </section>
  );
}
