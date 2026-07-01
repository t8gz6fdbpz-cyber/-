import { AboutSection } from "./components/sections/AboutSection";
import { ContactSection } from "./components/sections/ContactSection";
import { FinalStatementSection } from "./components/sections/FinalStatementSection";
import { GrowthSystemsSection } from "./components/sections/GrowthSystemsSection";
import { HeroSection } from "./components/sections/HeroSection";
import { MarqueeSection } from "./components/sections/MarqueeSection";
import { PhilosophySection } from "./components/sections/PhilosophySection";
import { ProjectsSection } from "./components/sections/ProjectsSection";
import { SkillsMatrixSection } from "./components/sections/ServicesSection";

export default function App() {
  return (
    <main className="min-h-screen w-full max-w-[100vw] overflow-x-clip bg-[var(--color-bg)]">
      <HeroSection />
      <MarqueeSection />
      <AboutSection />
      <GrowthSystemsSection />
      <SkillsMatrixSection />
      <ProjectsSection />
      <PhilosophySection />
      <ContactSection />
      <FinalStatementSection />
    </main>
  );
}
