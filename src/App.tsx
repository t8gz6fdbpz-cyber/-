import { BrowserRouter, Route, Routes, useParams } from "react-router-dom";

import { AboutSection } from "./components/sections/AboutSection";
import { CaseStudiesPreviewSection } from "./components/sections/CaseStudiesPreviewSection";
import { ContactSection } from "./components/sections/ContactSection";
import { HeroSection } from "./components/sections/HeroSection";
import { InterestsSection } from "./components/sections/InterestsSection";
import { MarqueeSection } from "./components/sections/MarqueeSection";
import { SkillsMatrixSection } from "./components/sections/ServicesSection";
import { FloatingLogoNav } from "./components/ui/FloatingLogoNav";
import { CaseStudyPage } from "./pages/CaseStudyPage";
import { InterestPage } from "./pages/InterestPage";
import { ListPage } from "./pages/ListPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { WorksPage } from "./pages/WorksPage";
import { RouteEffects } from "./routing";

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

function CaseStudyRoute() {
  const { slug = "" } = useParams();
  return <CaseStudyPage slug={slug} />;
}

function InterestRoute() {
  const { slug = "" } = useParams();
  return <InterestPage slug={slug} />;
}

function PortfolioApp() {
  return (
    <main className="min-h-screen w-full max-w-[100vw] overflow-x-clip bg-[var(--color-bg)]">
      <RouteEffects />
      <FloatingLogoNav />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/works" element={<WorksPage />} />
        <Route path="/about" element={<ListPage />} />
        <Route path="/list" element={<ListPage />} />
        <Route path="/cases/:slug" element={<CaseStudyRoute />} />
        <Route path="/interests/:slug" element={<InterestRoute />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </main>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <PortfolioApp />
    </BrowserRouter>
  );
}
