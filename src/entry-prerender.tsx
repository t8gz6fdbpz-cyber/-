import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom";
import { PortfolioApp } from "./App";
import { formatDate, formatTime } from "./components/sections/HeroSection";

export function renderHome(timestamp: number) {
  return renderToString(
    <StaticRouter location="/">
      <PortfolioApp initialTimestamp={timestamp} />
    </StaticRouter>,
  );
}

// Refresh the live clock before hydration; avoid a stale build-time timestamp.
// Detail routes and reduced-motion visitors retain their original client render.
export function clockBootstrap() {
  return `<script>(() => {
    const root = document.getElementById('root');
    if (location.pathname !== '/' || matchMedia('(prefers-reduced-motion: reduce)').matches) {
      root.replaceChildren(); root.removeAttribute('data-prerendered'); return;
    }
    const formatDate = ${formatDate.toString()};
    const formatTime = ${formatTime.toString()};
    const now = new Date(); root.dataset.prerenderTime = String(now.getTime());
    root.querySelectorAll('#floating-logo-nav-panel a').forEach(link => {
      if (link.getAttribute('href') === location.pathname + location.hash) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
    const fields = root.querySelectorAll('.hero-cover-meta p');
    if (fields[1]) fields[1].textContent = formatDate(now);
    if (fields[2]) fields[2].textContent = formatTime(now);
  })();</script>`;
}
