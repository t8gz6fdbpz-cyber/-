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
    subtitle: "短视频编导 / IP制作人 / AI数字人内容运营",
    summary: "独立完成“雅姐”IP 从真人内容、AI数字人生产到全平台分发与线索转化。",
    keywords: ["短视频编导", "IP制作人", "AI数字人", "全平台运营", "线索转化", "内容赛马"],
    modules: ["IP孵化", "IP运营", "AI数字人", "视频号", "小红书", "抖音"],
  },
];

export const getCaseStudy = (slug: string) =>
  caseStudies.find((item) => item.slug === slug);
