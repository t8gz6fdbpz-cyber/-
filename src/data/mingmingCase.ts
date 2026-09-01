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

export type MingmingAccount = MingmingMedia & {
  followers: number | null;
  followersLabel: string;
  originalIndex: number;
};

export type MingmingEvidence = MingmingMedia & {
  sourceFile: string;
  group: "training" | "talent" | "executive-profile" | "executive-video" | "automation" | "development";
};

export type MingmingVideo = MingmingMedia & {
  label: string;
  intro: string;
  insights: string[];
  videoSrc?: string;
  temporaryAsset: boolean;
  sourceUrl?: string;
};

const assetRoot = "/assets/cases/mingming";

export const heroContent = {
  label: "CASE 01 / IP 制作人",
  title: "鸣鸣很忙",
  positioning: "以AI长视频、IP孵化和自动化开发为核心，完成从内容策划到增长验证的项目交付。",
} as const;

export const heroMetrics = [
  { value: "2部", label: "AIGC长视频" },
  { value: "20+", label: "万粉达人" },
  { value: "1万+", label: "年度留资" },
  { value: "10场", label: "线下训练营" },
] as const;

export const videoOverview =
  "2人协作完成2部横版AIGC招商宣传片；负责文案、编导、生成、素材统筹、剪辑与成片交付。";

export const videoCases: MingmingVideo[] = [
  {
    id: "zhejiang",
    label: "VIDEO A / 浙江",
    title: "浙江区域招商宣传片",
    intro:
      "以甲乙方对话和喜剧情节降低广告感，将品牌卖点自然嵌入区域招商故事。",
    insights: [
      "策划甲乙方人物关系与喜剧冲突。",
      "负责文案、编导、AIGC生成和剪辑。",
      "完成1部16:9区域招商宣传片交付。",
    ],
    alt: "浙江区域招商宣传片参考封面：两位店员在服装门店内协作",
    caption: "项目成片",
    poster: `${assetRoot}/video-covers/zhejiang-reference.jpg`,
    width: 1600,
    height: 1067,
    isPlaceholder: false,
    temporaryAsset: true,
    sourceUrl: "https://www.pexels.com/photo/a-man-and-a-woman-doing-business-7679473/",
  },
  {
    id: "shijiazhuang",
    label: "VIDEO B / 石家庄",
    title: "河北石家庄宣传片",
    intro:
      "结合石家庄摇滚文化与公司音乐节，以门店年轻人的梦想故事完成招商信息植入。",
    insights: [
      "提炼“摇滚之城”本地文化线索。",
      "连接音乐节资产与门店人物故事。",
      "完成1部16:9城市主题宣传片交付。",
    ],
    alt: "石家庄城市主题宣传片参考封面：乐手在演出场地内排练",
    caption: "项目成片",
    poster: `${assetRoot}/video-covers/shijiazhuang-reference.jpg`,
    width: 1600,
    height: 1067,
    isPlaceholder: false,
    temporaryAsset: true,
    sourceUrl: "https://www.pexels.com/photo/musicians-preparing-for-concert-17513729/",
  },
];

// REPLACE: 替换真实视频文件
// REPLACE: 替换真实视频封面
// 临时封面来源（Pexels）：https://www.pexels.com/photo/a-man-and-a-woman-doing-business-7679473/
// 临时封面来源（Pexels）：https://www.pexels.com/photo/musicians-preparing-for-concert-17513729/
// REPLACE: 核对最终数据
// REPLACE: 补充项目发布日期

export const incubationOverview = {
  summary: "负责华南大区账号运营与达人孵化，覆盖定位、内容、培训、数据复盘和直播转化。",
  capabilities: [
    { title: "账号增长", summary: "完成定位、选题、发布节奏和数据复盘，形成可重复执行的账号运营路径。" },
    { title: "直播与投放", summary: "结合本地推、巨量AD和企业号数据，完成观察、分析、诊断、调整。" },
    { title: "培训与SOP", summary: "组织10场线下训练营，把从0粉、无经验到万粉阶段整理成训练路径。" },
    { title: "高管IP", summary: "围绕高管定位、内容表达和单条视频表现，建立结果证据库。" },
  ],
  accountSummary: "展示12组公开账号样本，最高粉丝7.1万；按粉丝量从高到低排列。",
  accountConclusion: "12组公开样本 / 5个账号超过4万粉 / 最高7.1万粉",
  evidenceSummary: "汇总17张普通达人和13张高管公开成绩截图，用真实结果证明账号孵化与内容运营能力。",
} as const;

export const incubationMetrics = [
  { value: "20+", label: "孵化万粉达人" },
  { value: "1万+", label: "年度总留资" },
  { value: "1个月", label: "最快0→1万粉" },
  { value: "10场", label: "线下训练营" },
] as const;

const accountEvidence = [
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
] as const;

export const douyinAccounts: MingmingAccount[] = accountEvidence.map(
  ([followers, followersLabel], index) => {
    const number = String(index + 1).padStart(2, "0");

    return {
      id: `douyin-${index + 1}`,
      followers,
      followersLabel,
      originalIndex: index,
      title: `账号增长成果 ${number}`,
      alt: `抖音账号公开数据截图，粉丝${followersLabel}`,
      caption: `粉丝 ${followersLabel}`,
      src: `${assetRoot}/ip-douyin/account-${number}.webp`,
      width: 1206,
      height: 2622,
      isPlaceholder: false,
    };
  },
);

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

export const talentResults: MingmingEvidence[] = talentSourceFiles.map((sourceFile, index) => {
  const number = String(index + 1).padStart(2, "0");

  return {
    id: `talent-${index + 1}`,
    title: `普通达人成绩 ${number}`,
    alt: `普通达人公开账号成绩截图 ${number}`,
    caption: "公开账号成绩截图",
    src: `${assetRoot}/ip-talent-results/talent-${number}.jpg`,
    width: 1206,
    height: 2622,
    sourceFile,
    group: "talent",
    isPlaceholder: false,
  };
});

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

const executiveProfileIndexes = new Set([2, 6, 9, 12]);

export const executiveResults: MingmingEvidence[] = executiveSourceFiles.map((sourceFile, index) => {
  const number = String(index + 1).padStart(2, "0");
  const isProfile = executiveProfileIndexes.has(index);

  return {
    id: `executive-${index + 1}`,
    title: isProfile ? `高管主页证据 ${number}` : `高管视频数据 ${number}`,
    alt: isProfile ? `高管 IP 公开账号主页与内容主页截图 ${number}` : `高管 IP 公开单条视频表现截图 ${number}`,
    caption: isProfile ? "账号主页与内容主页" : "单条视频数据",
    src: `${assetRoot}/ip-executive-results/executive-${number}.jpg`,
    width: 1206,
    height: 2622,
    sourceFile,
    group: isProfile ? "executive-profile" : "executive-video",
    isPlaceholder: false,
  };
});

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
  summary: "结合3类运营工具建立4步复盘机制，基于12组公开账号样本持续调整内容和投放动作，年度累计留资1万+。",
  metrics: [
    { value: "3类", label: "运营工具" },
    { value: "4步", label: "复盘闭环" },
    { value: "12组", label: "公开账号样本" },
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
