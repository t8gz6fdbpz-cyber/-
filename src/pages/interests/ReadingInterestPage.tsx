import { motion, useReducedMotion } from "framer-motion";

import {
  learningFlow,
  readingArticles,
  readingSystemShots,
  type PlaceholderRecord,
} from "../../data/interestDetails";
import { InterestPageFrame } from "./InterestPageFrame";

export function ReadingInterestPage() {
  const reduceMotion = useReducedMotion();

  return (
    <InterestPageFrame active="reading">
      <div className="reading-workbench">
        <motion.header
          className="reading-hero"
          initial={reduceMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
        >
          <div>
            <p className="life-eyebrow">04 / 阅读与思考</p>
            <h1>把理解，<br />重新讲清楚</h1>
          </div>
          <p>
            我以 Obsidian 作为知识管理与沉淀环境，让 AI 用苏格拉底式提问暴露理解盲区，再倒逼自己用费曼学习法重新表达，最后形成文章或可重复使用的学习 Skill。
          </p>
        </motion.header>

        <section className="learning-method" aria-labelledby="learning-method-title">
          <div className="reading-section-heading">
            <span>METHOD / 01—05</span>
            <h2 id="learning-method-title">一条会反复回看的学习路径</h2>
          </div>
          <ol>
            {learningFlow.map((step) => (
              <li key={step.number}>
                <span>{step.number}</span>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </li>
            ))}
          </ol>
          <p className="learning-equation" aria-label="学习流程概览">
            提出主题 <span>→</span> AI 追问 <span>→</span> Obsidian 整理 <span>→</span> 费曼输出 <span>→</span> 文章或 Skill
          </p>
        </section>

        <section className="reading-output" aria-labelledby="article-output-title">
          <div className="reading-section-heading">
            <span>OUTPUT / WRITING</span>
            <h2 id="article-output-title">文章输出</h2>
            <p>理解经过重写后留下的文本。以下位置只等待真实文章截图，不预设标题、数据或成果。</p>
          </div>
          <div className="article-proof-grid">
            {readingArticles.map((item, index) => (
              <ProofPlaceholder key={item.label} item={item} index={index} />
            ))}
          </div>
        </section>

        <section className="reading-system" aria-labelledby="learning-system-title">
          <div className="reading-section-heading">
            <span>SYSTEM / PRACTICE</span>
            <h2 id="learning-system-title">学习系统</h2>
            <p>这里记录 AI 追问、Obsidian 整理与学习 Skill 的实际工作过程，和上方的文章成稿明确分开。</p>
          </div>
          <div className="system-proof-grid">
            {readingSystemShots.map((item, index) => (
              <ProofPlaceholder key={item.label} item={item} index={index} />
            ))}
          </div>
        </section>
      </div>
    </InterestPageFrame>
  );
}

function ProofPlaceholder({ item }: { item: PlaceholderRecord; index: number }) {
  return (
    <figure>
      <div className={`life-photo life-photo--${item.photo.ratio}`}>
        <img src={item.photo.src} alt={item.photo.alt} loading="lazy" />
      </div>
      <figcaption>
        <strong>{item.label}</strong>
        <span>{item.photo.replacementNote}</span>
        <p>{item.note}</p>
      </figcaption>
    </figure>
  );
}
