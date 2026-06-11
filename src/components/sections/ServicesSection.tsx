import {
  AnimatePresence,
  motion,
  type MotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { X } from "lucide-react";
import {
  type CSSProperties,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

type Tool = {
  name: string;
  category: string;
  orbit: "AI Tools" | "Creative Tools" | "Platform Tools";
  description: string;
  image: string;
  x: number;
  y: number;
  size: number;
  depth: number;
  useCases: string[];
  projects: string[];
};

const tools: Tool[] = [
  {
    name: "Codex",
    category: "AI Tools",
    orbit: "AI Tools",
    description: "Engineering, prototyping, automation, and rapid product iteration.",
    image: "/toolbox/codex.png",
    x: 50,
    y: 49,
    size: 124,
    depth: 1,
    useCases: ["Product prototyping", "Code automation", "Technical exploration"],
    projects: ["Interactive portfolio systems", "Creative workflow utilities"],
  },
  {
    name: "Claude",
    category: "AI Tools",
    orbit: "AI Tools",
    description: "Long-form thinking, research synthesis, and structured writing.",
    image: "/toolbox/claude.png",
    x: 35,
    y: 31,
    size: 90,
    depth: 0.78,
    useCases: ["Research synthesis", "Narrative planning", "Document analysis"],
    projects: ["Content strategy reports", "Creative research briefs"],
  },
  {
    name: "Jimeng",
    category: "AI Tools",
    orbit: "AI Tools",
    description: "Fast visual ideation and image-driven creative exploration.",
    image: "/toolbox/jimeng.png",
    x: 65,
    y: 31,
    size: 88,
    depth: 0.76,
    useCases: ["Visual concepts", "Campaign key visuals", "Style exploration"],
    projects: ["Brand moodboards", "Social campaign assets"],
  },
  {
    name: "Photoshop",
    category: "Creative Tools",
    orbit: "Creative Tools",
    description: "Image composition, retouching, color work, and visual finishing.",
    image: "/toolbox/photoshop.jpg",
    x: 21,
    y: 48,
    size: 78,
    depth: 0.58,
    useCases: ["Image finishing", "Campaign graphics", "Photo compositing"],
    projects: ["Launch posters", "Social content systems"],
  },
  {
    name: "Premiere",
    category: "Creative Tools",
    orbit: "Creative Tools",
    description: "Timeline editing and flexible post-production for long-form video.",
    image: "/toolbox/premiere.png",
    x: 79,
    y: 48,
    size: 78,
    depth: 0.58,
    useCases: ["Video editing", "Narrative assembly", "Multi-format delivery"],
    projects: ["Creator documentaries", "Brand films"],
  },
  {
    name: "DaVinci Resolve",
    category: "Creative Tools",
    orbit: "Creative Tools",
    description: "Cinematic color grading, finishing, and advanced post-production.",
    image: "/toolbox/davinci.png",
    x: 37,
    y: 68,
    size: 84,
    depth: 0.68,
    useCases: ["Color grading", "Audio finishing", "Cinematic delivery"],
    projects: ["Commercial color systems", "Short-film finishing"],
  },
  {
    name: "CapCut",
    category: "Creative Tools",
    orbit: "Creative Tools",
    description: "Fast social-first editing, captions, effects, and delivery.",
    image: "/toolbox/capcut.png",
    x: 64,
    y: 68,
    size: 82,
    depth: 0.66,
    useCases: ["Short-form editing", "Caption systems", "Platform adaptation"],
    projects: ["Douyin content series", "Creator growth experiments"],
  },
  {
    name: "Douyin",
    category: "Platforms",
    orbit: "Platform Tools",
    description: "Short-form storytelling, distribution, and audience growth.",
    image: "/toolbox/douyin.png",
    x: 14,
    y: 69,
    size: 70,
    depth: 0.42,
    useCases: ["Content publishing", "Trend research", "Audience testing"],
    projects: ["Account growth programs", "Short-video campaigns"],
  },
  {
    name: "Xiaohongshu",
    category: "Platforms",
    orbit: "Platform Tools",
    description: "Lifestyle content, visual discovery, and community storytelling.",
    image: "/toolbox/xiaohongshu.png",
    x: 87,
    y: 69,
    size: 70,
    depth: 0.42,
    useCases: ["Visual publishing", "Community research", "Content seeding"],
    projects: ["Brand discovery campaigns", "Creator content calendars"],
  },
  {
    name: "WeChat",
    category: "Platforms",
    orbit: "Platform Tools",
    description: "Private-domain communication, community, and relationship building.",
    image: "/toolbox/wechat.png",
    x: 20,
    y: 27,
    size: 74,
    depth: 0.5,
    useCases: ["Community operations", "Private traffic", "Client communication"],
    projects: ["Community programs", "Customer relationship workflows"],
  },
  {
    name: "WeChat Channels",
    category: "Platforms",
    orbit: "Platform Tools",
    description: "Video distribution inside the WeChat content ecosystem.",
    image: "/toolbox/wechat-channels.png",
    x: 81,
    y: 27,
    size: 74,
    depth: 0.5,
    useCases: ["Video publishing", "Cross-channel distribution", "Live content"],
    projects: ["Channel growth systems", "Integrated launch campaigns"],
  },
  {
    name: "CDR",
    category: "Work Tools",
    orbit: "Platform Tools",
    description: "Vector graphics, print layouts, and production-ready brand assets.",
    image: "/toolbox/cdr.png",
    x: 47,
    y: 84,
    size: 68,
    depth: 0.35,
    useCases: ["Vector artwork", "Print production", "Brand asset delivery"],
    projects: ["Identity production kits", "Offline campaign materials"],
  },
  {
    name: "Feishu",
    category: "Work Tools",
    orbit: "Platform Tools",
    description: "Team collaboration, project coordination, and knowledge systems.",
    image: "/toolbox/feishu.ico",
    x: 55,
    y: 14,
    size: 72,
    depth: 0.46,
    useCases: ["Project coordination", "Knowledge management", "Team alignment"],
    projects: ["Content operating systems", "Cross-functional project hubs"],
  },
];

function ToolOrb({
  index,
  progress,
  tool,
  focusedOrbit,
  onFocusOrbit,
  onOpen,
}: {
  index: number;
  progress: MotionValue<number>;
  tool: Tool;
  focusedOrbit: Tool["orbit"] | null;
  onFocusOrbit: (orbit: Tool["orbit"] | null) => void;
  onOpen: (tool: Tool) => void;
}) {
  const shouldReduceMotion = useReducedMotion();
  const direction = index % 2 === 0 ? 1 : -1;
  const rawX = useTransform(
    progress,
    [0, 0.5, 1],
    [0, direction * (8 + tool.depth * 16), direction * -5],
  );
  const rawY = useTransform(
    progress,
    [0, 0.5, 1],
    [direction * 5, direction * -12, direction * 8],
  );
  const rawRotate = useTransform(progress, [0, 1], [-2 * direction, 3 * direction]);
  const x = useSpring(rawX, { stiffness: 80, damping: 22, mass: 0.8 });
  const y = useSpring(rawY, { stiffness: 80, damping: 22, mass: 0.8 });
  const rotate = useSpring(rawRotate, { stiffness: 70, damping: 24 });
  const focusState =
    focusedOrbit === null ? "idle" : focusedOrbit === tool.orbit ? "related" : "muted";

  return (
    <motion.button
      type="button"
      aria-label={`Open ${tool.name} details`}
      data-focus-state={focusState}
      data-orbit={tool.orbit}
      className="tool-orb group absolute -translate-x-1/2 -translate-y-1/2 rounded-[30%] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
      style={{
        left: `${tool.x}%`,
        top: `${tool.y}%`,
        width: `clamp(${Math.round(tool.size * 0.68)}px, ${tool.size / 10}vw, ${tool.size}px)`,
        height: `clamp(${Math.round(tool.size * 0.68)}px, ${tool.size / 10}vw, ${tool.size}px)`,
        x: shouldReduceMotion ? 0 : x,
        y: shouldReduceMotion ? 0 : y,
        rotate: shouldReduceMotion ? 0 : rotate,
        zIndex: Math.round(tool.depth * 10) + 1,
      }}
      whileHover={shouldReduceMotion ? undefined : { scale: 1.16, z: 42 }}
      whileFocus={shouldReduceMotion ? undefined : { scale: 1.12, z: 36 }}
      whileTap={{ scale: 0.96 }}
      transition={{ type: "spring", stiffness: 240, damping: 18, mass: 0.7 }}
      onHoverStart={() => onFocusOrbit(tool.orbit)}
      onHoverEnd={() => onFocusOrbit(null)}
      onFocus={() => onFocusOrbit(tool.orbit)}
      onBlur={() => onFocusOrbit(null)}
      onClick={() => onOpen(tool)}
    >
      <motion.span
        className="tool-orb-body absolute inset-0 rounded-[inherit]"
        animate={
          shouldReduceMotion
            ? undefined
            : {
                y: [0, -4 - tool.depth * 3, 0],
                scale: [1, 1.018 + tool.depth * 0.012, 1],
              }
        }
        transition={{
          duration: 4.8 + (index % 5) * 0.65,
          delay: index * -0.31,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <span className="tool-orb-glass absolute inset-0 rounded-[inherit]" />
        <img
          src={tool.image}
          alt=""
          draggable={false}
          className="relative z-10 h-full w-full rounded-[inherit] object-contain p-[12%]"
        />
      </motion.span>
      <span className="tool-orb-tooltip pointer-events-none absolute left-1/2 top-[calc(100%+12px)] z-30 w-max max-w-[230px] rounded-2xl border border-white/10 bg-black/80 px-4 py-3 text-left opacity-0 shadow-2xl backdrop-blur-xl transition-all duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
        <span className="block text-[10px] uppercase tracking-[0.22em] text-white/35">
          {tool.orbit}
        </span>
        <strong className="mt-1 block text-sm font-medium text-white">{tool.name}</strong>
        <span className="mt-2 block text-xs leading-relaxed text-white/65">
          {tool.useCases.slice(0, 2).join(" · ")}
        </span>
      </span>
    </motion.button>
  );
}

function ToolModal({ tool, onClose }: { tool: Tool; onClose: () => void }) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-5 backdrop-blur-xl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby="tool-modal-title"
        className="relative w-full max-w-2xl overflow-hidden rounded-[36px] border border-white/15 bg-[#12151b]/95 p-7 text-white shadow-[0_40px_120px_rgba(0,0,0,0.65)] sm:p-10"
        initial={{ opacity: 0, y: 30, scale: 0.94 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.96 }}
        transition={{ type: "spring", stiffness: 190, damping: 24 }}
      >
        <button
          type="button"
          aria-label="Close tool details"
          onClick={onClose}
          className="absolute right-5 top-5 z-10 rounded-full border border-white/10 bg-white/5 p-3 text-white/70 transition hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-5">
          <div className="h-24 w-24 shrink-0 rounded-[28px] border border-white/15 bg-white/10 p-3 shadow-[0_18px_50px_rgba(0,0,0,0.35)]">
            <img
              src={tool.image}
              alt={`${tool.name} logo`}
              className="h-full w-full rounded-[20px] object-contain"
            />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-white/40">
              {tool.category}
            </p>
            <h3 id="tool-modal-title" className="mt-2 text-3xl font-semibold sm:text-5xl">
              {tool.name}
            </h3>
          </div>
        </div>

        <p className="mt-7 max-w-xl text-base font-light leading-relaxed text-white/65 sm:text-lg">
          {tool.description}
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
            <p className="text-xs uppercase tracking-[0.22em] text-white/35">Use Cases</p>
            <ul className="mt-4 space-y-3 text-sm text-white/75">
              {tool.useCases.map((item) => (
                <li key={item} className="border-b border-white/10 pb-3 last:border-0 last:pb-0">
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
            <p className="text-xs uppercase tracking-[0.22em] text-white/35">
              Sample Projects
            </p>
            <ul className="mt-4 space-y-3 text-sm text-white/75">
              {tool.projects.map((item) => (
                <li key={item} className="border-b border-white/10 pb-3 last:border-0 last:pb-0">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function SkillsMatrixSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [focusedOrbit, setFocusedOrbit] = useState<Tool["orbit"] | null>(null);
  const [selectedTool, setSelectedTool] = useState<Tool | null>(() => {
    if (typeof window === "undefined") return null;
    const requestedTool = new URLSearchParams(window.location.search).get("tool");
    return tools.find((tool) => tool.name === requestedTool) ?? null;
  });
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const rawRotate = useTransform(scrollYProgress, [0, 1], [-3, 4]);
  const rawY = useTransform(scrollYProgress, [0, 0.5, 1], [24, 0, -18]);
  const ecosystemRotate = useSpring(rawRotate, { stiffness: 60, damping: 24 });
  const ecosystemY = useSpring(rawY, { stiffness: 65, damping: 24 });
  const openTool = useCallback((tool: Tool) => {
    setSelectedTool(tool);
    const url = new URL(window.location.href);
    url.searchParams.set("tool", tool.name);
    window.history.replaceState({}, "", url);
  }, []);
  const closeTool = useCallback(() => {
    setSelectedTool(null);
    const url = new URL(window.location.href);
    url.searchParams.delete("tool");
    window.history.replaceState({}, "", url);
  }, []);

  return (
    <>
      <section
        ref={sectionRef}
        id="skills"
        className="toolbox-section relative min-h-[155vh] scroll-mt-8 bg-[#090a0d] text-white"
      >
        <div className="sticky top-0 flex min-h-screen flex-col overflow-hidden px-5 py-16 sm:px-8 md:px-10 md:py-20">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_48%,rgba(83,109,255,0.15),transparent_34%),radial-gradient(circle_at_24%_68%,rgba(182,77,255,0.10),transparent_28%)]" />
          <div className="relative z-10 mx-auto flex w-full max-w-6xl items-end justify-between gap-6">
            <div>
              <p className="mb-3 text-xs uppercase tracking-[0.32em] text-white/35">
                My Skills
              </p>
              <h2 className="text-[clamp(3.5rem,10vw,9rem)] font-black uppercase leading-[0.82] tracking-[-0.05em]">
                我的技能
              </h2>
            </div>
            <p className="hidden max-w-[300px] pb-2 text-right text-sm font-light leading-relaxed text-white/45 md:block">
              The tools and platforms behind my workflow.
            </p>
          </div>

          <motion.div
            className="tool-ecosystem relative z-10 mx-auto mt-7 w-full max-w-6xl flex-1 [perspective:1200px] sm:mt-9"
            style={{ rotate: ecosystemRotate, y: ecosystemY }}
          >
            <div className="absolute left-1/2 top-1/2 h-[42%] w-[38%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/10 blur-[90px]" />
            <div className="tool-nebula absolute inset-0" aria-hidden="true" />
            <div className="tool-orbit-ring tool-orbit-ring-ai" aria-hidden="true">
              <span>AI Tools</span>
            </div>
            <div className="tool-orbit-ring tool-orbit-ring-creative" aria-hidden="true">
              <span>Creative Tools</span>
            </div>
            <div className="tool-orbit-ring tool-orbit-ring-platform" aria-hidden="true">
              <span>Platform Tools</span>
            </div>
            <div className="tool-particle-field" aria-hidden="true">
              {Array.from({ length: 18 }, (_, index) => (
                <span
                  key={index}
                  style={
                    {
                      "--particle-x": `${8 + ((index * 31) % 86)}%`,
                      "--particle-y": `${6 + ((index * 47) % 88)}%`,
                      "--particle-delay": `${-((index * 0.73) % 7)}s`,
                      "--particle-duration": `${6 + (index % 6)}s`,
                    } as CSSProperties
                  }
                />
              ))}
            </div>
            {tools.map((tool, index) => (
              <ToolOrb
                key={tool.name}
                index={index}
                progress={scrollYProgress}
                tool={tool}
                focusedOrbit={focusedOrbit}
                onFocusOrbit={setFocusedOrbit}
                onOpen={openTool}
              />
            ))}
          </motion.div>

          <p className="relative z-10 mt-4 text-center text-xs font-light tracking-[0.18em] text-white/30 md:hidden">
            The tools and platforms behind my workflow.
          </p>
        </div>
      </section>

      <AnimatePresence>
        {selectedTool ? (
          <ToolModal tool={selectedTool} onClose={closeTool} />
        ) : null}
      </AnimatePresence>
    </>
  );
}

export const ServicesSection = SkillsMatrixSection;
