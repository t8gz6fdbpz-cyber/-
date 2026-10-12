import { mediaUrl } from "../utils/media";

export type HengqianMedia = {
  id: string;
  src: string;
  previewSrc: string;
  originalSrc: string;
  alt: string;
  width: number;
  height: number;
  platform: string;
  evidence: string;
  note: string;
};

const root = "/assets/cases/hengqian";

const media = (
  id: string,
  folder: string,
  file: string,
  alt: string,
  width: number,
  height: number,
  platform: string,
  evidence: string,
  note: string,
): HengqianMedia => ({
  id,
  src: mediaUrl(`${root}/${folder}/${file}`),
  previewSrc: `${root}/${folder}/${file.replace(/\.[^.]+$/, '.preview.webp')}`,
  originalSrc: `${root}/${folder}/${file}`,
  alt,
  width,
  height,
  platform,
  evidence,
  note,
});

export const aiProduction = [
  media("ai-production-1", "ai-digital-human", "ai-01.jpg", "雅姐在绿幕前进行数字人素材采集，现场可见补光与拍摄设备", 2880, 2160, "AI数字人", "绿幕采集", "真实人物录制与现场编导"),
  media("ai-production-2", "ai-digital-human", "ai-02.jpg", "雅姐绿幕录制现场，人物、提词与灯光设备共同入镜", 2880, 2160, "AI数字人", "拍摄现场", "数字人生成前的真人素材准备"),
  media("ai-production-3", "ai-digital-human", "ai-08.jpg", "数字人绿幕采集的另一现场画面，人物、工作人员和两侧灯光共同入镜", 1707, 1280, "AI数字人", "采集现场", "数字人项目 · 第三份独立现场记录"),
];

export const aiEvidence = [
  media("ai-evidence-1", "ai-digital-human", "ai-03.png", "代表性内容数据截图：播放量2922509、完播率43.78%、平均播放69.82秒", 3749, 5734, "AI数字人", "播放与留存", "代表内容播放量 2,922,509，完播率 43.78%"),
  media("ai-evidence-2", "ai-digital-human", "ai-04.png", "数字人内容记录，52.1k播放及完播数据", 5618, 2375, "AI数字人", "内容记录", "52.1k 播放；与另一记录的采样时间、账号条件未确认"),
  media("ai-evidence-3", "ai-digital-human", "ai-05.png", "数字人内容记录，33.4k播放及完播数据", 4332, 2049, "AI数字人", "内容记录", "33.4k 播放；保留为独立内容记录，不作为受控实验"),
  media("ai-evidence-4", "ai-digital-human", "ai-06.png", "2025年1月6日数字人内容公开记录：10.9万播放，互动数字依次1259、329、1325、1281", 8301, 1692, "AI数字人", "内容记录 03", "10.9 万播放 · 公开内容记录"),
  media("ai-evidence-5", "ai-digital-human", "ai-07.png", "数字人内容记录：198.4k播放，互动数字依次12.7k、1.6k、1.1k、8.8k，完播48.32%、平均11.7秒", 4624, 2665, "AI数字人", "内容记录 04", "198.4k 播放 · 完播率 48.32% · 平均时长 11.7 秒"),
];

export const photography = [
  media("photo-1", "photography", "photo-01.jpg", "孟樊雅商业IP拍摄准备，现场可见灯光、相机机位和工作人员背影", 2880, 2160, "孟樊雅商业IP", "布光与制作", "商业 IP · 拍摄准备"),
  media("photo-2", "photography", "photo-02.jpg", "雅姐真人IP拍摄现场，展示布光、机位与人物环境", 2880, 2160, "真人IP", "制作现场", "真实内容生产过程"),
  media("photo-3", "photography", "photo-03.jpg", "孟樊雅商业IP的室外拍摄环境与灯光设备记录", 2160, 2880, "孟樊雅商业IP", "室外现场", "商业 IP · 拍摄环境"),
  media("photo-4", "photography", "photo-04.jpg", "孟樊雅商业IP拍摄现场，人物、摄影团队、桌面与补光设备同框", 1707, 1280, "孟樊雅商业IP", "人物与机位", "商业 IP · 真人拍摄"),
  media("photo-5", "photography", "photo-05.jpg", "孟樊雅商业IP项目摄影工作照，摄影师手持相机检查拍摄画面", 1280, 1707, "孟樊雅商业IP", "摄影工作照", "商业 IP · 摄影执行"),
];

export const wechatEvidence = [
  media("wechat-1", "wechat-channels", "wechat-01.png", "视频号公开内容界面，显示95.8万次播放及万级互动", 3739, 7766, "视频号", "公开内容", "公开界面显示约 95.8 万播放"),
  media("wechat-2", "wechat-channels", "wechat-02.png", "视频号代表视频数据分析：958610播放、11258点赞、15966评论、新增关注13753", 4358, 7767, "视频号", "单条内容", "代表视频 958,610 播放及万级互动"),
  ...[
    ["wechat-3", "wechat-03.png", 2599, 2951], ["wechat-4", "wechat-04.png", 2364, 2947],
    ["wechat-5", "wechat-05.png", 2260, 2951],
    ["wechat-7", "wechat-07.png", 2358, 2935], ["wechat-8", "wechat-08.png", 2364, 2936],
  ].map(([id, file, width, height], index) => {
    const profiles = [
      ["懂你的雅雅姐", "16,314"], ["雅姐-专注女性成长", "4,606"],
      ["雅姐商业路", "3,522"], ["雅姐女性导师", "2,475"], ["雅姐-女性导师", "2,157"],
    ];
    const [name, followers] = profiles[index];
    return media(String(id), "wechat-channels", String(file), `孟樊雅项目视频号主页：${name}，截图时关注人数${followers}`, Number(width), Number(height), "视频号", name, `截图时关注存量 ${followers}；不等同于新增关注`);
  }),
];

export const xiaohongshuEvidence = [
  media("xhs-1", "xiaohongshu", "xhs-01.png", "小红书账号主页与数据作品集截图", 4361, 3880, "小红书", "账号增长", "截图时粉丝 3,989，获赞与收藏 1.5 万"),
  media("xhs-2", "xiaohongshu", "xhs-02.png", "小红书代表笔记数据：8万浏览、互动3979、笔记涨粉1313", 3755, 6420, "小红书", "单篇笔记", "8 万浏览、互动 3,979、单篇涨粉 1,313"),
  media("xhs-3", "xiaohongshu", "xhs-03.png", "小红书笔记数据：3万浏览、互动1197、笔记涨粉349", 4075, 6910, "小红书", "单篇笔记", "3 万浏览、互动 1,197、单篇涨粉 349"),
  media("xhs-4", "xiaohongshu", "xhs-04.png", "小红书笔记数据：2万浏览、互动2515、笔记涨粉230", 4044, 6910, "小红书", "单篇笔记", "2 万浏览、互动 2,515、单篇涨粉 230"),
];

export const douyinEvidence = [
  media("douyin-1", "douyin", "douyin-01.png", "协助大型IP制作的抖音账号与内容成果截图1", 2699, 5507, "抖音", "协作成果", "成熟IP项目中的内容制作支持"),
  media("douyin-2", "douyin", "douyin-02.png", "协助大型IP制作的抖音账号与内容成果截图2", 2699, 5507, "抖音", "协作成果", "参与编导或制作环节"),
  media("douyin-3", "douyin", "douyin-03.png", "协助大型IP制作的抖音账号与内容成果截图3", 2699, 5507, "抖音", "协作成果", "账号成绩不归因为个人独立主导"),
];


export const allEvidence = [
  ...aiProduction,
  ...aiEvidence,
  ...photography,
  ...wechatEvidence,
  ...xiaohongshuEvidence,
  ...douyinEvidence,
];

export const projectResults = [
  { id: 'hq-commercial', title: '01 商业 IP', project: '孟樊雅 / 雅姐', value: '600+', label: '月均', note: '从零起号 · 视频号与小红书' },
  { id: 'hq-ai', title: '02 数字人', project: 'AI 矩阵打法', value: '400+', label: '月均', note: '绿幕采集 · 内容生产与矩阵运营' },
  { id: 'hq-collaboration', title: '03 商业 IP 协助', project: '王延芝', value: '80+', label: '日均', note: '团队成果 · 投产比提升 20%' },
] as const;

// Only the substantive duplicate wechat-6 is merged. wechat-8 is a distinct record.
// Each item is assigned once in material-manifest.md; archive groups contain
// only supplementary screenshots that are not shown in the main chapters.
export const evidenceGroups = [
  { id: "wechat", label: "孟樊雅 / 视频号", description: "01 商业 IP · 五份不同主页记录。关注数为截图时存量；资料数量不代表独立账号数量。", items: wechatEvidence.slice(2) },
  { id: "xhs", label: "孟樊雅 / 小红书", description: "01 商业 IP · 账号主页与另外两篇笔记。代表笔记在正文展示一次。", items: [xiaohongshuEvidence[0], ...xiaohongshuEvidence.slice(2)] },
  { id: "ai", label: "数字人 / AI 矩阵", description: "02 数字人 · 四份独立内容数据记录。不同条件与采样周期不推断为受控实验。", items: aiEvidence.slice(1) },
  { id: "douyin", label: "王延芝 / 协助", description: "03 商业 IP 协助 · 另外两份成熟 IP 账号资料。账号历史成绩不归为个人独立贡献。", items: douyinEvidence.slice(1) },
];
