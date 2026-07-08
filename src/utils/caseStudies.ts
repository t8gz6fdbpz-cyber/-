export type CaseSlug = "mingming" | "hengqian";

export type CaseStudy = {
  slug: CaseSlug;
  title: string;
  subtitle: string;
  summary: string;
  keywords: string[];
  modules: string[];
};

export const caseStudies: CaseStudy[] = [
  {
    slug: "mingming",
    title: "鸣鸣很忙",
    subtitle: "本地生活达人 / IP孵化 / 直播运营项目",
    summary: "围绕达人、内容、直播和 AI 工具，把本地生活项目做成可执行的运营系统。",
    keywords: [
      "达人孵化",
      "达人培训",
      "直播运营",
      "视频运营",
      "投流",
      "AI自动化",
      "AI视频",
    ],
    modules: [
      "达人孵化",
      "达人培训",
      "直播运营",
      "视频运营",
      "投流",
      "AI自动化",
      "AI视频",
    ],
  },
  {
    slug: "hengqian",
    title: "镜前时代",
    subtitle: "IP孵化与 AI 数字人运营项目",
    summary: "围绕 IP 定位、平台内容和数字人实验，探索更轻、更稳定的内容生产方式。",
    keywords: ["IP孵化", "IP运营", "AI数字人", "视频号", "小红书", "抖音"],
    modules: ["IP孵化", "IP运营", "AI数字人", "视频号", "小红书", "抖音"],
  },
];

export const getCaseStudy = (slug: string) =>
  caseStudies.find((item) => item.slug === slug);
