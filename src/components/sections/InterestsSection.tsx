import { BookOpen, Dumbbell, Mountain, Bike, Feather } from "lucide-react";

const interestGroups = [
  {
    title: "运动",
    intro:
      "运动让我把注意力重新放回身体，也让我保持稳定的执行节奏。",
    icon: Dumbbell,
    image: "/images/hobbies/sports-placeholder.svg",
    imageAlt: "运动照片占位图，后期可替换为健身、骑行、徒步或羽毛球照片",
    caption: "这里预留运动生活照",
    items: [
      { name: "健身", note: "建立身体秩序，也训练长期主义。" },
      { name: "骑行", note: "在城市和风里整理想法。" },
      { name: "徒步", note: "用慢一点的速度看见环境。" },
      { name: "羽毛球", note: "快速反应、节奏判断和一点胜负心。" },
    ],
  },
  {
    title: "看书",
    intro:
      "我喜欢从历史和人物里看长期变化，也从文艺复兴里看创造力如何被时代点燃。",
    icon: BookOpen,
    image: "/images/hobbies/reading-placeholder.svg",
    imageAlt: "阅读照片占位图，后期可替换为书桌、书籍或展览照片",
    caption: "这里预留阅读与历史相关照片",
    items: [
      { name: "历史", note: "看人的选择，也看系统如何塑造命运。" },
      { name: "文艺复兴", note: "艺术、商业、城市和个人意识同时生长。" },
      { name: "历史人物", note: "我会关注他们的胆识、判断力和自我更新能力。" },
      { name: "人物传记", note: "把抽象品质放回真实处境里理解。" },
    ],
  },
];

const personalNotes = [
  {
    icon: Mountain,
    title: "我喜欢真实的体感",
    text: "骑行、徒步和训练都让我从屏幕里出来，重新感受节奏、距离和耐心。",
  },
  {
    icon: Bike,
    title: "我喜欢持续前进",
    text: "很多事情不是靠一次爆发完成，而是在重复里找到更好的方法。",
  },
  {
    icon: Feather,
    title: "我喜欢有质感的人物",
    text: "我会被那些能在时代里做判断、能创造东西、也能不断更新自己的人吸引。",
  },
];

export function InterestsSection() {
  return (
    <section
      id="interests"
      className="interests-section scroll-mt-8 px-5 py-24 sm:px-8 md:px-10 md:py-36"
    >
      <div className="mx-auto max-w-7xl">
        <div className="interests-heading">
          <p>兴趣</p>
          <h2>我的兴趣爱好</h2>
          <span>
            工作之外，我会把一部分精力放在身体、阅读和长期学习上。这些东西不会直接写进项目里，但会影响我怎么判断内容、理解人和保持创造力。
          </span>
        </div>

        <div className="interests-layout">
          <div className="interest-group-stack">
            {interestGroups.map((group) => {
              const Icon = group.icon;

              return (
                <article key={group.title} className="interest-group">
                  <div className="interest-group-copy">
                    <div className="interest-group-title">
                      <Icon aria-hidden="true" />
                      <div>
                        <h3>{group.title}</h3>
                        <p>{group.intro}</p>
                      </div>
                    </div>
                    <div className="interest-item-grid">
                      {group.items.map((item) => (
                        <div key={item.name}>
                          <strong>{item.name}</strong>
                          <span>{item.note}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <figure className="interest-photo-panel">
                    <img src={group.image} alt={group.imageAlt} />
                    <figcaption>{group.caption}</figcaption>
                  </figure>
                </article>
              );
            })}
          </div>

          <aside className="interest-personal-panel">
            <p>工作之外的我</p>
            <figure className="interest-side-photo">
              <img
                src="/images/hobbies/life-placeholder.svg"
                alt="个人兴趣照片占位图，后期可替换为生活记录照片"
              />
            </figure>
            <div>
              {personalNotes.map((note) => {
                const Icon = note.icon;

                return (
                  <article key={note.title}>
                    <Icon aria-hidden="true" />
                    <h3>{note.title}</h3>
                    <span>{note.text}</span>
                  </article>
                );
              })}
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
