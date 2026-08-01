import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useLayoutEffect, useState } from "react";

import { AboutSection } from "./components/sections/AboutSection";
import { CaseStudiesPreviewSection } from "./components/sections/CaseStudiesPreviewSection";
import { ContactSection } from "./components/sections/ContactSection";
import { HeroSection } from "./components/sections/HeroSection";
import { InterestsSection } from "./components/sections/InterestsSection";
import { MarqueeSection } from "./components/sections/MarqueeSection";
import { SkillsMatrixSection } from "./components/sections/ServicesSection";
import { FloatingLogoNav } from "./components/ui/FloatingLogoNav";
import { CaseStudyPage } from "./pages/CaseStudyPage";
import { ListPage } from "./pages/ListPage";
import { WorksPage } from "./pages/WorksPage";

type PortfolioRoute = {
  hash: string;
  pathname: string;
  search: string;
};

let hashScrollRequestId = 0;

const cancelPendingHashScroll = () => {
  hashScrollRequestId += 1;
};

const scrollHomeToTopImmediately = () => {
  if (
    typeof window === "undefined" ||
    window.location.pathname !== "/" ||
    window.location.hash
  ) {
    return;
  }

  const root = document.documentElement;
  const previousScrollBehavior = root.style.scrollBehavior;
  root.style.scrollBehavior = "auto";
  window.scrollTo(0, 0);
  root.scrollTop = 0;
  document.body.scrollTop = 0;
  root.style.scrollBehavior = previousScrollBehavior;
};

const getCurrentRoute = (): PortfolioRoute =>
  typeof window === "undefined"
    ? { hash: "", pathname: "/", search: "" }
    : {
        hash: window.location.hash,
        pathname: window.location.pathname,
        search: window.location.search,
      };

const getInitialRoute = (): PortfolioRoute => {
  const route = getCurrentRoute();

  if (
    typeof window !== "undefined" &&
    "scrollRestoration" in window.history
  ) {
    window.history.scrollRestoration = "manual";
  }

  if (
    typeof window !== "undefined" &&
    route.pathname === "/" &&
    route.hash === "#skills"
  ) {
    window.history.replaceState({}, "", `${route.pathname}${route.search}`);
    scrollHomeToTopImmediately();
    return { ...route, hash: "" };
  }

  return route;
};

const scrollToHash = (hash: string, behavior: ScrollBehavior = "smooth") => {
  if (!hash) return;

  const requestId = ++hashScrollRequestId;
  const targetId = hash.replace(/^#/, "");
  const delays = [0, 120, 320, 640, 1040];

  const scrollToTarget = (target: Element, scrollBehavior: ScrollBehavior) => {
    const top =
      target.getBoundingClientRect().top + window.scrollY - 28;

    window.scrollTo({
      top: Math.max(0, top),
      behavior: scrollBehavior,
    });
  };

  delays.forEach((delay, index) => {
    window.setTimeout(() => {
      if (
        requestId !== hashScrollRequestId ||
        window.location.hash !== hash
      ) {
        return;
      }

      const target =
        document.getElementById(targetId) ?? document.querySelector(hash);

      if (target) {
        scrollToTarget(target, index === 0 ? behavior : "auto");
      }
    }, delay);
  });
};

function HomePage() {
  return (
    <>
      <HeroSection />
      <MarqueeSection />
      <AboutSection />
      <CaseStudiesPreviewSection />
      <SkillsMatrixSection />
      <InterestsSection />
      <ContactSection />
    </>
  );
}

export default function App() {
  const [route, setRoute] = useState(getInitialRoute);
  const path = route.pathname;

  useLayoutEffect(() => {
    const resetInitialHomeScroll = () => {
      cancelPendingHashScroll();
      scrollHomeToTopImmediately();
    };
    const handlePageShow = () => {
      resetInitialHomeScroll();
      window.requestAnimationFrame(resetInitialHomeScroll);
    };

    resetInitialHomeScroll();
    const frameId = window.requestAnimationFrame(resetInitialHomeScroll);
    const timeoutId = window.setTimeout(resetInitialHomeScroll, 120);
    window.addEventListener("pageshow", handlePageShow);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.clearTimeout(timeoutId);
      window.removeEventListener("pageshow", handlePageShow);
    };
  }, []);

  useEffect(() => {
    const handleRouteChange = () => {
      const nextRoute = getCurrentRoute();
      cancelPendingHashScroll();
      setRoute(nextRoute);
      scrollToHash(nextRoute.hash);

      if (!nextRoute.hash && nextRoute.pathname === "/") {
        scrollHomeToTopImmediately();
      }
    };

    const handleDocumentClick = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const target = event.target as Element | null;
      const anchor = target?.closest("a[href]") as HTMLAnchorElement | null;

      if (!anchor || anchor.target || anchor.hasAttribute("download")) {
        return;
      }

      const href = anchor.getAttribute("href");

      if (!href || href.startsWith("mailto:") || href.startsWith("tel:")) {
        return;
      }

      const url = new URL(anchor.href, window.location.href);

      if (url.origin !== window.location.origin) {
        return;
      }

      const isPortfolioRoute =
        url.pathname === "/" ||
        url.pathname === "/works" ||
        url.pathname === "/about" ||
        url.pathname === "/list" ||
        url.pathname.startsWith("/cases/");

      if (!isPortfolioRoute) {
        return;
      }

      event.preventDefault();
      cancelPendingHashScroll();

      const next = `${url.pathname}${url.search}${url.hash}`;
      window.history.pushState({}, "", next);
      setRoute(getCurrentRoute());

      if (url.hash) {
        scrollToHash(url.hash);
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    };

    window.addEventListener("popstate", handleRouteChange);
    document.addEventListener("click", handleDocumentClick);

    return () => {
      cancelPendingHashScroll();
      window.removeEventListener("popstate", handleRouteChange);
      document.removeEventListener("click", handleDocumentClick);
    };
  }, []);

  useEffect(() => {
    cancelPendingHashScroll();

    if (route.hash) {
      scrollToHash(route.hash, "auto");
      return cancelPendingHashScroll;
    }

    if (path === "/") {
      scrollHomeToTopImmediately();
      const frameId = window.requestAnimationFrame(() => {
        if (!window.location.hash && window.location.pathname === "/") {
          scrollHomeToTopImmediately();
        }
      });

      return () => {
        window.cancelAnimationFrame(frameId);
        cancelPendingHashScroll();
      };
    }

    return cancelPendingHashScroll;
  }, [path, route.hash]);

  const routeKey = path.startsWith("/cases/") ? path : path || "/";

  const page =
    path === "/works" ? (
      <WorksPage />
    ) : path === "/about" || path === "/list" ? (
      <ListPage />
    ) : path.startsWith("/cases/") ? (
      <CaseStudyPage slug={path.replace("/cases/", "")} />
    ) : (
      <HomePage />
    );

  return (
    <main className="min-h-screen w-full max-w-[100vw] overflow-x-clip bg-[var(--color-bg)]">
      <FloatingLogoNav />
      <AnimatePresence mode="wait">
        <motion.div
          key={routeKey}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
        >
          {page}
        </motion.div>
      </AnimatePresence>
    </main>
  );
}
