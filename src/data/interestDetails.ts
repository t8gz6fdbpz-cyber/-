import { mediaUrl } from "../utils/media";

export type LocalPhoto = {
  src: string;
  alt: string;
  ratio: "portrait" | "square" | "landscape" | "wide";
  replacementNote: string;
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
      src: mediaUrl("/images/interests/sports/fitness.jpg"),
      alt: "训练者在明亮健身房里进行力量训练",
      ratio: "portrait",
      replacementNote: "建议替换为 4:5 竖幅健身照片",
    },
  },
  {
    name: "骑行",
    note: "路面向前展开，速度让思绪慢慢变轻。",
    photo: {
      src: mediaUrl("/images/interests/sports/cycling.jpg"),
      alt: "骑行者沿开阔山路向前骑行",
      ratio: "landscape",
      replacementNote: "建议替换为 3:2 横幅骑行照片",
    },
  },
  {
    name: "登山",
    note: "一步一步向上，身体会找到自己的节拍。",
    photo: {
      src: mediaUrl("/images/interests/sports/hiking.jpg"),
      alt: "登山者背着背包走在山间小径上",
      ratio: "portrait",
      replacementNote: "建议替换为 4:5 竖幅登山照片",
    },
  },
  {
    name: "攀岩",
    note: "专注落在手脚之间，下一处支点自然出现。",
    photo: {
      src: mediaUrl("/images/interests/sports/climbing.jpg"),
      alt: "攀岩者在自然岩壁上寻找支点",
      ratio: "landscape",
      replacementNote: "建议替换为 3:2 横幅攀岩照片",
    },
  },
  {
    name: "羽毛球",
    note: "轻快的来回里，反应与默契同时醒来。",
    photo: {
      src: mediaUrl("/images/interests/sports/badminton.jpg"),
      alt: "羽毛球运动员在球场上挥拍击球",
      ratio: "square",
      replacementNote: "建议替换为 1:1 或 4:3 羽毛球照片",
    },
  },
  {
    name: "游泳",
    note: "水声包住呼吸，动作回到最直接的节奏。",
    photo: {
      src: mediaUrl("/images/interests/sports/swimming.jpg"),
      alt: "游泳者在泳池水面划水前进",
      ratio: "wide",
      replacementNote: "建议替换为 16:9 横幅游泳照片",
    },
  },
] satisfies readonly SportsRecord[];

const travelRecordRows = [
  ["广西", "山影落进水面，天色一慢下来，喀斯特的轮廓也变得很安静。", "guangxi.jpg", "广西喀斯特群山与河流相映的清晨景色", "landscape"],
  ["河南", "石壁和岁月都不说话，走近时才发现细节比想象更多。", "henan.jpg", "河南龙门石窟的石刻造像", "portrait"],
  ["海南", "风里带着盐味，浪一遍遍抹平脚印，时间也跟着松下来。", "hainan.jpg", "海南气息的热带海岸与浅色沙滩", "wide"],
  ["福建", "屋顶围成完整的圆，烟火气在天井里慢慢聚拢。", "fujian.jpg", "福建土楼围合而成的圆形院落", "square"],
  ["浙江", "水面把城市声音压低，沿湖走时，连风都显得有分寸。", "zhejiang.jpg", "浙江杭州西湖水面与岸边树影", "landscape"],
  ["上海", "江风很快，高楼很亮，但拐进街口，生活仍按自己的速度展开。", "shanghai.jpg", "上海浦东天际线与黄浦江", "wide"],
  ["北京", "朱墙之外人流不断，阳光把旧建筑的尺度照得格外清楚。", "beijing.jpg", "北京故宫朱墙与宽阔院落", "landscape"],
  ["山西", "夜色落在老街上，灯牌、砖墙和热气一起把路面照暖。", "shanxi.jpg", "山西平遥古城夜晚亮起灯火的街道", "portrait"],
  ["陕西", "城墙把街道拉得很长，雨后灰砖的颜色比白天更沉静。", "shaanxi.jpg", "陕西西安城墙附近雨后的街景", "landscape"],
  ["山东", "海风从礁石之间穿过，浪花和松枝把北方海岸写得很轻。", "shandong.jpg", "山东青岛海边的礁石与浪花", "wide"],
  ["天津", "巷子窄而明亮，红灯笼和砖墙之间藏着缓慢的日常。", "tianjin.jpg", "天津老街砖墙与红灯笼", "portrait"],
  ["贵州", "山与水把视线层层推远，雾气让远处的村落只留下轮廓。", "guizhou.jpg", "贵州群山与水面交叠的开阔风景", "landscape"],
  ["重庆", "高低错落的灯沿江展开，走在里面，总会忘记自己正处在哪一层。", "chongqing.jpg", "重庆夜晚沿江展开的城市灯火", "wide"],
] satisfies readonly (readonly [string, string, string, string, LocalPhoto["ratio"]])[];

export const travelRecords = travelRecordRows.map(([place, story, filename, alt, ratio]) => ({
  place,
  story,
  photo: {
    src: mediaUrl(`/images/interests/travel/${filename}`),
    alt,
    ratio,
    replacementNote: `建议保持${ratio === "portrait" ? "竖幅" : ratio === "square" ? "方幅" : "横幅"}构图`,
  },
})) satisfies readonly TravelRecord[];

// 四个位置的文件名保持固定即可直接替换；推荐比例分别为 4:5、3:4、1:1、16:7。
export const singingPhotos = [
  {
    label: "主图",
    note: "适合替换为年会舞台、排练或演唱中的个人照片。",
    photo: { src: mediaUrl("/images/interests/singing/singing-main.svg"), alt: "唱歌主图照片占位，推荐四比五竖幅", ratio: "portrait", replacementNote: "推荐比例 4:5" },
  },
  {
    label: "侧拍 A",
    note: "适合替换为侧身、候场或调试麦克风的照片。",
    photo: { src: mediaUrl("/images/interests/singing/singing-side-a.svg"), alt: "唱歌辅助照片占位，推荐三比四竖幅", ratio: "portrait", replacementNote: "推荐比例 3:4" },
  },
  {
    label: "侧拍 B",
    note: "适合替换为舞台细节或近距离表情照片。",
    photo: { src: mediaUrl("/images/interests/singing/singing-side-b.svg"), alt: "唱歌辅助照片占位，推荐一比一方幅", ratio: "square", replacementNote: "推荐比例 1:1" },
  },
  {
    label: "横幅",
    note: "适合替换为完整舞台、合唱或环境全景。",
    photo: { src: mediaUrl("/images/interests/singing/singing-banner.svg"), alt: "唱歌横幅照片占位，推荐十六比七横幅", ratio: "wide", replacementNote: "推荐比例 16:7" },
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
