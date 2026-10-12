import { motion, useReducedMotion } from "framer-motion";

import { sportsRecords } from "../../data/interestDetails";
import { InterestPageFrame } from "./InterestPageFrame";
import { InterestPhoto } from "./InterestPhoto";

export function SportsInterestPage() {
  const reduceMotion = useReducedMotion();

  return (
    <InterestPageFrame active="sports">
      <div className="sports-journal">
        <motion.header
          className="sports-hero life-section-hero"
          initial={reduceMotion ? false : { opacity: 0.8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <h1>运动</h1>
          <p className="sports-intro">
            不是为了抵达某个数字。让身体醒来，让呼吸重新变深，持续向前本身就是答案。
          </p>
        </motion.header>

        <div className="sports-sequence" aria-label="六项运动记录">
          {sportsRecords.map((item, index) => (
            <figure
              key={item.name}
              className={`sports-entry sports-entry--${index + 1}`}
            >
              <InterestPhoto photo={item.photo} nativeRatio eager={index < 2}
                sizes={index >= 4 ? "(max-width: 760px) calc(100vw - 40px), 44vw" : "(max-width: 760px) calc(100vw - 40px), (max-width: 1100px) 44vw, 22vw"} />
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
