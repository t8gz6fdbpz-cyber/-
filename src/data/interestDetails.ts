import { mediaUrl } from "../utils/media";
import travelPhotoSources from "./travelPhotoSources.json";

export type LocalPhoto = {
  src: string;
  alt: string;
  ratio: "portrait" | "square" | "landscape" | "wide";
  replacementNote: string;
  width?: number;
  height?: number;
};

export type SportsRecord = {
  name: string;
  note: string;
  photo: LocalPhoto;
};

export type TravelRecord = {
  place: string;
  story: string;
  photo: LocalPhoto;
  credit: (typeof travelPhotoSources)[number];
};

export type LearningStep = {
  number: string;
  title: string;
  description: string;
};

export type PlaceholderRecord = {
  label: string;
  note: string;
  photo: LocalPhoto;
};

export const sportsRecords = [
  {
    name: "健身",
    note: "稳住呼吸，把每一次重复做完整。",
    photo: {
      src: "/images/interests/personal/fitness.webp",
      alt: "在健身房的长凳上进行哑铃力量训练",
      ratio: "portrait",
      replacementNote: "",
      width: 1080,
      height: 1178,
    },
  },
  {
    name: "攀岩",
    note: "专注落在手脚之间，下一处支点自然出现。",
    photo: {
      src: "/images/interests/personal/climbing.webp",
      alt: "在室内抱石墙上寻找支点的攀岩记录",
      ratio: "portrait",
      replacementNote: "",
      width: 1206,
      height: 1272,
    },
  },
  {
    name: "登山",
    note: "一步一步向上，身体会找到自己的节拍。",
    photo: {
      src: "/images/interests/personal/hiking.webp",
      alt: "登山者背着背包走在山间小径上",
      ratio: "portrait",
      replacementNote: "",
      width: 1080,
      height: 1440,
    },
  },
  {
    name: "骑行",
    note: "路面向前展开，速度让思绪慢慢变轻。",
    photo: {
      src: "/images/interests/personal/cycling.webp",
      alt: "骑行停靠时，河边落日与公路自行车的近景",
      ratio: "portrait",
      replacementNote: "",
      width: 1206,
      height: 1584,
    },
  },
  {
    name: "游泳",
    note: "水声包住呼吸，动作回到最直接的节奏。",
    photo: {
      src: "/images/interests/personal/swimming.webp",
      alt: "泳池中的自由泳训练，水面映着明亮光线",
      ratio: "landscape",
      replacementNote: "",
      width: 1206,
      height: 849,
    },
  },
  {
    name: "羽毛球",
    note: "轻快的来回里，反应与默契同时醒来。",
    photo: {
      src: "/images/interests/personal/badminton.webp",
      alt: "羽毛球落在球场上，斜射光线勾出球羽和影子",
      ratio: "wide",
      replacementNote: "",
      width: 1206,
      height: 644,
    },
  },
] satisfies readonly SportsRecord[];

const travelDiaryNotes: Record<string, string> = {
  广西: "桂林的山影与夜色，把城市的边界慢慢收进水面。",
  河南: "在龙门石窟，石壁上的细节值得把脚步放慢。",
  海南: "海口新海港的灯火，接住夜色里往来的渡轮。",
  福建: "厦门街巷亮起灯，夜晚也有了温暖的层次。",
  浙江: "西湖的水面和远处的塔，留下一段安静的距离。",
  上海: "天光慢慢退去，陆家嘴的楼宇接住傍晚的颜色。",
  北京: "雨中的故宫，朱墙与屋檐显得格外沉静。",
  山西: "五台延庆寺的木构与屋顶，留下岁月的层次。",
  陕西: "夜色里的西安钟楼，是城市中心的一处停顿。",
  山东: "长岛的海岸展开，视线跟着水面走向更远处。",
  天津: "海河两岸的灯影，把夜晚写进水里。",
  贵州: "黄果树的水流落下，山间有了清楚的回响。",
  重庆: "夜色沿着楼宇铺开，山城的高低藏在灯火之间。",
};

// These are dated, openly licensed scenery images, not personal trip evidence.
export const travelRecords = travelPhotoSources.map((source) => ({
  place: source.place,
  story: travelDiaryNotes[source.place],
  credit: source,
  photo: {
    src: source.src,
    alt: source.subject,
    ratio: source.height > source.width ? "portrait" as const : "landscape" as const,
    replacementNote: "",
    width: source.width,
    height: source.height,
  },
})) satisfies readonly TravelRecord[];

export const singingPhotos = [
  {
    label: "舞台侧影",
    note: "声音发生时的光线、距离和身体状态。",
    photo: {
      src: "/images/interests/personal/singing-side.webp",
      alt: "穿着黑金色舞台服装，侧身站在麦克风旁的演唱照片",
      ratio: "portrait",
      replacementNote: "",
      width: 1078,
      height: 1436,
    },
  },
  {
    label: "唱歌的瞬间",
    note: "先听见呼吸，再让情绪自然抵达。",
    photo: {
      src: "/images/interests/personal/singing-front.webp",
      alt: "在暖色舞台灯光下，面向观众站在麦克风前的演唱照片",
      ratio: "portrait",
      replacementNote: "",
      width: 1078,
      height: 1436,
    },
  },
] satisfies readonly PlaceholderRecord[];

export const learningFlow = [
  { number: "01", title: "提出主题", description: "先把真正想理解的问题放到桌面上，而不是从答案开始。" },
  { number: "02", title: "AI 追问", description: "让 AI 以苏格拉底式提问持续追问依据、边界与反例，暴露理解盲区。" },
  { number: "03", title: "Obsidian 整理", description: "把问题、证据与概念关系放进 Obsidian，形成可连接的知识脉络。" },
  { number: "04", title: "费曼输出", description: "不用术语遮掩含混，尝试用自己的语言把知识重新讲清楚。" },
  { number: "05", title: "沉淀复用", description: "最终整理成文章，或封装为可以再次调用的交互式学习 Skill。" },
] satisfies readonly LearningStep[];

export const readingArticles = [1, 2, 3].map((index) => ({
  label: `文章截图 ${String(index).padStart(2, "0")}`,
  note: "替换为真实文章页面或 Obsidian 成稿截图。",
  photo: {
    src: mediaUrl(`/images/interests/reading/article-0${index}.svg`),
    alt: `文章输出截图占位 ${index}`,
    ratio: "landscape" as const,
    replacementNote: "推荐比例 4:3",
  },
})) satisfies readonly PlaceholderRecord[];

export const readingSystemShots = [1, 2, 3, 4].map((index) => ({
  label: `学习系统 ${String(index).padStart(2, "0")}`,
  note: "替换为真实的 AI 对话、学习 Skill、Obsidian 或学习过程截图。",
  photo: {
    src: mediaUrl(`/images/interests/reading/system-0${index}.svg`),
    alt: `交互式学习系统截图占位 ${index}`,
    ratio: "wide" as const,
    replacementNote: "推荐比例 16:10",
  },
})) satisfies readonly PlaceholderRecord[];
