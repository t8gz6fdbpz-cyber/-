import { motion, useReducedMotion } from "framer-motion";
import type { CSSProperties } from "react";
import { useState } from "react";

type ToolCategory = "AI 工具" | "内容制作" | "平台运营";

type Tool = {
  name: string;
  category: ToolCategory;
  tag: string;
  description: string;
  image: string;
  position: { x: number; y: number };
};

const categoryMeta: Array<{
  name: ToolCategory;
  english: string;
  accent: string;
}> = [
  { name: "AI 工具", english: "AI CREATION", accent: "#ffd175" },
  { name: "内容制作", english: "CONTENT PRODUCTION", accent: "#c28a2e" },
  { name: "平台运营", english: "PLATFORM OPERATION", accent: "#8a5a18" },
];

const tools: Tool[] = [
  {
    name: "Claude",
    category: "AI 工具",
    tag: "研究与策略",
    description: "用于资料研究、长文本分析和内容策略梳理。",
    image: "/toolbox/claude.png",
    position: { x: 38, y: 28 },
  },
  {
    name: "Codex",
    category: "AI 工具",
    tag: "开发与自动化",
    description: "用于网页开发、原型实现和重复工作自动化。",
    image: "/toolbox/codex.png",
    position: { x: 50, y: 18 },
  },
  {
    name: "即梦",
    category: "AI 工具",
    tag: "视觉创作",
    description: "用于视觉概念探索、图像生成和创意方向验证。",
    image: "/toolbox/jimeng.png",
    position: { x: 62, y: 28 },
  },
  {
    name: "Photoshop",
    category: "内容制作",
    tag: "图像处理",
    description: "用于图片精修、视觉合成和内容物料制作。",
    image: "/toolbox/photoshop.jpg",
    position: { x: 25, y: 48 },
  },
  {
    name: "Premiere",
    category: "内容制作",
    tag: "视频剪辑",
    description: "用于长短视频剪辑、节奏控制和多格式输出。",
    image: "/toolbox/premiere.png",
    position: { x: 75, y: 48 },
  },
  {
    name: "DaVinci Resolve",
    category: "内容制作",
    tag: "调色与后期",
    description: "用于专业调色、声音处理和视频后期交付。",
    image: "/toolbox/davinci.png",
    position: { x: 35, y: 62 },
  },
  {
    name: "剪映",
    category: "内容制作",
    tag: "短视频制作",
    description: "用于社交平台短视频、字幕和快速内容适配。",
    image: "/toolbox/capcut.png",
    position: { x: 65, y: 62 },
  },
  {
    name: "CDR",
    category: "内容制作",
    tag: "矢量设计",
    description: "用于矢量图形、印刷排版和线下物料制作。",
    image: "/toolbox/cdr.png",
    position: { x: 50, y: 72 },
  },
  {
    name: "抖音",
    category: "平台运营",
    tag: "短视频增长",
    description: "用于内容分发、趋势洞察和账号增长运营。",
    image: "/toolbox/douyin.png",
    position: { x: 20, y: 78 },
  },
  {
    name: "视频号",
    category: "平台运营",
    tag: "视频分发",
    description: "用于微信生态的视频发布、直播和内容联动。",
    image: "/toolbox/wechat-channels.png",
    position: { x: 38, y: 86 },
  },
  {
    name: "微信",
    category: "平台运营",
    tag: "私域运营",
    description: "用于社群维护、用户沟通和私域关系沉淀。",
    image: "/toolbox/wechat.png",
    position: { x: 62, y: 86 },
  },
  {
    name: "小红书",
    category: "平台运营",
    tag: "内容种草",
    description: "用于视觉内容发布、社区洞察和品牌种草。",
    image: "/toolbox/xiaohongshu.png",
    position: { x: 80, y: 78 },
  },
];

function ToolIcon({
  tool,
  index,
  active,
  onActivate,
}: {
  tool: Tool;
  index: number;
  active: boolean;
  onActivate: (tool: Tool) => void;
}) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.button
      type="button"
      aria-label={`${tool.name}：${tool.tag}`}
      aria-pressed={active}
      className="tool-planet-icon"
      data-active={active}
      style={{
        left: `${tool.position.x}%`,
        top: `${tool.position.y}%`,
      }}
      animate={
        shouldReduceMotion
          ? undefined
          : { y: [0, -4 - (index % 3) * 2, 0] }
      }
      transition={{
        duration: 5.5 + (index % 4),
        delay: index * -0.35,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      whileHover={shouldReduceMotion ? undefined : { scale: 1.15 }}
      whileFocus={shouldReduceMotion ? undefined : { scale: 1.15 }}
      onPointerEnter={() => onActivate(tool)}
      onPointerDown={() => onActivate(tool)}
      onFocus={() => onActivate(tool)}
      onClick={() => onActivate(tool)}
    >
      <img src={tool.image} alt="" draggable={false} />
    </motion.button>
  );
}

function InfoPanel({ tool }: { tool: Tool }) {
  const meta = categoryMeta.find((item) => item.name === tool.category);

  return (
    <motion.aside
      key={tool.name}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28 }}
      className="tool-info-panel"
      aria-live="polite"
    >
      <div className="tool-info-logo">
        <img src={tool.image} alt="" />
      </div>
      <p style={{ color: meta?.accent }}>{tool.category}</p>
      <h3>{tool.name}</h3>
      <span>{tool.tag}</span>
      <div className="tool-info-divider" />
      <p className="tool-info-description">{tool.description}</p>
      <small>悬停或聚焦图标查看对应能力</small>
    </motion.aside>
  );
}

function MobileToolGrid({
  activeTool,
  onActivate,
}: {
  activeTool: Tool;
  onActivate: (tool: Tool) => void;
}) {
  return (
    <div className="tool-mobile-layout">
      {categoryMeta.map((category) => (
        <section key={category.name} className="tool-mobile-category">
          <div className="tool-mobile-category-heading">
            <span style={{ backgroundColor: category.accent }} />
            <div>
              <h3>{category.name}</h3>
              <p>{category.english}</p>
            </div>
          </div>
          <div className="tool-mobile-grid">
            {tools
              .filter((tool) => tool.category === category.name)
              .map((tool) => (
                <button
                  type="button"
                  key={tool.name}
                  data-active={activeTool.name === tool.name}
                  onPointerDown={() => onActivate(tool)}
                  onClick={() => onActivate(tool)}
                >
                  <img src={tool.image} alt="" />
                  <span>{tool.name}</span>
                  <small>{tool.tag}</small>
                </button>
              ))}
          </div>
        </section>
      ))}
      <InfoPanel tool={activeTool} />
    </div>
  );
}

export function SkillsMatrixSection() {
  const [activeTool, setActiveTool] = useState<Tool>(
    tools.find((tool) => tool.name === "Codex") ?? tools[0],
  );
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      id="skills"
      className="toolbox-section scroll-mt-8 bg-[#090a0d] px-5 py-20 text-white sm:px-8 md:px-10 md:py-28"
    >
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-3 text-xs uppercase tracking-[0.32em] text-white/50">
              My Skills
            </p>
            <h2 className="text-[clamp(3.5rem,10vw,9rem)] font-black uppercase leading-[0.82] tracking-[-0.05em]">
              我的技能
            </h2>
          </div>
          <div className="max-w-md md:text-right">
            <h3 className="text-2xl font-semibold text-white md:text-3xl">
              我的工具栈
            </h3>
            <p className="mt-2 text-sm tracking-[0.08em] text-white/65">
              AI创作 / 内容制作 / 平台运营
            </p>
          </div>
        </div>

        <div className="tool-desktop-layout mt-12">
          <div className="tool-category-index" aria-label="工具分类">
            <p>TOOL PLANET</p>
            {categoryMeta.map((category) => (
              <div key={category.name} className="tool-category-item">
                <span style={{ backgroundColor: category.accent }} />
                <div>
                  <strong>{category.name}</strong>
                  <small>{category.english}</small>
                </div>
              </div>
            ))}
          </div>

          <motion.div
            className="tool-planet-stage"
            animate={
              shouldReduceMotion
                ? undefined
                : { rotate: [-0.8, 0.8, -0.8] }
            }
            transition={{ duration: 28, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="tool-nebula" aria-hidden="true" />
            <div className="tool-planet-orbit tool-planet-orbit-inner" />
            <div className="tool-planet-orbit tool-planet-orbit-outer" />
            <div className="tool-particle-field" aria-hidden="true">
              {Array.from({ length: 12 }, (_, index) => (
                <span
                  key={index}
                  style={
                    {
                      "--particle-x": `${8 + ((index * 31) % 84)}%`,
                      "--particle-y": `${8 + ((index * 47) % 82)}%`,
                      "--particle-delay": `${-((index * 0.73) % 7)}s`,
                      "--particle-duration": `${7 + (index % 5)}s`,
                    } as CSSProperties
                  }
                />
              ))}
            </div>
            {tools.map((tool, index) => (
              <ToolIcon
                key={tool.name}
                tool={tool}
                index={index}
                active={activeTool.name === tool.name}
                onActivate={setActiveTool}
              />
            ))}
          </motion.div>

          <InfoPanel tool={activeTool} />
        </div>

        <MobileToolGrid activeTool={activeTool} onActivate={setActiveTool} />
      </div>
    </section>
  );
}

export const ServicesSection = SkillsMatrixSection;
