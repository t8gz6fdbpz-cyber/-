import { ArrowLeft } from "lucide-react";

import { PortfolioLink } from "../routing";
import { contactChannels } from "../utils/portfolioData";

const questions = [
  {
    question: "你擅长什么？",
    answer:
      "我擅长把内容、人设、直播、平台运营和 AI 工具串成一个可执行的增长系统。",
  },
  {
    question: "你如何理解内容运营？",
    answer:
      "内容不是单条作品，而是一套持续被验证的表达方式。好内容要能被看见、被理解，也要能推动行动。",
  },
  {
    question: "你为什么关注 AI？",
    answer:
      "AI 能把重复工作变轻，把想法变快。真正重要的不是工具本身，而是人如何判断、选择和组织它。",
  },
  {
    question: "工作之外你在做什么？",
    answer:
      "我会持续学习商业、心理学、设计和 AI，也会观察不同平台里的表达方式和人群变化。",
  },
  {
    question: "你希望做出什么样的作品？",
    answer:
      "我希望作品既有清晰的业务价值，也有真实的个人判断。它应该解决问题，也应该留下质感。",
  },
];

export function ListPage() {
  return (
    <section className="about-page portfolio-page-shell">
      <div className="portfolio-page-header">
        <PortfolioLink to="/" className="portfolio-back-link">
          <ArrowLeft aria-hidden="true" />
          返回首页
        </PortfolioLink>
        <div>
          <p>关于我</p>
          <h1>继续了解</h1>
          <span>一些关于工作方式、学习方式和内容判断的问题。</span>
        </div>
      </div>

      <div className="about-qa-list">
        {questions.map((item) => (
          <article key={item.question} className="about-qa-item">
            <h2>{item.question}</h2>
            <p>{item.answer}</p>
          </article>
        ))}
      </div>

      <div className="about-contact-strip">
        <p>联系我</p>
        <div>
          {contactChannels.map((channel) =>
            channel.href.startsWith("#") ? (
              <PortfolioLink key={channel.label} to={`/${channel.href}`}>
                {channel.label}：{channel.value}
              </PortfolioLink>
            ) : (
              <a key={channel.label} href={channel.href}>
                {channel.label}：{channel.value}
              </a>
            ),
          )}
        </div>
      </div>
    </section>
  );
}
