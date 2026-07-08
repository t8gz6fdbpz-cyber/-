import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Component, lazy, Suspense, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

import type { ToolCategory, ToolGalaxyTool } from "./ToolGalaxy3D";

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

function ToolInfoPanel({ tool }: { tool: ToolGalaxyTool }) {
  return (
    <AnimatePresence mode="wait">
      <motion.aside
        key={tool.id}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        className="tool-info-panel"
        aria-live="polite"
      >
        <div className="tool-info-logo">
          {tool.icon ? (
            <img src={tool.icon} alt="" draggable={false} />
          ) : (
            <span className="tool-planet-fallback">
              {tool.initials ?? tool.name.slice(0, 2)}
            </span>
          )}
        </div>
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
        <small>点击星球可聚焦到镜头前方；点击空白处恢复轨道运动。</small>
      </motion.aside>
    </AnimatePresence>
  );
}

export function SkillsMatrixSection() {
  const shouldReduceMotion = useReducedMotion();
  const [activeCategory, setActiveCategory] = useState<ToolCategory>("AI 创作");
  const [selectedToolId, setSelectedToolId] = useState("codex");
  const [focusedToolId, setFocusedToolId] = useState<string | null>(null);
  const [galaxySupport, setGalaxySupport] =
    useState<GalaxySupportState>("loading");

  useEffect(() => {
    setGalaxySupport(canUseWebGL() ? "supported" : "unsupported");
  }, []);

  const selectedTool =
    tools.find((tool) => tool.id === selectedToolId) ?? tools[0];

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
    setActiveCategory(tool.category);
    setFocusedToolId(focus ? tool.id : null);
  };

  const selectCategory = (category: ToolCategory) => {
    const firstTool = tools.find((tool) => tool.category === category);
    setActiveCategory(category);
    if (firstTool) {
      setSelectedToolId(firstTool.id);
      setFocusedToolId(null);
    }
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

        <div className="tool-desktop-layout mt-14">
          <div className="tool-category-index" aria-label="工具分类">
            <p>分类轨道</p>
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
              resetKey={`${activeCategory}-${selectedTool.id}`}
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
                  focusedToolId={focusedToolId}
                  reducedMotion={Boolean(shouldReduceMotion)}
                  selectedToolId={selectedTool.id}
                  tools={tools}
                  onClearFocus={() => setFocusedToolId(null)}
                  onSelectTool={selectTool}
                />
              </Suspense>
            </ToolGalaxyErrorBoundary>
          )}

          <ToolInfoPanel tool={selectedTool} />
        </div>
      </div>
    </section>
  );
}

export const ServicesSection = SkillsMatrixSection;
