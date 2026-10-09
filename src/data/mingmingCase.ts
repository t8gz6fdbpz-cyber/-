import { mediaUrl } from "../utils/media";

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
  group: "training";
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
  businessGoal: string;
  regionalInsight: string;
  creativeStrategy: string;
  responsibility: string;
  videoSrc: string;
};

const assetRoot = "/assets/cases/mingming";
const assetUrl = (path: string) => mediaUrl(`${assetRoot}/${path}`);

export const heroContent = {
  chapter: "01",
  eyebrow: "公司与岗位",
  label: "COMPANY & ROLE",
  title: "鸣鸣很忙集团-赵一鸣商业有限公司",
  companyName: "鸣鸣很忙集团-赵一鸣商业有限公司",
  company: "鸣鸣很忙集团旗下拥有零食很忙、赵一鸣零食两大品牌，构建覆盖全国的大规模量贩零食门店网络。",
  role: "抖音制作人",
  region: "华南区域",
  tenure: "2025.03.18—2026.09.04",
  scope: "内部账号运营、IP增长、内容生产与培训",
  positioning: "在鸣鸣很忙华南区域，我同时负责 AIGC 招商内容与全民 IP 增长：一边把区域招商需求转化为完整影片，一边把员工账号运营转化为可复制的增长系统。",
  projects: [
    {
      index: "A",
      title: "AIGC 区域招商影片",
      summary: "用区域文化、人物关系与 AIGC 生产完成两部横版招商成片。",
    },
    {
      index: "B",
      title: "全民 IP 孵化",
      summary: "把员工账号运营、内容生产、投流复盘与培训组织成增长闭环。",
    },
  ],
} as const;

export const resultsOverview = {
  chapter: "02",
  eyebrow: "核心项目及成果",
  label: "PROJECTS & OUTCOMES",
  title: "以作品交付，以增长验证。",
  summary: "两部区域招商影片，一套员工 IP 增长系统。",
} as const;

export const videoOverview = {
  index: "项目一",
  eyebrow: "AIGC REGION FILMS",
  title: "AIGC 区域招商影片",
  summary: "我主导负责浙江、石家庄区域招商影片的创意与制作，将区域文化、人物关系和品牌招商信息组织成完整故事，并完成从内容策略、文案编导、AIGC 生成、素材统筹到剪辑交付的完整链路。",
  facts: [
    { value: "区域招商", label: "项目业务目标" },
    { value: "浙江 × 石家庄", label: "重点区域项目" },
    { value: "我主导负责", label: "核心项目角色" },
    { value: "策略—创意—成片", label: "完整交付链路" },
  ],
} as const;

export const videoCases: MingmingVideo[] = [
  {
    id: "zhejiang",
    label: "FILM 01 / 浙江",
    title: "浙江区域招商宣传片",
    businessGoal: "降低传统招商广告的生硬感，让招商信息能够通过人物关系被自然理解。",
    regionalInsight: "以甲乙方沟通场景作为观众熟悉的商业语境，强化浙江区域项目的现实感。",
    creativeStrategy: "使用甲乙方人物关系和喜剧冲突承载品牌信息，让招商表达先成立为故事。",
    responsibility: "我主导负责内容策略、文案、编导、AIGC 画面生成、素材统筹、剪辑与成片交付。",
    alt: "浙江区域招商宣传片",
    caption: "完整成片",
    videoSrc: assetUrl("videos/zhejiang-regional-investment.mp4"),
    poster: assetUrl("video-covers/zhejiang-cover.png"),
    width: 1600,
    height: 900,
    isPlaceholder: false,
  },
  {
    id: "shijiazhuang",
    label: "FILM 02 / 石家庄",
    title: "石家庄区域招商宣传片",
    businessGoal: "把品牌招商信息与城市文化连接，增强区域项目的识别度和记忆点。",
    regionalInsight: "从石家庄摇滚文化、音乐节和门店年轻人的梦想故事中寻找叙事入口。",
    creativeStrategy: "使用地域文化、青年人物和品牌门店场景组织完整招商故事。",
    responsibility: "我主导负责内容策略、文案、编导、AIGC 画面生成、素材统筹、剪辑与成片交付。",
    alt: "石家庄区域招商宣传片",
    caption: "完整成片",
    videoSrc: assetUrl("videos/shijiazhuang-city-promotion.mp4"),
    poster: assetUrl("video-covers/shijiazhuang-cover.png"),
    width: 1600,
    height: 900,
    isPlaceholder: false,
  },
];

export const incubationResults = {
  index: "项目二",
  eyebrow: "PEOPLE-POWERED IP",
  title: "全民 IP 孵化",
  summary: "围绕员工 IP 孵化，我建立了从账号定位、内容生产、运营投放、数据复盘到线下培训的增长闭环，覆盖 300+ 员工账号。",
  metrics: [
    { value: "300+", label: "员工账号管理", detail: "华南区域持续运营范围" },
    { value: "20+个", label: "万粉达人", detail: "我直接负责或主导孵化" },
    { value: "1 万+", label: "年度总留资", detail: "账号运营与内容增长结果" },
    { value: "1 个月", label: "最快 0→1 万粉", detail: "增长路径最快验证周期" },
    { value: "10 场", label: "线下训练营", detail: "我组织并沉淀培训流程" },
  ],
  evidenceSummary: "精选粉丝数最高的 12 个账号主页记录增长规模；9 张内容截图记录传播与互动表现。",
} as const;

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

const accountSourceFiles = [
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

const accountDisplayHeights: Record<number, number> = {
  2: 1140, 4: 1120, 5: 1140, 6: 1180, 7: 1180, 9: 1120,
  10: 1100, 11: 1160, 12: 1160, 13: 1100, 14: 1120, 16: 1160,
};

const accountDisplayNames: Record<number, string> = {
  2: "赵一鸣选址老吴",
  4: "赵一鸣波哥",
  5: "赵一鸣刘星",
  6: "赵一鸣零食-张孝伟",
  7: "芳姐的零售笔记",
  9: "赵一鸣小KD",
  10: "赵一鸣——魏什么魏",
  11: "赵一鸣小九儿（全国招商）",
  12: "赵一鸣 大唐",
  13: "光头孟老师",
  14: "赵一鸣小方总在新疆",
  16: "赵一鸣·零食庞胖（浙江上海区域负责人）",
};

export const accountGrowthResults: MingmingGrowthEvidence[] = accountFollowerEvidence
  .map(([followers, followersLabel], index) => {
    const evidenceNumber = index + 1;
    const number = String(evidenceNumber).padStart(2, "0");
    const sourceFile = accountSourceFiles[index];
    const src = assetUrl(`ip-orbit/account-${number}.webp`);

    return {
      id: `account-growth-${number}`,
      evidenceType: "account-profile" as const,
      title: `账号主页 · ${followersLabel}粉丝`,
      caption: `账号增长成果 ${number} / 12`,
      alt: `${accountDisplayNames[evidenceNumber] ?? "账号"}的公开主页截图，粉丝${followersLabel}`,
      src,
      canonicalSource: sourceFile,
      sourceFile,
      width: 1206,
      height: accountDisplayHeights[evidenceNumber] ?? 1160,
      followers,
      followersLabel,
      sortWeight: followers,
      isPlaceholder: false,
    };
  })
  // Every count was checked against the public follower figure in its source screenshot.
  // The two 1.4万 accounts tie for the final place; the source order selects talent-14.
  .sort((left, right) => right.sortWeight - left.sortWeight)
  .slice(0, 12);

const contentSourceFiles = [
  "05b82ce2-dece-4cd9-994d-82c0382521b6.jpg",
  "0f595469-57e0-47f9-954e-add8632e0203.jpg",
  "27bbfb62-abff-4d16-9a11-9f23c277d875.jpg",
  "4a9720cb-eaa8-42fd-a2d5-d3fe7bd18586.jpg",
  "541ac482-5c55-4974-a05c-ab3df64db600.jpg",
  "656ae118-914d-4846-8149-4ba4328ff7a2.jpg",
  "663c9961-45d9-48a3-923d-703af24de649.jpg",
  "b731e83d-5787-4316-9f80-5460a0527719.jpg",
  "d113bf58-94e1-43d8-8371-07ac51506210.jpg",
] as const;

const contentPublicIndexes = [1, 2, 4, 5, 6, 8, 9, 11, 12] as const;
// Existing optimized versions verified against the corresponding source screenshots.
const contentWebpFiles: Record<number, string> = { 1: "executive-01.webp", 2: "executive-02.webp", 4: "executive-04.webp" };

export const contentPerformanceResults: MingmingGrowthEvidence[] = contentSourceFiles.map(
  (sourceFile, index) => {
    const displayNumber = String(index + 1).padStart(2, "0");
    const publicNumber = String(contentPublicIndexes[index]).padStart(2, "0");

    return {
      id: `content-performance-${displayNumber}`,
      evidenceType: "content-performance",
      title: `单条内容表现 · ${displayNumber}`,
      caption: `内容表现成果 ${displayNumber} / 09`,
      alt: `内容表现成果第${index + 1}张，单条视频或公开内容数据截图`,
      src: contentWebpFiles[contentPublicIndexes[index]]
        ? assetUrl(`ip-executive/${contentWebpFiles[contentPublicIndexes[index]]}`)
        : assetUrl(`ip-executive-results/executive-${publicNumber}.jpg`),
      canonicalSource: sourceFile,
      sourceFile,
      width: 1206,
      height: 2622,
      sortWeight: index + 1,
      isPlaceholder: false,
    };
  },
);

export const methodOverview = {
  chapter: "03",
  eyebrow: "项目具体介绍",
  label: "PROCESS & METHOD",
  title: "把一次交付，变成可持续的方法。",
  summary: "从业务目标出发，将内容创作、日常运营与复盘连接起来。",
} as const;

export const aigcMethod = {
  title: "让区域故事承载招商信息",
  background: "区域招商需要同时传递品牌信息、城市气质和合作价值。为了降低传统招商广告的生硬感，我用人物关系承载信息，再以区域文化建立记忆点：浙江片侧重甲乙方喜剧关系，石家庄片结合摇滚文化、音乐节与门店年轻人的梦想故事。",
  responsibilities: ["文案", "编导", "AIGC 生成", "素材统筹", "剪辑", "成片交付"],
  processSummary: "从招商需求出发，以区域文化和人物故事建立表达，再通过 AIGC 生成、素材校准与剪辑，完成一支完整影片。",
  steps: [
    { title: "需求提炼", phase: "BRIEF", summary: "明确招商目标、核心受众与必传信息，建立创作边界。" },
    { title: "区域研究", phase: "RESEARCH", summary: "提取城市文化与品牌场景，找到当地受众的共鸣点。" },
    { title: "人物与故事", phase: "STORY", summary: "用人物关系和情节冲突承载卖点，让故事先成立。" },
    { title: "AIGC 生成", phase: "GENERATE", summary: "拆分镜头需求，生成并筛选符合人物与地域气质的画面。" },
    { title: "素材统一", phase: "REFINE", summary: "校准人物、色彩与景别，保持画面风格和镜头连续。" },
    { title: "剪辑交付", phase: "DELIVER", summary: "完成节奏、声音与字幕，检查成片并交付招商影片。" },
  ],
} as const;

export const ipMethod = {
  title: "把员工账号连接成增长系统",
  scopeSummary: "我负责华南区域 300+ 员工账号运营，将账号定位、内容策划、拍摄剪辑、发布运营、投流复盘与线下培训串成同一套工作链路。",
  scope: ["300+ 员工账号运营", "账号定位", "内容策划", "拍摄与剪辑", "发布运营", "投流与复盘", "线下培训"],
  operationsSummary: "六个动作分成三个阶段：先确定表达方向，再用持续发布与复盘找到有效内容，最后放大并承接线索。",
  operationStages: ["建立方向", "持续运营", "放大结果"],
  operations: [
    { title: "账号定位", summary: "明确人设、受众与内容方向" },
    { title: "内容模板", summary: "沉淀可重复使用的选题与表达结构" },
    { title: "持续发布", summary: "组织拍摄、剪辑与发布节奏" },
    { title: "数据复盘", summary: "观察播放、互动与线索表现" },
    { title: "投流放大", summary: "结合平台工具验证并扩大有效内容" },
    { title: "留资转化", summary: "承接线索并形成下一轮调整依据" },
  ],
  trainingSummary: "将定位、内容、增长和转化沉淀为四阶段培训流程，让员工从零经验进入可持续运营状态。",
  trainingStages: [
    { title: "定位", details: "招募评估、账号定位" },
    { title: "内容", details: "选题设计、拍摄表达训练" },
    { title: "增长", details: "发布节奏、数据复盘" },
    { title: "转化", details: "直播转化、万粉阶段运营" },
  ],
} as const;

export const performanceMedia: MingmingMedia[] = [
  {
    id: "enterprise-account",
    title: "企业号",
    alt: "企业号运营工具截图",
    caption: "账号运营与线索承接记录",
    src: assetUrl("performance/enterprise-account.png"),
    width: 210,
    height: 239,
    isPlaceholder: false,
  },
  {
    id: "local-promotion",
    title: "本地推",
    alt: "本地推投放工具截图",
    caption: "本地内容投放与效果观察",
    src: assetUrl("performance/local-promotion.png"),
    width: 234,
    height: 260,
    isPlaceholder: false,
  },
  {
    id: "ocean-engine-ad",
    title: "巨量 AD",
    alt: "巨量 AD 投放工具截图",
    caption: "广告数据与素材表现分析",
    src: assetUrl("performance/ocean-engine-ad.png"),
    width: 280,
    height: 284,
    isPlaceholder: false,
  },
];

const trainingEvidence = [
  ["147394e3-a69b-4ace-a09d-1a96902ca937.jpg", "training-01.webp", "01 浙江达人训练营", 2880, 2160],
  ["2b8750ec-67a1-4294-9622-d8fc569bdefd.jpg", "training-02.webp", "02 江西达人训练营", 2880, 2160],
  ["9e2fc971-3a33-4da2-9abc-f9edbb573c88.jpg", "training-03.webp", "03 海南达人训练营", 1707, 1280],
  ["企业微信截图_17613164961130.png", "training-04.webp", "04 浙江达人训练营", 1452, 819],
  ["企业微信截图_17613174703294.png", "training-05.webp", "05 贵州达人训练营", 1457, 820],
  ["a15867ff-033e-43be-80d1-d8dedfbc0f29.jpg", "training-06.webp", "06 福建达人训练营", 2880, 2160],
  ["a241a0c647dd79ba7ac017bd3261dccc_origin.jpg", "training-07.webp", "07 广州达人训练营", 4096, 3072],
  ["b679339c82be8e40766413af220d8c89_origin(1).jpg", "training-08.webp", "08 上海达人训练营", 2560, 1920],
  ["b95709622d95481cd269238ea9601487_origin(1).jpg", "training-09.webp", "09 福建达人训练营", 2560, 1920],
  ["pic(24).jpg", "training-10.webp", "10 河南达人训练营", 1702, 1276],
] as const;

export const trainingGallery: MingmingEvidence[] = trainingEvidence.map(
  ([sourceFile, targetFile, title, width, height], index) => ({
    id: `training-${index + 1}`,
    title,
    alt: `${title}现场记录`,
    caption: "线下训练营现场记录",
    src: assetUrl(`ip-training/${targetFile}`),
    width,
    height,
    sourceFile,
    group: "training",
    isPlaceholder: false,
  }),
);

export const summaryContent = {
  chapter: "04",
  eyebrow: "经历总结",
  label: "WHAT I BUILT",
  statement: "这段经历让我完成了从内容创作、账号增长到方法复制的能力闭环：既能独立交付完整内容，也能把单点经验转化为可规模化运行的运营与培训体系。",
  abilities: [
    { title: "AIGC 内容生产", summary: "从策略、文案、AIGC 生成到完整成片。" },
    { title: "账号增长", summary: "从定位、内容、投流到留资转化。" },
    { title: "IP 运营", summary: "将账号矩阵、内容模板和数据复盘连接成日常机制。" },
    { title: "培训复制", summary: "把个人方法沉淀为员工可以执行的流程和培训体系。" },
  ],
} as const;

function validateCaseEvidence() {
  if (!import.meta.env.DEV) return;

  const allGrowthEvidence = [...accountGrowthResults, ...contentPerformanceResults];
  const normalizedSources = allGrowthEvidence.map((item) => item.canonicalSource.toLowerCase());
  const duplicateSources = normalizedSources.filter(
    (source, index, sources) => sources.indexOf(source) !== index,
  );
  const checks = [
    accountGrowthResults.length === 12 || `精选账号主页应为12张，当前为${accountGrowthResults.length}张`,
    contentPerformanceResults.length === 9 || `内容表现成果应为9张，当前为${contentPerformanceResults.length}张`,
    trainingGallery.length === 10 || `培训资料应为10张，当前为${trainingGallery.length}张`,
    performanceMedia.length === 3 || `投流资料应为3张，当前为${performanceMedia.length}张`,
    videoCases.length === 2 || `完整成片应为2部，当前为${videoCases.length}部`,
    duplicateSources.length === 0 || `成果证据存在重复源文件：${[...new Set(duplicateSources)].join("、")}`,
  ];
  const problems = checks.filter((check): check is string => typeof check === "string");

  if (problems.length) {
    console.warn(`[mingmingCase] 素材校验失败：${problems.join("；")}`);
  }
}

validateCaseEvidence();
