import { repeatItems } from "./repeatItems";

export type NavItem = {
  label: string;
  href: string;
};

export type Skill = {
  number: string;
  title: string;
  subtitle: string;
  description: string;
};

export type Project = {
  number: string;
  category: string;
  name: string;
  liveUrl: string;
  images: [string, string, string];
};

export type MarqueeAccount = {
  image: string;
  likes: string;
  followers: string;
};

export const contactHref = "mailto:1489363185@qq.com";

export const navItems: NavItem[] = [
  { label: "简介", href: "#about" },
  { label: "工作经历", href: "#growth-systems" },
  { label: "技能", href: "#skills" },
  { label: "联系我", href: "#contact" },
];

export const heroPortrait =
  "https://shrug-person-78902957.figma.site/_components/v2/d24c01ad3a56fc65e942a1f501eb73db42d7cf9a/Rectangle_40443.81459862.png";

export const aboutCopy =
  "I am building a personal growth system around content, business, and AI creation. Through continuous practice, structured reflection, and collaborative experiments, I turn ideas into repeatable methods and long-term value.";

const parseMetric = (value: string) => {
  const normalized = value.trim().replace(/,/g, "");
  const numeric = Number.parseFloat(normalized.replace(/[^\d.]/g, ""));

  if (!Number.isFinite(numeric)) {
    return 0;
  }

  return normalized.includes("万") ? numeric * 10000 : numeric;
};

const sortAccountsByReach = (items: MarqueeAccount[]) =>
  [...items].sort((a, b) => {
    const followersDelta =
      parseMetric(b.followers) - parseMetric(a.followers);

    if (followersDelta !== 0) {
      return followersDelta;
    }

    return parseMetric(b.likes) - parseMetric(a.likes);
  });

export const marqueeAccounts: MarqueeAccount[] = [
  { image: "/assets/daren-gallery-01.jpg", likes: "1128", followers: "1.3万" },
  { image: "/assets/daren-gallery-02.jpg", likes: "2433", followers: "1.9万" },
  { image: "/assets/daren-gallery-03.jpg", likes: "773", followers: "1.8万" },
  { image: "/assets/daren-gallery-04.jpg", likes: "1.1万", followers: "4.6万" },
  { image: "/assets/daren-gallery-05.jpg", likes: "22.2万", followers: "7.0万" },
  { image: "/assets/daren-gallery-06.jpg", likes: "816", followers: "5103" },
  { image: "/assets/daren-gallery-07.jpg", likes: "2409", followers: "6.3万" },
  { image: "/assets/daren-gallery-08.jpg", likes: "1203", followers: "4.1万" },
  { image: "/assets/daren-gallery-09.jpg", likes: "1610", followers: "1.6万" },
  { image: "/assets/daren-gallery-10.jpg", likes: "1.4万", followers: "7.1万" },
  { image: "/assets/daren-gallery-11.jpg", likes: "6625", followers: "1.4万" },
  { image: "/assets/daren-gallery-12.jpg", likes: "427", followers: "1.3万" },
  { image: "/assets/daren-gallery-13.jpg", likes: "5325", followers: "1.9万" },
  { image: "/assets/daren-gallery-14.jpg", likes: "1.7万", followers: "7228" },
  { image: "/assets/daren-gallery-15.jpg", likes: "3.9万", followers: "1.9万" },
  { image: "/assets/daren-gallery-16.jpg", likes: "21.2万", followers: "26.7万" },
];

export const sortedMarqueeAccounts = sortAccountsByReach(marqueeAccounts);

export const marqueeRowOne = sortedMarqueeAccounts.filter(
  (_, index) => index % 2 === 0,
);
export const marqueeRowTwo = sortedMarqueeAccounts.filter(
  (_, index) => index % 2 === 1,
);

const growthVisualRowOne = [
  "https://motionsites.ai/assets/hero-space-voyage-preview-eECLH3Yc.gif",
  "https://motionsites.ai/assets/hero-codenest-preview-Cgppc2qV.gif",
  "https://motionsites.ai/assets/hero-vex-ventures-preview-BczMFIiw.gif",
  "https://motionsites.ai/assets/hero-stellar-ai-v2-preview-DjvxjG3C.gif",
  "https://motionsites.ai/assets/hero-asme-preview-B_nGDnTP.gif",
  "https://motionsites.ai/assets/hero-transform-data-preview-Cx5OU29N.gif",
  "https://motionsites.ai/assets/hero-vitara-preview-Cjz2QYyU.gif",
  "https://motionsites.ai/assets/hero-terra-preview-BFjrCr7T.gif",
  "https://motionsites.ai/assets/hero-skyelite-preview-DHaZIgUv.gif",
  "https://motionsites.ai/assets/hero-aethera-preview-DknSlcTa.gif",
  "https://motionsites.ai/assets/hero-designpro-preview-D8c5_een.gif",
];

const growthVisualRowTwo = [
  "https://motionsites.ai/assets/hero-stellar-ai-preview-D3HL6bw1.gif",
  "https://motionsites.ai/assets/hero-xportfolio-preview-D4A8maiC.gif",
  "https://motionsites.ai/assets/hero-orbit-web3-preview-BXt4OttD.gif",
  "https://motionsites.ai/assets/hero-nexora-preview-cx5HmUgo.gif",
  "https://motionsites.ai/assets/hero-evr-ventures-preview-DZxeVFEX.gif",
  "https://motionsites.ai/assets/hero-planet-orbit-preview-DWAP8Z1P.gif",
  "https://motionsites.ai/assets/hero-new-era-preview-CocuDUm9.gif",
  "https://motionsites.ai/assets/hero-wealth-preview-B70idl_u.gif",
  "https://motionsites.ai/assets/hero-luminex-preview-CxOP7ce6.gif",
  "https://motionsites.ai/assets/hero-celestia-preview-0yO3jXO8.gif",
];

export const repeatedMarqueeRowOne = repeatItems(marqueeRowOne, 3);
export const repeatedMarqueeRowTwo = repeatItems(marqueeRowTwo, 3);

export const skills: Skill[] = [
  {
    number: "01",
    title: "Strategy",
    subtitle: "战略思考",
    description:
      "Placeholder copy for insight framing, business diagnosis, and turning ambiguous goals into clear strategic priorities.",
  },
  {
    number: "02",
    title: "Content",
    subtitle: "内容策划",
    description:
      "Placeholder copy for topic systems, narrative structure, creative production, and multi-platform content planning.",
  },
  {
    number: "03",
    title: "IP Building",
    subtitle: "IP打造",
    description:
      "Placeholder copy for positioning, persona development, creator matrices, and sustainable audience relationships.",
  },
  {
    number: "04",
    title: "Growth",
    subtitle: "运营增长",
    description:
      "Placeholder copy for experimentation, distribution, conversion loops, and data-informed iteration across channels.",
  },
  {
    number: "05",
    title: "AI Workflow",
    subtitle: "AI工作流",
    description:
      "Placeholder copy for AI-assisted research, creation, automation, and reusable human-in-the-loop workflows.",
  },
  {
    number: "06",
    title: "Management",
    subtitle: "团队协同",
    description:
      "Placeholder copy for team alignment, training systems, feedback rhythms, and cross-functional delivery.",
  },
];

export const ipShowcaseItems = [
  { label: "IP ACCOUNT 01", image: growthVisualRowOne[1] },
  { label: "CREATOR MATRIX", image: growthVisualRowTwo[4] },
  { label: "VIDEO SYSTEM", image: growthVisualRowOne[6] },
  { label: "ACCOUNT 02", image: growthVisualRowTwo[7] },
  { label: "CONTENT LAB", image: growthVisualRowOne[9] },
];

export const trainingSteps = [
  { number: "01", title: "发现达人", copy: "Placeholder discovery criteria and talent signals." },
  { number: "02", title: "培训", copy: "Placeholder onboarding and capability-building process." },
  { number: "03", title: "内容优化", copy: "Placeholder creative review and content iteration loop." },
  { number: "04", title: "复盘", copy: "Placeholder feedback, data review, and learning capture." },
  { number: "05", title: "成长", copy: "Placeholder milestones and long-term development system." },
];

export const growthMetrics = [
  { label: "ROI", value: "0.00", note: "Placeholder return metric" },
  { label: "CTR", value: "0.0%", note: "Placeholder click metric" },
  { label: "Exposure", value: "00M+", note: "Placeholder reach metric" },
  { label: "Leads", value: "000+", note: "Placeholder lead metric" },
  { label: "Case Study", value: "VIEW", note: "Placeholder campaign breakdown" },
];

export const liveReviewSteps = [
  { number: "01", title: "问题发现", copy: "Identify the placeholder friction point." },
  { number: "02", title: "数据拆解", copy: "Read placeholder behavior and funnel signals." },
  { number: "03", title: "话术优化", copy: "Rewrite the placeholder communication flow." },
  { number: "04", title: "停留提升", copy: "Test placeholder retention improvements." },
  { number: "05", title: "转化提升", copy: "Close the placeholder conversion loop." },
];

export const mirrorCases = [
  { number: "01", title: "PROJECT CASE", image: growthVisualRowTwo[2] },
  { number: "02", title: "CONTENT CASE", image: growthVisualRowOne[3] },
  { number: "03", title: "GROWTH CASE", image: growthVisualRowTwo[5] },
  { number: "04", title: "AI CASE", image: growthVisualRowOne[7] },
];

export const contactChannels = [
  { label: "电话号码", value: "13999854204", href: "tel:13999854204" },
  { label: "微信号", value: "Wu_JhNice", href: "#contact" },
  {
    label: "电子邮箱",
    value: "1489363185@qq.com",
    href: "mailto:1489363185@qq.com",
  },
];

export const projects: Project[] = [
  {
    number: "01",
    category: "Client",
    name: "Nextlevel Studio",
    liveUrl:
      "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055451_e317bf2d-28d4-48cc-86b0-6f72f25b6327.png&w=1280&q=85",
    images: [
      "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055344_5eff02e0-87a5-41ce-b64f-eb08da8f33db.png&w=1280&q=85",
      "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055431_11d841fd-8b41-46a5-82e4-b04f2407a7d8.png&w=1280&q=85",
      "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055451_e317bf2d-28d4-48cc-86b0-6f72f25b6327.png&w=1280&q=85",
    ],
  },
  {
    number: "02",
    category: "Personal",
    name: "Aura Brand Identity",
    liveUrl:
      "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055753_adc5dcbd-a8e6-49c0-b43a-9b030d835cea.png&w=1280&q=85",
    images: [
      "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055654_911201c5-36d9-4bc6-bac7-331adfce159f.png&w=1280&q=85",
      "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055723_5ceda0b8-d9c2-4665-b2e3-83ba19ba76d1.png&w=1280&q=85",
      "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055753_adc5dcbd-a8e6-49c0-b43a-9b030d835cea.png&w=1280&q=85",
    ],
  },
  {
    number: "03",
    category: "Client",
    name: "Solaris Digital",
    liveUrl:
      "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055818_9d062121-ad7e-46b9-999a-1a6a692ef1ee.png&w=1280&q=85",
    images: [
      "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055759_963cfb0b-4bd1-4b0f-9d0a-09bd6cf95b2f.png&w=1280&q=85",
      "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_060108_438f781a-9846-4dcc-89ab-c4e6cb830f5b.png&w=1280&q=85",
      "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055818_9d062121-ad7e-46b9-999a-1a6a692ef1ee.png&w=1280&q=85",
    ],
  },
];
