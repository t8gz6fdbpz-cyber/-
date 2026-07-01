import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import {
  type CSSProperties,
  type PointerEvent,
  useRef,
  useState,
} from "react";

import { FadeIn } from "../ui/FadeIn";
import { LiveProjectButton } from "../ui/LiveProjectButton";
import { projects, type Project } from "../../utils/portfolioData";

const particles = [
  { left: "8%", top: "18%", size: 3, delay: "-2.2s", duration: "9s" },
  { left: "19%", top: "72%", size: 4, delay: "-5.8s", duration: "12s" },
  { left: "31%", top: "39%", size: 2, delay: "-7.1s", duration: "10s" },
  { left: "48%", top: "14%", size: 3, delay: "-1.4s", duration: "11s" },
  { left: "62%", top: "67%", size: 2, delay: "-4.7s", duration: "8s" },
  { left: "73%", top: "27%", size: 4, delay: "-8.3s", duration: "13s" },
  { left: "87%", top: "78%", size: 3, delay: "-3.6s", duration: "10s" },
  { left: "92%", top: "43%", size: 2, delay: "-6.5s", duration: "9s" },
];

const sceneAccents = ["255 209 117", "138 90 24", "7 6 4"];

function ProjectCard({
  index,
  project,
  totalCards,
}: {
  index: number;
  project: Project;
  totalCards: number;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [isActive, setIsActive] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "end 0.2"],
  });
  const targetScale = 1 - (totalCards - 1 - index) * 0.03;
  const animatedScale = useTransform(
    scrollYProgress,
    [0, 1],
    [1, targetScale],
  );
  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);
  const hoverScale = useMotionValue(1);
  const hoverDepth = useMotionValue(0);
  const lightX = useMotionValue(50);
  const lightY = useMotionValue(42);
  const lightOpacity = useMotionValue(0.12);
  const springConfig = { stiffness: 120, damping: 24, mass: 0.9 };
  const rotateX = useSpring(tiltX, springConfig);
  const rotateY = useSpring(tiltY, springConfig);
  const sceneScale = useSpring(hoverScale, springConfig);
  const sceneDepth = useSpring(hoverDepth, springConfig);
  const highlightOpacity = useSpring(lightOpacity, {
    stiffness: 100,
    damping: 22,
  });
  const backgroundX = useTransform(rotateY, [-6, 6], [-3, 3]);
  const backgroundY = useTransform(rotateX, [-4, 4], [-2, 2]);
  const midgroundX = useTransform(rotateY, [-6, 6], [-7, 7]);
  const midgroundY = useTransform(rotateX, [-4, 4], [-5, 5]);
  const foregroundX = useTransform(rotateY, [-6, 6], [-13, 13]);
  const foregroundY = useTransform(rotateX, [-4, 4], [-9, 9]);
  const specularHighlight = useMotionTemplate`radial-gradient(circle at ${lightX}% ${lightY}%, rgba(255,209,117,0.28) 0%, rgba(255,209,117,0.1) 16%, rgba(255,209,117,0) 44%)`;
  const stackStyle = {
    "--stack-offset": `${index * 28}px`,
    "--scene-accent": sceneAccents[index % sceneAccents.length],
    zIndex: index + 1,
  } as CSSProperties;

  const resetInteraction = () => {
    setIsActive(false);
    tiltX.set(0);
    tiltY.set(0);
    hoverScale.set(1);
    hoverDepth.set(0);
    lightX.set(50);
    lightY.set(42);
    lightOpacity.set(0.12);
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (shouldReduceMotion || event.pointerType !== "mouse") return;

    setIsActive(true);
    hoverScale.set(1.015);
    hoverDepth.set(10);
    lightOpacity.set(0.28);

    const bounds = event.currentTarget.getBoundingClientRect();
    const relativeX = (event.clientX - bounds.left) / bounds.width;
    const relativeY = (event.clientY - bounds.top) / bounds.height;

    tiltX.set((0.5 - relativeY) * 8);
    tiltY.set((relativeX - 0.5) * 12);
    lightX.set(relativeX * 100);
    lightY.set(relativeY * 100);
  };

  const activateInteraction = () => {
    if (shouldReduceMotion) return;
    setIsActive(true);
    hoverScale.set(1.015);
    hoverDepth.set(10);
    lightOpacity.set(0.28);
  };

  return (
    <>
      <motion.article
        data-project-card={project.number}
        style={{
          scale: shouldReduceMotion ? 1 : animatedScale,
          transformOrigin: "top center",
          ...stackStyle,
        }}
        className="project-card-stage sticky top-[calc(4rem+var(--stack-offset))] [perspective:1200px] md:top-[calc(6rem+var(--stack-offset))]"
      >
        <motion.div
          data-active={isActive}
          className="project-card-surface group relative overflow-hidden rounded-[40px] border border-white/[0.15] bg-[#102a40] p-4 sm:rounded-[50px] sm:p-6 md:rounded-[60px] md:p-8"
          style={{
            rotateX: shouldReduceMotion ? 0 : rotateX,
            rotateY: shouldReduceMotion ? 0 : rotateY,
            scale: shouldReduceMotion ? 1 : sceneScale,
            z: shouldReduceMotion ? 0 : sceneDepth,
            transformStyle: "preserve-3d",
          }}
          onPointerEnter={activateInteraction}
          onPointerMove={handlePointerMove}
          onPointerLeave={resetInteraction}
          onFocusCapture={activateInteraction}
          onBlurCapture={resetInteraction}
        >
          <motion.div
            aria-hidden="true"
            className="project-scene-background absolute inset-0"
            style={{
              x: shouldReduceMotion ? 0 : backgroundX,
              y: shouldReduceMotion ? 0 : backgroundY,
              z: -35,
            }}
          />

          <motion.div
            className="project-card-header relative z-10 mb-8 flex flex-col gap-6 md:mb-10 md:flex-row md:items-start md:justify-between"
            style={{
              x: shouldReduceMotion ? 0 : midgroundX,
              y: shouldReduceMotion ? 0 : midgroundY,
              z: 38,
            }}
          >
            <div className="grid gap-4 md:grid-cols-[auto_1fr] md:gap-6">
              <span className="text-[clamp(3rem,10vw,140px)] font-black leading-none text-[#D7E2EA]">
                {project.number}
              </span>

              <div className="space-y-3 pt-2">
                <p className="text-sm uppercase tracking-[0.24em] text-[#D7E2EA]/70">
                  {project.category}
                </p>
                <h3 className="text-[clamp(1.4rem,3vw,2.75rem)] font-medium uppercase tracking-[0.12em] text-white">
                  {project.name}
                </h3>
              </div>
            </div>

            <LiveProjectButton href={project.liveUrl} />
          </motion.div>

          <div className="project-media-grid relative z-10 grid grid-cols-[0.4fr_0.6fr] gap-4 md:gap-5">
            <motion.div
              className="project-image-column grid gap-4 md:gap-5"
              style={{
                x: shouldReduceMotion ? 0 : midgroundX,
                y: shouldReduceMotion ? 0 : midgroundY,
                z: 48,
              }}
            >
              <div className="project-image-frame project-image-top h-[clamp(130px,16vw,230px)] rounded-[40px] sm:rounded-[50px] md:rounded-[60px]">
                <img
                  src={project.images[0]}
                  alt={`${project.name} showcase one`}
                  loading="lazy"
                  decoding="async"
                  className="project-scene-image h-full w-full object-cover"
                />
              </div>
              <div className="project-image-frame project-image-bottom h-[clamp(160px,22vw,340px)] rounded-[40px] sm:rounded-[50px] md:rounded-[60px]">
                <img
                  src={project.images[1]}
                  alt={`${project.name} showcase two`}
                  loading="lazy"
                  decoding="async"
                  className="project-scene-image h-full w-full object-cover"
                />
              </div>
            </motion.div>

            <motion.div
              className="project-image-frame project-image-main h-full min-h-[320px] rounded-[40px] sm:rounded-[50px] md:min-h-[390px] md:rounded-[60px]"
              style={{
                x: shouldReduceMotion ? 0 : foregroundX,
                y: shouldReduceMotion ? 0 : foregroundY,
                z: 76,
              }}
            >
              <img
                src={project.images[2]}
                alt={`${project.name} showcase three`}
                loading="lazy"
                decoding="async"
                className="project-scene-image h-full w-full object-cover"
              />
            </motion.div>
          </div>

          <motion.div
            aria-hidden="true"
            className="project-specular-highlight absolute inset-0 z-20 rounded-[inherit]"
            style={{
              background: specularHighlight,
              opacity: shouldReduceMotion ? 0.1 : highlightOpacity,
              z: 92,
            }}
          />

          <motion.div
            aria-hidden="true"
            className="project-particles absolute inset-0 z-20 overflow-hidden rounded-[inherit]"
            style={{
              x: shouldReduceMotion ? 0 : foregroundX,
              y: shouldReduceMotion ? 0 : foregroundY,
              z: 88,
            }}
          >
            {particles.map((particle, particleIndex) => (
              <span
                key={`${project.number}-${particleIndex}`}
                className="project-particle"
                style={
                  {
                    left: particle.left,
                    top: particle.top,
                    width: particle.size,
                    height: particle.size,
                    "--particle-delay": particle.delay,
                    "--particle-duration": particle.duration,
                  } as CSSProperties
                }
              />
            ))}
          </motion.div>
        </motion.div>
      </motion.article>

      <div
        ref={ref}
        className="h-[85vh]"
        data-project-container={project.number}
        aria-hidden="true"
      />
    </>
  );
}

export function ProjectsSection() {
  return (
    <section
      id="projects"
      className="relative z-10 -mt-10 scroll-mt-8 rounded-t-[40px] bg-[#0C0C0C] px-5 pb-24 pt-20 sm:-mt-12 sm:rounded-t-[50px] sm:px-8 md:-mt-14 md:rounded-t-[60px] md:px-10 md:pt-28"
    >
      <div className="mx-auto max-w-6xl">
        <FadeIn delay={0} y={40}>
          <h2 className="hero-heading mb-16 text-center text-[clamp(3rem,12vw,160px)] font-black uppercase leading-none tracking-tight sm:mb-20">
            Project
          </h2>
        </FadeIn>

        <div className="project-stack relative isolate">
          {projects.map((project, index) => (
            <ProjectCard
              key={project.name}
              index={index}
              project={project}
              totalCards={projects.length}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
