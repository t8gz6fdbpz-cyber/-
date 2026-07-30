import { useReducedMotion } from "framer-motion";
import {
  Component,
  lazy,
  Suspense,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { CSSProperties, MutableRefObject, ReactNode } from "react";

import type {
  GalaxyInteractionPhase,
  ToolCategory,
  ToolGalaxyTool,
} from "./ToolGalaxy3D";

const ToolGalaxy3D = lazy(() =>
  import("./ToolGalaxy3D").then((module) => ({
    default: module.ToolGalaxy3D,
  })),
);

class ToolGalaxyErrorBoundary extends Component<
  { children: ReactNode; resetKey: string },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: { componentStack?: string }) {
    console.error("[ToolGalaxy3D] Canvas runtime error", {
      error,
      componentStack: errorInfo.componentStack,
    });
  }

  componentDidUpdate(previousProps: { resetKey: string }) {
    if (this.state.hasError && previousProps.resetKey !== this.props.resetKey) {
      this.setState({ hasError: false });
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="tool-galaxy-stage tool-galaxy-fallback" role="status">
          3D 星系运行时出错，已切换为轻量展示。
        </div>
      );
    }

    return this.props.children;
  }
}

const categoryMeta: Array<{
  name: ToolCategory;
  note: string;
  accent: string;
}> = [
  { name: "AI 创作", note: "脚本、策略、视觉和原型", accent: "#ffd175" },
  { name: "内容制作", note: "剪辑、设计、包装和交付", accent: "#c28a2e" },
  { name: "平台运营", note: "分发、直播、社群和增长", accent: "#8a5a18" },
];

const tools: ToolGalaxyTool[] = [
  {
    id: "chatgpt",
    name: "ChatGPT",
    category: "AI 创作",
    description: "用于脚本生成、选题拆解、复盘整理和内容工作流搭建。",
    tags: ["脚本生成", "选题拆解", "复盘整理"],
    icon: "/toolbox/chatgpt.svg",
    initials: "GPT",
    orbitIndex: 0,
    orbitRadius: 1.45,
    orbitTilt: [58, -16, 12],
    baseAngle: 4.2,
    speed: 0.08,
    phase: 0,
  },
  {
    id: "claude",
    name: "Claude",
    category: "AI 创作",
    description: "用于资料分析、策略梳理、长文本处理和复杂信息归纳。",
    tags: ["资料分析", "策略梳理", "长文本处理"],
    icon: "/toolbox/claude.png",
    orbitIndex: 1,
    orbitRadius: 1.88,
    orbitTilt: [-46, 24, -18],
    baseAngle: 1.05,
    speed: -0.08,
    phase: 0,
  },
  {
    id: "codex",
    name: "Codex",
    category: "AI 创作",
    description: "用于网页开发、自动化实现、原型搭建和小工具落地。",
    tags: ["网页开发", "自动化实现", "原型搭建"],
    icon: "/toolbox/codex.png",
    orbitIndex: 2,
    orbitRadius: 1.66,
    orbitTilt: [22, 54, 42],
    baseAngle: 3.67,
    speed: 0.1,
    phase: 0,
  },
  {
    id: "jimeng",
    name: "即梦",
    category: "AI 创作",
    description: "用于视觉概念、图像生成、创意验证和内容情绪板探索。",
    tags: ["视觉概念", "图像生成", "创意验证"],
    icon: "/toolbox/jimeng.png",
    orbitIndex: 3,
    orbitRadius: 2.12,
    orbitTilt: [-68, -22, 34],
    baseAngle: 0,
    speed: -0.08,
    phase: 0,
  },
  {
    id: "capcut",
    name: "剪映",
    category: "内容制作",
    description: "用于短视频制作、字幕处理、快速剪辑和平台格式适配。",
    tags: ["短视频制作", "字幕处理", "快速剪辑"],
    icon: "/toolbox/capcut.png",
    orbitIndex: 0,
    orbitRadius: 1.52,
    orbitTilt: [58, -16, 12],
    baseAngle: 5.76,
    speed: 0.18,
    phase: 0,
  },
  {
    id: "premiere",
    name: "Premiere",
    category: "内容制作",
    description: "用于视频剪辑、节奏处理、多轨整理和成片输出。",
    tags: ["视频剪辑", "节奏处理", "成片输出"],
    icon: "/toolbox/premiere.png",
    orbitIndex: 1,
    orbitRadius: 1.96,
    orbitTilt: [-46, 24, -18],
    baseAngle: 2.62,
    speed: -0.17,
    phase: 0,
  },
  {
    id: "photoshop",
    name: "Photoshop",
    category: "内容制作",
    description: "用于图片处理、视觉合成、封面制作和内容包装。",
    tags: ["图片处理", "视觉合成", "封面制作"],
    icon: "/toolbox/photoshop.jpg",
    orbitIndex: 4,
    orbitRadius: 2.3,
    orbitTilt: [34, -66, -28],
    baseAngle: 1.05,
    speed: 0.15,
    phase: 0,
  },
  {
    id: "canva",
    name: "Canva",
    category: "内容制作",
    description: "用于轻量设计、活动物料、模板搭建和快速协作。",
    tags: ["轻量设计", "活动物料", "模板搭建"],
    icon: "/toolbox/canva.svg",
    initials: "CV",
    orbitIndex: 5,
    orbitRadius: 1.74,
    orbitTilt: [-24, -42, 68],
    baseAngle: 4.2,
    speed: -0.2,
    phase: 0,
  },
  {
    id: "douyin",
    name: "抖音",
    category: "平台运营",
    description: "用于短视频增长、直播运营、内容分发和趋势观察。",
    tags: ["短视频增长", "直播运营", "内容分发"],
    icon: "/toolbox/douyin.png",
    orbitIndex: 2,
    orbitRadius: 1.76,
    orbitTilt: [22, 54, 42],
    baseAngle: 0.52,
    speed: 0.16,
    phase: 0,
  },
  {
    id: "wechat-channels",
    name: "视频号",
    category: "平台运营",
    description: "用于微信生态分发、直播联动、内容沉淀和私域承接。",
    tags: ["微信生态", "直播联动", "内容沉淀"],
    icon: "/toolbox/wechat-channels.png",
    orbitIndex: 3,
    orbitRadius: 2.06,
    orbitTilt: [-68, -22, 34],
    baseAngle: 3.14,
    speed: -0.15,
    phase: 0,
  },
  {
    id: "xiaohongshu",
    name: "小红书",
    category: "平台运营",
    description: "用于内容种草、社区洞察、视觉表达和用户反馈观察。",
    tags: ["内容种草", "社区洞察", "视觉表达"],
    icon: "/toolbox/xiaohongshu.png",
    orbitIndex: 4,
    orbitRadius: 2.22,
    orbitTilt: [34, -66, -28],
    baseAngle: 4.45,
    speed: 0.14,
    phase: 0,
  },
  {
    id: "tiktok",
    name: "TikTok",
    category: "平台运营",
    description: "用于海外趋势观察、短视频参考和内容测试。",
    tags: ["趋势观察", "短视频参考", "内容测试"],
    icon: "/toolbox/tiktok.svg",
    initials: "TK",
    orbitIndex: 5,
    orbitRadius: 1.82,
    orbitTilt: [-24, -42, 68],
    baseAngle: 1.2,
    speed: -0.18,
    phase: 0,
  },
];

type GalaxySupportState = "loading" | "supported" | "unsupported";
type ToolCardTheme = {
  accent: string;
  background: string;
  glow: string;
};

function canUseWebGL() {
  if (typeof document === "undefined") return false;

  try {
    const canvas = document.createElement("canvas");
    const context =
      canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    return Boolean(context);
  } catch (error) {
    console.error("[ToolGalaxy3D] WebGL capability check failed", error);
    return false;
  }
}

const toolCardThemes: Record<string, ToolCardTheme> = {
  capcut: {
    accent: "#f8f8f2",
    background: "linear-gradient(145deg, #050505 0%, #171717 58%, #2a2a2a 100%)",
    glow: "rgba(255, 255, 255, 0.18)",
  },
  photoshop: {
    accent: "#31a8ff",
    background: "linear-gradient(145deg, #061529 0%, #0b2b58 58%, #123b74 100%)",
    glow: "rgba(49, 168, 255, 0.32)",
  },
  premiere: {
    accent: "#9999ff",
    background: "linear-gradient(145deg, #090821 0%, #19125a 54%, #2d2584 100%)",
    glow: "rgba(153, 153, 255, 0.3)",
  },
  xiaohongshu: {
    accent: "#ff2d3d",
    background: "linear-gradient(145deg, #210407 0%, #74121b 58%, #be2030 100%)",
    glow: "rgba(255, 45, 61, 0.32)",
  },
  jimeng: {
    accent: "#8f8cff",
    background: "linear-gradient(145deg, #0b1028 0%, #24307d 52%, #6865d9 100%)",
    glow: "rgba(143, 140, 255, 0.3)",
  },
  claude: {
    accent: "#d97745",
    background: "linear-gradient(145deg, #120907 0%, #4b2417 55%, #b7683f 100%)",
    glow: "rgba(217, 119, 69, 0.28)",
  },
  codex: {
    accent: "#10a37f",
    background: "linear-gradient(145deg, #071410 0%, #0f352c 58%, #167a62 100%)",
    glow: "rgba(16, 163, 127, 0.28)",
  },
  chatgpt: {
    accent: "#74aa9c",
    background: "linear-gradient(145deg, #08120f 0%, #174136 58%, #4d8d7e 100%)",
    glow: "rgba(116, 170, 156, 0.28)",
  },
  douyin: {
    accent: "#ff2b55",
    background: "linear-gradient(145deg, #050507 0%, #1b1220 50%, #0aa7b8 100%)",
    glow: "rgba(255, 43, 85, 0.28)",
  },
  "wechat-channels": {
    accent: "#22c55e",
    background: "linear-gradient(145deg, #07140c 0%, #10391d 58%, #2f8f4e 100%)",
    glow: "rgba(34, 197, 94, 0.26)",
  },
  tiktok: {
    accent: "#25f4ee",
    background: "linear-gradient(145deg, #050507 0%, #171824 55%, #111f2d 100%)",
    glow: "rgba(37, 244, 238, 0.26)",
  },
  canva: {
    accent: "#7d6cff",
    background: "linear-gradient(145deg, #091127 0%, #1f4fb8 54%, #7d6cff 100%)",
    glow: "rgba(125, 108, 255, 0.3)",
  },
};

function getToolCardTheme(tool: ToolGalaxyTool) {
  return (
    toolCardThemes[tool.id] ?? {
      accent: "#ffd175",
      background: "linear-gradient(145deg, #070604 0%, #21170b 58%, #68451a 100%)",
      glow: "rgba(255, 209, 117, 0.24)",
    }
  );
}

function ToolInfoPanel({
  onClose,
  panelRef,
  tool,
}: {
  onClose: () => void;
  panelRef: MutableRefObject<HTMLElement | null>;
  tool: ToolGalaxyTool;
}) {
  const theme = getToolCardTheme(tool);
  const style = {
    "--tool-accent": theme.accent,
    "--tool-card-bg": theme.background,
    "--tool-glow": theme.glow,
  } as CSSProperties;

  useLayoutEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;

    [
      "bottom",
      "height",
      "left",
      "opacity",
      "overflow",
      "padding",
      "pointer-events",
      "right",
      "top",
      "visibility",
      "width",
      "z-index",
    ].forEach((property) => panel.style.removeProperty(property));
    panel.style.setProperty("--morph-logo-progress", "0");
    panel.style.setProperty("--morph-content-progress", "0");
    panel.style.setProperty("--morph-content-offset", "12px");
  }, [panelRef, tool.id]);

  return (
    <aside
      ref={panelRef}
      className="tool-info-panel"
      style={style}
      aria-live="polite"
    >
      <button
        type="button"
        className="tool-info-close"
        aria-label="关闭详情"
        onClick={onClose}
      >
        ×
      </button>
      <div className="tool-info-logo">
        {tool.icon ? (
          <img src={tool.icon} alt="" draggable={false} />
        ) : (
          <span className="tool-planet-fallback">
            {tool.initials ?? tool.name.slice(0, 2)}
          </span>
        )}
      </div>
      <div className="tool-info-content">
        <p>{tool.category}</p>
        <h3>{tool.name}</h3>
        <span>{tool.tags[0]}</span>
        <div className="tool-tag-list" aria-label="工具标签">
          {tool.tags.map((tag) => (
            <em key={tag}>{tag}</em>
          ))}
        </div>
        <div className="tool-info-divider" />
        <p className="tool-info-description">{tool.description}</p>
        <small>点击空白处或关闭按钮，恢复自由轨道。</small>
      </div>
    </aside>
  );
}

export function SkillsMatrixSection() {
  const shouldReduceMotion = useReducedMotion();
  const [activeCategory, setActiveCategory] = useState<ToolCategory | null>(null);
  const [selectedToolId, setSelectedToolId] = useState<string | null>(null);
  const [focusedToolId, setFocusedToolId] = useState<string | null>(null);
  const [interactionPhase, setInteractionPhase] =
    useState<GalaxyInteractionPhase>("free");
  const [galaxySupport, setGalaxySupport] =
    useState<GalaxySupportState>("loading");
  const detailPanelRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    setGalaxySupport(canUseWebGL() ? "supported" : "unsupported");
  }, []);

  const detailTool =
    focusedToolId === null
      ? null
      : tools.find((tool) => tool.id === focusedToolId) ?? null;

  const categoryCounts = useMemo(
    () =>
      categoryMeta.map((category) => ({
        ...category,
        count: tools.filter((tool) => tool.category === category.name).length,
      })),
    [],
  );

  const selectTool = (tool: ToolGalaxyTool, focus = true) => {
    setSelectedToolId(tool.id);
    if (!focus) {
      setFocusedToolId(null);
      setInteractionPhase("free");
      return;
    }
    if (
      focusedToolId === tool.id &&
      (interactionPhase === "focusing" || interactionPhase === "focused")
    ) {
      return;
    }

    setFocusedToolId(tool.id);
    setInteractionPhase("focusing");
  };

  const clearFocus = () => {
    if (focusedToolId === null || interactionPhase === "releasing") return;

    setInteractionPhase("releasing");
  };

  const handleFocusSettled = (toolId: string) => {
    if (focusedToolId !== toolId || interactionPhase !== "focusing") return;

    setInteractionPhase("focused");
  };

  const handleReleaseSettled = (toolId: string) => {
    if (focusedToolId !== toolId || interactionPhase !== "releasing") return;

    setSelectedToolId(null);
    setFocusedToolId(null);
    setInteractionPhase("free");
  };

  const selectCategory = (category: ToolCategory | null) => {
    setActiveCategory((current) => (current === category ? null : category));
    if (focusedToolId !== null) clearFocus();
  };

  return (
    <section
      id="skills"
      className="toolbox-section scroll-mt-8 bg-[var(--color-bg)] px-5 py-24 text-[var(--color-text)] sm:px-8 md:px-10 md:py-36"
    >
      <div className="mx-auto max-w-7xl">
        <div className="skill-planet-heading">
          <div>
            <p>技能</p>
            <h2>工具星系</h2>
          </div>
          <span>
            我常用的工具、平台和创作系统。它们不是孤立的软件，而是围绕内容生产、平台运营和 AI 工作流运行的工具生态。
          </span>
        </div>

        <div
          className={`tool-desktop-layout mt-14 ${
            focusedToolId ? "is-focused" : ""
          }`}
          data-galaxy-phase={interactionPhase}
        >
          <div className="tool-category-index" aria-label="工具分类">
            <p>分类</p>
            <button
              type="button"
              className="tool-category-item"
              data-active={activeCategory === null}
              onClick={() => selectCategory(null)}
            >
              <span style={{ backgroundColor: "#ffd175" }} />
              <div>
                <strong>全部</strong>
                <small>{tools.length} 个工具</small>
              </div>
            </button>
            {categoryCounts.map((category) => (
              <button
                key={category.name}
                type="button"
                className="tool-category-item"
                data-active={activeCategory === category.name}
                onClick={() => selectCategory(category.name)}
              >
                <span style={{ backgroundColor: category.accent }} />
                <div>
                  <strong>{category.name}</strong>
                  <small>
                    {category.note} / {category.count} 个工具
                  </small>
                </div>
              </button>
            ))}
          </div>

          {galaxySupport === "loading" ? (
            <div className="tool-galaxy-stage tool-galaxy-fallback" role="status">
              正在加载 3D 星系
            </div>
          ) : galaxySupport === "unsupported" ? (
            <div className="tool-galaxy-stage tool-galaxy-fallback" role="status">
              当前浏览器不支持 WebGL，已切换为轻量展示。
            </div>
          ) : (
            <ToolGalaxyErrorBoundary
              resetKey={`${activeCategory ?? "all"}-${selectedToolId ?? "free"}`}
            >
              <Suspense
                fallback={
                  <div
                    className="tool-galaxy-stage tool-galaxy-fallback"
                    role="status"
                  >
                    正在加载 3D 星系
                  </div>
                }
              >
                <ToolGalaxy3D
                  activeCategory={activeCategory}
                  detailPanelRef={detailPanelRef}
                  focusedToolId={focusedToolId}
                  interactionPhase={interactionPhase}
                  reducedMotion={Boolean(shouldReduceMotion)}
                  selectedToolId={selectedToolId}
                  tools={tools}
                  onClearFocus={clearFocus}
                  onFocusSettled={handleFocusSettled}
                  onReleaseSettled={handleReleaseSettled}
                  onSelectTool={selectTool}
                />
              </Suspense>
            </ToolGalaxyErrorBoundary>
          )}

          {detailTool && focusedToolId ? (
            <ToolInfoPanel
              panelRef={detailPanelRef}
              tool={detailTool}
              onClose={clearFocus}
            />
          ) : null}
        </div>
      </div>
    </section>
  );
}

export const ServicesSection = SkillsMatrixSection;
