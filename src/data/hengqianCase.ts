export type HengqianMedia = {
  id: string;
  src: string;
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
  src: `${root}/${folder}/${file}`,
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
];

export const aiEvidence = [
  media("ai-evidence-1", "ai-digital-human", "ai-03.png", "代表性内容数据截图：播放量2922509、完播率43.78%、平均播放69.82秒", 3749, 5734, "AI数字人", "播放与留存", "代表内容播放量 2,922,509，完播率 43.78%"),
  media("ai-evidence-2", "ai-digital-human", "ai-04.png", "数字人内容版本数据截图，展示播放、互动、完播与平均时长", 5618, 2375, "AI数字人", "版本测试", "同一内容方向的不同版本表现"),
  media("ai-evidence-3", "ai-digital-human", "ai-05.png", "另一数字人内容版本数据截图，展示播放与互动指标", 4332, 2049, "AI数字人", "版本测试", "用于赛马比较与内容迭代"),
  media("ai-evidence-4", "ai-digital-human", "ai-06.png", "数字人内容成果截图，展示公开内容表现", 8301, 1692, "AI数字人", "内容表现", "不同选题方向的公开表现"),
  media("ai-evidence-5", "ai-digital-human", "ai-07.png", "代表性内容数据截图：198.4k播放、12.7k点赞、1.6k评论、1.1k分享", 4624, 2665, "AI数字人", "互动表现", "198.4k 播放与万级点赞"),
];

export const photography = [
  media("photo-1", "photography", "photo-01.jpg", "雅姐真人IP大型拍摄现场，人物与摄影设备同框", 2880, 2160, "真人IP", "现场编导", "拍摄统筹与现场执行"),
  media("photo-2", "photography", "photo-02.jpg", "雅姐真人IP拍摄现场，展示布光、机位与人物环境", 2880, 2160, "真人IP", "制作现场", "真实内容生产过程"),
  media("photo-3", "photography", "photo-03.jpg", "竖幅真人IP拍摄现场记录", 2160, 2880, "真人IP", "现场记录", "人物状态与拍摄环境"),
];

export const wechatEvidence = [
  media("wechat-1", "wechat-channels", "wechat-01.png", "视频号公开内容界面，显示95.8万次播放及万级互动", 3739, 7766, "视频号", "公开内容", "公开界面显示约 95.8 万播放"),
  media("wechat-2", "wechat-channels", "wechat-02.png", "视频号代表视频数据分析：958610播放、11258点赞、15966评论、新增关注13753", 4358, 7767, "视频号", "单条内容", "代表视频 958,610 播放及万级互动"),
  ...[
    ["wechat-3", "wechat-03.png", 2599, 2951], ["wechat-4", "wechat-04.png", 2364, 2947],
    ["wechat-5", "wechat-05.png", 2260, 2951], ["wechat-6", "wechat-06.png", 2260, 2971],
    ["wechat-7", "wechat-07.png", 2358, 2935], ["wechat-8", "wechat-08.png", 2364, 2936],
  ].map(([id, file, width, height], index) => media(String(id), "wechat-channels", String(file), `视频号账号关注及主页成果截图${index + 1}`, Number(width), Number(height), "视频号", "账号增长", index === 0 ? "截图时关注人数 16,314" : "账号关注与主页公开记录")),
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

export const responsibilities = [
  "IP定位",
  "选题策划",
  "文案与脚本",
  "现场编导",
  "绿幕录制",
  "AI数字人生成",
  "剪辑包装",
  "全平台发布",
  "数据复盘",
  "内容赛马",
  "留资转化",
];

export const independentResponsibilities = [
  "目标客户分析",
  "账号定位",
  "内容策略",
  "选题",
  "脚本与文案",
  "真人拍摄",
  "现场编导",
  "AI数字人采集与生成",
  "AI批量内容生产",
  "多平台内容分发",
  "矩阵运营",
  "数据复盘与内容赛马",
  "线索获取与后端转化配合",
  "培训、SOP与运营流程搭建",
];

export const accountMatrix = [
  { platform: "视频号", count: 5, role: "主阵地" },
  { platform: "抖音", count: 2, role: "矩阵补充" },
  { platform: "小红书", count: 2, role: "矩阵补充" },
  { platform: "快手", count: 2, role: "矩阵补充" },
];

export const capabilityGroups = [
  { number: "01", title: "策略与内容", items: responsibilities.slice(0, 3) },
  { number: "02", title: "制作与生成", items: responsibilities.slice(3, 7) },
  { number: "03", title: "分发与运营", items: responsibilities.slice(7, 9) },
  { number: "04", title: "增长与转化", items: responsibilities.slice(9, 11) },
];

export const productionFlow = [
  "人物与内容定位",
  "选题和脚本",
  "真人绿幕素材采集",
  "AI数字人内容生成",
  "多版本剪辑",
  "多平台分发",
  "数据赛马",
  "高表现方向迭代",
];

export const allEvidence = [
  ...aiProduction,
  ...aiEvidence,
  ...photography,
  ...wechatEvidence,
  ...xiaohongshuEvidence,
  ...douyinEvidence,
];
