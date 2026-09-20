import { motion, useReducedMotion } from "framer-motion";

import { sportsRecords } from "../../data/interestDetails";
import { InterestPageFrame } from "./InterestPageFrame";

export function SportsInterestPage() {
  const reduceMotion = useReducedMotion();

  return (
    <InterestPageFrame active="sports">
      <div className="sports-journal">
        <motion.header
          className="sports-hero"
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="life-eyebrow">01 / 身体与节奏</p>
          <h1>运动</h1>
          <p className="sports-intro">
            不是为了抵达某个数字。让身体醒来，让呼吸重新变深，持续向前本身就是答案。
          </p>
          <div className="sports-pulse" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
        </motion.header>

        <div className="sports-sequence" aria-label="六项运动记录">
          {sportsRecords.map((item, index) => (
            <figure
              key={item.name}
              className={`sports-entry sports-entry--${index + 1}`}
            >
              <div className={`life-photo life-photo--${item.photo.ratio}`}>
                <img
                  src={item.photo.src}
                  alt={item.photo.alt}
                  loading={index < 2 ? "eager" : "lazy"}
                  decoding="async"
                />
              </div>
              <figcaption>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <h2>{item.name}</h2>
                  <p>{item.note}</p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </InterestPageFrame>
  );
}
