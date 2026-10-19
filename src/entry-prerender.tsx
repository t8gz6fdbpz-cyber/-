import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom";
import { PortfolioApp } from "./App";
import { formatDate, formatTime } from "./components/sections/HeroSection";
import { MOTION_STORAGE_KEY, normalizeMotionChoice, resolveMotionPreference } from "./motion/motionModel";

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
    const normalizeChoice = ${normalizeMotionChoice.toString()};
    const resolvePreference = ${resolveMotionPreference.toString()};
    let storedChoice;
    try { storedChoice = localStorage.getItem('${MOTION_STORAGE_KEY}'); } catch {}
    const choice = normalizeChoice(storedChoice);
    const state = resolvePreference(choice, matchMedia('(prefers-reduced-motion: reduce)').matches, new URLSearchParams(location.search).get('motion') === 'reduce');
    document.documentElement.dataset.motion = state.reduced ? 'reduce' : 'full';
    document.documentElement.dataset.motionPreference = choice;
    document.documentElement.dataset.motionSource = state.source;
    if (location.pathname !== '/' || state.reduced) {
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
