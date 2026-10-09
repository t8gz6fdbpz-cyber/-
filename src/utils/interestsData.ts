import { mediaUrl } from "./media";

export type InterestSlug = "sports" | "travel" | "singing" | "reading";

export type Interest = {
  id: InterestSlug;
  number: string;
  title: string;
  category: string;
  description: string;
  detail: string;
  image: string;
  imageAlt: string;
  href: string;
  position: "high" | "low";
  imageStatus: "temporary";
};

export const interests: Interest[] = [
  {
    id: "sports",
    number: "01",
    title: "运动",
    category: "身体与节奏",
    description: "让身体先动起来，也让判断重新变得清晰。",
    detail:
      "运动让我把注意力放回身体。节奏、呼吸、耐力和恢复，都会反过来影响我做内容和判断问题的状态。",
    image: mediaUrl("/images/hobbies/interest-sports.webp"),
    imageAlt: "骑行者迎着暖色晨光沿山路向上骑行",
    href: "/interests/sports",
    position: "high",
    imageStatus: "temporary",
  },
  {
    id: "travel",
    number: "02",
    title: "旅行",
    category: "在路上",
    description: "换一条路，去理解地方、尺度和不同生活。",
    detail:
      "旅行会重新校准我对生活的尺度感。走进不同街巷、城市和人群里，很多创意也会从真实场景里长出来。",
    image: mediaUrl("/images/hobbies/interest-travel.webp"),
    imageAlt: "旅行者走在雨后石板老街上，远处是晨雾山峦",
    href: "/interests/travel",
    position: "low",
    imageStatus: "temporary",
  },
  {
    id: "singing",
    number: "03",
    title: "唱歌",
    category: "声音与表达",
    description: "在旋律里训练呼吸，也保留直接表达的冲动。",
    detail:
      "唱歌是一种直接的表达训练。它让我更敏感地感受情绪、节奏和语气，也提醒我表达不只靠信息密度。",
    image: mediaUrl("/images/hobbies/interest-singing.webp"),
    imageAlt: "歌者在暖色灯光的排练室里侧身对着麦克风演唱",
    href: "/interests/singing",
    position: "high",
    imageStatus: "temporary",
  },
  {
    id: "reading",
    number: "04",
    title: "读书",
    category: "阅读与思考",
    description: "从文字中理解人、社会与长期变化。",
    detail:
      "读书让我保持长期输入。商业、心理学、设计和技术里的线索，常常会在之后变成内容判断和项目方法。",
    image: mediaUrl("/images/hobbies/interest-reading.webp"),
    imageAlt: "暮色窗边的书桌上摊开历史书、笔记本和钢笔",
    href: "/interests/reading",
    position: "low",
    imageStatus: "temporary",
  },
];

export const getInterest = (slug: string) =>
  interests.find((item) => item.id === slug);
