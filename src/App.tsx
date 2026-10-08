import { BrowserRouter, Navigate, Route, Routes, useParams } from "react-router-dom";
import { lazy, Suspense, startTransition, useEffect, useState } from "react";

import { AboutSection } from "./components/sections/AboutSection";
import { CaseStudiesPreviewSection } from "./components/sections/CaseStudiesPreviewSection";
import { ContactSection } from "./components/sections/ContactSection";
import { HeroSection } from "./components/sections/HeroSection";
import { InterestsSection } from "./components/sections/InterestsSection";
import { MarqueeSection } from "./components/sections/MarqueeSection";
import { SkillsMatrixSection } from "./components/sections/ServicesSection";
import { FloatingEmailButton } from "./components/ui/FloatingEmailButton";
import { FloatingLogoNav } from "./components/ui/FloatingLogoNav";
import { RouteEffects } from "./routing";

const CaseStudyPage = lazy(() => import("./pages/CaseStudyPage").then(m => ({ default: m.CaseStudyPage })));
const InterestPage = lazy(() => import("./pages/InterestPage").then(m => ({ default: m.InterestPage })));
const ListPage = lazy(() => import("./pages/ListPage").then(m => ({ default: m.ListPage })));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage").then(m => ({ default: m.NotFoundPage })));
const WorksPage = lazy(() => import("./pages/WorksPage").then(m => ({ default: m.WorksPage })));

function HomePage({ initialTimestamp }: { initialTimestamp?: number }) {
  return (
    <>
      <HeroSection initialTimestamp={initialTimestamp} />
      <MarqueeSection />
      <AboutSection />
      <CaseStudiesPreviewSection />
      <SkillsMatrixSection />
      <InterestsSection />
      <ContactSection />
    </>
  );
}

function CaseStudyRoute() {
  const { slug = "" } = useParams();
  return <CaseStudyPage slug={slug} />;
}

function InterestRoute() {
  const { slug = "" } = useParams();
  return <InterestPage key={slug} slug={slug} />;
}

export function PortfolioApp({ initialTimestamp }: { initialTimestamp?: number }) {
  return (
    <main className="min-h-screen w-full max-w-[100vw] overflow-x-clip bg-[var(--color-bg)]">
      <FloatingLogoNav />
      <FloatingEmailButton />
      <Suspense fallback={<div className="route-loading" role="status">正在打开页面…</div>}>
      {typeof window !== "undefined" ? <RouteEffects /> : null}
      <Routes>
        <Route path="/" element={<HomePage initialTimestamp={initialTimestamp} />} />
        <Route path="/works" element={<WorksPage />} />
        <Route path="/about" element={<ListPage />} />
        <Route path="/list" element={<ListPage />} />
        <Route path="/cases/mingming" element={<Navigate replace to="/cases/wujiahao" />} />
        <Route path="/cases/:slug" element={<CaseStudyRoute />} />
        <Route path="/interests/:slug" element={<InterestRoute />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      </Suspense>
    </main>
  );
}

export default function App({ initialTimestamp }: { initialTimestamp?: number }) {
  const [hydrationTimestamp, setHydrationTimestamp] = useState(initialTimestamp);
  // Consume the static markup's clock only once. Later home visits use now.
  useEffect(() => {
    startTransition(() => setHydrationTimestamp(undefined));
  }, []);
  return (
    <BrowserRouter>
      <PortfolioApp initialTimestamp={hydrationTimestamp} />
    </BrowserRouter>
  );
}
