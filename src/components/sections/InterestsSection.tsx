import { ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

import { PortfolioLink } from "../../routing";
import { interests } from "../../utils/interestsData";

export function InterestsSection() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section id="interests" className="interests-showcase-section scroll-mt-8">
      <motion.header
        className="interests-showcase-heading"
        initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
        whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.68, ease: [0.22, 1, 0.36, 1] }}
      >
        <div>
          <p>工作之外</p>
          <h2>我的兴趣爱好</h2>
        </div>
        <p className="interests-showcase-intro">
          生活不止工作，还有热爱。
          <br />
          这些兴趣让我保持好奇、持续成长，也让我走得更远。
        </p>
      </motion.header>

      <motion.div
        className="interests-showcase-grid"
        initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
        whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.12 }}
        transition={{ duration: 0.76, ease: [0.22, 1, 0.36, 1] }}
      >
        {interests.map((interest) => (
          <article
            key={interest.id}
            className="interests-showcase-item"
            data-position={interest.position}
          >
            <PortfolioLink
              to={interest.href}
              className="interests-showcase-trigger"
              aria-label={`${interest.title}：${interest.description}`}
              data-image-status={interest.imageStatus}
            >
              <figure className="interests-showcase-poster">
                <img
                  className="interests-showcase-image"
                  src={interest.image}
                  alt={interest.imageAlt}
                  loading="lazy"
                  decoding="async"
                  draggable="false"
                />
              </figure>

              <div className="interests-showcase-meta">
                <div className="interests-showcase-labels">
                  <span className="interests-showcase-number">{interest.number}</span>
                  <span className="interests-showcase-category">{interest.category}</span>
                </div>
                <div className="interests-showcase-title">
                  <h3>{interest.title}</h3>
                  <ArrowUpRight aria-hidden="true" />
                </div>
                <p>{interest.description}</p>
              </div>
            </PortfolioLink>
          </article>
        ))}
      </motion.div>
    </section>
  );
}
