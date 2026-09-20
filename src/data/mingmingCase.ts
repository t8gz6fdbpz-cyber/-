export type MingmingMedia = {
  id: string;
  title: string;
  alt: string;
  caption: string;
  src?: string;
  poster?: string;
  width?: number;
  height?: number;
  isPlaceholder: boolean;
};

export type MingmingEvidence = MingmingMedia & {
  sourceFile: string;
  group: "training" | "automation" | "development";
};

export type MingmingGrowthEvidence = MingmingMedia & {
  src: string;
  width: number;
  height: number;
  sourceFile: string;
  canonicalSource: string;
  evidenceType: "account-profile" | "content-performance";
  sortWeight: number;
  followers?: number;
  followersLabel?: string;
};

export type MingmingVideo = MingmingMedia & {
  label: string;
  context: string;
  strategy: string;
  responsibility: string;
  delivery: string;
  videoSrc?: string;
};

const assetRoot = "/assets/cases/mingming";

export const heroContent = {
  label: "CASE 01 / COMPANY & PERSONAL IMPACT",
  title: "鸣鸣很忙集团",
  role: "抖音制作人",
  region: "华南区域",
  tenure: "2025.03.18—2026.09.04",
  positioning: "负责华南区域内部账号运营与 IP 增长，管理 300+ 员工账号，通过培训和内容生产让员工账号成为持续为公司传播的内容节点。",
} as const;

export const companyProfile = {
  eyebrow: "THE PLATFORM",
  title: "公司背书",
  statement: "鸣鸣很忙集团，旗下拥有零食很忙、赵一鸣零食两大品牌，覆盖全国 3 万家门店，是量贩零食行业的龙头企业。",
  scale: "3 万家",
  scaleLabel: "全国门店覆盖",
  sourceLabel: "官方公开资料：零食很忙官网「关于我们」",
  sourceUrl: "https://www.hnlshm.com/about.html",
  sourceNote: "官网披露：截至 2025 年 11 月 30 日，全国门店总数为 21,000+；本页“覆盖全国 3 万家门店”为本案例采用口径。",
} as const;

export const responsibilityOverview = {
  eyebrow: "MY RESPONSIBILITY",
  title: "我负责的事情",
  summary: "作为抖音制作人，我主要负责华南区域的 IP 增长与内部 MCN 运营，管理约 300 多个员工账号，负责账号定位、内容生产、培训、数据复盘和宣传转化。",
  items: [
    "华南区域 300+ 员工账号管理",
    "员工 IP 定位与内容策划",
    "短视频拍摄、剪辑与发布节奏",
    "内部媒体技能培训与训练营",
    "账号数据复盘与增长调整",
    "内容传播与招商/业务宣传支持",
  ],
} as const;

export const personalResults = [
  { value: "20+", label: "万粉达人", detail: "我直接负责或主导孵化" },
  { value: "1 万+", label: "年度总留资", detail: "我负责的内容增长结果" },
  { value: "1 个月", label: "最快 0→1 万粉", detail: "我主导的增长路径验证" },
  { value: "10 场", label: "线下达人训练营", detail: "我组织并沉淀训练流程" },
  { value: "300+", label: "员工账号管理", detail: "华南区域长期运营范围" },
] as const;

export const videoOverview = {
  eyebrow: "AI INVESTMENT PROMOTION",
  title: "AI 招商短片项目",
  background: "这是服务于鸣鸣很忙招商业务的 AIGC 短片项目。我们希望降低传统招商广告的生硬感，用人物关系和区域文化把招商信息自然放进故事里。",
  contribution: "2 人协作完成 2 部横版 AIGC 招商宣传片；我负责文案、编导、AIGC 生成、素材统筹、剪辑和成片交付，最终交付 2 部 16:9 横版招商宣传片。",
} as const;

export const videoCases: MingmingVideo[] = [
  {
    id: "zhejiang",
    label: "VIDEO A / 浙江",
    title: "浙江区域招商宣传片",
    context: "面向浙江区域招商，以区域传播场景为项目背景。",
    strategy: "通过甲乙方人物关系和喜剧情节降低广告感，把品牌卖点自然嵌入故事。",
    responsibility: "我负责文案、编导、AIGC 生成、素材统筹、剪辑和成片交付。",
    delivery: "1 部 16:9 横版 AIGC 招商宣传片。",
    alt: "浙江区域招商宣传片",
    caption: "项目成片",
    videoSrc: `${assetRoot}/videos/zhejiang-regional-investment.mp4`,
    poster: `${assetRoot}/video-covers/zhejiang-cover.png`,
    width: 1600,
    height: 1067,
    isPlaceholder: false,
  },
  {
    id: "shijiazhuang",
    label: "VIDEO B / 石家庄",
    title: "河北石家庄宣传片",
    context: "面向河北石家庄招商，以城市文化与公司音乐节资产为项目背景。",
    strategy: "结合摇滚文化、音乐节和门店年轻人的梦想故事，让招商信息进入人物叙事。",
    responsibility: "我负责文案、编导、AIGC 生成、素材统筹、剪辑和成片交付。",
    delivery: "1 部 16:9 横版 AIGC 招商宣传片。",
    alt: "河北石家庄宣传片",
    caption: "项目成片",
    videoSrc: `${assetRoot}/videos/shijiazhuang-city-promotion.mp4`,
    poster: `${assetRoot}/video-covers/shijiazhuang-cover.png`,
    width: 1600,
    height: 1067,
    isPlaceholder: false,
  },
];

export const incubationOverview = {
  summary: "我负责华南区域账号运营与达人孵化，把账号管理、员工培训、内容生产和数据复盘组织成可重复执行的 IP 增长流程。",
  capabilities: [
    { title: "账号增长", summary: "完成定位、选题、发布节奏和数据复盘，形成可重复执行的账号运营路径。" },
    { title: "直播与投放", summary: "结合本地推、巨量AD和企业号数据，完成观察、分析、诊断、调整。" },
    { title: "培训与SOP", summary: "组织10场线下训练营，把从0粉、无经验到万粉阶段整理成训练路径。" },
    { title: "内容与复盘", summary: "用账号主页、内容表现和公开结果持续校准定位与下一轮动作。" },
  ],
  accountSummary: "在职期间，我独立负责17个账号的定位、内容生产、发布节奏与数据复盘，并独立产出9项代表性内容成果验证选题与表达能力。",
} as const;

export const accountGrowthFlow = [
  { title: "IP 定位", summary: "明确人设、受众与内容方向" },
  { title: "内容生产", summary: "将选题、拍摄与发布节奏落地" },
  { title: "分发与投放", summary: "协同平台分发、企业号与投放动作" },
  { title: "数据复盘", summary: "观察表现、诊断问题并迭代" },
  { title: "增长与线索", summary: "沉淀粉丝增长、内容表现与留资结果" },
] as const;

export const incubationMetrics = [
  { value: "20+", label: "孵化万粉达人" },
  { value: "1万+", label: "年度总留资" },
  { value: "1个月", label: "最快0→1万粉" },
  { value: "10场", label: "线下训练营" },
] as const;

export const accountGrowthSummary = [
  { value: "17个", label: "不同账号" },
  { value: "独立负责", label: "在职期间全链路打造" },
  { value: "9项", label: "内容表现成果" },
  { value: "26.7万", label: "最高公开粉丝成绩" },
] as const;

const accountFollowerEvidence = [
  [13_000, "1.3万"],
  [19_000, "1.9万"],
  [7_228, "7228"],
  [18_000, "1.8万"],
  [46_000, "4.6万"],
  [70_000, "7.0万"],
  [19_000, "1.9万"],
  [5_103, "5103"],
  [63_000, "6.3万"],
  [41_000, "4.1万"],
  [16_000, "1.6万"],
  [71_000, "7.1万"],
  [267_000, "26.7万"],
  [14_000, "1.4万"],
  [13_000, "1.3万"],
  [19_000, "1.9万"],
  [14_000, "1.4万"],
] as const;

const trainingEvidence = [
  ["147394e3-a69b-4ace-a09d-1a96902ca937.jpg", "training-01.jpg", "01 浙江达人训练营", 2880, 2160],
  ["2b8750ec-67a1-4294-9622-d8fc569bdefd.jpg", "training-02.jpg", "02 江西达人训练营", 2880, 2160],
  ["9e2fc971-3a33-4da2-9abc-f9edbb573c88.jpg", "training-03.jpg", "03 海南达人训练营", 1707, 1280],
  ["企业微信截图_17613164961130.png", "training-04.png", "04 浙江达人训练营", 1452, 819],
  ["企业微信截图_17613174703294.png", "training-05.png", "05 贵州达人训练营", 1457, 820],
  ["a15867ff-033e-43be-80d1-d8dedfbc0f29.jpg", "training-06.jpg", "06 福建达人训练营", 2880, 2160],
  ["a241a0c647dd79ba7ac017bd3261dccc_origin.jpg", "training-07.jpg", "07 广州达人训练营", 4096, 3072],
  ["b679339c82be8e40766413af220d8c89_origin(1).jpg", "training-08.jpg", "08 上海达人训练营", 2560, 1920],
  ["b95709622d95481cd269238ea9601487_origin(1).jpg", "training-09.jpg", "09 福建达人训练营", 2560, 1920],
  ["pic(24).jpg", "training-10.jpg", "10 河南达人训练营", 1702, 1276],
] as const;

export const trainingGallery: MingmingEvidence[] = trainingEvidence.map(
  ([sourceFile, targetFile, title, width, height], index) => ({
    id: `training-${index + 1}`,
    title,
    alt: `${title}现场合照`,
    caption: title,
    src: `${assetRoot}/ip-training/${targetFile}`,
    width,
    height,
    sourceFile,
    group: "training",
    isPlaceholder: false,
  }),
);

const talentSourceFiles = [
  "0707ed8a-82a3-43c4-b9f4-2c5aee1a441b.jpg",
  "09bc403f-99b5-4291-979e-45bf45fce0da.jpg",
  "14affc96-d452-4176-bd9a-ffbe9d950a59.jpg",
  "24f29a61-16f8-4d64-92a7-38fe29e2ced9.jpg",
  "3e53790f-1538-4ed4-b24e-1e2e6d0ea576.jpg",
  "5ec3089a-53ea-4b6d-9308-92cc88e134b9.jpg",
  "606e2e57-ce25-4162-8243-2c785a9a3291.jpg",
  "65ae75d2-44fc-462c-b07f-cc92281c7639.jpg",
  "66d279fc-beed-4d1e-9050-39946d29796b.jpg",
  "79cea886-df31-45e7-92a4-bf17339a6f9c.jpg",
  "8105c393-59cc-4cfe-9278-60608d708084.jpg",
  "9d4fb0b1-f6a5-42f1-ad47-7f8dedd364be.jpg",
  "b328e6f6-4ccd-4fe4-be07-bb05888380f0.jpg",
  "db8b9ee2-cacc-4bce-91f0-3447230cc297.jpg",
  "e0e041e5-1277-4eaa-b17d-d34087e725e7.jpg",
  "eaeb0d61-837c-42e4-b493-20c50514411d.jpg",
  "f1feb7d4-af0c-417a-9a31-6ada559dc9c1.jpg",
] as const;

const executiveSourceFiles = [
  "05b82ce2-dece-4cd9-994d-82c0382521b6.jpg",
  "0f595469-57e0-47f9-954e-add8632e0203.jpg",
  "14affc96-d452-4176-bd9a-ffbe9d950a59.jpg",
  "27bbfb62-abff-4d16-9a11-9f23c277d875.jpg",
  "4a9720cb-eaa8-42fd-a2d5-d3fe7bd18586.jpg",
  "541ac482-5c55-4974-a05c-ab3df64db600.jpg",
  "606e2e57-ce25-4162-8243-2c785a9a3291.jpg",
  "656ae118-914d-4846-8149-4ba4328ff7a2.jpg",
  "663c9961-45d9-48a3-923d-703af24de649.jpg",
  "b328e6f6-4ccd-4fe4-be07-bb05888380f0.jpg",
  "b731e83d-5787-4316-9f80-5460a0527719.jpg",
  "d113bf58-94e1-43d8-8371-07ac51506210.jpg",
  "f1feb7d4-af0c-417a-9a31-6ada559dc9c1.jpg",
] as const;

export const accountGrowthResults: MingmingGrowthEvidence[] = accountFollowerEvidence
  .map(([followers, followersLabel], index) => {
    const evidenceNumber = index + 1;
    const number = String(evidenceNumber).padStart(2, "0");
    const sourceFile = talentSourceFiles[index];
    const src = evidenceNumber <= 12
      ? `${assetRoot}/ip-douyin/account-${number}.webp`
      : `${assetRoot}/ip-talent-results/talent-${number}.jpg`;

    return {
      id: `account-growth-${number}`,
      evidenceType: "account-profile" as const,
      title: `账号粉丝成绩 · ${followersLabel}`,
      caption: "在职期间独立负责打造的账号主页公开结果",
      alt: `账号增长成果，主页公开粉丝${followersLabel}`,
      src,
      canonicalSource: sourceFile,
      sourceFile,
      width: 1206,
      height: 2622,
      followers,
      followersLabel,
      sortWeight: followers,
      isPlaceholder: false,
    };
  })
  .sort((left, right) => right.sortWeight - left.sortWeight);

const contentPerformanceSourceIndexes = [1, 2, 4, 5, 6, 8, 9, 11, 12] as const;

export const contentPerformanceResults: MingmingGrowthEvidence[] = contentPerformanceSourceIndexes.map(
  (sourceIndex, index) => {
    const sourceNumber = String(sourceIndex).padStart(2, "0");
    const displayNumber = String(index + 1).padStart(2, "0");
    const sourceFile = executiveSourceFiles[sourceIndex - 1];
    const src = `${assetRoot}/ip-executive-results/executive-${sourceNumber}.jpg`;

    return {
      id: `content-performance-${displayNumber}`,
      evidenceType: "content-performance",
      title: `单条内容表现 ${displayNumber}`,
      caption: "公开内容表现截图",
      alt: `单条视频公开表现截图 ${displayNumber}`,
      src,
      canonicalSource: sourceFile,
      sourceFile,
      width: 1206,
      height: 2622,
      sortWeight: index + 1,
      isPlaceholder: false,
    };
  },
);

function validateGrowthEvidenceCollections(
  accountItems: readonly MingmingGrowthEvidence[],
  contentItems: readonly MingmingGrowthEvidence[],
) {
  if (!import.meta.env.DEV) return;

  const allItems = [...accountItems, ...contentItems];
  const duplicateIds = allItems
    .map((item) => item.id)
    .filter((id, index, ids) => ids.indexOf(id) !== index);
  const normalizedSources = allItems.map((item) => item.canonicalSource.replace(/\\/g, "/").toLowerCase());
  const duplicateSources = normalizedSources.filter((source, index, sources) => sources.indexOf(source) !== index);
  const problems = [
    ...(accountItems.length === 17 ? [] : [`账号增长成绩应为17项，当前为${accountItems.length}项`]),
    ...(contentItems.length === 9 ? [] : [`内容表现成绩应为9项，当前为${contentItems.length}项`]),
    ...(duplicateIds.length ? [`重复证据ID：${[...new Set(duplicateIds)].join("、")}`] : []),
    ...(duplicateSources.length ? [`重复规范素材：${[...new Set(duplicateSources)].join("、")}`] : []),
  ];

  if (problems.length) {
    console.warn(`[mingmingCase] 证据唯一性校验失败：${problems.join("；")}`);
  }
}

validateGrowthEvidenceCollections(accountGrowthResults, contentPerformanceResults);

export const performanceMedia: MingmingMedia[] = [
  {
    id: "local-promotion",
    title: "本地推",
    alt: "本地推投放工具截图",
    caption: "本地内容投放与效果观察",
    src: `${assetRoot}/performance/local-promotion.png`,
    width: 234,
    height: 260,
    isPlaceholder: false,
  },
  {
    id: "ocean-engine-ad",
    title: "巨量 AD",
    alt: "巨量 AD 投放工具截图",
    caption: "广告数据与素材表现分析",
    src: `${assetRoot}/performance/ocean-engine-ad.png`,
    width: 280,
    height: 284,
    isPlaceholder: false,
  },
  {
    id: "enterprise-account",
    title: "企业号",
    alt: "企业号运营工具截图",
    caption: "账号运营和线索承接记录",
    src: `${assetRoot}/performance/enterprise-account.png`,
    width: 210,
    height: 239,
    isPlaceholder: false,
  },
];

export const reviewWorkflow = {
  summary: "结合3类运营工具建立4步复盘机制，围绕17个独立负责账号持续调整内容和投放动作，年度累计留资1万+。",
  metrics: [
    { value: "3类", label: "运营工具" },
    { value: "4步", label: "复盘闭环" },
    { value: "17个", label: "独立负责账号" },
    { value: "1万+", label: "年度总留资" },
  ],
  steps: [
    { title: "观察", summary: "查看直播、内容和投放表现" },
    { title: "分析", summary: "拆分流量、互动和线索数据" },
    { title: "诊断", summary: "定位选题、表达和转化问题" },
    { title: "调整", summary: "形成下一轮内容与投放动作" },
  ],
} as const;

export const incubationStages = [
  { title: "定位", details: "招募评估、账号定位" },
  { title: "内容", details: "选题设计、拍摄表达训练" },
  { title: "增长", details: "发布节奏、数据复盘" },
  { title: "转化", details: "直播转化、万粉阶段运营" },
] as const;

export const trainingSummary =
  "组织10场线下达人训练营，形成定位、内容、增长和转化四阶段SOP；最快个案1个月从0粉进入万粉阶段。";

export const agentWorkflow = [
  "需求拆解",
  "提示词与任务规划",
  "Codex / 自动化工具执行",
  "Browser 验证与持续迭代",
];

export const agentOverview = {
  summary: "使用Codex、结构化提示词和Browser完成需求拆解、网页实现、路由排查与浏览器验收，并搭建真实自动化工作流。",
  development: {
    eyebrow: "CODEX COLLABORATION",
    title: "Codex协作开发",
    summary: "以当前个人作品集为真实项目，通过对话完成页面架构、React与TypeScript实现、路由修复和持续迭代。",
    tags: ["1个持续开发作品集", "3类业务案例", "桌面与移动端双端验收"],
  },
  automation: {
    eyebrow: "REAL AUTOMATION",
    title: "AI自动化工作流",
    summary: "通过网页自动化、桌面软件控制和流程编排，将企业微信相关操作组织为可重复执行的任务流程。",
    tags: ["1套真实工作流", "网页与桌面双端执行", "企业微信流程编排"],
  },
} as const;

export const agentAutomation: MingmingEvidence = {
  id: "ai-automation-workflow",
  title: "AI 自动化工作流",
  alt: "网页自动化、桌面软件控制与企业微信操作组成的 AI 自动化工作流截图",
  caption: "通过网页自动化、桌面软件控制和流程编排，将企业微信相关操作组织为可执行工作流。",
  src: `${assetRoot}/agent-development/ai-automation-workflow.png`,
  width: 1920,
  height: 1029,
  sourceFile: "企业微信截图_17803839269731.png",
  group: "automation",
  isPlaceholder: false,
};

export const agentDevelopment: MingmingEvidence = {
  id: "portfolio-route-validation",
  title: "作品集路由与浏览器验收",
  alt: "个人作品集路由在本地浏览器中的验证记录",
  caption: "从页面实现到路由排查，再到桌面与移动端浏览器验收。",
  src: `${assetRoot}/agent-development/browser-route-test.png`,
  width: 1440,
  height: 900,
  sourceFile: "browser-route-test.png",
  group: "development",
  isPlaceholder: false,
};

export const agentCapabilities = [
  "Codex协作开发",
  "结构化提示词",
  "React与TypeScript",
  "路由和交互排查",
  "Browser响应式验收",
  "网页自动化",
  "桌面软件自动化",
  "企业微信流程编排",
] as const;

export const replacementChecklist = [
  "浙江区域招商宣传片源文件",
  "石家庄城市主题宣传片源文件",
  "两支宣传片最终封面",
  "项目最终数据与发布日期",
] as const;
